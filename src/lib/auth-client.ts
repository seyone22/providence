import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL, // e.g. http://localhost:3000
    basePath: "/api/v1/auth"
});

export const { useSession, signIn, signOut, signUp } = authClient;

