"use client";

import MinimalHeader from "@/app/components/MinimalHeader";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, User, Building, Globe, Ship } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const appleEase: any = [0.16, 1, 0.3, 1];

const brandLogos = [
  { src: "audi logo.png", alt: "Audi Logo" },
  { src: "Bentley Logo.png", alt: "Bentley Logo" },
  { src: "bmw logo.png", alt: "BMW Logo" },
  { src: "ferrari logo.png", alt: "Ferrari Logo" },
  { src: "genesis logo.png", alt: "Genesis Logo" },
  { src: "lamborghini logo.png", alt: "Lamborghini Logo" },
  { src: "land rover logo.png", alt: "Land Rover Logo" },
  { src: "lexus logo.png", alt: "Lexus Logo" },
  { src: "lucid motors logo.png", alt: "Lucid Motors Logo" },
  { src: "Aston Martin Logo.png", alt: "Aston Martin Logo" },
  { src: "rolls royce logo.png", alt: "Rolls Royce Logo" },
  { src: "tesla logo.png", alt: "Tesla Logo" },
  { src: "volvo logo.png", alt: "Volvo Logo" },
  { src: "Zeekr logo.png", alt: "Zeekr Logo" },
  { src: "mercedes benz logo.png", alt: "Mercedes-Benz Logo" },
  { src: "Polestar logo.png", alt: "Polestar Logo" },
  { src: "porsche logo.png", alt: "Porsche Logo" },
];

const flagLogos = [
  { src: "Australia.png", alt: "Australia" },
  { src: "Bahamas.png", alt: "Bahamas" },
  { src: "Barbados.png", alt: "Barbados" },
  { src: "Cyprus.png", alt: "Cyprus" },
  { src: "Guyana.png", alt: "Guyana" },
  { src: "Hong Kong.png", alt: "Hong Kong" },
  { src: "Indonesia.png", alt: "Indonesia" },
  { src: "Ireland.png", alt: "Ireland" },
  { src: "Trinidad and Tobago.png", alt: "Trinidad and Tobago" },
  { src: "Jamaica.png", alt: "Jamaica" },
  { src: "Sri Lanka.png", alt: "Sri Lanka" },
  { src: "Thailand.png", alt: "Thailand" },
  { src: "Uganda.png", alt: "Uganda" },
  { src: "United Kingdom.png", alt: "United Kingdom" },
  { src: "Jersey.png", alt: "Jersey" },
  { src: "Kenya.png", alt: "Kenya" },
  { src: "Malaysia.png", alt: "Malaysia" },
  { src: "Maldives.png", alt: "Maldives" },
  { src: "Malta.png", alt: "Malta" },
  { src: "New Zealand.png", alt: "New Zealand" },
  { src: "Zimbabwe.png", alt: "Zimbabwe" },
];

export default function Home() {
  const manifestoRef = useRef(null);
  const { scrollYProgress: manifestoScroll } = useScroll({
    target: manifestoRef,
    offset: ["start end", "center center"],
  });

  const manifestoScale = useTransform(manifestoScroll, [0, 1], [0.85, 1]);
  const manifestoOpacity = useTransform(manifestoScroll, [0, 1], [0.3, 1]);

  return (
      <main className="min-h-screen bg-white text-black relative flex flex-col selection:bg-black/10 selection:text-black font-sans overflow-hidden">

        {/* Embedded CSS for the Logo Carousel */}
        <style dangerouslySetInnerHTML={{ __html: `
        .carousel-container {
            width: 100vw; 
            margin-left: calc(50% - 50vw); 
            overflow: hidden;
            background: transparent;
            border-top: 1px solid rgba(0, 0, 0, 0.15); 
            border-bottom: 1px solid rgba(0, 0, 0, 0.15); 
            padding: 40px 0;
            box-sizing: border-box;
            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        .carousel-track {
            display: flex;
            align-items: center;
            width: calc(3400% / 7); 
            animation: scroll 40s linear infinite; 
        }
        .carousel-track:hover {
            animation-play-state: paused;
        }
        .carousel-item {
            width: calc(100% / 34); 
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0 5px;
            box-sizing: border-box;
        }
        .carousel-item img {
            max-width: 100%;
            max-height: 70px;
            object-fit: contain;
            filter: grayscale(100%) opacity(70%); 
            transition: filter 0.3s ease, transform 0.3s ease, opacity 0.3s ease;
            cursor: pointer;
        }
        .carousel-item img:hover {
            filter: grayscale(0%) opacity(100%);
            transform: scale(1.15);
        }
        @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
      `}} />

        {/* === BACKGROUND LAYER === */}
        <motion.div
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: appleEase }}
            className="absolute inset-0 z-0 pointer-events-none"
        >
          <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100"
              style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=100&w=3000&auto=format&fit=crop')",
              }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
        </motion.div>

        <MinimalHeader />

        {/* === CONTENT LAYER === */}
        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto px-6 py-32 w-full">
          <div className="text-center max-w-5xl mx-auto">
            <motion.h1
                initial={{ y: 30, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2, ease: appleEase }}
                className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-black via-black to-zinc-600 leading-[0.9]"
            >
              World’s Largest Borderless Showroom.
            </motion.h1>

            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4, ease: appleEase }}
                className="text-2xl md:text-3xl text-black font-medium tracking-tight mt-8 mb-6"
            >
              Any Car. Any Country. Any Port.
            </motion.p>

            {/* === INFINITE LOGO CAROUSEL === */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.45, ease: appleEase }}
                className="carousel-container my-12"
            >
              <div className="carousel-track">
                {/* Mapping through the array twice to create the 34 items needed for the infinite loop */}
                {[...brandLogos, ...brandLogos].map((logo, index) => (
                    <div key={index} className="carousel-item">
                      <img src={`car_logo/${logo.src}`} alt={logo.alt} />
                    </div>
                ))}
              </div>
            </motion.div>

            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: appleEase }}
                className="text-lg md:text-xl text-zinc-500 font-light max-w-3xl mx-auto leading-relaxed mt-20"
            >
              Welcome to Providence Auto. We are building the world’s largest
              borderless showroom.
            </motion.p>

            {/* === INFINITE LOGO CAROUSEL === */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.45, ease: appleEase }}
                className="carousel-container my-12"
            >
              <div className="carousel-track">
                {/* Mapping through the array twice to create the 34 items needed for the infinite loop */}
                {[...flagLogos, ...flagLogos].map((logo, index) => (
                    <div key={index} className="carousel-item">
                      <img src={`country/${logo.src}`} alt={logo.alt} />
                    </div>
                ))}
              </div>
            </motion.div>
          </div>

          <section
              ref={manifestoRef}
              className="bg-transparent border-black/5 relative z-10 overflow-hidden"
          >
            <div className="max-w-5xl mx-auto text-center">
              <motion.p
                  style={{ scale: manifestoScale, opacity: manifestoOpacity }}
                  className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight text-black mt-20"
              >
                Whether you are a car enthusiast looking for your dream car or a
                dealership wanting to scale up, we provide the exact vehicle you
                desire. We source vehicles from the most tax-efficient markets on
                earth and deliver them right to your country with zero logistical
                friction.{" "}
              </motion.p>
            </div>
          </section>

          {/* === SECTION: HOW IT WORKS === */}
          <section className="py-32 px-6 max-w-7xl mx-auto w-full relative z-10">
            <motion.div
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: appleEase }}
                className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-black">
                How it works
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Request",
                  icon: (
                      <svg
                          width="36"
                          height="36"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                  ),
                  desc: "Tell us the car you want. Model, colour, trim — as specific as you like. We'll come back with a full global sourcing quote within 24 hours. No commitment required.",
                },
                {
                  step: "02",
                  title: "Source",
                  icon: <Globe className="h-10 w-10" />,
                  desc: "We search 40+ global markets to find your exact spec at the most tax-efficient price. Currency, supply, and timing all factored in. You approve the quote. We handle everything from there.",
                },
                {
                  step: "03",
                  title: "Shipping",
                  icon: <Ship className="h-10 w-10" />,
                  desc: "Your car is purchased, quality checked, fully documented, and shipped. You get real-time updates at every stage. It arrives cleared, compliant, and ready to register.",
                },
              ].map((item, index) => (
                  <motion.div
                      key={index}
                      initial={{ y: 40, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.8,
                        delay: index * 0.1,
                        ease: appleEase,
                      }}
                      className="group relative bg-zinc-50 border border-black/5 rounded-[2.5rem] p-10 hover:bg-white hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] transition-all duration-500"
                  >
                    {/* ICON & STEP */}
                    <div className="flex justify-between items-start mb-12">
                      <div className="h-14 w-14 bg-white  rounded-2xl flex items-center justify-center  group-hover:bg-black group-hover:text-white transition-all duration-500">
                        {item.icon}
                      </div>
                      <span className="text-4xl font-bold text-black/60 group-hover:text-black/100 transition-colors duration-500">
                    {item.step}
                  </span>
                    </div>

                    {/* CONTENT */}
                    <h3 className="text-2xl font-bold text-black mb-4 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-zinc-500 text-lg leading-relaxed font-light">
                      {item.desc}
                    </p>

                    {/* SUBTLE GLOW EFFECT */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-black/5 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </motion.div>
              ))}
            </div>
          </section>

          {/* Path Selections */}
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto w-full">
            {/* B2C Pathway: Direct Buyers */}
            <motion.div
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6, ease: appleEase }}
            >
              <Link
                  href="/b2c"
                  className="group relative bg-white/40 backdrop-blur-xl border border-black/5 rounded-[2.5rem] p-10 flex flex-col justify-between h-full hover:bg-white hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:border-black/10 transition-all duration-500 overflow-hidden min-h-[400px]"
              >
                <div className="relative z-10">
                  <div className="h-12 w-12 bg-black/5 rounded-2xl flex items-center justify-center mb-8 border border-black/10 group-hover:bg-black group-hover:text-white transition-all duration-500">
                    <User className="h-6 w-6" />
                  </div>
                  <h3 className="text-3xl font-bold text-black mb-4 tracking-tight">
                    For Direct Buyers
                  </h3>
                  <p className="text-zinc-500 text-lg leading-relaxed mb-12 font-light">
                    For the past 12 years, we have supplied the top car dealers in
                    your country. For the first time, we are offering our service
                    directly to consumers. Cut out the middleman and save a ton
                    when you directly import with us.
                  </p>
                </div>

                <div className="relative z-10 flex items-center justify-between mt-auto pt-6">
                <span className="text-black font-bold text-lg">
                  Find My Dream Car
                </span>
                  <div className="h-14 w-14 bg-white border border-black/10 text-black rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-lg">
                    <ArrowRight size={24} />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* B2B Pathway: Dealerships */}
            <motion.div
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7, ease: appleEase }}
            >
              <Link
                  href="/b2b"
                  className="group relative bg-white/40 backdrop-blur-xl border border-black/5 rounded-[2.5rem] p-10 flex flex-col justify-between h-full hover:bg-white hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:border-black/10 transition-all duration-500 overflow-hidden min-h-[400px]"
              >
                <div className="relative z-10">
                  <div className="h-12 w-12 bg-black/5 rounded-2xl flex items-center justify-center mb-8 border border-black/10 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                    <Building className="h-6 w-6" />
                  </div>
                  <h3 className="text-3xl font-bold text-black mb-4 tracking-tight">
                    For Dealerships
                  </h3>
                  <p className="text-zinc-500 text-lg leading-relaxed mb-12 font-light">
                    Scale your lot without the overhead. Access 100+ global
                    markets to find the exact trims and specifications your
                    customers are looking for. Transform your inventory power
                    overnight.
                  </p>
                </div>

                <div className="relative z-10 flex items-center justify-between mt-auto pt-6">
                <span className="text-black font-bold text-lg">
                  Scale Your Dealership
                </span>
                  <div className="h-14 w-14 bg-white border border-black/10 text-black rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-lg">
                    <ArrowRight size={24} />
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* === PARTNERS/AFFILIATES SECTION === */}
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
                      transition={{
                        duration: 0.8,
                        delay: 1.0 + index * 0.1,
                        ease: appleEase,
                      }}
                      className="relative h-12 w-24 md:h-26 md:w-36 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-105 transition-all duration-500 cursor-pointer"
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