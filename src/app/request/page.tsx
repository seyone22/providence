"use client";

import { useState, useEffect } from "react";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import MinimalHeader from "@/app/components/MinimalHeader";
import { submitCarRequest } from "@/actions/request-actions";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Apple-style smooth easing curve
const appleEase: any = [0.16, 1, 0.3, 1];

const TOTAL_STEPS = 4;

const CAR_MAKES = [
    "Acura", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Bugatti",
    "Buick", "Cadillac", "Chevrolet", "Chrysler", "Dodge", "Ferrari", "Fiat",
    "Ford", "Genesis", "GMC", "Honda", "Hyundai", "Infiniti", "Jaguar", "Jeep",
    "Kia", "Koenigsegg", "Lamborghini", "Land Rover", "Lexus", "Lincoln", "Lotus",
    "Lucid", "Maserati", "Maybach", "Mazda", "McLaren", "Mercedes-Benz", "Mini",
    "Mitsubishi", "Nissan", "Pagani", "Peugeot", "Polestar", "Porsche", "Ram",
    "Rivian", "Rolls-Royce", "Subaru", "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo"
].sort();

export default function RequestCar() {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // Dynamic Models State
    const [availableModels, setAvailableModels] = useState<string[]>([]);
    const [isLoadingModels, setIsLoadingModels] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        make: "",
        vehicle_model: "",
        condition: "New",
        yearFrom: "",
        yearTo: "",
        mileage: "",
        specs: "",
        name: "",
        email: "",
        countryCode: "+1",
        phone: "",
        countryOfImport: ""
    });

    // Fetch models from NHTSA API
    useEffect(() => {
        if (!formData.make || formData.make.length < 2) {
            setAvailableModels([]);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setIsLoadingModels(true);
            try {
                const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${formData.make}?format=json`);
                const data = await res.json();

                if (data.Results) {
                    const models = data.Results.map((item: any) => {
                        return item.Model_Name.toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase());
                    });
                    const uniqueModels = Array.from(new Set(models)).sort() as string[];
                    setAvailableModels(uniqueModels);
                }
            } catch (err) {
                console.error("Failed to fetch models", err);
            } finally {
                setIsLoadingModels(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [formData.make]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        if (id === "make") {
            setFormData(prev => ({ ...prev, make: value, vehicle_model: "" }));
        } else {
            setFormData(prev => ({ ...prev, [id]: value }));
        }
    };

    const handleConditionSelect = (condition: "New" | "Used") => {
        setFormData({ ...formData, condition });
    };

    const handleNext = () => {
        if (step === 1 && (!formData.make || !formData.vehicle_model)) {
            setErrorMsg("Please provide a make and model.");
            return;
        }
        if (step === 2 && formData.condition === "Used" && (!formData.yearFrom || !formData.mileage)) {
            setErrorMsg("Please provide an estimated year range and mileage for used vehicles.");
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

        if (!formData.name || !formData.email || !formData.phone || !formData.countryOfImport) {
            setErrorMsg("Please fill in all contact and import details.");
            return;
        }

        setIsSubmitting(true);
        setErrorMsg("");

        try {
            const response = await submitCarRequest(formData);

            if (response.success) {
                setSuccessMsg("Your inquiry has been received. Our concierge team will contact you shortly.");
            } else {
                setErrorMsg(`Error: ${response.message}`);
            }
        } catch (error) {
            console.error(error);
            setErrorMsg("Failed to submit request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Updated input styles for light mode
    const minimalInput = "w-full bg-transparent border-b border-black/20 text-black placeholder:text-zinc-400 focus:outline-none focus:border-black transition-colors rounded-none px-0 py-3 text-lg";
    const minimalSelect = "w-full bg-transparent border-b border-black/20 text-black focus:outline-none focus:border-black transition-colors rounded-none px-0 py-3 text-lg appearance-none cursor-pointer";

    return (
        <div className="min-h-screen bg-white text-black flex flex-col relative overflow-x-hidden font-sans selection:bg-black/10 selection:text-black">

            {/* === BACKGROUND LAYER === */}
            <motion.div
                initial={{ scale: 1.05, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: appleEase }}
                className="absolute inset-0 z-0 pointer-events-none fixed"
            >
                {/* Clean, detailed interior or bright studio car shot */}
                <img
                    src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=3000&auto=format&fit=crop"
                    alt="Premium automotive interior"
                    className="object-cover object-center"
                />
                {/* Frosted washes to ensure the form and text pop */}
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent h-1/3" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
            </motion.div>

            <MinimalHeader />

            <main className="flex-1 flex flex-col items-center justify-center py-32 px-4 relative z-10 w-full min-h-screen">

                {/* Header Text */}
                <div className="text-center mb-12 mt-10">
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: appleEase }}
                        className="text-4xl md:text-6xl font-bold tracking-tighter text-black mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,1)]"
                    >
                        Create your inquiry.
                    </motion.h2>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: appleEase }}
                        className="text-zinc-500 text-lg md:text-xl max-w-xl mx-auto font-light drop-shadow-[0_0_10px_rgba(255,255,255,1)]"
                    >
                        Provide your exact specifications, and our concierge will handle the rest.
                    </motion.p>
                </div>

                {/* Main Form Card (Frosted Glass Effect) */}
                <motion.div
                    initial={{ y: 40, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: appleEase }}
                    className="w-full max-w-3xl bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 shadow-[0_40px_100px_rgba(0,0,0,0.08)] overflow-hidden relative text-black"
                >
                    {/* Top Progress Bar */}
                    <div className="w-full h-1.5 bg-black/5 absolute top-0 left-0">
                        <div
                            className="h-full bg-black transition-all duration-700 ease-out"
                            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                        />
                    </div>

                    {successMsg ? (
                        <div className="p-12 md:p-20 text-center flex flex-col items-center justify-center min-h-[500px]">
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", damping: 15, delay: 0.1 }}
                                className="h-24 w-24 bg-green-50 rounded-full flex items-center justify-center mb-8 border border-green-100"
                            >
                                <CheckCircle2 className="h-12 w-12 text-green-600" />
                            </motion.div>
                            <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Inquiry Received.</h3>
                            <p className="text-zinc-500 text-lg mb-10 max-w-md font-light leading-relaxed">{successMsg}</p>
                            <button onClick={() => window.location.reload()} className="text-sm font-semibold text-black border-b border-black/30 pb-1 hover:border-black transition-colors">
                                Submit another inquiry
                            </button>
                        </div>
                    ) : (
                        <div className="p-8 md:p-14 min-h-[500px] flex flex-col relative">

                            <div className="flex justify-between items-end border-b border-black/5 pb-6 mb-8 relative z-10">
                                <h3 className="text-2xl font-bold tracking-tight text-black">
                                    {step === 1 && "1. Vehicle Selection"}
                                    {step === 2 && "2. Condition & History"}
                                    {step === 3 && "3. Special Requirements"}
                                    {step === 4 && "4. Your Details"}
                                </h3>
                                <span className="text-zinc-400 text-sm font-medium tracking-wide uppercase">
                                    Step {step} of {TOTAL_STEPS}
                                </span>
                            </div>

                            {errorMsg && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-8 p-4 bg-red-50/50 backdrop-blur-sm text-red-600 rounded-2xl text-sm font-medium border border-red-100 relative z-10"
                                >
                                    {errorMsg}
                                </motion.div>
                            )}

                            {/* === ANIMATED FORM STEPS === */}
                            <div className="flex-1 relative">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={step}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.4, ease: appleEase }}
                                        className="space-y-8"
                                    >
                                        {/* STEP 1 */}
                                        {step === 1 && (
                                            <>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div>
                                                        <input id="make" list="car-makes" required value={formData.make} onChange={handleChange} placeholder="Make / Brand (e.g. Porsche)" className={minimalInput} autoComplete="off" />
                                                        <datalist id="car-makes">
                                                            {CAR_MAKES.map(make => <option key={make} value={make} />)}
                                                        </datalist>
                                                    </div>
                                                    <div className="relative">
                                                        <input id="vehicle_model" list="car-models" required value={formData.vehicle_model} onChange={handleChange} placeholder={isLoadingModels ? "Loading Models..." : "Model (e.g. 911 Carrera)"} className={minimalInput} autoComplete="off" />
                                                        <datalist id="car-models">
                                                            {availableModels.map(model => <option key={model} value={model} />)}
                                                        </datalist>
                                                        {isLoadingModels && <Loader2 className="absolute right-0 top-4 animate-spin text-zinc-400" size={18} />}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-zinc-400 mt-2 font-light">Type to search or enter a custom brand. Data verified via global directories.</p>
                                            </>
                                        )}

                                        {/* STEP 2 */}
                                        {step === 2 && (
                                            <>
                                                <div className="flex gap-4">
                                                    <button onClick={() => handleConditionSelect("New")} className={`flex-1 py-5 border rounded-2xl font-bold transition-all duration-300 ${formData.condition === "New" ? "border-black bg-black text-white shadow-md" : "border-black/10 text-zinc-500 hover:border-black/30 hover:bg-black/5"}`}>Brand New</button>
                                                    <button onClick={() => handleConditionSelect("Used")} className={`flex-1 py-5 border rounded-2xl font-bold transition-all duration-300 ${formData.condition === "Used" ? "border-black bg-black text-white shadow-md" : "border-black/10 text-zinc-500 hover:border-black/30 hover:bg-black/5"}`}>Pre-Owned</button>
                                                </div>

                                                <AnimatePresence>
                                                    {formData.condition === "Used" && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: "auto" }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="grid grid-cols-1 md:grid-cols-3 gap-8 overflow-hidden pt-4"
                                                        >
                                                            <div><input id="yearFrom" type="number" value={formData.yearFrom} onChange={handleChange} placeholder="Year From" className={minimalInput} /></div>
                                                            <div><input id="yearTo" type="number" value={formData.yearTo} onChange={handleChange} placeholder="Year To" className={minimalInput} /></div>
                                                            <div><input id="mileage" value={formData.mileage} onChange={handleChange} placeholder="Max Mileage (e.g. 30k)" className={minimalInput} /></div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </>
                                        )}

                                        {/* STEP 3 */}
                                        {step === 3 && (
                                            <div>
                                                <textarea id="specs" value={formData.specs} onChange={handleChange} placeholder="Specify preferred colors, interior trims, must-have packages, or any other special requirements..." className={`${minimalInput} resize-none min-h-[160px]`} autoFocus />
                                            </div>
                                        )}

                                        {/* STEP 4 */}
                                        {step === 4 && (
                                            <>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div><input id="name" required value={formData.name} onChange={handleChange} placeholder="Full Name" className={minimalInput} autoFocus /></div>
                                                    <div><input id="email" type="email" required value={formData.email} onChange={handleChange} placeholder="Email Address" className={minimalInput} /></div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                                    <div className="md:col-span-3">
                                                        <select id="countryCode" value={formData.countryCode} onChange={handleChange} className={minimalSelect}>
                                                            <option value="+1">+1 (US/CA)</option>
                                                            <option value="+44">+44 (UK)</option>
                                                            <option value="+971">+971 (UAE)</option>
                                                            <option value="+94">+94 (SL)</option>
                                                        </select>
                                                    </div>
                                                    <div className="md:col-span-4">
                                                        <input id="phone" type="tel" required value={formData.phone} onChange={handleChange} placeholder="Phone Number" className={minimalInput} />
                                                    </div>
                                                    <div className="md:col-span-5">
                                                        <input id="countryOfImport" required value={formData.countryOfImport} onChange={handleChange} placeholder="Country of Import" className={minimalInput} />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Navigation */}
                            <div className="mt-12 pt-8 border-t border-black/5 flex items-center justify-between relative z-10">
                                {step > 1 ? (
                                    <button type="button" onClick={handlePrev} className="text-zinc-400 hover:text-black transition-colors duration-300 flex items-center gap-2 font-bold">
                                        <ArrowLeft size={18} /> Back
                                    </button>
                                ) : <div />}

                                {step < TOTAL_STEPS ? (
                                    <button type="button" onClick={handleNext} className="bg-black text-white px-10 py-4 rounded-full font-bold transition-all duration-300 hover:scale-105 shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex items-center gap-2">
                                        Continue
                                    </button>
                                ) : (
                                    <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="bg-black text-white px-10 py-4 rounded-full font-bold transition-all duration-300 hover:scale-105 shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex items-center gap-2 disabled:opacity-70 disabled:hover:scale-100">
                                        {isSubmitting ? <><Loader2 className="animate-spin" size={18} /> Processing</> : "Submit Inquiry"}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
}