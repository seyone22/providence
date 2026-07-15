import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { emailService } from "@/lib/email";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),

  trustedOrigins: [
    "http://localhost:3000",
    "https://providenceauto.co.uk",
    "https://*.providenceauto.co.uk",
  ],

  // 1. Password Reset lives here
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url, token }) {
      await emailService.sendAuthEmail(user.email, "reset", url);
    },
  },

  // 2. Email Verification must be a TOP-LEVEL object (Fix for TS2353)
  emailVerification: {
    sendOnSignUp: true,
    async sendVerificationEmail({ user, url, token }, _request) {
      await emailService.sendAuthEmail(user.email, "verification", url);
    },
  },

  // ADD THIS NEW BLOCK:
  // Resolves the "Shadow Account" edge case for walk-in attendees.
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "facebook", "discord"],
      // We trust these providers to have verified the user's email address.
    },
  },

  socialProviders: {
    // ... your existing providers
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    },
  },
  basePath: "/api/v1/auth",
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "user" },
      isBanned: { type: "boolean", defaultValue: false },
      badges: { type: "string[]", defaultValue: [] },
      // 👉 ADD THIS
      whatsappNumber: { type: "string", required: false, defaultValue: "" },
    },
  },

  // 3. Hook Fix: Return void or { data: ... } (Fix for TS2322)
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const user = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, session.userId),
          });
          if (user?.isBanned) {
            throw new APIError("FORBIDDEN", {
              message: "Your account has been suspended.",
            });
          }
          // RETURN VOID HERE (Do not return 'session' directly)
          // If you wanted to modify the session, you would return { data: session }
        },
      },
    },
  },
});
