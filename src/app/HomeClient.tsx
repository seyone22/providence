"use client";

import { motion } from "framer-motion";
import { ArrowRight, Building, Globe, Ship, User } from "lucide-react";
import Link from "next/link";
import GalleryPreview from "@/components/GalleryPreview";
import GlobalPartnersStrip from "@/components/GlobalPartnersStrip";
import GradientMesh from "@/components/GradientMesh";
import MinimalHeader from "@/components/MinimalHeader";
import { appleEase, Reveal } from "@/components/Reveal";
import WhatsAppCTA from "@/components/WhatsAppCTA";

const brandLogos = [
  { src: "audi-logo.webp", alt: "Audi Logo" },
  { src: "bentley-logo.webp", alt: "Bentley Logo" },
  { src: "bmw-logo.webp", alt: "BMW Logo" },
  { src: "ferrari-logo.webp", alt: "Ferrari Logo" },
  { src: "genesis-logo.webp", alt: "Genesis Logo" },
  { src: "lamborghini-logo.webp", alt: "Lamborghini Logo" },
  { src: "land-rover-logo.webp", alt: "Land Rover Logo" },
  { src: "lexus-logo.webp", alt: "Lexus Logo" },
  { src: "lucid-motors-logo.webp", alt: "Lucid Motors Logo" },
  { src: "aston-martin-logo.webp", alt: "Aston Martin Logo" },
  { src: "rolls-royce-logo.webp", alt: "Rolls Royce Logo" },
  { src: "tesla-logo.webp", alt: "Tesla Logo" },
  { src: "volvo-logo.webp", alt: "Volvo Logo" },
  { src: "zeekr-logo.webp", alt: "Zeekr Logo" },
  { src: "mercedes-benz-logo.webp", alt: "Mercedes-Benz Logo" },
  { src: "polestar-logo.webp", alt: "Polestar Logo" },
  { src: "porsche-logo.webp", alt: "Porsche Logo" },
];

const flagLogos = [
  { src: "australia.webp", alt: "Australia" },
  { src: "bahamas.webp", alt: "Bahamas" },
  { src: "barbados.webp", alt: "Barbados" },
  { src: "cyprus.webp", alt: "Cyprus" },
  { src: "guyana.webp", alt: "Guyana" },
  { src: "hong-kong.webp", alt: "Hong Kong" },
  { src: "indonesia.webp", alt: "Indonesia" },
  { src: "ireland.webp", alt: "Ireland" },
  { src: "trinidad-and-tobago.webp", alt: "Trinidad and Tobago" },
  { src: "jamaica.webp", alt: "Jamaica" },
  { src: "sri-lanka.webp", alt: "Sri Lanka" },
  { src: "thailand.webp", alt: "Thailand" },
  { src: "uganda.webp", alt: "Uganda" },
  { src: "united-kingdom.webp", alt: "United Kingdom" },
  { src: "jersey.webp", alt: "Jersey" },
  { src: "kenya.webp", alt: "Kenya" },
  { src: "malaysia.webp", alt: "Malaysia" },
  { src: "maldives.webp", alt: "Maldives" },
  { src: "malta.webp", alt: "Malta" },
  { src: "new-zealand.webp", alt: "New Zealand" },
  { src: "zimbabwe.webp", alt: "Zimbabwe" },
];

export default function HomeClient() {
  return (
    // Replaced overflow-x-hidden on main with a wrapping div strategy for better iOS support
    <main className="min-h-screen w-full bg-white text-black selection:bg-black/10 selection:text-black font-sans">
      <div className="relative w-full overflow-hidden">
        {/* Embedded CSS for Flawless Marquee Carousels
          Instead of translating -50% on a dynamically sized container (which glitches on resizing/mobile),
          we use a mathematically perfect loop by translating exactly -100% minus the gap size.
        */}
        <style
          dangerouslySetInnerHTML={{
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
        `,
          }}
        />

        {/* =========================================
            TOP SECTION: BACKGROUND IMAGE AREA
        ========================================= */}
        <section className="relative w-full pt-24 md:pt-32 pb-16">
          {/* BACKGROUND LAYER */}
          <motion.div
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: appleEase }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            {/* Self-hosted, and a real <img> rather than a CSS background.
                Both halves of that matter. It used to be a background-image
                pointing at images.unsplash.com at q=100&w=3000 — 853 KB from a
                third-party origin, and a CSS background is only discovered once
                the stylesheet has been parsed and the box laid out, so it could
                not be prefetched or prioritised. As an <img> the preload scanner
                finds it in the raw HTML, and `sizes` lets a phone take the
                1080px copy (46 KB) instead of the 1920px one (105 KB). */}
            <img
              src="/home/hero-1920.webp"
              srcSet="/home/hero-1080.webp 1080w, /home/hero-1920.webp 1920w"
              sizes="100vw"
              alt=""
              aria-hidden="true"
              width={1920}
              height={1282}
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            {/* Gradient to seamlessly fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
          </motion.div>

          {/* Gradient-mesh style layered over the hero image (image kept) */}
          <GradientMesh fade={false} className="z-0 opacity-80" />

          <MinimalHeader />

          <div className="relative z-10 flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 w-full">
            <div className="text-center max-w-5xl mx-auto mt-8 md:mt-12">
              <Reveal
                immediate
                as="h1"
                y={20}
                scale={0.95}
                delay={0.2}
                duration={1}
                className="pa-headline-gradient text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-4 md:mb-6 leading-[1.1] md:leading-[0.9]"
              >
                World’s Largest Borderless Showroom.
              </Reveal>

              <Reveal
                immediate
                as="p"
                y={15}
                delay={0.4}
                duration={0.8}
                className="text-xl sm:text-2xl md:text-3xl text-zinc-700 font-medium tracking-tight mt-6 md:mt-8 mb-4 md:mb-6"
              >
                Any Car. Any Country. Any Port.
              </Reveal>
            </div>

            {/* BRAND LOGO CAROUSEL */}
            <Reveal
              immediate
              y={10}
              delay={0.45}
              duration={0.8}
              className="w-full mt-4 md:mt-8"
            >
              <div className="marquee-container border-y border-black/10">
                <div className="marquee-content">
                  {brandLogos.map((logo, index) => (
                    <div key={`brand-1-${index}`} className="marquee-item">
                      <img
                        src={`/car_logo/${logo.src}`}
                        alt={logo.alt}
                        width={96}
                        height={96}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
                {/* Duplicate content for seamless infinite loop */}
                <div className="marquee-content" aria-hidden="true">
                  {brandLogos.map((logo, index) => (
                    <div key={`brand-2-${index}`} className="marquee-item">
                      <img
                        src={`/car_logo/${logo.src}`}
                        alt={logo.alt}
                        width={96}
                        height={96}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <section className="relative z-10 w-full py-16 md:py-24">
              {/* `immediate` because PageSpeed measures this paragraph as the
                  page's Largest Contentful Paint element on mobile. A scroll
                  reveal would hold it at opacity:0 until the runtime script
                  reached it, which is what put LCP at 20.2s. */}
              <Reveal immediate className="max-w-4xl mx-auto px-4 text-center">
                <p className="text-xl sm:text-2xl md:text-3xl font-light tracking-tight leading-relaxed text-zinc-700">
                  Welcome to Providence Auto. We are building the world’s
                  largest borderless showroom. Whether you are a car enthusiast
                  looking for your dream car or a dealership wanting to scale
                  up, we provide the exact vehicle you desire. We source
                  vehicles from the most tax-efficient markets on earth — with
                  our own people and operations teams in{" "}
                  <span className="text-black font-medium">
                    the UK, Japan, the UAE, India, Thailand, Australia, New
                    Zealand and Sri Lanka
                  </span>{" "}
                  — and deliver them right to your country with zero logistical
                  friction.
                </p>
                <Link
                  href="/source-cars-from"
                  className="group mt-8 inline-flex items-center gap-2 text-base sm:text-lg font-medium text-black underline decoration-1 underline-offset-4 hover:decoration-2"
                >
                  Meet the seven countries behind every car
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </Reveal>
            </section>

            {/* FLAG LOGO CAROUSEL */}
            <Reveal
              immediate
              y={10}
              delay={0.45}
              duration={0.8}
              className="w-full mb-12"
            >
              <div className="marquee-container border-y border-black/10">
                <div className="marquee-content reverse">
                  {flagLogos.map((logo, index) => (
                    <div key={`flag-1-${index}`} className="marquee-item">
                      <img
                        src={`/country/${logo.src}`}
                        alt={logo.alt}
                        width={96}
                        height={96}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
                <div className="marquee-content reverse" aria-hidden="true">
                  {flagLogos.map((logo, index) => (
                    <div key={`flag-2-${index}`} className="marquee-item">
                      <img
                        src={`/country/${logo.src}`}
                        alt={logo.alt}
                        width={96}
                        height={96}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* =========================================
            BOTTOM SECTION: SOLID WHITE BACKGROUND
        ========================================= */}
        <section className="relative z-10 bg-white w-full pb-24 md:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
            {/* HOW IT WORKS */}
            <div className="pt-8 md:pt-12 pb-16 md:pb-20">
              <Reveal
                y={30}
                duration={0.8}
                className="mb-12 md:mb-20 text-center"
              >
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tighter text-black">
                  How it works
                </h2>
              </Reveal>

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
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    ),
                    desc: "Tell us the car you want. Model, colour, trim — as specific as you like. We'll come back with a full global sourcing quote within 24 hours. No commitment required.",
                  },
                  {
                    step: "",
                    title: "Source",
                    glowColor: "group-hover:bg-emerald-500/15",
                    icon: (
                      <Globe className="text-sky-500 h-7 w-7 md:h-8 md:w-8 group-hover:text-white transition-colors duration-500" />
                    ),
                    desc: "We search 40+ global markets to find your exact spec at the most tax-efficient price, buying through our own teams in seven of them. Currency, supply, and timing all factored in. You see the comparison and approve the quote — nothing moves until you do.",
                  },
                  {
                    step: "",
                    title: "Shipping",
                    glowColor: "group-hover:bg-indigo-500/15",
                    icon: (
                      <Ship className="text-sky-500 h-7 w-7 md:h-8 md:w-8 group-hover:text-white transition-colors duration-500" />
                    ),
                    desc: "Your car is purchased, quality checked, fully documented and shipped, with real-time updates at every stage. It arrives with the complete document pack and our team behind you through clearance and registration.",
                  },
                ].map((item, index) => (
                  <Reveal
                    key={index}
                    y={20}
                    delay={index * 0.08}
                    duration={0.6}
                    className="pa-lift relative overflow-hidden group flex flex-col items-start p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-zinc-50/50 hover:bg-zinc-50 border border-black/[0.07] hover:border-black/10"
                  >
                    {/* Subtle Glow Orb Effect */}
                    <div
                      className={`absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-[80px] bg-transparent transition-colors duration-700 ${item.glowColor}`}
                    />

                    <div className="relative z-10 w-full">
                      {/* ICON & STEP */}
                      <div className="flex justify-between items-start mb-6 md:mb-8 w-full">
                        <div className="p-3 md:p-4 bg-white border border-black/10 rounded-2xl inline-flex group-hover:bg-sky-500 group-hover:border-sky-500 transition-colors duration-500 shadow-sm">
                          {item.icon}
                        </div>

                        {item.step && (
                          <span className="text-3xl md:text-4xl font-bold text-black/40 group-hover:text-black/80 transition-colors duration-500">
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
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Path Selections */}
            <div
              id="pathway-section"
              className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto w-full mt-8 md:mt-12"
            >
              <Reveal y={30} delay={0.1} duration={0.8} className="h-full">
                <Link
                  href="/b2c"
                  className="pa-lift group relative bg-zinc-50 border border-black/[0.07] rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between h-full hover:bg-white hover:border-black/10 overflow-hidden min-h-[350px] md:min-h-[400px]"
                >
                  {/* Colorful gradient wash — on by default on mobile, on hover on desktop */}
                  <div className="pointer-events-none absolute inset-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(90%_90%_at_88%_95%,rgba(56,189,248,0.20),rgba(139,92,246,0.15)_38%,rgba(236,72,153,0.10)_62%,transparent_78%)]" />
                  <div className="relative z-10">
                    <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center mb-6 md:mb-8 border border-black/10 shadow-sm group-hover:bg-black group-hover:text-white transition-all duration-500">
                      <User className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-black mb-3 md:mb-4 tracking-tight">
                      For Direct Buyers
                    </h3>
                    <p className="text-zinc-500 text-base md:text-lg leading-relaxed mb-10 font-light">
                      For the past 15 years, we have supplied the top car
                      dealers in your country. For the first time, we are
                      offering our service directly to consumers. Cut out the
                      middleman and save a ton when you directly import with us.
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center justify-between mt-auto pt-6 border-t border-black/5 group-hover:border-transparent transition-colors duration-500">
                    <span className="text-black group-hover:text-sky-500 font-bold text-base md:text-lg transition-colors duration-300">
                      Find My Dream Car
                    </span>
                    <div className="h-12 w-12 md:h-14 md:w-14 bg-white border border-black/10 text-black rounded-full flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm group-hover:shadow-lg group-hover:border-sky-500">
                      <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                  </div>
                </Link>
              </Reveal>

              <Reveal y={30} delay={0.2} duration={0.8} className="h-full">
                <Link
                  href="/b2b"
                  className="pa-lift group relative bg-zinc-50 border border-black/[0.07] rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between h-full hover:bg-white hover:border-black/10 overflow-hidden min-h-[350px] md:min-h-[400px]"
                >
                  {/* Colorful gradient wash — on by default on mobile, on hover on desktop */}
                  <div className="pointer-events-none absolute inset-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(90%_90%_at_88%_95%,rgba(16,185,129,0.18),rgba(56,189,248,0.15)_38%,rgba(99,102,241,0.11)_62%,transparent_78%)]" />
                  <div className="relative z-10">
                    <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center mb-6 md:mb-8 border border-black/10 shadow-sm group-hover:bg-black group-hover:text-white transition-all duration-500">
                      <Building className="h-5 w-5 md:h-6 md:w-6" />
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

                  <div className="relative z-10 flex items-center justify-between mt-auto pt-6 border-t border-black/5 group-hover:border-transparent transition-colors duration-500">
                    <span className="text-black group-hover:text-sky-500 font-bold text-base md:text-lg transition-colors duration-300">
                      Scale Your Dealership
                    </span>
                    <div className="h-12 w-12 md:h-14 md:w-14 bg-white border border-black/10 text-black rounded-full flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm group-hover:shadow-lg group-hover:border-sky-500">
                      <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            </div>

            {/* GALLERY PREVIEW — horizontally scrollable strip linking to the full gallery */}
            <GalleryPreview />

            {/* PARTNERS/AFFILIATES SECTION */}
            <GlobalPartnersStrip />

            {/* GENERAL ENQUIRIES — WhatsApp */}
            <WhatsAppCTA />
          </div>
        </section>
      </div>
    </main>
  );
}
