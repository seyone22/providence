"use client";

import { Suspense } from "react";
import MinimalHeader from "@/components/MinimalHeader";
import { motion } from "framer-motion";
import RequestForm from "@/components/requestForm"; // Adjust path if necessary

// Apple-style smooth easing curve
const appleEase: any = [0.16, 1, 0.3, 1];

export default function RequestCar() {
    return (
        <div className="min-h-screen bg-white text-black flex flex-col relative overflow-x-hidden font-sans selection:bg-black/10 selection:text-black">

            {/* === BACKGROUND LAYER === */}
            <motion.div
                initial={{ scale: 1.05, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: appleEase }}
                className="absolute inset-0 z-0 pointer-events-none fixed"
            >
                {/* Clean, detailed interior or bright studio car shot */}
                <img
                    src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=3000&auto=format&fit=crop"
                    alt="Premium automotive interior"
                    className="w-full h-full object-cover object-center"
                />
                {/* Frosted washes to ensure the form and text pop */}
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent h-1/3" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
            </motion.div>

            <MinimalHeader />

            <main className="flex-1 flex flex-col items-center justify-center py-32 px-4 relative z-10 w-full min-h-screen">

                {/* Header Text */}
                <div className="text-center mb-12 mt-10">
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: appleEase }}
                        className="text-4xl md:text-6xl font-bold tracking-tighter text-black mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,1)]"
                    >
                        Create your inquiry.
                    </motion.h2>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: appleEase }}
                        className="text-zinc-500 text-lg md:text-xl max-w-xl mx-auto font-light drop-shadow-[0_0_10px_rgba(255,255,255,1)]"
                    >
                        Provide your exact specifications, and our concierge will handle the rest.
                    </motion.p>
                </div>

                {/* Main Form Component */}
                <div className="w-full max-w-3xl">
                    <Suspense fallback={
                        <div className="w-full max-w-3xl mx-auto h-[550px] flex items-center justify-center bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 shadow-[0_40px_100px_rgba(0,0,0,0.08)] text-zinc-500">
                            Loading form...
                        </div>
                    }>
                        <RequestForm />
                    </Suspense>
                </div>

            </main>
        </div>
    );
}