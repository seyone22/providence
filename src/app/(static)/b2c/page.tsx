"use client";

import { ArrowRight, Compass, Landmark, ShieldCheck, Ship } from "lucide-react";
import { Suspense } from "react";
import DotGlobe, { GLOBE_PALETTE_LIGHT } from "@/components/DotGlobe";
import FAQSection from "@/components/faqSection";
import GradientMesh from "@/components/GradientMesh";
import MinimalHeader from "@/components/MinimalHeader";
import OdometerCounter from "@/components/OdometerCounter";
import { Reveal } from "@/components/Reveal";
import RequestForm from "@/components/requestForm";
import VoyageTrack, { type VoyageStage } from "@/components/VoyageTrack";

// The hero counters. Same figures as /about-us, and the same reason for being
// here: they are the scale that makes "any market" credible rather than a
// slogan. Kept to four so the row stays one line on desktop.
const STATS = [
  { value: 40, suffix: "+", label: "Sourcing markets" },
  { value: 7, label: "Countries we buy in" },
  { value: 28, label: "Destinations we ship to" },
  { value: 24, suffix: " hrs", label: "To your first quote" },
];

// The buyer-side view of an import. VoyageTrack's own defaults end at "Customs
// cleared" → "Delivered"; we contract CNF to the destination port, so the last
// two pips are stated at that level. Same treatment as /about-us.
const IMPORT_STAGES: VoyageStage[] = [
  { label: "You choose", at: 0 },
  { label: "We bid", at: 0.18 },
  { label: "Inspected", at: 0.36 },
  { label: "At sea", at: 0.62 },
  { label: "At your port", at: 0.84 },
  { label: "Yours", at: 1 },
];

export default function B2CLanding() {
  return (
    <main className="min-h-screen bg-white text-black selection:bg-black/10 selection:text-black font-sans overflow-x-hidden">
      <MinimalHeader />

      <section className="relative min-h-screen flex flex-col justify-center items-start px-6 pt-20 bg-white overflow-hidden">
        <GradientMesh image="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=3000&auto=format&fit=cover" />

        <div className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center mt-0">
          <Reveal
            immediate
            as="p"
            y={20}
            delay={0.2}
            duration={0.8}
            className="text-sm font-bold tracking-[0.4em] text-zinc-500 uppercase mb-8"
          >
            Direct Import Network
          </Reveal>
          <Reveal
            immediate
            as="h1"
            y={30}
            scale={0.95}
            delay={0.3}
            duration={1}
            className="pa-headline-gradient text-4xl md:text-8xl lg:text-12xl font-bold tracking-tighter mb-6 leading-[1.1] drop-shadow-[0_0_15px_rgba(255,255,255,1)]"
          >
            Buy Your Dream Car
            <br /> from Any Market.
          </Reveal>
          <Reveal
            immediate
            as="p"
            y={20}
            delay={0.5}
            duration={0.8}
            className="text-xl md:text-3xl text-zinc-600 font-medium tracking-tight mb-12 max-w-2xl drop-shadow-[0_0_10px_rgba(255,255,255,1)]"
          >
            Wherever you live, you can now buy direct from the markets the trade
            buys in — and keep the dealership's margin for yourself.
          </Reveal>
          <Reveal immediate y={20} delay={0.6} duration={0.8}>
            <a
              href="#inquiry"
              className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold  text-white bg-black rounded-full overflow-hidden transition-transform hover:scale-105 shadow-[0_10px_40px_rgba(0,0,0,0.1)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Begin Your Inquiry{" "}
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </a>
          </Reveal>

          <Reveal
            y={20}
            delay={0.7}
            duration={0.6}
            className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-3xl"
          >
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-black/5 bg-white/85 px-4 py-5 sm:bg-white/70 sm:backdrop-blur-sm"
              >
                <div className="flex justify-center">
                  <OdometerCounter
                    value={s.value}
                    suffix={s.suffix}
                    label={s.label}
                    className="text-2xl md:text-3xl font-bold tracking-tight text-center"
                  />
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="py-32 md:py-48 px-6 bg-white border-y border-black/5 relative z-10 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <Reveal
            as="p"
            className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight text-zinc-400"
          >
            For the last 15 years, we’ve supplied the top car dealers in your
            country. For the first time ever, we are{" "}
            <span className="text-black drop-shadow-sm">
              cutting out the middleman
            </span>{" "}
            and offering our global sourcing network{" "}
            <span className="text-black drop-shadow-sm">directly to you</span>.
          </Reveal>
        </div>
      </section>

      {/* ── ANY MARKET: the globe ─────────────────────────── */}
      <section className="py-24 md:py-32 px-6 bg-[#FAFAFA] border-y border-black/5 relative z-10">
        <div className="max-w-6xl mx-auto">
          <Reveal
            y={30}
            duration={0.7}
            className="text-center mb-12 max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-black mb-5">
              Any market you can name, and the route to get it home.
            </h2>
            <p className="text-lg text-zinc-500 font-light">
              Every arc below is a real shipping lane we run, not a claim — drag
              to spin it.
            </p>
          </Reveal>

          <Reveal
            y={20}
            duration={0.6}
            className="mx-auto max-w-xl rounded-[2rem] border border-black/5 bg-white p-4 md:p-6"
          >
            <DotGlobe palette={GLOBE_PALETTE_LIGHT} />
          </Reveal>
        </div>
      </section>

      {/* ── HOW IT WORKS: the process rail ────────────────── */}
      <section className="py-24 md:py-32 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <Reveal
            y={30}
            duration={0.7}
            className="text-center mb-12 max-w-2xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-black mb-5">
              You pick the car, and you can see exactly where it is.
            </h2>
            <p className="text-lg text-zinc-500 font-light">
              Nothing is bid on until you have the inspection and the full
              landed price. After that, every import tracks the same way:
            </p>
          </Reveal>

          <Reveal
            y={20}
            duration={0.6}
            className="rounded-[2rem] bg-white border border-black/5 p-6 md:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.03)]"
          >
            <VoyageTrack stages={IMPORT_STAGES} />
          </Reveal>
        </div>
      </section>

      <section className="py-32 px-6 max-w-7xl mx-auto bg-white relative z-10">
        <Reveal y={40} duration={0.8} className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-black mb-6">
            Never compromise again.
          </h2>
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-light">
            We buy in seven countries and source across forty more, so we know
            where your exact specification lands cheapest — and we show you the
            comparison rather than asking you to take our word for it.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
          {[
            {
              icon: Compass,
              title: "Buy Where It Is Cheapest, Today",
              desc: "The same car has a different price in every market, and the exchange rate moves it again. We price your exact specification across all of them and show you the comparison, so you buy from the country that is cheapest the week you buy — not the one we happen to prefer.",
              glowColor: "group-hover:bg-blue-500/15",
            },
            {
              icon: Landmark,
              title: "The Tax Position, Before You Commit",
              desc: "Duty, VAT and registration tax are what turn a good price into a bad one, and they differ on every route. We work out what your country charges on your exact car and put it in the quote, so the number you agree is the number you pay.",
              glowColor: "group-hover:bg-emerald-500/15",
            },
            {
              icon: Ship,
              title: "Shipping and Paperwork Support",
              desc: "From an auction hall in Japan or a dealer forecourt in Dubai to your port. Our own teams prepare every form, arrange the marine cover and book the freight — and show you each step as it happens.",
              glowColor: "group-hover:bg-indigo-500/15",
            },
            {
              icon: ShieldCheck,
              title: "15 Years of Heritage",
              desc: "We aren't a startup guessing how to ship cars. Over a decade of established infrastructure and our own teams in the UK, Japan, the UAE, India, Thailand, Australia, New Zealand and Sri Lanka — with more markets added as we grow.",
              glowColor: "group-hover:bg-amber-500/15",
            },
          ].map((feature, index) => (
            <Reveal
              key={index}
              y={40}
              scale={0.95}
              delay={index * 0.1}
              duration={0.8}
              className="relative overflow-hidden group flex flex-col items-start p-8 rounded-[2rem] bg-transparent hover:bg-zinc-50 transition-all duration-500 border border-transparent hover:border-black/5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)]"
            >
              <div
                className={`absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-[80px] bg-transparent transition-colors duration-700 ${feature.glowColor}`}
              />
              <div className="relative z-10">
                <div className="p-4 bg-black/5 border border-black/10 rounded-2xl mb-6 inline-flex group-hover:bg-sky-500 group-hover:border-sky-500 transition-colors duration-500">
                  <feature.icon className="text-sky-500 h-8 w-8 group-hover:text-white transition-colors duration-500" />
                </div>

                <h3 className="text-2xl font-bold text-black mb-4 group-hover:text-sky-500 transition-colors duration-500">
                  {feature.title}
                </h3>

                <p className="text-zinc-500 text-lg leading-relaxed font-light">
                  {feature.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/*/!* Gallery Promo Section *!/*/}
      {/*<section className="py-16 px-6 max-w-7xl mx-auto bg-white relative z-10">*/}
      {/*    <motion.div*/}
      {/*        initial={{ y: 40, opacity: 0, scale: 0.98 }}*/}
      {/*        whileInView={{ y: 0, opacity: 1, scale: 1 }}*/}
      {/*        viewport={{ once: true, margin: "-100px" }}*/}
      {/*        transition={{ duration: 0.8, ease: appleEase }}*/}
      {/*    >*/}
      {/*        <Link href="/b2c/gallery" className="group relative block w-full overflow-hidden rounded-[2.5rem] bg-black min-h-[400px] md:min-h-[500px]">*/}
      {/*            <img*/}
      {/*                src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2938&auto=format&fit=crop"*/}
      {/*                alt="The Providence Gallery"*/}
      {/*                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[1.5s] ease-out"*/}
      {/*            />*/}
      {/*            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />*/}

      {/*            <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-end">*/}
      {/*                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">*/}
      {/*                    <div className="max-w-2xl">*/}
      {/*                        <div className="flex items-center gap-3 mb-4">*/}
      {/*                            <Images className="text-white/70 h-6 w-6" />*/}
      {/*                            <span className="text-white/70 font-bold tracking-[0.2em] uppercase text-sm">Portfolio</span>*/}
      {/*                        </div>*/}
      {/*                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white mb-4">*/}
      {/*                            The Gallery.*/}
      {/*                        </h2>*/}
      {/*                        <p className="text-lg md:text-xl text-zinc-300 font-light">*/}
      {/*                            Explore our collection of curated, globally-sourced vehicles successfully delivered to our clients.*/}
      {/*                        </p>*/}
      {/*                    </div>*/}

      {/*                    <div className="shrink-0 inline-flex items-center justify-center px-8 py-4 text-base font-bold text-black bg-white rounded-full transition-transform group-hover:scale-105">*/}
      {/*                        <span className="flex items-center gap-2">*/}
      {/*                            View Collection <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />*/}
      {/*                        </span>*/}
      {/*                    </div>*/}
      {/*                </div>*/}
      {/*            </div>*/}
      {/*        </Link>*/}
      {/*    </motion.div>*/}
      {/*</section>*/}

      <section
        id="inquiry"
        className="py-32 px-6 relative flex flex-col justify-center items-center bg-zinc-50 border-t border-black/5 z-10 overflow-hidden"
      >
        <Reveal
          y={40}
          duration={1}
          className="relative z-10 text-center max-w-4xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-black mb-6">
            Tell us exactly what you want.
          </h2>
          <p className="text-xl md:text-2xl text-zinc-500 font-light max-w-2xl mx-auto">
            Like a{" "}
            <span className="text-black font-medium">
              2023 Defender in Fuji White
            </span>
            . Our team will find that version in the global markets where it
            costs you the least.
          </p>
        </Reveal>

        <div className="w-full relative z-20">
          <Suspense
            fallback={
              <div className="w-full max-w-3xl mx-auto h-[550px] flex items-center justify-center bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 text-zinc-500">
                Loading form...
              </div>
            }
          >
            <RequestForm />
          </Suspense>
        </div>

        {/* FAQs Section */}
        <FAQSection />

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-black/5 blur-[120px] rounded-full pointer-events-none" />
      </section>
    </main>
  );
}
