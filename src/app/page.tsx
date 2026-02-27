"use client";

import MinimalHeader from "@/app/components/MinimalHeader";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, User, Building } from "lucide-react";
import { motion } from "framer-motion";

// Apple-style smooth easing curve
const appleEase: any = [0.16, 1, 0.3, 1];

export default function Home() {
  return (
      <main className="min-h-screen bg-white text-black relative flex flex-col selection:bg-black/10 selection:text-black font-sans overflow-hidden">

        {/* === BACKGROUND LAYER === */}
        <motion.div
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: appleEase }}
            className="absolute inset-0 z-0 pointer-events-none"
        >
          {/* High-quality light luxury car image */}
          <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=100&w=3000&auto=format&fit=crop')" }}
          />
          {/* Bottom-to-top gradient to seamlessly blend the image into the white background below */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
        </motion.div>

        <MinimalHeader />

        {/* === CONTENT LAYER === */}
        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto px-6 py-32 w-full">

          <div className="text-center max-w-4xl mx-auto mb-20">
            <motion.h1
                initial={{ y: 30, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2, ease: appleEase }}
                className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-black via-black to-black/50 leading-none"
            >
              Borderless.<br />Showroom.
            </motion.h1>

            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4, ease: appleEase }}
                className="text-2xl md:text-3xl text-zinc-500 font-medium tracking-tight mt-8 mb-6"
            >
              Any Car. Any Country. Any Port.
            </motion.p>

            {/* === NEW VALUE PROPOSITION BLURB === */}
            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: appleEase }}
                className="text-lg md:text-xl text-zinc-500 font-light max-w-3xl mx-auto leading-relaxed"
            >
              Whether you are a car enthusiast looking for your dream car or a dealership wanting to scale up, we provide the exact vehicle you desire. We source vehicles from the most tax-efficient markets on earth. Then, we deliver them right to your doorstep with zero logistical friction.
            </motion.p>
          </div>

          {/* The Pathways (B2C & B2B) */}
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto w-full">

            {/* B2C Pathway */}
            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6, ease: appleEase }}
            >
              <Link href="/b2c" className="group relative bg-black/[0.02] backdrop-blur-xl border border-black/5 rounded-[2.5rem] p-10 flex flex-col justify-between h-full hover:bg-white hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-black/10 transition-all duration-500 overflow-hidden">

                <div className="relative z-10">
                  <div className="h-12 w-12 bg-black/5 rounded-2xl flex items-center justify-center mb-8 border border-black/10 group-hover:bg-black group-hover:text-white transition-all duration-500">
                    <User className="h-6 w-6" />
                  </div>
                  <h3 className="text-3xl font-bold text-black mb-4 tracking-tight">For Direct Buyers</h3>
                  <p className="text-zinc-500 text-lg leading-relaxed mb-12 font-light">
                    Cut out the middleman. Access our global sourcing network and directly import your dream car at its true market value.
                  </p>
                </div>

                <div className="relative z-10 flex items-center justify-between mt-auto">
                  <span className="text-black font-semibold text-lg">Find My Dream Car</span>
                  <div className="h-12 w-12 bg-black text-white rounded-full flex items-center justify-center group-hover:translate-x-2 transition-transform duration-500 shadow-md">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* B2B Pathway */}
            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7, ease: appleEase }}
            >
              <Link href="/b2b" className="group relative bg-black/[0.02] backdrop-blur-xl border border-black/5 rounded-[2.5rem] p-10 flex flex-col justify-between h-full hover:bg-white hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-black/10 transition-all duration-500 overflow-hidden">

                <div className="relative z-10">
                  <div className="h-12 w-12 bg-black/5 rounded-2xl flex items-center justify-center mb-8 border border-black/10 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 text-black">
                    <Building className="h-6 w-6" />
                  </div>
                  <h3 className="text-3xl font-bold text-black mb-4 tracking-tight">For Dealerships</h3>
                  <p className="text-zinc-500 text-lg leading-relaxed mb-12 font-light">
                    Transform your website into a borderless lot. Access 100+ global markets to find the exact trims your customers demand.
                  </p>
                </div>

                <div className="relative z-10 flex items-center justify-between mt-auto">
                  <span className="text-black font-semibold text-lg">Scale Your Inventory</span>
                  <div className="h-12 w-12 bg-black/5 border border-black/10 text-black rounded-full flex items-center justify-center group-hover:translate-x-2 group-hover:bg-black group-hover:text-white transition-all duration-500">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </Link>
            </motion.div>

          </div>

          {/* === NEW PARTNERS/AFFILIATES SECTION === */}
          <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.9, ease: appleEase }}
              className="mt-32 max-w-5xl mx-auto w-full text-center"
          >
            <p className="text-xs md:text-sm font-bold tracking-[0.3em] text-zinc-400 uppercase mb-10 drop-shadow-sm">
              Trusted by our global partners
            </p>

            {/* Logo Grid/Flex */}
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
              {[1, 2, 3, 4, 5, 6, 7].map((num, index) => (
                  <motion.div
                      key={num}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: 1.0 + index * 0.1, ease: appleEase }}
                      className="relative h-10 w-24 md:h-24 md:w-36 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-105 transition-all duration-500 cursor-pointer"
                  >
                    <Image
                        src={`/affiliate/${num}.png`}
                        alt={`Global Partner ${num}`}
                        fill
                        className="object-cover"
                    />
                  </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </main>
  );
}