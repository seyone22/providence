"use client";

import { useState, useEffect } from "react";
import { Loader2, ArrowLeft, CheckCircle2, ChevronDown } from "lucide-react";
import { submitCarRequest } from "@/actions/request-actions";
import { motion, AnimatePresence } from "framer-motion";
import {customList} from "country-codes-list";

const appleEase: any = [0.16, 1, 0.3, 1];
const TOTAL_STEPS = 3; // Reduced steps for better conversion flow

const CAR_MAKES = [
    "Acura", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Bugatti",
    "Chevrolet", "Ferrari", "Lamborghini", "Land Rover", "Lexus", "Maserati",
    "McLaren", "Mercedes-Benz", "Porsche", "Rolls-Royce", "Tesla", "Toyota"
].sort();

const COUNTRIES = [
    { n: "Afghanistan", c: "+93" }, { n: "Albania", c: "+355" }, { n: "Algeria", c: "+213" },
    { n: "Andorra", c: "+376" }, { n: "Angola", c: "+244" }, { n: "Antigua and Barbuda", c: "+1-268" },
    { n: "Argentina", c: "+54" }, { n: "Armenia", c: "+374" }, { n: "Australia", c: "+61" },
    { n: "Austria", c: "+43" }, { n: "Azerbaijan", c: "+994" }, { n: "Bahamas", c: "+1-242" },
    { n: "Bahrain", c: "+973" }, { n: "Bangladesh", c: "+880" }, { n: "Barbados", c: "+1-246" },
    { n: "Belarus", c: "+375" }, { n: "Belgium", c: "+32" }, { n: "Belize", c: "+501" },
    { n: "Benin", c: "+229" }, { n: "Bhutan", c: "+975" }, { n: "Bolivia", c: "+591" },
    { n: "Bosnia and Herzegovina", c: "+387" }, { n: "Botswana", c: "+267" }, { n: "Brazil", c: "+55" },
    { n: "Brunei", c: "+673" }, { n: "Bulgaria", c: "+359" }, { n: "Burkina Faso", c: "+226" },
    { n: "Burundi", c: "+257" }, { n: "Cambodia", c: "+855" }, { n: "Cameroon", c: "+237" },
    { n: "Canada", c: "+1" }, { n: "Cape Verde", c: "+238" }, { n: "Chad", c: "+235" },
    { n: "Chile", c: "+56" }, { n: "China", c: "+86" }, { n: "Colombia", c: "+57" },
    { n: "Comoros", c: "+269" }, { n: "Congo", c: "+242" }, { n: "Costa Rica", c: "+506" },
    { n: "Croatia", c: "+385" }, { n: "Cuba", c: "+53" }, { n: "Cyprus", c: "+357" },
    { n: "Czech Republic", c: "+420" }, { n: "Denmark", c: "+45" }, { n: "Djibouti", c: "+253" },
    { n: "Dominica", c: "+1-767" }, { n: "Dominican Republic", c: "+1-809" }, { n: "Ecuador", c: "+593" },
    { n: "Egypt", c: "+20" }, { n: "El Salvador", c: "+503" }, { n: "Equatorial Guinea", c: "+240" },
    { n: "Eritrea", c: "+291" }, { n: "Estonia", c: "+372" }, { n: "Eswatini", c: "+268" },
    { n: "Ethiopia", c: "+251" }, { n: "Fiji", c: "+679" }, { n: "Finland", c: "+358" },
    { n: "France", c: "+33" }, { n: "Gabon", c: "+241" }, { n: "Gambia", c: "+220" },
    { n: "Georgia", c: "+995" }, { n: "Germany", c: "+49" }, { n: "Ghana", c: "+233" },
    { n: "Greece", c: "+30" }, { n: "Grenada", c: "+1-473" }, { n: "Guatemala", c: "+502" },
    { n: "Guinea", c: "+224" }, { n: "Guyana", c: "+592" }, { n: "Haiti", c: "+509" },
    { n: "Honduras", c: "+504" }, { n: "Hungary", c: "+36" }, { n: "Iceland", c: "+354" },
    { n: "India", c: "+91" }, { n: "Indonesia", c: "+62" }, { n: "Iran", c: "+98" },
    { n: "Iraq", c: "+964" }, { n: "Ireland", c: "+353" }, { n: "Israel", c: "+972" },
    { n: "Italy", c: "+39" }, { n: "Jamaica", c: "+1-876" }, { n: "Japan", c: "+81" },
    { n: "Jordan", c: "+962" }, { n: "Kazakhstan", c: "+7" }, { n: "Kenya", c: "+254" },
    { n: "Kiribati", c: "+686" }, { n: "Kuwait", c: "+965" }, { n: "Kyrgyzstan", c: "+996" },
    { n: "Laos", c: "+856" }, { n: "Latvia", c: "+371" }, { n: "Lebanon", c: "+961" },
    { n: "Lesotho", c: "+266" }, { n: "Liberia", c: "+231" }, { n: "Libya", c: "+218" },
    { n: "Liechtenstein", c: "+423" }, { n: "Lithuania", c: "+370" }, { n: "Luxembourg", c: "+352" },
    { n: "Madagascar", c: "+261" }, { n: "Malawi", c: "+265" }, { n: "Malaysia", c: "+60" },
    { n: "Maldives", c: "+960" }, { n: "Mali", c: "+223" }, { n: "Malta", c: "+356" },
    { n: "Mauritania", c: "+222" }, { n: "Mauritius", c: "+230" }, { n: "Mexico", c: "+52" },
    { n: "Moldova", c: "+373" }, { n: "Monaco", c: "+377" }, { n: "Mongolia", c: "+976" },
    { n: "Montenegro", c: "+382" }, { n: "Morocco", c: "+212" }, { n: "Mozambique", c: "+258" },
    { n: "Myanmar", c: "+95" }, { n: "Namibia", c: "+264" }, { n: "Nauru", c: "+674" },
    { n: "Nepal", c: "+977" }, { n: "Netherlands", c: "+31" }, { n: "New Zealand", c: "+64" },
    { n: "Nicaragua", c: "+505" }, { n: "Niger", c: "+227" }, { n: "Nigeria", c: "+234" },
    { n: "North Korea", c: "+850" }, { n: "North Macedonia", c: "+389" }, { n: "Norway", c: "+47" },
    { n: "Oman", c: "+968" }, { n: "Pakistan", c: "+92" }, { n: "Palau", c: "+680" },
    { n: "Palestine", c: "+970" }, { n: "Panama", c: "+507" }, { n: "Papua New Guinea", c: "+675" },
    { n: "Paraguay", c: "+595" }, { n: "Peru", c: "+51" }, { n: "Philippines", c: "+63" },
    { n: "Poland", c: "+48" }, { n: "Portugal", c: "+351" }, { n: "Qatar", c: "+974" },
    { n: "Romania", c: "+40" }, { n: "Russia", c: "+7" }, { n: "Rwanda", c: "+250" },
    { n: "Saint Kitts and Nevis", c: "+1-869" }, { n: "Saint Lucia", c: "+1-758" }, { n: "Samoa", c: "+685" },
    { n: "San Marino", c: "+378" }, { n: "Sao Tome and Principe", c: "+239" }, { n: "Saudi Arabia", c: "+966" },
    { n: "Senegal", c: "+221" }, { n: "Serbia", c: "+381" }, { n: "Seychelles", c: "+248" },
    { n: "Sierra Leone", c: "+232" }, { n: "Singapore", c: "+65" }, { n: "Slovakia", c: "+421" },
    { n: "Slovenia", c: "+386" }, { n: "Solomon Islands", c: "+677" }, { n: "Somalia", c: "+252" },
    { n: "South Africa", c: "+27" }, { n: "South Korea", c: "+82" }, { n: "South Sudan", c: "+211" },
    { n: "Spain", c: "+34" }, { n: "Sri Lanka", c: "+94" }, { n: "Sudan", c: "+249" },
    { n: "Suriname", c: "+597" }, { n: "Sweden", c: "+46" }, { n: "Switzerland", c: "+41" },
    { n: "Syria", c: "+963" }, { n: "Taiwan", c: "+886" }, { n: "Tajikistan", c: "+992" },
    { n: "Tanzania", c: "+255" }, { n: "Thailand", c: "+66" }, { n: "Togo", c: "+228" },
    { n: "Tonga", c: "+676" }, { n: "Trinidad and Tobago", c: "+1-868" }, { n: "Tunisia", c: "+216" },
    { n: "Turkey", c: "+90" }, { n: "Turkmenistan", c: "+993" }, { n: "Tuvalu", c: "+688" },
    { n: "Uganda", c: "+256" }, { n: "Ukraine", c: "+380" }, { n: "United Arab Emirates", c: "+971" },
    { n: "United Kingdom", c: "+44" }, { n: "United States", c: "+1" }, { n: "Uruguay", c: "+598" },
    { n: "Uzbekistan", c: "+998" }, { n: "Vanuatu", c: "+678" }, { n: "Vatican City", c: "+39" },
    { n: "Venezuela", c: "+58" }, { n: "Vietnam", c: "+84" }, { n: "Yemen", c: "+967" },
    { n: "Zambia", c: "+260" }, { n: "Zimbabwe", c: "+263" }
].sort((a, b) => a.n.localeCompare(b.n));

// customList returns an object by default, so we convert it to a sorted array
const countriesArray = Object.values(COUNTRIES).sort((a, b) =>
    a.n.localeCompare(b.n)
);

const initialFormState = {
    make: "", vehicle_model: "", condition: "New",
    yearRange: "2024-2026",
    mileageRange: "Under 5,000",
    specs: "", name: "", email: "",
    countryCode: "+1", phone: "", countryOfImport: ""
};

export default function RequestForm() {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [availableModels, setAvailableModels] = useState<string[]>([]);
    const [isLoadingModels, setIsLoadingModels] = useState(false);
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (!formData.make || formData.make.length < 2) return;
        const delayDebounceFn = setTimeout(async () => {
            setIsLoadingModels(true);
            try {
                const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${formData.make}?format=json`);
                const data = await res.json();
                if (data.Results) {
                    const models = data.Results.map((item: any) =>
                        item.Model_Name.toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase())
                    );
                    setAvailableModels(Array.from(new Set(models)).sort() as string[]);
                }
            } catch (err) { console.error(err); } finally { setIsLoadingModels(false); }
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [formData.make]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleNext = () => {
        if (step === 1 && (!formData.make || !formData.vehicle_model)) {
            setErrorMsg("Please select a make and model.");
            return;
        }
        setErrorMsg("");
        setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    };

    const handlePrev = () => {
        setErrorMsg("");
        setStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await submitCarRequest(formData);
            if (response.success) setSuccessMsg("Inquiry received. Our concierge will reach out within 24 hours.");
            else setErrorMsg(response.message);
        } catch (error) { setErrorMsg("Submission failed. Please try again."); } finally { setIsSubmitting(false); }
    };

    const minimalInput = "w-full bg-transparent border-b border-black/20 text-black placeholder:text-zinc-400 focus:outline-none focus:border-black transition-colors rounded-none px-0 py-3 text-lg";
    const minimalSelect = "w-full bg-transparent border-b border-black/20 text-black focus:outline-none focus:border-black transition-colors rounded-none px-0 py-3 text-lg appearance-none cursor-pointer pr-8";

    return (
        <motion.div className="w-full max-w-3xl bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 shadow-[0_40px_100px_rgba(0,0,0,0.08)] overflow-hidden relative text-black mx-auto">
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-black/5 absolute top-0 left-0">
                <motion.div className="h-full bg-black" animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }} transition={{ duration: 0.5 }} />
            </div>

            {successMsg ? (
                <div className="p-12 text-center flex flex-col items-center justify-center min-h-[500px]">
                    <CheckCircle2 className="h-16 w-16 text-green-600 mb-6" />
                    <h3 className="text-3xl font-bold mb-4">Confirmed.</h3>
                    <p className="text-zinc-500 text-lg mb-8">{successMsg}</p>
                    <button onClick={() => {setStep(1); setSuccessMsg(""); setFormData(initialFormState);}} className="text-black border-b border-black font-bold">New Inquiry</button>
                </div>
            ) : (
                <div className="p-8 md:p-14 min-h-[550px] flex flex-col">
                    <div className="flex justify-between items-end border-b border-black/5 pb-6 mb-8">
                        <h3 className="text-2xl font-bold">
                            {step === 1 && "1. Specifications"}
                            {step === 2 && "2. Condition & Availability"}
                            {step === 3 && "3. Delivery Details"}
                        </h3>
                        <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Step {step}/{TOTAL_STEPS}</span>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8 flex-1">
                            {/* STEP 1: MAKE, MODEL, SPECS */}
                            {step === 1 && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="relative">
                                            <input id="make" list="car-makes" value={formData.make} onChange={handleChange} placeholder="Make" className={minimalInput} />
                                            <datalist id="car-makes">{CAR_MAKES.map(m => <option key={m} value={m} />)}</datalist>
                                        </div>
                                        <div className="relative">
                                            <input id="vehicle_model" list="car-models" value={formData.vehicle_model} onChange={handleChange} placeholder={isLoadingModels ? "Searching..." : "Model"} className={minimalInput} />
                                            <datalist id="car-models">{availableModels.map(m => <option key={m} value={m} />)}</datalist>
                                        </div>
                                    </div>
                                    <div>
                                        <textarea id="specs" value={formData.specs} onChange={handleChange} placeholder="Specification Requests (e.g. Carbon Fiber Pack, Magma Red Interior, Night Package...)" className={`${minimalInput} min-h-[120px] resize-none`} />
                                    </div>
                                </>
                            )}

                            {/* STEP 2: CONDITION, YEAR RANGE, MILEAGE RANGE */}
                            {step === 2 && (
                                <>
                                    <div className="flex gap-4">
                                        {["New", "Used"].map((cond) => (
                                            <button key={cond} onClick={() => setFormData({...formData, condition: cond as any})} className={`flex-1 py-4 rounded-2xl font-bold border transition-all ${formData.condition === cond ? "bg-black text-white border-black" : "bg-transparent text-zinc-400 border-black/10"}`}>
                                                {cond === "New" ? "Brand New" : "Pre-Owned"}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="relative">
                                            <label className="text-xs font-bold text-zinc-400 uppercase">Year Range</label>
                                            <select id="yearRange" value={formData.yearRange} onChange={handleChange} className={minimalSelect}>
                                                <option>2024-2026</option>
                                                <option>2021-2023</option>
                                                <option>2018-2020</option>
                                                <option>Vintage / Classic</option>
                                            </select>
                                            <ChevronDown className="absolute right-0 bottom-4 text-zinc-400" size={16} />
                                        </div>
                                        <div className="relative">
                                            <label className="text-xs font-bold text-zinc-400 uppercase">Maximum Mileage</label>
                                            <select id="mileageRange" value={formData.mileageRange} onChange={handleChange} className={minimalSelect}>
                                                <option>Delivery Miles Only</option>
                                                <option>Under 5,000</option>
                                                <option>Under 20,000</option>
                                                <option>Under 50,000</option>
                                            </select>
                                            <ChevronDown className="absolute right-0 bottom-4 text-zinc-400" size={16} />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* STEP 3: CONTACT & IMPORT */}
                            {step === 3 && (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <input id="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className={minimalInput} />
                                        <input id="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className={minimalInput} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                        <div className="md:col-span-4 relative">
                                            <select id="countryCode" value={formData.countryCode} onChange={handleChange} className={minimalSelect}>
                                                {COUNTRIES.map(c => <option key={c.n} value={c.c}>{c.c} {c.n}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-0 bottom-4 text-zinc-400" size={16} />
                                        </div>
                                        <input id="phone" className="md:col-span-8 w-full bg-transparent border-b border-black/20 px-0 py-3 text-lg focus:outline-none focus:border-black" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
                                    </div>
                                    <div className="relative">
                                        <select id="countryOfImport" value={formData.countryOfImport} onChange={handleChange} className={minimalSelect}>
                                            <option value="">Destination Country...</option>
                                            {COUNTRIES.map(c => <option key={c.n} value={c.n}>{c.n}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-0 bottom-4 text-zinc-400" size={16} />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <div className="mt-12 pt-8 flex items-center justify-between border-t border-black/5">
                        <button onClick={handlePrev} className={`flex items-center gap-2 font-bold transition-opacity ${step === 1 ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
                            <ArrowLeft size={18} /> Back
                        </button>
                        {step < TOTAL_STEPS ? (
                            <button onClick={handleNext} className="bg-black text-white px-10 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-lg">Continue</button>
                        ) : (
                            <button onClick={handleSubmit} disabled={isSubmitting} className="bg-black text-white px-10 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-lg disabled:opacity-50">
                                {isSubmitting ? "Processing..." : "Submit Inquiry"}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    );
}