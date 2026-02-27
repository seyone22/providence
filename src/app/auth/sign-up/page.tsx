"use client";

import {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {signUp} from "@/src/lib/auth-client";
import {AuthLayout} from "@/src/components/auth/authLayout";
import {Button} from "@/src/components/ui/button";
import {Input} from "@/src/components/ui/input";
import {Label} from "@/src/components/ui/label";
import {Loader2} from "lucide-react";
import {toast} from "sonner";

export default function SignUp() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSignUp(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);

        try {
            await signUp.email({
                email,
                password,
                name,
                callbackURL: "/profile",
            }, {
                onSuccess: () => {
                    router.push("/profile");
                    toast.success("Account created successfully!");
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message);
                    setIsLoading(false);
                }
            });
        } catch (error) {
            toast.error("Something went wrong");
            setIsLoading(false);
        }
    }

    return (
        <AuthLayout
            title="Create an Account"
            subtitle="Join the community to RSVP for events"
            image="https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=2670&auto=format&fit=crop"
        >
            <div className="grid gap-6" style={{maxHeight: "100vh"}}>
                <form onSubmit={handleSignUp}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="Shehan Doe"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
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
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 size-4 animate-spin"/>}
                            Create Account
                        </Button>
                    </div>
                </form>

                <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/auth/sign-in" className="underline underline-offset-4 hover:text-primary">
                        Sign in
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}