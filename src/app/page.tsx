import MinimalHeader from "@/app/components/MinimalHeader";
import Link from "next/link";
import { ArrowRight, User, Building } from "lucide-react";

export default function Home() {
  return (
      <main className="min-h-screen bg-black text-white relative flex flex-col selection:bg-white/30 selection:text-white font-sans">

        {/* === BACKGROUND LAYER === */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* High-quality dark luxury car image */}
          <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 scale-105"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=3000&auto=format&fit=crop')" }}
          />
          {/* Bottom-to-top gradient to seamlessly blend the image into the black background below */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          {/* Vignette effect to focus the eye on the center text */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)]" />
        </div>

        <MinimalHeader />

        {/* === CONTENT LAYER === */}
        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto px-6 py-32 w-full">

          <div className="text-center max-w-4xl mx-auto mb-24">
            <p className="text-sm font-bold tracking-[0.4em] text-zinc-500 uppercase mb-8">
              Providence Auto
            </p>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40 leading-none">
              Borderless.<br />Showroom.
            </h1>
            <p className="text-2xl md:text-3xl text-zinc-400 font-medium tracking-tight mt-8">
              Any Car. Any Country. Any Port.
            </p>
          </div>

          {/* The Pathways (B2C & B2B) */}
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto w-full">

            {/* B2C Pathway */}
            <Link href="/b2c" className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 flex flex-col justify-between h-full hover:bg-white/[0.08] hover:border-white/30 transition-all duration-500 overflow-hidden">
              {/* Subtle hover glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] group-hover:bg-white/10 transition-colors" />

              <div className="relative z-10">
                <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                  <User className="text-white h-6 w-6" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">For Direct Buyers</h3>
                <p className="text-zinc-400 text-lg leading-relaxed mb-12 font-light">
                  Cut out the middleman. Access our global sourcing network and directly import your dream car at its true market value.
                </p>
              </div>

              <div className="relative z-10 flex items-center justify-between mt-auto">
                <span className="text-white font-semibold text-lg">Find My Dream Car</span>
                <div className="h-12 w-12 bg-white text-black rounded-full flex items-center justify-center group-hover:translate-x-2 transition-transform duration-500">
                  <ArrowRight size={20} />
                </div>
              </div>
            </Link>

            {/* B2B Pathway */}
            <Link href="/b2b" className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 flex flex-col justify-between h-full hover:bg-white/[0.08] hover:border-white/30 transition-all duration-500 overflow-hidden">
              {/* Subtle hover glow */}
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] group-hover:bg-blue-500/20 transition-colors" />

              <div className="relative z-10">
                <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                  <Building className="text-white h-6 w-6" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">For Dealerships</h3>
                <p className="text-zinc-400 text-lg leading-relaxed mb-12 font-light">
                  Transform your website into a borderless lot. Access 100+ global markets to find the exact trims your customers demand.
                </p>
              </div>

              <div className="relative z-10 flex items-center justify-between mt-auto">
                <span className="text-white font-semibold text-lg">Scale Your Inventory</span>
                <div className="h-12 w-12 bg-white/10 border border-white/20 text-white rounded-full flex items-center justify-center group-hover:translate-x-2 transition-transform duration-500">
                  <ArrowRight size={20} />
                </div>
              </div>
            </Link>

          </div>
        </div>
      </main>
  );
}