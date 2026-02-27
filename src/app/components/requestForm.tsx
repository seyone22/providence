"use client";

import { useState, useEffect } from "react";
import { Loader2, ArrowLeft, CheckCircle2, ChevronDown } from "lucide-react";
import { submitCarRequest } from "@/actions/request-actions";
import { motion, AnimatePresence } from "framer-motion";

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

// Comprehensive, lightweight country list
const COUNTRIES = [
    { n: "Afghanistan", c: "+93" }, { n: "Albania", c: "+355" }, { n: "Algeria", c: "+213" }, { n: "Andorra", c: "+355" }, { n: "Angola", c: "+244" }, { n: "Antigua", c: "+376" }, { n: "Argentina", c: "+54" }, { n: "Armenia", c: "+374" }, { n: "Australia", c: "+61" }, { n: "Austria", c: "+43" }, { n: "Azerbaijan", c: "+994" }, { n: "Bahamas", c: "+1" }, { n: "Bahrain", c: "+973" }, { n: "Bangladesh", c: "+880" }, { n: "Barbados", c: "+1" }, { n: "Belarus", c: "+375" }, { n: "Belgium", c: "+32" }, { n: "Belize", c: "+1" }, { n: "Benin", c: "+229" }, { n: "Bhutan", c: "+880" }, { n: "Bolivia", c: "+591" }, { n: "Bosnia", c: "+387" }, { n: "Botswana", c: "+267" }, { n: "Brazil", c: "+55" }, { n: "Brunei", c: "+673" }, { n: "Bulgaria", c: "+359" }, { n: "Burkina Faso", c: "+226" }, { n: "Burundi", c: "+257" }, { n: "Cambodia", c: "+855" }, { n: "Cameroon", c: "+237" }, { n: "Canada", c: "+1" }, { n: "Cape Verde", c: "+238" }, { n: "Chad", c: "+235" }, { n: "Chile", c: "+56" }, { n: "China", c: "+86" }, { n: "Colombia", c: "+56" }, { n: "Comoros", c: "+269" }, { n: "Congo", c: "+242" }, { n: "Costa Rica", c: "+506" }, { n: "Croatia", c: "+385" }, { n: "Cuba", c: "+53" }, { n: "Cyprus", c: "+357" }, { n: "Czech Republic", c: "+420" }, { n: "Denmark", c: "+45" }, { n: "Djibouti", c: "+253" }, { n: "Dominica", c: "+1" }, { n: "Dominican Republic", c: "+1" }, { n: "Ecuador", c: "+593" }, { n: "Egypt", c: "+20" }, { n: "El Salvador", c: "+503" }, { n: "Equatorial Guinea", c: "+240" }, { n: "Eritrea", c: "+291" }, { n: "Estonia", c: "+45" }, { n: "Eswatini", c: "+291" }, { n: "Ethiopia", c: "+251" }, { n: "Fiji", c: "+679" }, { n: "Finland", c: "+358" }, { n: "France", c: "+33" }, { n: "Gabon", c: "+241" }, { n: "Gambia", c: "+220" }, { n: "Georgia", c: "+995" }, { n: "Germany", c: "+49" }, { n: "Ghana", c: "+233" }, { n: "Greece", c: "+30" }, { n: "Grenada", c: "+1" }, { n: "Guatemala", c: "+502" }, { n: "Guinea", c: "+224" }, { n: "Guyana", c: "+1" }, { n: "Haiti", c: "+592" }, { n: "Honduras", c: "+504" }, { n: "Hungary", c: "+36" }, { n: "Iceland", c: "+354" }, { n: "India", c: "+91" }, { n: "Indonesia", c: "+91" }, { n: "Iran", c: "+98" }, { n: "Iraq", c: "+964" }, { n: "Ireland", c: "+353" }, { n: "Israel", c: "+972" }, { n: "Italy", c: "+39" }, { n: "Jamaica", c: "+1" }, { n: "Japan", c: "+81" }, { n: "Jordan", c: "+962" }, { n: "Kazakhstan", c: "+7" }, { n: "Kenya", c: "+254" }, { n: "Kiribati", c: "+686" }, { n: "Kuwait", c: "+965" }, { n: "Kyrgyzstan", c: "+996" }, { n: "Laos", c: "+856" }, { n: "Latvia", c: "+371" }, { n: "Lebanon", c: "+961" }, { n: "Lesotho", c: "+266" }, { n: "Liberia", c: "+231" }, { n: "Libya", c: "+218" }, { n: "Liechtenstein", c: "+423" }, { n: "Lithuania", c: "+370" }, { n: "Luxembourg", c: "+352" }, { n: "Madagascar", c: "+261" }, { n: "Malawi", c: "+265" }, { n: "Malaysia", c: "+60" }, { n: "Maldives", c: "+960" }, { n: "Mali", c: "+223" }, { n: "Malta", c: "+356" }, { n: "Mauritania", c: "+222" }, { n: "Mauritius", c: "+230" }, { n: "Mexico", c: "+52" }, { n: "Moldova", c: "+373" }, { n: "Monaco", c: "+377" }, { n: "Mongolia", c: "+976" }, { n: "Montenegro", c: "+382" }, { n: "Morocco", c: "+212" }, { n: "Mozambique", c: "+258" }, { n: "Myanmar", c: "+95" }, { n: "Namibia", c: "+264" }, { n: "Nauru", c: "+674" }, { n: "Nepal", c: "+977" }, { n: "Netherlands", c: "+31" }, { n: "New Zealand", c: "+61" }, { n: "Nicaragua", c: "+505" }, { n: "Niger", c: "+227" }, { n: "Nigeria", c: "+234" }, { n: "North Korea", c: "+850" }, { n: "North Macedonia", c: "+382" }, { n: "Norway", c: "+47" }, { n: "Oman", c: "+968" }, { n: "Pakistan", c: "+92" }, { n: "Palau", c: "+674" }, { n: "Palestine", c: "+970" }, { n: "Panama", c: "+507" }, { n: "Papua New Guinea", c: "+675" }, { n: "Paraguay", c: "+507" }, { n: "Peru", c: "+51" }, { n: "Philippines", c: "+63" }, { n: "Poland", c: "+48" }, { n: "Portugal", c: "+39" }, { n: "Qatar", c: "+974" }, { n: "Romania", c: "+48" }, { n: "Russia", c: "+7" }, { n: "Rwanda", c: "+250" }, { n: "Saint Kitts", c: "+1" }, { n: "Saint Lucia", c: "+1" }, { n: "Samoa", c: "+685" }, { n: "San Marino", c: "+377" }, { n: "Sao Tome", c: "+239" }, { n: "Saudi Arabia", c: "+966" }, { n: "Senegal", c: "+221" }, { n: "Serbia", c: "+381" }, { n: "Seychelles", c: "+248" }, { n: "Sierra Leone", c: "+232" }, { n: "Singapore", c: "+65" }, { n: "Slovakia", c: "+421" }, { n: "Slovenia", c: "+421" }, { n: "Solomon Islands", c: "+677" }, { n: "Somalia", c: "+252" }, { n: "South Africa", c: "+27" }, { n: "South Korea", c: "+82" }, { n: "South Sudan", c: "+211" }, { n: "Spain", c: "+34" }, { n: "Sri Lanka", c: "+94" }, { n: "Sudan", c: "+249" }, { n: "Suriname", c: "+597" }, { n: "Sweden", c: "+47" }, { n: "Switzerland", c: "+41" }, { n: "Syria", c: "+963" }, { n: "Taiwan", c: "+886" }, { n: "Tajikistan", c: "+992" }, { n: "Tanzania", c: "+255" }, { n: "Thailand", c: "+66" }, { n: "Togo", c: "+228" }, { n: "Tonga", c: "+676" }, { n: "Trinidad", c: "+1" }, { n: "Tunisia", c: "+216" }, { n: "Turkey", c: "+34" }, { n: "Turkmenistan", c: "+993" }, { n: "Tuvalu", c: "+678" }, { n: "Uganda", c: "+256" }, { n: "Ukraine", c: "+7" }, { n: "United Arab Emirates", c: "+971" }, { n: "United Kingdom", c: "+44" }, { n: "United States", c: "+1" }, { n: "Uruguay", c: "+598" }, { n: "Uzbekistan", c: "+998" }, { n: "Vanuatu", c: "+678" }, { n: "Vatican City", c: "+379" }, { n: "Venezuela", c: "+598" }, { n: "Vietnam", c: "+84" }, { n: "Yemen", c: "+967" }, { n: "Zambia", c: "+260" }, { n: "Zimbabwe", c: "+263" }
].sort((a, b) => a.n.localeCompare(b.n));

const initialFormState = {
    make: "", vehicle_model: "", condition: "New", yearFrom: "", yearTo: "",
    mileage: "", specs: "", name: "", email: "", countryCode: "+1", phone: "", countryOfImport: ""
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

    const handleConditionSelect = (condition: "New" | "Used") => setFormData({ ...formData, condition });

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
                setSuccessMsg("Your inquiry has been received. Please check your email for confirmation, and our concierge team will contact you shortly.");
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

    const handleReset = () => {
        setSuccessMsg("");
        setStep(1);
        setFormData(initialFormState);
    };

    const minimalInput = "w-full bg-transparent border-b border-black/20 text-black placeholder:text-zinc-400 focus:outline-none focus:border-black transition-colors rounded-none px-0 py-3 text-lg";

    // NEW: appearance-none drops the native arrow so we can render our custom Lucide one
    const minimalSelect = "w-full bg-transparent border-b border-black/20 text-black focus:outline-none focus:border-black transition-colors rounded-none px-0 py-3 text-lg appearance-none cursor-pointer pr-8 truncate";

    return (
        <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            whileInView={{ y: 0, opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: appleEase }}
            className="w-full max-w-3xl bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 shadow-[0_40px_100px_rgba(0,0,0,0.08)] overflow-hidden relative text-black mx-auto"
        >
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
                    <button onClick={handleReset} className="text-sm font-semibold text-black border-b border-black/30 pb-1 hover:border-black transition-colors">
                        Submit another inquiry
                    </button>
                </div>
            ) : (
                <div className="p-8 md:p-14 min-h-[500px] flex flex-col relative text-left">
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
                                                <datalist id="car-makes">{CAR_MAKES.map(make => <option key={make} value={make} />)}</datalist>
                                            </div>
                                            <div className="relative">
                                                <input id="vehicle_model" list="car-models" required value={formData.vehicle_model} onChange={handleChange} placeholder={isLoadingModels ? "Loading Models..." : "Model (e.g. 911 Carrera)"} className={minimalInput} autoComplete="off" />
                                                <datalist id="car-models">{availableModels.map(model => <option key={model} value={model} />)}</datalist>
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
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-8 overflow-hidden pt-4">
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
                                    <div><textarea id="specs" value={formData.specs} onChange={handleChange} placeholder="Specify preferred colors, interior trims, must-have packages, or any other special requirements..." className={`${minimalInput} resize-none min-h-[160px]`} autoFocus /></div>
                                )}

                                {/* STEP 4 */}
                                {step === 4 && (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div><input id="name" required value={formData.name} onChange={handleChange} placeholder="Full Name" className={minimalInput} autoFocus /></div>
                                            <div><input id="email" type="email" required value={formData.email} onChange={handleChange} placeholder="Email Address" className={minimalInput} /></div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                            <div className="md:col-span-3 relative">
                                                <select id="countryCode" value={formData.countryCode} onChange={handleChange} className={minimalSelect}>
                                                    {COUNTRIES.map(c => (
                                                        <option key={`code-${c.n}`} value={c.c}>
                                                            {c.c} ({c.n.substring(0, 15)}{c.n.length > 15 ? '...' : ''})
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={16} />
                                            </div>
                                            <div className="md:col-span-4">
                                                <input id="phone" type="tel" required value={formData.phone} onChange={handleChange} placeholder="Phone Number" className={minimalInput} />
                                            </div>
                                            <div className="md:col-span-5 relative">
                                                <select id="countryOfImport" required value={formData.countryOfImport} onChange={handleChange} className={minimalSelect}>
                                                    <option value="" disabled>Import Country...</option>
                                                    {COUNTRIES.map(c => (
                                                        <option key={`import-${c.n}`} value={c.n}>
                                                            {c.n}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={16} />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

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
    );
}