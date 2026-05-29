"use client";

import { useRef, useState, useEffect, Suspense, useMemo } from "react";
import MinimalHeader from "@/components/MinimalHeader";
import { Landmark, Compass, Ship, ShieldCheck, ArrowRight, CheckCircle2, MapPin, Search, Zap } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Reveal, appleEase } from "@/components/Reveal";
import RequestForm from "@/components/requestForm";
import FAQSection from "@/components/faqSection";
import type { LandingPageConfig } from "@/config/landing-pages";

// ── DATA ────────────────────────────────────────────────────────────────────

const IRELAND_FAQS: LandingPageConfig["faqs"] = {
    title: "Import to Ireland — Your Questions Answered",
    subtitle: "Everything you need to know about importing a Japanese car to Ireland with Providence.",
    categories: [
        {
            category: "Irish Import Taxes",
            items: [
                {
                    q: "What taxes do I pay when importing a car to Ireland?",
                    a: "Three charges apply: (1) Customs Duty — 0% for Japan-built cars under the EU–Japan EPA since February 2026. (2) VAT at 23%, charged once on the car's landed value. (3) VRT (Vehicle Registration Tax) — 7% to 14% for low-CO2 hybrids and efficient petrols. We calculate, declare, and pay all three on your behalf."
                },
                {
                    q: "What is VRT and how is it calculated?",
                    a: "VRT is a once-off Irish registration tax charged on Revenue's Open Market Selling Price (OMSP) — their estimate of what the car would retail for in Ireland. The rate is set by CO2 emissions. Hybrids and efficient petrols pay 7–14%; large diesel SUVs can pay 35–41%. Choosing a low-emission Japanese hybrid keeps this to a minimum, and we calculate the exact VRT before you commit."
                },
                {
                    q: "Why is a Japanese hybrid the best value import right now?",
                    a: "Since 1 February 2026, Japan-built cars enter Ireland at 0% customs duty under the EU–Japan Economic Partnership Agreement. Combined with Japan's wholesale auction prices, low CO2 emissions (7–14% VRT band), and right-hand drive compatibility, a Japanese hybrid consistently lands in Ireland thousands below Irish forecourt prices — even after all taxes are paid."
                },
                {
                    q: "Will I pay VAT twice — once in Japan and again on arrival?",
                    a: "No. Japanese export sales are VAT-free at source. Irish VAT at 23% is charged once, at the Irish port of entry, on the car's landed value. There is no double-taxation. We manage this declaration as part of your full clearance package."
                },
                {
                    q: "Is there a VRT relief available for electric vehicle imports?",
                    a: "Yes — until 31 December 2026, battery electric vehicles qualify for up to €5,000 VRT relief, plus the lowest CO2 band (7%) and zero NOx levy. This window closes at year-end. Given 6–10 weeks shipping time, you need to start your inquiry now if you want to register before the deadline."
                }
            ]
        },
        {
            category: "The Import Process",
            items: [
                {
                    q: "How long does the full import take?",
                    a: "Typically 8–12 weeks from inquiry to delivery at your door. We spend 1–2 weeks sourcing and confirming your vehicle at Japanese auction, then 6–10 weeks for RoRo shipping to Ireland, followed by customs clearance, VRT registration at NCTS, and local delivery. We send live milestone updates throughout."
                },
                {
                    q: "What is NCTS and do I need to do anything for it?",
                    a: "The National Car Testing Service (NCTS) is where imported vehicles are registered in Ireland and VRT is assessed. Every imported vehicle must be registered within 30 days of arrival, with an NCTS appointment booked within the first 7 days. We handle this entirely — booking, documentation, VRT payment. You do nothing."
                },
                {
                    q: "Do I need to be present for any part of the process?",
                    a: "No. From the moment you submit your inquiry to the moment the car arrives at your door, Providence manages every step. You receive updates and full documentation throughout, but zero physical presence is required."
                },
                {
                    q: "What documentation will I receive with my car?",
                    a: "You receive the original Japanese auction sheet with independent condition grading, full vehicle history, Certificate of Conformity with WLTP CO2 and NOx data, Bill of Lading, customs clearance certificates, and the VRT receipt. Everything needed for registration and ownership."
                },
                {
                    q: "Can I track my car during shipping?",
                    a: "Yes. Once your car is loaded onto the vessel, you receive a live tracking link showing its real-time position from Japan to an Irish port. Our team also sends milestone notifications: sourced, inspected, loaded, in transit, cleared, and out for delivery."
                }
            ]
        },
        {
            category: "Safety & Quality",
            items: [
                {
                    q: "How does the Japanese auction grading system work?",
                    a: "Japanese car auctions use an independent condition grading scale: Grade 5 is showroom condition, Grade 4 is excellent, Grade 3.5 is very good with only minor surface marks. We source Grade 3.5 and above, and provide the original auction sheet so you can see precisely what was assessed before we ship anything."
                },
                {
                    q: "What mileage should I expect on a Japanese import?",
                    a: "Japan's shaken inspection regime and high vehicle turnover mean cars are traded at relatively low mileage. A 3–8 year-old Japanese hybrid typically has 30,000–70,000 km — often well below what you'd find on an equivalent Irish used car of the same age. We target average mileage for the best balance of price, condition, and VRT efficiency."
                },
                {
                    q: "How do I know my money is safe?",
                    a: "We have 15+ years of trading history supplying the dealerships Irish buyers already trust. Payment is held securely until your vehicle is confirmed and cleared for shipment. Every car is covered by comprehensive marine insurance door-to-door, and we provide a full paper trail from purchase through to delivery."
                },
                {
                    q: "What if the car doesn't arrive in the condition described?",
                    a: "Every vehicle undergoes a full independent pre-export inspection before leaving Japan. You receive the condition report, photographs, and auction grade before we authorise shipping. If anything doesn't match the agreed specification, we don't ship it — full stop. Our reputation is built on 15 years of verified deliveries."
                }
            ]
        }
    ]
};

const JAPAN_ADVANTAGES = [
    {
        icon: Landmark,
        title: "0% Customs Duty",
        subtitle: "Since February 2026",
        desc: "The EU–Japan Economic Partnership Agreement reached its final phase on 1 February 2026. Japan-built cars — Toyota, Honda, Mazda, Nissan, Subaru — now enter Ireland at exactly 0% customs duty. The same rate as UK-built cars, with none of the Brexit documentation risk.",
        glowColor: "group-hover:bg-sky-500/15",
        accentColor: "text-sky-500"
    },
    {
        icon: ShieldCheck,
        title: "Exceptional Quality",
        subtitle: "Japan's Shaken System",
        desc: "Japan's strict vehicle inspection forces owners to trade early. The result: well-maintained, low-mileage cars sold at auction with independent condition grades (3.5–5 out of 5). You see the exact grade and condition report before we ship.",
        glowColor: "group-hover:bg-emerald-500/15",
        accentColor: "text-emerald-500"
    },
    {
        icon: Compass,
        title: "RHD & Hybrid Range",
        subtitle: "Road-Legal from Day One",
        desc: "Japan drives on the left — every car is right-hand drive and compliant for Irish roads with no conversion. Toyota Aqua, Prius, Corolla, Honda Jazz: hybrids with 7–14% VRT rates that simply aren't available this cheaply anywhere else.",
        glowColor: "group-hover:bg-amber-500/15",
        accentColor: "text-amber-500"
    }
];

const PROCESS_STEPS = [
    {
        number: "01",
        icon: Search,
        title: "Source",
        desc: "We bid at Japan's leading auction houses and dealer networks, identifying your car with an independent condition grade and full vehicle history before we touch the budget."
    },
    {
        number: "02",
        icon: Ship,
        title: "Ship",
        desc: "Your car is loaded onto a RoRo vessel and shipped directly to an Irish port. Fully insured with marine cover, live-tracked from the moment it leaves Japan."
    },
    {
        number: "03",
        icon: Landmark,
        title: "Clear",
        desc: "We handle 100% of the paperwork: customs declarations, VRT payment at NCTS, and all registration requirements. Zero forms for you — not one."
    },
    {
        number: "04",
        icon: MapPin,
        title: "Deliver",
        desc: "Your fully registered, road-legal car arrives at your door in Ireland. Keys handed over, all documents provided. Nothing more to do."
    }
];

const TOP_MODELS = [
    { make: "Toyota", prefillMake: "Toyota", model: "Aqua", prefillModel: "Aqua", displayName: "Aqua", type: "Hybrid", vrt: "7–9%", note: "Lowest VRT band. Japan's most abundant hybrid at auction — supply keeps prices consistently low.", badge: null, bestCondition: "Pre-owned", conditionNote: "Best bought 2–6 years old. Shaken-enforced turnover means excellent stock at low prices." },
    { make: "Toyota", prefillMake: "Toyota", model: "Prius", prefillModel: "Prius", displayName: "Prius", type: "Hybrid", vrt: "7–9%", note: "Industry-proven hybrid reliability. Strong Irish resale demand, especially for post-2019 models.", badge: null, bestCondition: "Pre-owned", conditionNote: "3–7 year models offer the best value-to-condition ratio at Japanese auction." },
    { make: "Toyota", prefillMake: "Toyota", model: "Corolla", prefillModel: "Corolla", displayName: "Corolla Hybrid", type: "Hybrid", vrt: "11–13%", note: "Japan-built, mainstream Irish demand, and strong residual value make this a safe import.", badge: null, bestCondition: "Pre-owned", conditionNote: "2020–2023 models hit the sweet spot for spec, price, and VRT efficiency." },
    { make: "Honda", prefillMake: "Honda", model: "Fit", prefillModel: "Fit", displayName: "Fit / Jazz", type: "Hybrid", vrt: "9–12%", note: "Compact, efficient, and significantly cheaper at Japanese auction than the Irish equivalent.", badge: null, bestCondition: "Pre-owned", conditionNote: "3–7 year old Jazz/Fit hybrids have the best auction availability and condition grades." },
    { make: "Mazda", prefillMake: "Mazda", model: "Mazda3", prefillModel: "Mazda3", displayName: "Mazda 3 Skyactiv", type: "Petrol", vrt: "11–14%", note: "Premium interior feel, efficient Skyactiv engine, and consistently high-grade auction stock.", badge: null, bestCondition: "Pre-owned", conditionNote: "Pre-owned strongly preferred — limited new supply at Japanese auction. 2019–2022 models are ideal." },
    { make: "Nissan", prefillMake: "Nissan", model: "Leaf", prefillModel: "Leaf", displayName: "Leaf", type: "EV", vrt: "7%", note: "Lowest CO2 band, zero NOx levy, and up to €5,000 VRT relief — but only until 31 December 2026.", badge: "Act before Dec 2026", bestCondition: "Pre-owned", conditionNote: "2018–2022 models qualify for the full €5,000 EV relief. Shipping takes 6–10 weeks — start now." },
    { make: "Nissan", prefillMake: "Nissan", model: "Note", prefillModel: "Note", displayName: "Note e-Power", type: "e-Power", vrt: "9–11%", note: "Self-charging e-Power system — no plug required. Exceptional fuel efficiency in Irish conditions.", badge: null, bestCondition: "Pre-owned", conditionNote: "2020–2023 second-gen models offer the latest e-Power tech at well below Irish forecourt prices." },
];

// ── COUNTDOWN ────────────────────────────────────────────────────────────────

function getTimeLeft() {
    const deadline = new Date("2027-01-01T00:00:00Z").getTime();
    const now = Date.now();
    const diff = deadline - now;
    if (diff <= 0) return { months: 0, days: 0, hours: 0 };
    const totalMs = diff;
    const totalHours = Math.floor(totalMs / (1000 * 60 * 60));
    const nowDate = new Date();
    const deadlineDate = new Date("2027-01-01T00:00:00Z");
    let months = (deadlineDate.getFullYear() - nowDate.getFullYear()) * 12 + (deadlineDate.getMonth() - nowDate.getMonth());
    const afterMonths = new Date(nowDate);
    afterMonths.setMonth(afterMonths.getMonth() + months);
    if (afterMonths > deadlineDate) months--;
    const afterMonthsFixed = new Date(nowDate);
    afterMonthsFixed.setMonth(afterMonthsFixed.getMonth() + months);
    const remainingMs = deadlineDate.getTime() - afterMonthsFixed.getTime();
    const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return { months, days, hours };
}

const TRUST_BADGES = [
    "15+ Years Trading",
    "0% Customs Duty (Japan)",
    "Full VRT & NCTS Handling",
    "Marine Insurance Included",
    "Door-to-Door Delivery"
];

// ── PAGE ────────────────────────────────────────────────────────────────────

export default function ImportJapaneseCarsIreland() {
    const heroRef = useRef(null);
    const { scrollYProgress: heroScroll } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });
    const heroScale = useTransform(heroScroll, [0, 1], [1, 0.8]);
    const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
    const heroY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);

    const manifestoRef = useRef(null);
    const { scrollYProgress: manifestoScroll } = useScroll({
        target: manifestoRef,
        offset: ["start end", "center center"]
    });
    const manifestoScale = useTransform(manifestoScroll, [0, 1], [0.85, 1]);
    const manifestoOpacity = useTransform(manifestoScroll, [0, 1], [0.3, 1]);

    // Countdown to Dec 31, 2026
    const [timeLeft, setTimeLeft] = useState(getTimeLeft);
    useEffect(() => {
        const id = setInterval(() => setTimeLeft(getTimeLeft()), 60_000);
        return () => clearInterval(id);
    }, []);

    // Model-card → form prefill
    const [selectedMake, setSelectedMake] = useState("");
    const [selectedVehicleModel, setSelectedVehicleModel] = useState("");
    const [showPrefillNotice, setShowPrefillNotice] = useState(false);
    const [prefillNoticeText, setPrefillNoticeText] = useState("");

    // Stable prefill object — only recreated when the user actually clicks a model card.
    // Avoids triggering the form's prefill effect on every countdown re-render.
    const prefill = useMemo(() => ({
        countryOfImport: "Ireland",
        ...(selectedMake ? { make: selectedMake, vehicle_model: selectedVehicleModel } : {})
    }), [selectedMake, selectedVehicleModel]);

    const handleModelSelect = (model: typeof TOP_MODELS[0]) => {
        setSelectedMake(model.prefillMake);
        setSelectedVehicleModel(model.prefillModel);
        setPrefillNoticeText(`${model.make} ${model.displayName}`);
        setShowPrefillNotice(true);
        setTimeout(() => setShowPrefillNotice(false), 7000);
        document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth" });
    };

    // Group models by brand for display
    const modelsByBrand = TOP_MODELS.reduce<Record<string, typeof TOP_MODELS>>((acc, m) => {
        (acc[m.make] = acc[m.make] || []).push(m);
        return acc;
    }, {});

    return (
        <main className="min-h-screen bg-white text-black selection:bg-black/10 selection:text-black font-sans overflow-x-hidden">
            <MinimalHeader />

            {/* ── EV DEADLINE COUNTDOWN BANNER ─────────────── */}
            <div className="fixed top-16 left-0 right-0 z-40 bg-black/95 backdrop-blur-sm border-b border-white/[0.06] flex items-center min-h-[42px]">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-center gap-3 sm:gap-6">
                    <span className="text-white/60 text-[10px] sm:text-[11px] font-medium tracking-[0.12em] uppercase shrink-0">
                        EV VRT Relief — €5,000
                    </span>
                    <span className="text-white/20 hidden sm:inline">·</span>
                    <div className="flex items-center gap-2 sm:gap-3 text-[11px] font-bold tracking-[0.1em]">
                        <span className="text-[#4da8da]">{timeLeft.months}<span className="text-white/40 font-normal ml-0.5">mo</span></span>
                        <span className="text-white/20">·</span>
                        <span className="text-[#4da8da]">{timeLeft.days}<span className="text-white/40 font-normal ml-0.5">d</span></span>
                        <span className="text-white/20">·</span>
                        <span className="text-[#4da8da]">{timeLeft.hours}<span className="text-white/40 font-normal ml-0.5">h</span></span>
                        <span className="text-white/40 font-normal hidden sm:inline">remaining</span>
                    </div>
                    <a href="#inquiry" className="text-[10px] sm:text-[11px] font-bold text-[#4da8da] hover:text-white transition-colors tracking-[0.1em] uppercase shrink-0">
                        Enquire →
                    </a>
                </div>
            </div>

            {/* ── HERO ─────────────────────────────────────── */}
            <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center items-start px-6 pt-36 md:pt-28 bg-white overflow-hidden">
                <motion.div
                    initial={{ scale: 1.05, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: appleEase }}
                    className="absolute inset-0 z-0 pointer-events-none"
                >
                    <img
                        src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=3000&auto=format&fit=cover"
                        alt="Import Japanese Cars to Ireland — Providence Auto"
                        style={{ height: "100vh", width: "100vw", objectFit: "cover", objectPosition: "center" }}
                    />
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent h-[30%]" />
                    <div className="absolute top-1/2 bottom-0 w-full bg-gradient-to-t from-white via-white/30 to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.7)_0%,transparent_50%)]" />
                </motion.div>

                <motion.div
                    style={{ scale: heroScale, opacity: heroOpacity, y: heroY }}
                    className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center"
                >
                    <Reveal
                        immediate
                        as="p"
                        y={20}
                        delay={0.2}
                        duration={0.8}
                        className="text-sm font-bold tracking-[0.4em] text-zinc-500 uppercase mb-8"
                    >
                        Japan → Ireland · End-to-End Import Service
                    </Reveal>

                    <Reveal
                        immediate
                        as="h1"
                        y={30}
                        scale={0.95}
                        delay={0.3}
                        duration={1}
                        className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-black via-black/80 to-black/50 leading-[1.1] drop-shadow-[0_0_15px_rgba(255,255,255,1)]"
                    >
                        Import a Japanese Car<br />to Ireland.
                    </Reveal>

                    <Reveal
                        immediate
                        as="p"
                        y={20}
                        delay={0.5}
                        duration={0.8}
                        className="text-xl md:text-2xl text-zinc-600 font-medium tracking-tight mb-10 max-w-2xl drop-shadow-[0_0_10px_rgba(255,255,255,1)]"
                    >
                        We source, ship, clear customs, and deliver to your door.<br className="hidden md:block" /> You choose the car. We handle everything else.
                    </Reveal>

                    <Reveal
                        immediate
                        y={20}
                        delay={0.6}
                        duration={0.8}
                        className="flex flex-col sm:flex-row items-center gap-4"
                    >
                        <a
                            href="#inquiry"
                            className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-black rounded-full overflow-hidden transition-transform hover:scale-105 shadow-[0_10px_40px_rgba(0,0,0,0.15)]"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Begin Your Import Inquiry <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </a>
                        <a
                            href="/ireland-cost-calculator"
                            className="group inline-flex items-center gap-2 text-zinc-600 font-medium hover:text-black transition-colors text-base"
                        >
                            Estimate your import costs <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                    </Reveal>
                </motion.div>
            </section>

            {/* ── TRUST BADGES ────────────────────────────── */}
            <section className="py-5 px-6 border-y border-black/5 bg-white relative z-10">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center sm:justify-center gap-x-8 gap-y-2.5">
                        {TRUST_BADGES.map((badge) => (
                            <div key={badge} className="flex items-center gap-1.5 text-zinc-500 text-xs sm:text-sm font-medium">
                                <CheckCircle2 size={12} className="text-sky-500 shrink-0" />
                                {badge}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── MANIFESTO ───────────────────────────────── */}
            <section ref={manifestoRef} className="py-32 md:py-48 px-6 bg-white border-b border-black/5 relative z-10 overflow-hidden">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.p
                        style={{ scale: manifestoScale, opacity: manifestoOpacity }}
                        className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight text-zinc-400"
                    >
                        For 15 years, we supplied the top car dealers in Ireland. Now we're going direct —{" "}
                        <span className="text-black drop-shadow-sm">
                            offering every Irish buyer the same wholesale sourcing network
                        </span>
                        , plus full customs clearance and doorstep delivery, for the first time.
                    </motion.p>
                </div>
            </section>

            {/* ── WHY JAPAN ───────────────────────────────── */}
            <section className="py-32 px-6 max-w-7xl mx-auto relative z-10">
                <Reveal y={40} duration={0.8} className="text-center mb-20">
                    <p className="text-sm font-bold tracking-[0.3em] text-zinc-400 uppercase mb-4">Why Japan</p>
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-black mb-6">
                        The world's best source<br />for Irish car imports.
                    </h2>
                    <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-light">
                        Three structural advantages that make Japan the standout choice — especially since February 2026.
                    </p>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {JAPAN_ADVANTAGES.map((adv, index) => (
                        <Reveal
                            key={index}
                            y={40}
                            scale={0.95}
                            delay={index * 0.1}
                            duration={0.8}
                            className="relative overflow-hidden group flex flex-col p-8 rounded-[2rem] border border-black/5 bg-white hover:bg-zinc-50 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)]"
                        >
                            <div className={`absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-[80px] bg-transparent transition-colors duration-700 ${adv.glowColor}`} />
                            <div className="relative z-10">
                                <div className="p-4 bg-black/5 border border-black/10 rounded-2xl mb-6 inline-flex group-hover:bg-sky-500 group-hover:border-sky-500 transition-colors duration-500">
                                    <adv.icon className={`${adv.accentColor} h-8 w-8 group-hover:text-white transition-colors duration-500`} />
                                </div>
                                <p className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase mb-2">{adv.subtitle}</p>
                                <h3 className="text-2xl font-bold text-black mb-4 group-hover:text-sky-500 transition-colors duration-500">
                                    {adv.title}
                                </h3>
                                <p className="text-zinc-500 text-base leading-relaxed font-light">{adv.desc}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ── PROCESS ─────────────────────────────────── */}
            <section className="py-32 px-6 bg-zinc-50 border-y border-black/5 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <Reveal y={40} duration={0.8} className="text-center mb-20">
                        <p className="text-sm font-bold tracking-[0.3em] text-zinc-400 uppercase mb-4">How It Works</p>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-black mb-6">
                            Source. Ship. Clear. Deliver.
                        </h2>
                        <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-light">
                            Every single step handled by Providence. Zero paperwork on your end.
                        </p>
                    </Reveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {PROCESS_STEPS.map((step, index) => (
                            <Reveal
                                key={index}
                                y={40}
                                delay={index * 0.1}
                                duration={0.6}
                                className="relative bg-white rounded-[2rem] p-8 border border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex flex-col"
                            >
                                <span className="text-7xl font-bold text-black/[0.04] absolute top-5 right-6 leading-none select-none pointer-events-none">
                                    {step.number}
                                </span>
                                <div className="p-3 bg-sky-500/10 rounded-xl mb-6 inline-flex w-fit">
                                    <step.icon className="h-6 w-6 text-sky-500" />
                                </div>
                                <h3 className="text-xl font-bold text-black mb-3">{step.title}</h3>
                                <p className="text-zinc-500 text-sm leading-relaxed font-light">{step.desc}</p>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── COST BREAKDOWN ──────────────────────────── */}
            <section className="py-32 px-6 bg-white relative z-10">
                <div className="max-w-5xl mx-auto">
                    <Reveal y={40} duration={0.8} className="text-center mb-16">
                        <p className="text-sm font-bold tracking-[0.3em] text-zinc-400 uppercase mb-4">The Numbers</p>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-black mb-6">
                            Three costs. Fully transparent.
                        </h2>
                        <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-light">
                            Every Irish import carries the same three charges. Here's what they look like on a typical Japanese hybrid — and how they compare to buying the same car in Ireland.
                        </p>
                    </Reveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {/* Breakdown card */}
                        <Reveal
                            y={40}
                            scale={0.97}
                            duration={0.8}
                            className="bg-white rounded-[2rem] border border-black/8 shadow-[0_20px_40px_rgba(0,0,0,0.06)] overflow-hidden"
                        >
                            <div className="bg-black px-8 py-6">
                                <p className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase mb-1">Illustrative Example</p>
                                <p className="text-white font-bold text-lg">Japan-Built Hybrid Import</p>
                                <p className="text-white/50 text-sm mt-0.5">3-year-old Toyota hybrid, average mileage</p>
                            </div>
                            <div className="px-8 py-6 space-y-0">
                                {[
                                    { label: "Car price (Japan auction)", value: "~€11,000", green: false },
                                    { label: "Shipping (RoRo, insured)", value: "~€1,500", green: false },
                                    { label: "Customs Duty — 0% (Japan EPA)", value: "€0", green: true },
                                    { label: "VAT at 23% on landed value", value: "~€2,875", green: false },
                                    { label: "VRT at ~12% (hybrid)", value: "~€2,400", green: false },
                                ].map((row, i) => (
                                    <div key={i} className="flex justify-between items-center py-4 border-b border-black/5 last:border-0">
                                        <span className="text-zinc-600 text-sm">{row.label}</span>
                                        <span className={`text-sm font-bold ${row.green ? "text-emerald-600" : "text-black"}`}>
                                            {row.value}
                                        </span>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center pt-5 border-t-2 border-black mt-2">
                                    <span className="font-bold text-black">Total Landed in Ireland</span>
                                    <span className="font-bold text-2xl text-black">~€17,775</span>
                                </div>
                            </div>
                        </Reveal>

                        {/* Comparison + context */}
                        <Reveal
                            y={40}
                            scale={0.97}
                            delay={0.15}
                            duration={0.8}
                            className="flex flex-col gap-5"
                        >
                            <div className="bg-zinc-50 rounded-[2rem] border border-black/5 p-8">
                                <p className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase mb-3">
                                    Irish Forecourt Equivalent
                                </p>
                                <p className="text-4xl font-bold text-black mb-2">€22,000 – €26,000</p>
                                <p className="text-zinc-500 text-sm font-light">
                                    Same model, same age, same spec — from a dealer in Ireland.
                                </p>
                            </div>

                            <div className="bg-[#4da8da] rounded-[2rem] p-8 text-white">
                                <p className="text-xs font-bold tracking-[0.2em] text-white/60 uppercase mb-3">
                                    Your Potential Saving
                                </p>
                                <p className="text-4xl font-bold mb-2">€4,000 – €8,000+</p>
                                <p className="text-white/75 text-sm font-light">
                                    Even after customs, VAT, VRT, and shipping are all paid in full. We give you exact numbers before you commit to anything.
                                </p>
                            </div>

                            <p className="text-xs text-zinc-400 font-light px-2 leading-relaxed">
                                Figures are indicative. Actual VRT is charged on Revenue's OMSP and varies by model, year, and mileage. We provide a full landed-cost breakdown before authorising any purchase.
                            </p>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ── TOP MODELS ──────────────────────────────── */}
            <section className="py-32 px-6 bg-zinc-50 border-y border-black/5 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <Reveal y={40} duration={0.8} className="text-center mb-16">
                        <p className="text-sm font-bold tracking-[0.3em] text-zinc-400 uppercase mb-4">Top Picks</p>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-black mb-6">
                            Most popular Japanese imports<br className="hidden md:block" /> for Ireland.
                        </h2>
                        <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-light">
                            These models tick every box: 0% duty, low CO2, favourable VRT, and strong Irish demand.
                        </p>
                    </Reveal>

                    <div className="space-y-12">
                        {Object.entries(modelsByBrand).map(([brand, models], brandIndex) => (
                            <Reveal
                                key={brand}
                                y={30}
                                delay={brandIndex * 0.08}
                                duration={0.6}
                            >
                                {/* Brand header */}
                                <div className="flex items-center gap-4 mb-5">
                                    <p className="text-xs font-bold tracking-[0.3em] text-zinc-400 uppercase shrink-0">{brand}</p>
                                    <div className="flex-1 h-px bg-black/5" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {models.map((model, index) => (
                                        <motion.button
                                            key={`${model.make}-${model.model}`}
                                            onClick={() => handleModelSelect(model)}
                                            initial={{ y: 20, opacity: 0 }}
                                            whileInView={{ y: 0, opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: index * 0.06, ease: appleEase }}
                                            className="bg-white rounded-[1.5rem] border border-black/5 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex flex-col gap-3 text-left hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-sky-500/20 transition-all duration-300 group cursor-pointer"
                                        >
                                            {model.badge && (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/10 border border-sky-500/20 rounded-full w-fit">
                                                    <Zap size={11} className="text-sky-500" />
                                                    <span className="text-xs font-bold text-sky-600">{model.badge}</span>
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="text-xl font-bold text-black group-hover:text-sky-600 transition-colors duration-300">{model.displayName}</h3>
                                            </div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="px-3 py-1 bg-sky-500/10 rounded-full text-xs font-bold text-sky-600">{model.type}</span>
                                                <span className="px-3 py-1 bg-emerald-500/10 rounded-full text-xs font-bold text-emerald-600">VRT {model.vrt}</span>
                                                <span className="px-3 py-1 bg-zinc-100 rounded-full text-xs font-medium text-zinc-500">{model.bestCondition}</span>
                                            </div>
                                            <p className="text-zinc-500 text-sm leading-relaxed font-light">{model.note}</p>
                                            <p className="text-zinc-400 text-xs leading-relaxed italic border-t border-black/5 pt-3">{model.conditionNote}</p>
                                            <div className="flex items-center gap-1.5 text-sky-500 text-xs font-bold mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                Enquire with this model pre-filled <ArrowRight size={12} />
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </Reveal>
                        ))}

                        {/* Don't see your car */}
                        <motion.a
                            href="#inquiry"
                            initial={{ y: 30, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true, margin: "-30px" }}
                            transition={{ duration: 0.6, ease: appleEase }}
                            className="bg-black rounded-[1.5rem] p-6 flex flex-col gap-3 hover:bg-zinc-900 transition-colors duration-300 cursor-pointer group"
                        >
                            <h3 className="text-xl font-bold text-white">Don't see your car?</h3>
                            <p className="text-white/50 text-sm leading-relaxed font-light flex-1">
                                We source any make and model from Japan. Tell us exactly what you want and we'll find it.
                            </p>
                            <div className="flex items-center gap-2 text-white font-bold text-sm mt-2">
                                Start your inquiry <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.a>
                    </div>
                </div>
            </section>

            {/* ── EV URGENCY ──────────────────────────────── */}
            <section className="py-14 px-6 bg-black relative z-10">
                <div className="max-w-5xl mx-auto">
                    <Reveal y={20} duration={0.6} className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                        <div className="text-center md:text-left flex-1">
                            <p className="text-xs font-bold tracking-[0.3em] text-[#4da8da] uppercase mb-3">
                                Closing Window — Act Before 31 December 2026
                            </p>
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                                Up to €5,000 VRT Relief on Electric Vehicle Imports
                            </h3>
                            <p className="text-white/50 text-sm font-light leading-relaxed">
                                Battery EVs pay the lowest VRT rate (7%), zero NOx levy, and qualify for up to €5,000 VRT relief — but only if registered before 31 December 2026. With 6–10 weeks shipping from Japan, now is the time to act.
                            </p>
                        </div>
                        <a
                            href="#inquiry"
                            className="shrink-0 px-8 py-3.5 bg-[#4da8da] text-white font-bold rounded-full hover:bg-[#3d92c2] transition-colors text-sm whitespace-nowrap shadow-[0_8px_24px_rgba(77,168,218,0.3)]"
                        >
                            Enquire Now
                        </a>
                    </Reveal>
                </div>
            </section>

            {/* ── INQUIRY FORM ────────────────────────────── */}
            <section
                id="inquiry"
                className="py-32 px-6 relative flex flex-col justify-center items-center bg-zinc-50 border-t border-black/5 z-10 overflow-hidden"
            >
                <Reveal y={40} duration={1} className="relative z-10 text-center max-w-4xl mx-auto mb-16">
                    <p className="text-sm font-bold tracking-[0.3em] text-zinc-400 uppercase mb-4">Free · No Commitment</p>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-black mb-6">
                        Tell us exactly what<br />you want to import.
                    </h2>
                    <p className="text-xl md:text-2xl text-zinc-500 font-light max-w-2xl mx-auto">
                        We'll come back with a{" "}
                        <span className="text-black font-medium">full landed-cost quote</span> — car price, shipping, VRT, and customs included — before you commit to a single euro.
                    </p>
                </Reveal>

                {/* Prefill notice */}
                <AnimatePresence>
                    {showPrefillNotice && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.35 }}
                            className="w-full max-w-3xl mx-auto mb-4 px-6 py-3 bg-sky-500/10 border border-sky-500/20 rounded-2xl text-sky-700 text-sm font-medium text-center"
                        >
                            Form pre-filled with <strong>{prefillNoticeText}</strong>. Review your details and continue.
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="w-full relative z-20">
                    <Suspense
                        fallback={
                            <div className="w-full max-w-3xl mx-auto h-[550px] flex items-center justify-center bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 text-zinc-500">
                                Loading form...
                            </div>
                        }
                    >
                        <RequestForm
                            key={`${selectedMake}-${selectedVehicleModel}`}
                            prefill={prefill}
                            defaultPhoneCountry="IE"
                        />
                    </Suspense>
                </div>

                <FAQSection data={IRELAND_FAQS} />

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-black/5 blur-[120px] rounded-full pointer-events-none" />
            </section>
        </main>
    );
}
