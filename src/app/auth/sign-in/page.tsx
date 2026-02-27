"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { signIn } from "@/src/lib/auth-client";
import { AuthLayout } from "@/src/components/auth/authLayout";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

export default function SignIn() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // 1. New Handler for Social Logins
    async function handleSocialSignIn(provider: "google" | "facebook" | "discord") {
        setIsLoading(true);
        await signIn.social({
            provider: provider,
            callbackURL: "/profile",
            fetchOptions: {
                onSuccess: () => {
                    // Toast is handled by better-auth usually, but we can add one here
                    toast.success(`Redirecting to ${provider}...`);
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message);
                    setIsLoading(false);
                }
            }
        });
    }

    async function handleSignIn(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);

        try {
            await signIn.email({
                email,
                password,
                callbackURL: "/profile",
                fetchOptions: {
                    onSuccess: () => {
                        router.push("/profile");
                        toast.success("Welcome back!");
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.message);
                        setIsLoading(false);
                    }
                }
            });
        } catch (error) {
            toast.error("Something went wrong");
            setIsLoading(false);
        }
    }

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Enter your credentials to access your tickets"
            image="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2671&auto=format&fit=crop"
        >
            <div className="grid gap-6" style={{maxHeight: "100vh"}}>
                <form onSubmit={handleSignIn}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                {/* Future: Forgot Password Link */}
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                            <Link
                                href="/auth/forgot-password"
                                className="text-xs text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 size-4 animate-spin"/>}
                            Sign In
                        </Button>
                    </div>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t"/>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or continue with
                        </span>
                    </div>
                </div>

                {/* 2. Updated Social Login Grid */}
                <div className="grid grid-cols-3 gap-2">
                    <Button
                        variant="outline"
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleSocialSignIn("google")}
                        className="w-full"
                    >
                        Google
                    </Button>
                    <Button
                        variant="outline"
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleSocialSignIn("facebook")}
                        className="w-full text-blue-600"
                    >
                        Meta
                    </Button>
                    <Button
                        variant="outline"
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleSocialSignIn("discord")}
                        className="w-full text-indigo-500"
                    >
                        Discord
                    </Button>
                </div>

                <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/sign-up" className="underline underline-offset-4 hover:text-primary">
                        Sign up
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}