"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {Button} from "@/app/components/ui/button";
import { authClient } from "@/lib/auth-client";
import {Label } from "@/app/components/ui/label";
import {Input} from "@/app/components/ui/input";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/app/components/ui/card";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (!token) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 text-center p-4">
                <div className="text-red-500 font-semibold">Invalid Link</div>
                <p className="text-sm text-muted-foreground">
                    This password reset link is missing the required token. Please request a new one.
                </p>
                <Button variant="outline" onClick={() => router.push("/auth/forgot-password")}>
                    Back to Forgot Password
                </Button>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            const { error } = await authClient.resetPassword({
                newPassword: password,
                token
            });

            if (error) {
                toast.error(error.message || "Failed to reset password");
            } else {
                toast.success("Password reset successfully!");
                router.push("/auth/sign-in");
            }
        } catch (err) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                    id="new-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Min. 8 characters"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Re-enter password"
                />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                Reset Password
            </Button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="container flex items-center justify-center min-h-[80vh] py-12">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Set new password</CardTitle>
                    <CardDescription>
                        Please enter your new password below.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Suspense is required here because useSearchParams needs client-side context */}
                    <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}