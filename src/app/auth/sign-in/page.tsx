"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";

// Apple-style smooth easing curve
const appleEase: any = [0.16, 1, 0.3, 1];

export default function SignIn() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); // <-- New state for inline error

    const passwordInputRef = useRef<HTMLInputElement>(null);

    // Clear error when user types
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (errorMessage) setErrorMessage("");
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if (errorMessage) setErrorMessage("");
    };

    async function handleSocialSignIn(provider: "google" | "facebook" | "discord") {
        setIsLoading(true);
        setErrorMessage("");
        await signIn.social({
            provider: provider,
            callbackURL: "/admin",
            fetchOptions: {
                onSuccess: () => {
                    toast.success(`Redirecting to ${provider}...`);
                },
                onError: (ctx) => {
                    const msg = ctx.error?.message || "Failed to sign in with provider.";
                    toast.error(msg);
                    setErrorMessage(msg);
                    setIsLoading(false);
                }
            }
        });
    }

    async function handleSignIn(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(""); // Clear previous errors on new submission

        try {
            await signIn.email({
                email,
                password,
                callbackURL: "/admin",
                fetchOptions: {
                    onSuccess: () => {
                        router.push("/admin");
                        toast.success("Welcome back!");
                    },
                    onError: (ctx) => {
                        // Extract message and set both toast and inline error
                        const msg =
                            ctx.error?.message ||
                            ctx.error?.body?.message ||
                            "Invalid email or password. Please try again.";

                        toast.error(msg);
                        setErrorMessage(msg);

                        setPassword("");
                        setIsLoading(false);

                        setTimeout(() => {
                            passwordInputRef.current?.focus();
                        }, 0);
                    }
                }
            });
        } catch (error: any) {
            const msg = error?.response?.data?.message || error?.message || "An unexpected error occurred.";

            toast.error(msg);
            setErrorMessage(msg);
            setPassword("");
            setIsLoading(false);

            setTimeout(() => {
                passwordInputRef.current?.focus();
            }, 0);
        }
    }

    // Dynamic classes: Add a red ring if there's an error
    const inputClasses = `w-full bg-black/5 border focus:bg-white text-black placeholder:text-zinc-400 rounded-2xl px-5 py-4 text-base transition-all duration-300 outline-none ${
        errorMessage
            ? "border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
            : "border-transparent focus:border-black/20 focus:ring-4 focus:ring-black/5"
    }`;

    return (
        <main
            className="min-h-screen bg-white text-black relative flex items-center justify-center px-4 font-sans selection:bg-black/10 selection:text-black overflow-hidden">

            {/* === BACKGROUND LAYER === */}
            <motion.div
                initial={{ scale: 1.05, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: appleEase }}
                className="absolute inset-0 z-0 pointer-events-none"
            >
                {/* High-key premium car image */}
                <img
                    src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=3000&auto=format&fit=crop"
                    alt="Premium automotive background"
                    className="w-full h-full object-cover object-center"
                />
                {/* Frosted washes to ensure the login card pops */}
                <div className="absolute inset-0 bg-white/30 backdrop-blur-[4px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
                <div
                    className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.8)_100%)]" />
            </motion.div>

            {/* Back Button */}
            <Link href="/"
                  className="absolute top-8 left-8 z-20 flex items-center gap-2 text-zinc-500 hover:text-black transition-colors font-medium">
                <ArrowLeft size={18} />
                <span>Back to Home</span>
            </Link>

            {/* === LOGIN CARD === */}
            <motion.div
                initial={{ y: 40, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: appleEase }}
                className="relative z-10 w-full max-w-[440px] bg-white/80 backdrop-blur-2xl border border-black/5 rounded-[2.5rem] p-10 shadow-[0_40px_100px_rgba(0,0,0,0.08)]"
            >
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold tracking-tight text-black mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-zinc-500 font-light text-sm">
                        Enter your credentials to access the portal.
                    </p>
                </div>

                <form onSubmit={handleSignIn} className="space-y-5">
                    <div className="space-y-4">
                        <div>
                            <input
                                id="email"
                                type="email"
                                placeholder="Email address"
                                required
                                value={email}
                                onChange={handleEmailChange}
                                disabled={isLoading}
                                className={inputClasses}
                            />
                        </div>
                        <div>
                            <div className="relative">
                                <input
                                    ref={passwordInputRef}
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    required
                                    value={password}
                                    onChange={handlePasswordChange}
                                    disabled={isLoading}
                                    className={`${inputClasses} pr-12`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors focus:outline-none disabled:opacity-50"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>
                            </div>

                            {/* Inline Error Message Animation */}
                            <AnimatePresence>
                                {errorMessage && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, y: -10 }}
                                        animate={{ opacity: 1, height: "auto", y: 0 }}
                                        exit={{ opacity: 0, height: 0, y: -10 }}
                                        className="text-red-500 text-sm mt-3 ml-2 flex items-center gap-1.5 font-medium"
                                    >
                                        <AlertCircle size={14} />
                                        <span>{errorMessage}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex justify-end mt-2">
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-xs text-zinc-500 hover:text-black font-medium transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100"
                    >
                        {isLoading && <Loader2 className="size-5 animate-spin" />}
                        {isLoading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-black/5" />
                    </div>
                    <div className="relative flex justify-center text-xs font-bold tracking-widest uppercase">
                        <span className="bg-white/80 backdrop-blur-md px-4 text-zinc-400 rounded-full">
                            Or
                        </span>
                    </div>
                </div>

                {/* Social Logins */}
                <div className="grid grid-cols-3 gap-3">
                    <button
                        type="button"
                        disabled={true}
                        onClick={() => handleSocialSignIn("google")}
                        className="w-full py-3 bg-zinc-50 border border-black/5 rounded-xl font-medium text-black hover:bg-black/5 transition-colors text-sm"
                    >
                        Google
                    </button>
                    <button
                        type="button"
                        disabled={true}
                        onClick={() => handleSocialSignIn("facebook")}
                        className="w-full py-3 bg-zinc-50 border border-black/5 rounded-xl font-medium text-black hover:bg-black/5 transition-colors text-sm"
                    >
                        Meta
                    </button>
                    <button
                        type="button"
                        disabled={true}
                        onClick={() => handleSocialSignIn("discord")}
                        className="w-full py-3 bg-zinc-50 border border-black/5 rounded-xl font-medium text-black hover:bg-black/5 transition-colors text-sm"
                    >
                        Discord
                    </button>
                </div>
            </motion.div>
        </main>
    );
}