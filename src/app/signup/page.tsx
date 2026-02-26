"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import MinimalHeader from "@/app/components/MinimalHeader";

export default function SignUp() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate a network request for the mockup
        setTimeout(() => {
            router.push("/dealer-dashboard");
        }, 1000);
    };

    const glassInputClasses = "bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-white/20 focus-visible:border-white/30 transition-all h-12";

    return (
        <main className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden justify-center items-center">
            {/* Dark background glow */}
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-900/10 to-black z-0 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,30,30,0.5)_0%,rgba(0,0,0,1)_100%)] z-0 pointer-events-none" />

            <MinimalHeader />

            <div className="relative z-10 w-full max-w-md px-4">
                <div className="text-center mb-8">
                    <h2 className="font-sans text-3xl font-bold tracking-tight text-white mb-2">
                        Dealer Portal
                    </h2>
                    <p className="text-gray-400">Sign in to manage your global inventory</p>
                </div>

                <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl rounded-[2rem] overflow-hidden">
                    <CardHeader className="pb-4">
                        <CardTitle className="sr-only">Sign In</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-3">
                                <Label htmlFor="email" className="text-gray-400">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        placeholder="dealer@showroom.com"
                                        className={`${glassInputClasses} pl-12`}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="password" className="text-gray-400">Password</Label>
                                    <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Forgot password?</a>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className={`${glassInputClasses} pl-12`}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-14 mt-4 text-lg font-bold bg-white text-black hover:bg-gray-200 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all rounded-full flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>Sign In <ArrowRight className="h-5 w-5" /></>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}