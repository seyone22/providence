import MinimalHeader from "@/app/components/MinimalHeader"; // Ensure the path matches your project structure
import Link from "next/link";
import { Landmark, Compass, Ship, ShieldCheck, ArrowRight } from "lucide-react";

export default function B2CLanding() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-white/30 selection:text-white font-sans overflow-x-hidden">
            <MinimalHeader />

            {/* SECTION 1: The Cinematic Hero */}
            <section className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-20">
                {/* Subtle top spotlight */}
                <div className="absolute top-[-10%] w-full h-[800px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08)_0%,rgba(0,0,0,1)_70%)] pointer-events-none" />

                <div className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center">
                    <p className="text-sm font-bold tracking-[0.4em] text-zinc-500 uppercase mb-8">
                        Direct Import Network
                    </p>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/30 leading-[1.1]">
                        The Global Shortcut to<br />Your Dream Car.
                    </h1>
                    <p className="text-xl md:text-3xl text-zinc-400 font-medium tracking-tight mb-12 max-w-2xl">
                        Don't settle for what's on the lot.
                    </p>

                    <Link href="/request" className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-black bg-white rounded-full overflow-hidden transition-transform hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.15)]">
                        <span className="relative z-10 flex items-center gap-2">
                            Begin Your Inquiry <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                </div>
            </section>

            {/* SECTION 2: The Manifesto (The "Aha" Moment) */}
            <section className="py-32 md:py-48 px-6 bg-zinc-950 border-y border-white/5 relative">
                <div className="max-w-5xl mx-auto text-center">
                    <p className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight text-zinc-500">
                        For the last 12 years, we’ve supplied the top car dealers in your country. For the first time ever, we are <span className="text-white">cutting out the middleman</span> and offering our global sourcing network <span className="text-white">directly to you</span>.
                    </p>
                </div>
            </section>

            {/* SECTION 3: The Architecture of the Service (Features) */}
            <section className="py-32 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-24">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6">
                        Never compromise again.
                    </h2>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-light">
                        We are industry experts. We know exactly where to source your desired vehicle for the cheapest price, with the exact specifications you demand.
                    </p>
                </div>

                {/* Elegant, breathable grid instead of a cramped list */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
                    {/* Feature 1 */}
                    <div className="flex flex-col items-start p-8 rounded-[2rem] hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl mb-6">
                            <Compass className="text-white h-8 w-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Currency & Market Optimization</h3>
                        <p className="text-zinc-400 text-lg leading-relaxed font-light">
                            We don't just find the car; we analyze global markets to optimize currency conversions, ensuring you buy from the most financially efficient country at that exact moment.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="flex flex-col items-start p-8 rounded-[2rem] hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl mb-6">
                            <Landmark className="text-white h-8 w-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Mastery of Tax Law</h3>
                        <p className="text-zinc-400 text-lg leading-relaxed font-light">
                            Importing luxury vehicles requires navigating complex tax codes. We know every loophole, tariff, and regulation to legally minimize your import duties.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="flex flex-col items-start p-8 rounded-[2rem] hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl mb-6">
                            <Ship className="text-white h-8 w-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">White-Glove Logistics</h3>
                        <p className="text-zinc-400 text-lg leading-relaxed font-light">
                            From the showroom floor in Germany to your driveway. We handle every single form, marine insurance policy, and freight mile for you. Zero friction.
                        </p>
                    </div>

                    {/* Feature 4 */}
                    <div className="flex flex-col items-start p-8 rounded-[2rem] hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl mb-6">
                            <ShieldCheck className="text-white h-8 w-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">12 Years of Heritage</h3>
                        <p className="text-zinc-400 text-lg leading-relaxed font-light">
                            We aren't a startup guessing how to ship cars. We have over a decade of established infrastructure, delivering the most reliable service in the industry.
                        </p>
                    </div>
                </div>
            </section>

            {/* SECTION 4: The Final Ask (The Concierge Prompt) */}
            <section className="py-32 px-6 relative flex flex-col justify-center items-center bg-zinc-950 border-t border-white/5">
                {/* Subtle background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/[0.03] blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10 text-center max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white mb-8">
                        Tell us exactly what you want.
                    </h2>
                    <p className="text-xl md:text-2xl text-zinc-400 font-light mb-12">
                        Like a <span className="text-white font-medium">2023 Defender in Fuji White</span>. Our team will generate a fully-landed Sourcing Quote within 24 hours.
                    </p>

                    <Link href="/request" className="inline-flex items-center justify-center px-12 py-6 text-xl font-bold text-black bg-white rounded-full transition-transform hover:scale-105 shadow-[0_0_60px_rgba(255,255,255,0.2)]">
                        Tell Us What You Want
                    </Link>
                </div>
            </section>
        </main>
    );
}