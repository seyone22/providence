import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : undefined,
  basePath: "/api/v1/auth",
});

export const { useSession, signIn, signOut, signUp } = authClient;