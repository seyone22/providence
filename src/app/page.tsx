"use client";

import MinimalHeader from "@/components/MinimalHeader";
import Link from "next/link";
import Image from "next/image";
import {ArrowRight, Building, Globe, Ship, User} from "lucide-react";
import {motion, useScroll, useTransform} from "framer-motion";
import {useRef} from "react";

const appleEase: any = [0.16, 1, 0.3, 1];

const brandLogos = [
    {src: "audi logo.png", alt: "Audi Logo"},
    {src: "Bentley Logo.png", alt: "Bentley Logo"},
    {src: "bmw logo.png", alt: "BMW Logo"},
    {src: "ferrari logo.png", alt: "Ferrari Logo"},
    {src: "genesis logo.png", alt: "Genesis Logo"},
    {src: "lamborghini logo.png", alt: "Lamborghini Logo"},
    {src: "land rover logo.png", alt: "Land Rover Logo"},
    {src: "lexus logo.png", alt: "Lexus Logo"},
    {src: "lucid motors logo.png", alt: "Lucid Motors Logo"},
    {src: "Aston Martin Logo.png", alt: "Aston Martin Logo"},
    {src: "rolls royce logo.png", alt: "Rolls Royce Logo"},
    {src: "tesla logo.png", alt: "Tesla Logo"},
    {src: "volvo logo.png", alt: "Volvo Logo"},
    {src: "Zeekr logo.png", alt: "Zeekr Logo"},
    {src: "mercedes benz logo.png", alt: "Mercedes-Benz Logo"},
    {src: "Polestar logo.png", alt: "Polestar Logo"},
    {src: "porsche logo.png", alt: "Porsche Logo"},
];

const flagLogos = [
    {src: "Australia.png", alt: "Australia"},
    {src: "Bahamas.png", alt: "Bahamas"},
    {src: "Barbados.png", alt: "Barbados"},
    {src: "Cyprus.png", alt: "Cyprus"},
    {src: "Guyana.png", alt: "Guyana"},
    {src: "Hong Kong.png", alt: "Hong Kong"},
    {src: "Indonesia.png", alt: "Indonesia"},
    {src: "Ireland.png", alt: "Ireland"},
    {src: "Trinidad and Tobago.png", alt: "Trinidad and Tobago"},
    {src: "Jamaica.png", alt: "Jamaica"},
    {src: "Sri Lanka.png", alt: "Sri Lanka"},
    {src: "Thailand.png", alt: "Thailand"},
    {src: "Uganda.png", alt: "Uganda"},
    {src: "United Kingdom.png", alt: "United Kingdom"},
    {src: "Jersey.png", alt: "Jersey"},
    {src: "Kenya.png", alt: "Kenya"},
    {src: "Malaysia.png", alt: "Malaysia"},
    {src: "Maldives.png", alt: "Maldives"},
    {src: "Malta.png", alt: "Malta"},
    {src: "New Zealand.png", alt: "New Zealand"},
    {src: "Zimbabwe.png", alt: "Zimbabwe"},
];

export default function Home() {
    const manifestoRef = useRef(null);
    const {scrollYProgress: manifestoScroll} = useScroll({
        target: manifestoRef,
        offset: ["start end", "center center"],
    });

    const manifestoScale = useTransform(manifestoScroll, [0, 1], [0.9, 1]);
    const manifestoOpacity = useTransform(manifestoScroll, [0, 1], [0.2, 1]);

    return (
        // Replaced overflow-x-hidden on main with a wrapping div strategy for better iOS support
        <main className="min-h-screen w-full bg-white text-black selection:bg-black/10 selection:text-black font-sans">
            <div className="relative w-full overflow-hidden">

                {/* Embedded CSS for Flawless Marquee Carousels
          Instead of translating -50% on a dynamically sized container (which glitches on resizing/mobile),
          we use a mathematically perfect loop by translating exactly -100% minus the gap size.
        */}
                <style dangerouslySetInnerHTML={{
                    __html: `
          .marquee-container {
            display: flex;
            overflow: hidden;
            user-select: none;
            gap: 2rem;
            padding: 2rem 0;
            width: 100%;
            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          }
          
          .marquee-content {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: space-around;
            gap: 2rem;
            min-width: 100%;
            animation: scroll-x 40s linear infinite;
          }

          .marquee-content.reverse {
            animation-direction: reverse;
          }

          .marquee-container:hover .marquee-content {
            animation-play-state: paused;
          }

          .marquee-item {
            width: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: transform 0.3s ease;
          }
            
          @media (min-width: 768px) {
            .marquee-item {
              width: 140px;
            }
          }

          .marquee-item img {
            max-width: 100%;
            max-height: 50px;
            object-fit: contain;
            filter: grayscale(100%) opacity(70%); 
            transition: filter 0.3s ease, transform 0.3s ease, opacity 0.3s ease;
            cursor: pointer;
          }
            
          @media (min-width: 768px) {
            .marquee-item img {
              max-height: 60px;
            }
          }

          .marquee-item img:hover {
            filter: grayscale(0%) opacity(100%);
            transform: scale(1.15);
          }

          @keyframes scroll-x {
            from { transform: translateX(0); }
            to { transform: translateX(calc(-100% - 2rem)); }
          }
        `
                }}/>

                {/* =========================================
            TOP SECTION: BACKGROUND IMAGE AREA
        ========================================= */}
                <section className="relative w-full pt-24 md:pt-32 pb-16">
                    {/* BACKGROUND LAYER */}
                    <motion.div
                        initial={{scale: 1.05, opacity: 0}}
                        animate={{scale: 1, opacity: 1}}
                        transition={{duration: 1.5, ease: appleEase}}
                        className="absolute inset-0 z-0 pointer-events-none"
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100"
                            style={{
                                backgroundImage:
                                    "url('https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=100&w=3000&auto=format&fit=crop')",
                            }}
                        />
                        {/* Gradient to seamlessly fade */}
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent"/>
                    </motion.div>

                    <MinimalHeader/>

                    <div className="relative z-10 flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 w-full">
                        <div className="text-center max-w-5xl mx-auto mt-8 md:mt-12">
                            <motion.h1
                                initial={{y: 20, opacity: 0, scale: 0.95}}
                                animate={{y: 0, opacity: 1, scale: 1}}
                                transition={{duration: 1, delay: 0.2, ease: appleEase}}
                                className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-b from-black via-black to-zinc-600 leading-[1.1] md:leading-[0.9]"
                            >
                                World’s Largest Borderless Showroom.
                            </motion.h1>

                            <motion.p
                                initial={{y: 15, opacity: 0}}
                                animate={{y: 0, opacity: 1}}
                                transition={{duration: 0.8, delay: 0.4, ease: appleEase}}
                                className="text-xl sm:text-2xl md:text-3xl text-zinc-700 font-medium tracking-tight mt-6 md:mt-8 mb-4 md:mb-6"
                            >
                                Any Car. Any Country. Any Port.
                            </motion.p>
                        </div>

                        {/* BRAND LOGO CAROUSEL */}
                        <motion.div
                            initial={{opacity: 0, y: 10}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.8, delay: 0.45, ease: appleEase}}
                            className="w-full mt-4 md:mt-8"
                        >
                            <div className="marquee-container border-y border-black/10">
                                <div className="marquee-content">
                                    {brandLogos.map((logo, index) => (
                                        <div key={`brand-1-${index}`} className="marquee-item">
                                            <img src={`car_logo/${logo.src}`} alt={logo.alt} loading="lazy"/>
                                        </div>
                                    ))}
                                </div>
                                {/* Duplicate content for seamless infinite loop */}
                                <div className="marquee-content" aria-hidden="true">
                                    {brandLogos.map((logo, index) => (
                                        <div key={`brand-2-${index}`} className="marquee-item">
                                            <img src={`car_logo/${logo.src}`} alt={logo.alt} loading="lazy"/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        <section
                            ref={manifestoRef}
                            className="relative z-10 w-full py-16 md:py-24"
                        >
                            <motion.div
                                style={{
                                    scale: manifestoScale,
                                    opacity: manifestoOpacity,
                                    willChange: "transform, opacity" // Hardware acceleration for iOS Safari
                                }}
                                className="max-w-4xl mx-auto px-4 text-center"
                            >
                                <p className="text-xl sm:text-2xl md:text-3xl font-light tracking-tight leading-relaxed text-zinc-700">
                                    Welcome to Providence Auto. We are building the world’s largest
                                    borderless showroom. Whether you are a car enthusiast looking
                                    for your dream car or a dealership wanting to scale up, we
                                    provide the exact vehicle you desire. We source vehicles from
                                    the most tax-efficient markets on earth and deliver them right
                                    to your country with zero logistical friction.
                                </p>
                            </motion.div>
                        </section>

                        {/* FLAG LOGO CAROUSEL */}
                        <motion.div
                            initial={{opacity: 0, y: 10}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.8, delay: 0.45, ease: appleEase}}
                            className="w-full mb-12"
                        >
                            <div className="marquee-container border-y border-black/10">
                                <div className="marquee-content reverse">
                                    {flagLogos.map((logo, index) => (
                                        <div key={`flag-1-${index}`} className="marquee-item">
                                            <img src={`country/${logo.src}`} alt={logo.alt} loading="lazy"/>
                                        </div>
                                    ))}
                                </div>
                                <div className="marquee-content reverse" aria-hidden="true">
                                    {flagLogos.map((logo, index) => (
                                        <div key={`flag-2-${index}`} className="marquee-item">
                                            <img src={`country/${logo.src}`} alt={logo.alt} loading="lazy"/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* =========================================
            BOTTOM SECTION: SOLID WHITE BACKGROUND
        ========================================= */}
                <section className="relative z-10 bg-white w-full pb-24 md:pb-32">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">

                        {/* HOW IT WORKS */}
                        <div className="pt-8 md:pt-12 pb-16 md:pb-20">
                            <motion.div
                                initial={{y: 30, opacity: 0}}
                                whileInView={{y: 0, opacity: 1}}
                                viewport={{once: true, margin: "-50px"}}
                                transition={{duration: 0.8, ease: appleEase}}
                                className="mb-12 md:mb-20 text-center"
                            >
                                <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tighter text-black">
                                    How it works
                                </h2>
                            </motion.div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 text-left">
                                {[
                                    {
                                        step: "",
                                        title: "Request",
                                        glowColor: "group-hover:bg-blue-500/15",
                                        icon: (
                                            <svg
                                                className="text-sky-500 h-7 w-7 md:h-8 md:w-8 group-hover:text-white transition-colors duration-500"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                            </svg>
                                        ),
                                        desc: "Tell us the car you want. Model, colour, trim — as specific as you like. We'll come back with a full global sourcing quote within 24 hours. No commitment required.",
                                    },
                                    {
                                        step: "",
                                        title: "Source",
                                        glowColor: "group-hover:bg-emerald-500/15",
                                        icon: (
                                            <Globe
                                                className="text-sky-500 h-7 w-7 md:h-8 md:w-8 group-hover:text-white transition-colors duration-500"/>
                                        ),
                                        desc: "We search 40+ global markets to find your exact spec at the most tax-efficient price. Currency, supply, and timing all factored in. You approve the quote. We handle everything from there.",
                                    },
                                    {
                                        step: "",
                                        title: "Shipping",
                                        glowColor: "group-hover:bg-indigo-500/15",
                                        icon: (
                                            <Ship
                                                className="text-sky-500 h-7 w-7 md:h-8 md:w-8 group-hover:text-white transition-colors duration-500"/>
                                        ),
                                        desc: "Your car is purchased, quality checked, fully documented, and shipped. You get real-time updates at every stage. It arrives cleared, compliant, and ready to register.",
                                    },
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{y: 30, opacity: 0, scale: 0.98}}
                                        whileInView={{y: 0, opacity: 1, scale: 1}}
                                        viewport={{once: true, margin: "-50px"}}
                                        transition={{duration: 0.8, delay: index * 0.1, ease: appleEase}}
                                        className="relative overflow-hidden group flex flex-col items-start p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-zinc-50/50 hover:bg-zinc-50 transition-all duration-500 border border-black/5 hover:border-black/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)]"
                                    >
                                        {/* Subtle Glow Orb Effect */}
                                        <div
                                            className={`absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-[80px] bg-transparent transition-colors duration-700 ${item.glowColor}`}
                                        />

                                        <div className="relative z-10 w-full">
                                            {/* ICON & STEP */}
                                            <div className="flex justify-between items-start mb-6 md:mb-8 w-full">
                                                <div
                                                    className="p-3 md:p-4 bg-white border border-black/10 rounded-2xl inline-flex group-hover:bg-sky-500 group-hover:border-sky-500 transition-colors duration-500 shadow-sm">
                                                    {item.icon}
                                                </div>

                                                {item.step && (
                                                    <span
                                                        className="text-3xl md:text-4xl font-bold text-black/40 group-hover:text-black/80 transition-colors duration-500">
                            {item.step}
                          </span>
                                                )}
                                            </div>

                                            {/* CONTENT */}
                                            <h3 className="text-xl md:text-2xl font-bold text-black mb-3 md:mb-4 tracking-tight group-hover:text-sky-500 transition-colors duration-500">
                                                {item.title}
                                            </h3>

                                            <p className="text-zinc-600 text-base md:text-lg leading-relaxed font-light">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Path Selections */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto w-full mt-8 md:mt-12">
                            <motion.div
                                initial={{y: 30, opacity: 0}}
                                whileInView={{y: 0, opacity: 1}}
                                viewport={{once: true, margin: "-50px"}}
                                transition={{duration: 0.8, delay: 0.1, ease: appleEase}}
                                className="h-full"
                            >
                                <Link
                                    href="/b2c"
                                    className="group relative bg-zinc-50 border border-black/5 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between h-full hover:bg-white hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:border-black/10 transition-all duration-500 overflow-hidden min-h-[350px] md:min-h-[400px]"
                                >
                                    <div className="relative z-10">
                                        <div
                                            className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center mb-6 md:mb-8 border border-black/10 shadow-sm group-hover:bg-black group-hover:text-white transition-all duration-500">
                                            <User className="h-5 w-5 md:h-6 md:w-6"/>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-bold text-black mb-3 md:mb-4 tracking-tight">
                                            For Direct Buyers
                                        </h3>
                                        <p className="text-zinc-500 text-base md:text-lg leading-relaxed mb-10 font-light">
                                            For the past 15 years, we have supplied the top car dealers in
                                            your country. For the first time, we are offering our service
                                            directly to consumers. Cut out the middleman and save a ton
                                            when you directly import with us.
                                        </p>
                                    </div>

                                    <div
                                        className="relative z-10 flex items-center justify-between mt-auto pt-6 border-t border-black/5 group-hover:border-transparent transition-colors duration-500">
                    <span
                        className="text-black group-hover:text-sky-500 font-bold text-base md:text-lg transition-colors duration-300">
                      Find My Dream Car
                    </span>
                                        <div
                                            className="h-12 w-12 md:h-14 md:w-14 bg-white border border-black/10 text-black rounded-full flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm group-hover:shadow-lg group-hover:border-sky-500">
                                            <ArrowRight className="w-5 h-5 md:w-6 md:h-6"/>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>

                            <motion.div
                                initial={{y: 30, opacity: 0}}
                                whileInView={{y: 0, opacity: 1}}
                                viewport={{once: true, margin: "-50px"}}
                                transition={{duration: 0.8, delay: 0.2, ease: appleEase}}
                                className="h-full"
                            >
                                <Link
                                    href="/b2b"
                                    className="group relative bg-zinc-50 border border-black/5 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between h-full hover:bg-white hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:border-black/10 transition-all duration-500 overflow-hidden min-h-[350px] md:min-h-[400px]"
                                >
                                    <div className="relative z-10">
                                        <div
                                            className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center mb-6 md:mb-8 border border-black/10 shadow-sm group-hover:bg-black group-hover:text-white transition-all duration-500">
                                            <Building className="h-5 w-5 md:h-6 md:w-6"/>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-bold text-black mb-3 md:mb-4 tracking-tight">
                                            For Dealerships
                                        </h3>
                                        <p className="text-zinc-500 text-base md:text-lg leading-relaxed mb-10 font-light">
                                            Scale your lot without the overhead. Access 100+ global
                                            markets to find the exact trims and specifications your
                                            customers are looking for. Transform your inventory power
                                            overnight.
                                        </p>
                                    </div>

                                    <div
                                        className="relative z-10 flex items-center justify-between mt-auto pt-6 border-t border-black/5 group-hover:border-transparent transition-colors duration-500">
                    <span
                        className="text-black group-hover:text-sky-500 font-bold text-base md:text-lg transition-colors duration-300">
                      Scale Your Dealership
                    </span>
                                        <div
                                            className="h-12 w-12 md:h-14 md:w-14 bg-white border border-black/10 text-black rounded-full flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm group-hover:shadow-lg group-hover:border-sky-500">
                                            <ArrowRight className="w-5 h-5 md:w-6 md:h-6"/>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        </div>

                        {/* PARTNERS/AFFILIATES SECTION */}
                        <motion.div
                            initial={{y: 30, opacity: 0}}
                            whileInView={{y: 0, opacity: 1}}
                            viewport={{once: true}}
                            transition={{duration: 1, ease: appleEase}}
                            className="mt-24 md:mt-32 max-w-5xl mx-auto w-full text-center"
                        >
                            <p className="text-[10px] md:text-xs font-bold tracking-[0.25em] md:tracking-[0.3em] text-zinc-400 uppercase mb-8 md:mb-10 drop-shadow-sm">
                                Trusted by our global partners
                            </p>

                            <div className="flex flex-nowrap justify-center items-center gap-3 sm:gap-6 md:gap-10 lg:gap-16 w-full">
                                {[1, 2, 3, 4, 5, 6, 7].map((num, index) => (
                                    <motion.div
                                        key={num}
                                        initial={{opacity: 0, scale: 0.95}}
                                        whileInView={{opacity: 1, scale: 1}}
                                        viewport={{once: true}}
                                        transition={{
                                            duration: 0.8,
                                            delay: index * 0.1,
                                            ease: appleEase,
                                        }}
                                        className="relative shrink h-6 w-12 sm:h-8 sm:w-16 md:h-12 md:w-24 lg:h-16 lg:w-32 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-105 transition-all duration-500 cursor-pointer"
                                    >
                                        <Image
                                            src={`/affiliate/${num}.png`}
                                            alt={`Global Partner ${num}`}
                                            fill
                                            className="object-contain"
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </main>
    );
}