"use client";

import { Suspense } from "react";
import MinimalHeader from "@/components/MinimalHeader";
import { Reveal } from "@/components/Reveal";
import GradientMesh from "@/components/GradientMesh";
import RequestForm from "@/components/requestForm"; // Adjust path if necessary

export default function RequestCar() {
    return (
        <div className="min-h-screen bg-white text-black flex flex-col relative overflow-x-hidden font-sans selection:bg-black/10 selection:text-black">

            {/* === HERO IMAGE + GRADIENT MESH BACKGROUND === */}
            <GradientMesh image="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=3000&auto=format&fit=crop" />

            <MinimalHeader />

            <main className="flex-1 flex flex-col items-center justify-center py-32 px-4 relative z-10 w-full min-h-screen">

                {/* Header Text */}
                <div className="text-center mb-12 mt-10">
                    <Reveal
                        immediate
                        as="h2"
                        y={20}
                        delay={0.1}
                        duration={0.8}
                        className="pa-headline-gradient text-4xl md:text-6xl font-bold tracking-tighter mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,1)]"
                    >
                        Create your inquiry.
                    </Reveal>
                    <Reveal
                        immediate
                        as="p"
                        y={20}
                        delay={0.2}
                        duration={0.8}
                        className="text-zinc-500 text-lg md:text-xl max-w-xl mx-auto font-light drop-shadow-[0_0_10px_rgba(255,255,255,1)]"
                    >
                        Provide your exact specifications, and our concierge will handle the rest.
                    </Reveal>
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