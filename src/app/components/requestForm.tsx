"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, ArrowLeft, ChevronDown, AlertCircle, User } from "lucide-react";
import { submitCarRequest } from "@/actions/request-actions";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_STEPS = 3;

const CAR_MAKES = [
    "Acura", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Bugatti",
    "Buick", "BYD", "Cadillac", "Chevrolet", "Chrysler", "Citroën", "Dacia",
    "Dodge", "Ferrari", "Fiat", "Fisker", "Ford", "Genesis", "GMC", "Honda",
    "Hyundai", "Infiniti", "Jaguar", "Jeep", "Kia", "Koenigsegg", "Lamborghini",
    "Land Rover", "Lexus", "Lincoln", "Lotus", "Lucid", "Maserati", "Mazda",
    "McLaren", "Mercedes-Benz", "MG", "Mini", "Mitsubishi", "Nio", "Nissan",
    "Pagani", "Peugeot", "Polestar", "Porsche", "Ram", "Renault", "Rivian",
    "Rolls-Royce", "Seat", "Skoda", "Subaru", "Suzuki", "Tesla", "Toyota",
    "VinFast", "Volkswagen", "Volvo", "Xpeng", "Zeekr"
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
    { n: "Canada", c: "+1" }, { n: "China", c: "+86" }, { n: "France", c: "+33" },
    { n: "Germany", c: "+49" }, { n: "India", c: "+91" }, { n: "Italy", c: "+39" },
    { n: "Japan", c: "+81" }, { n: "Mexico", c: "+52" }, { n: "Netherlands", c: "+31" },
    { n: "New Zealand", c: "+64" }, { n: "Saudi Arabia", c: "+966" }, { n: "Singapore", c: "+65" },
    { n: "South Africa", c: "+27" }, { n: "South Korea", c: "+82" }, { n: "Spain", c: "+34" },
    { n: "Sri Lanka", c: "+94" }, { n: "Sweden", c: "+46" }, { n: "Switzerland", c: "+41" },
    { n: "United Arab Emirates", c: "+971" }, { n: "United Kingdom", c: "+44" },
    { n: "United States", c: "+1" }
].sort((a, b) => a.n.localeCompare(b.n));

// --- HELPER: Read Cookies for Meta Pixel Data ---
function getCookie(name: string) {
    if (typeof document === 'undefined') return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return undefined;
}

// --- CUSTOM UI COMPONENTS ---

const SelectDropdown = ({
                            id, options, value, onChange, placeholder, error, disabled = false, isLoading = false
                        }: {
    id: string, options: {label: string, value: string}[], value: string, onChange: (id: string, val: string) => void, placeholder: string, error?: string, disabled?: boolean, isLoading?: boolean
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedLabel = options.find(o => o.value === value)?.label;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div
                onClick={() => !disabled && !isLoading && setIsOpen(!isOpen)}
                className={`w-full bg-transparent border-b flex items-center justify-between px-0 py-3 text-lg transition-colors cursor-pointer outline-none
                    ${disabled || isLoading ? "opacity-50 cursor-not-allowed" : ""}
                    ${error ? "border-red-500 text-red-500" : isOpen ? "border-sky-500 text-black" : "border-black/10 text-black hover:border-black/30"}
                `}
            >
                <span className={!value ? "text-zinc-400" : "text-black"}>
                    {isLoading ? "Loading..." : selectedLabel || placeholder}
                </span>
                {isLoading ? <Loader2 size={18} className="animate-spin text-zinc-400" /> : <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? "rotate-180 text-sky-500" : "text-zinc-400"}`} />}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.2 }}
                        className="absolute z-50 top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-black/5 max-h-64 overflow-y-auto py-2"
                    >
                        {options.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-zinc-500 italic">No options available</div>
                        ) : (
                            options.map((opt) => (
                                <div
                                    key={opt.value}
                                    onClick={() => { onChange(id, opt.value); setIsOpen(false); }}
                                    className={`px-4 py-3 text-sm cursor-pointer transition-colors hover:bg-sky-50 hover:text-sky-600 ${value === opt.value ? "bg-sky-500/10 text-sky-600 font-bold" : "text-zinc-700"}`}
                                >
                                    {opt.label}
                                </div>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
            {error && <p className="absolute -bottom-5 left-0 text-[10px] font-bold text-red-500 flex items-center gap-1"><AlertCircle size={10}/> {error}</p>}
        </div>
    );
};

// --- MAIN FORM COMPONENT ---

const initialFormState = {
    make: "", vehicle_model: "", condition: "New",
    yearRange: "2024-2026", mileageRange: "Under 5,000",
    specs: "", name: "", email: "", phone: "",
    countryCode: "+1", countryOfImport: ""
};

// Type for the returned agent
interface AgentData {
    name: string;
    email: string;
    image: string;
}

export default function RequestForm() {
    const searchParams = useSearchParams();

    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Success States
    const [isSuccess, setIsSuccess] = useState(false);
    const [submittedRequestId, setSubmittedRequestId] = useState<string>("");
    const [assignedAgent, setAssignedAgent] = useState<AgentData | null | undefined>(null);

    const [availableModels, setAvailableModels] = useState<string[]>([]);
    const [isLoadingModels, setIsLoadingModels] = useState(false);

    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Identity keys for Server-to-Server tracking
    const [trackingData, setTrackingData] = useState({ gclid: '', fbclid: '', fbc: '', fbp: '' });

    // Capture URL params and Cookies on mount
    useEffect(() => {
        setTrackingData({
            gclid: searchParams?.get('gclid') || '',
            fbclid: searchParams?.get('fbclid') || '',
            fbc: getCookie('_fbc') || '',
            fbp: getCookie('_fbp') || ''
        });
    }, [searchParams]);

    useEffect(() => {
        if (!formData.make) {
            setAvailableModels([]);
            return;
        }
        const fetchModels = async () => {
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
        };

        const delayDebounceFn = setTimeout(fetchModels, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [formData.make]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (errors[id]) setErrors(prev => ({ ...prev, [id]: "" }));
    };

    const handleDropdownChange = (id: string, value: string) => {
        setFormData(prev => {
            if (id === "make" && prev.make !== value) return { ...prev, [id]: value, vehicle_model: "" };
            return { ...prev, [id]: value };
        });
        if (errors[id]) setErrors(prev => ({ ...prev, [id]: "" }));
    };

    const validateStep = () => {
        const newErrors: Record<string, string> = {};

        if (step === 1) {
            if (!formData.make) newErrors.make = "Please select a make";
            if (!formData.vehicle_model) newErrors.vehicle_model = "Please select a model";
        }

        if (step === 3) {
            if (!formData.name.trim()) newErrors.name = "Full name is required";
            if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Valid email is required";
            if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
            if (!formData.countryOfImport) newErrors.countryOfImport = "Destination country is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep()) {
            setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
        }
    };

    const handlePrev = () => {
        setStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep()) return;

        setIsSubmitting(true);
        try {
            // Map the form UI data back into the structure expected by the backend
            let yearFrom = "", yearTo = "";
            if (formData.condition === "Used" && formData.yearRange) {
                const parts = formData.yearRange.split("-");
                yearFrom = parts[0];
                yearTo = parts[1] || parts[0];
            }

            const payload = {
                make: formData.make,
                vehicle_model: formData.vehicle_model,
                condition: formData.condition,
                yearFrom: yearFrom || undefined,
                yearTo: yearTo || undefined,
                mileage: formData.condition === "Used" ? formData.mileageRange : undefined,
                specs: formData.specs,
                name: formData.name,
                email: formData.email,
                countryCode: formData.countryCode,
                phone: formData.phone,
                countryOfImport: formData.countryOfImport,
                ...trackingData
            };

            const response = await submitCarRequest(payload);

            if (response.success) {
                // Save the returned data to state
                setAssignedAgent(response.agent);
                setSubmittedRequestId(response.requestId);
                setIsSuccess(true);
            } else {
                setErrors({ submit: response.message });
            }
        } catch (error) {
            setErrors({ submit: "Submission failed. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClasses = (id: string) => `w-full bg-transparent border-b text-black placeholder:text-zinc-400 focus:outline-none transition-colors rounded-none px-0 py-3 text-lg
        ${errors[id] ? "border-red-500 focus:border-red-600" : "border-black/10 focus:border-sky-500"}`;

    return (
        <motion.div className="w-full max-w-3xl bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 shadow-[0_40px_100px_rgba(0,0,0,0.08)] overflow-visible relative text-black mx-auto">
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-[#4da8da]/10 absolute top-0 left-0 overflow-hidden rounded-t-[2.5rem]">
                <motion.div className="h-full bg-[#4da8da]" animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }} transition={{ duration: 0.5 }} />
            </div>

            {isSuccess ? (
                // === NEW SUCCESS VIEW MATCHING SCREENSHOT ===
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-10 md:p-16 text-center flex flex-col items-center justify-center min-h-[500px]"
                >
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#4da8da] mb-10 tracking-tight">
                        Thank you for submitting your inquiry!
                    </h2>

                    <div className="w-32 h-32 rounded-full border-4 border-[#e6f3fa] overflow-hidden mb-6 shadow-sm bg-[#f2f8fc] flex items-center justify-center">
                        {assignedAgent?.image ? (
                            <img src={assignedAgent.image} alt={assignedAgent.name} className="w-full h-full object-cover" />
                        ) : (
                            <User className="h-14 w-14 text-[#4da8da]" />
                        )}
                    </div>

                    <p className="text-zinc-800 text-base md:text-lg leading-relaxed max-w-xl mb-10">
                        Hi {formData.name.split(' ')[0]}, I'm {assignedAgent?.name} and I'll be handling your inquiry from here.<br/>
                        To get started, we just need to verify your inquiry. I've sent you an authentication email from <a href={`mailto:${assignedAgent?.email}`} className="text-zinc-800 underline decoration-1 underline-offset-4 font-medium">{assignedAgent?.email}</a> with a live tracking link — if you don't see it, check your spam folder. You can also tap the Track my inquiry button to follow your progress.<br/>
                        Looking forward to helping you!
                    </p>

                    <div className="flex flex-col items-center gap-6 w-full max-w-md">
                        <a
                            href={`/tracking/${submittedRequestId}`}
                            className="w-full bg-[#4da8da] hover:bg-[#3d92c2] text-white py-4 px-6 rounded-2xl font-bold text-lg transition-colors text-center shadow-md shadow-[#4da8da]/20"
                        >
                            Authenticate and Track My Inquiry
                        </a>
                        <button
                            onClick={() => {
                                setIsSuccess(false);
                                setStep(1);
                                setFormData(initialFormState);
                            }}
                            className="text-[#4da8da] font-bold hover:text-[#3d92c2] transition-colors underline decoration-2 underline-offset-4 text-base"
                        >
                            New Inquiry
                        </button>
                    </div>
                </motion.div>
            ) : (
                <div className="p-8 md:p-14 min-h-[550px] flex flex-col">
                    <div className="flex justify-between items-end border-b border-black/5 pb-6 mb-8">
                        <h3 className="text-2xl font-bold">
                            {step === 1 && "1. Specifications"}
                            {step === 2 && "2. Condition & Availability"}
                            {step === 3 && "3. Delivery Details"}
                        </h3>
                        <span className="text-[#4da8da] text-xs font-bold uppercase tracking-widest">Step {step}/{TOTAL_STEPS}</span>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8 flex-1">
                            {step === 1 && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <SelectDropdown
                                            id="make"
                                            placeholder="Select Make"
                                            options={CAR_MAKES.map(m => ({ label: m, value: m }))}
                                            value={formData.make}
                                            onChange={handleDropdownChange}
                                            error={errors.make}
                                        />
                                        <SelectDropdown
                                            id="vehicle_model"
                                            placeholder="Select Model"
                                            options={availableModels.map(m => ({ label: m, value: m }))}
                                            value={formData.vehicle_model}
                                            onChange={handleDropdownChange}
                                            disabled={!formData.make}
                                            isLoading={isLoadingModels}
                                            error={errors.vehicle_model}
                                        />
                                    </div>
                                    <div className="relative pt-4">
                                        <textarea
                                            id="specs"
                                            value={formData.specs}
                                            onChange={handleInputChange}
                                            placeholder="Specification Requests (e.g. Carbon Fiber Pack, Magma Red Interior, Night Package...)"
                                            className={`${inputClasses("specs")} min-h-[120px] resize-none`}
                                        />
                                    </div>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <div className="flex gap-4">
                                        {["New", "Used"].map((cond) => (
                                            <button
                                                key={cond}
                                                onClick={() => setFormData({...formData, condition: cond as any})}
                                                className={`flex-1 py-4 rounded-2xl font-bold border transition-all ${formData.condition === cond ? "bg-[#4da8da] text-white border-[#4da8da] shadow-md" : "bg-transparent text-zinc-400 border-black/10 hover:border-[#4da8da]/30"}`}
                                            >
                                                {cond === "New" ? "Brand New" : "Pre-Owned"}
                                            </button>
                                        ))}
                                    </div>

                                    <AnimatePresence>
                                        {formData.condition === "Used" && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                                className="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-visible"
                                            >
                                                <div className="relative">
                                                    <label className="text-[10px] font-bold text-[#4da8da] uppercase tracking-wider block mb-1">Year Range</label>
                                                    <SelectDropdown
                                                        id="yearRange" placeholder="Select Year"
                                                        options={["2024-2026", "2021-2023", "2018-2020", "Vintage / Classic"].map(y => ({label: y, value: y}))}
                                                        value={formData.yearRange} onChange={handleDropdownChange}
                                                    />
                                                </div>
                                                <div className="relative">
                                                    <label className="text-[10px] font-bold text-[#4da8da] uppercase tracking-wider block mb-1">Max Mileage</label>
                                                    <SelectDropdown
                                                        id="mileageRange" placeholder="Select Mileage"
                                                        options={["Delivery Miles Only", "Under 5,000", "Under 20,000", "Under 50,000", "Over 50,000"].map(m => ({label: m, value: m}))}
                                                        value={formData.mileageRange} onChange={handleDropdownChange}
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {formData.condition === "New" && (
                                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-zinc-500 italic text-center py-4 text-sm">
                                            New vehicles will be sourced with 2025/2026 factory specifications.
                                        </motion.p>
                                    )}
                                </>
                            )}

                            {step === 3 && (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="relative">
                                            <input id="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" className={inputClasses("name")} />
                                            {errors.name && <p className="absolute -bottom-5 left-0 text-[10px] font-bold text-red-500 flex items-center gap-1"><AlertCircle size={10}/> {errors.name}</p>}
                                        </div>
                                        <div className="relative">
                                            <input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className={inputClasses("email")} />
                                            {errors.email && <p className="absolute -bottom-5 left-0 text-[10px] font-bold text-red-500 flex items-center gap-1"><AlertCircle size={10}/> {errors.email}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                        <div className="md:col-span-4 relative">
                                            <SelectDropdown
                                                id="countryCode" placeholder="Code"
                                                options={COUNTRIES.map(c => ({ label: `${c.c} ${c.n}`, value: c.c }))}
                                                value={formData.countryCode} onChange={handleDropdownChange}
                                            />
                                        </div>
                                        <div className="md:col-span-8 relative">
                                            <input id="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" className={inputClasses("phone")} />
                                            {errors.phone && <p className="absolute -bottom-5 left-0 text-[10px] font-bold text-red-500 flex items-center gap-1"><AlertCircle size={10}/> {errors.phone}</p>}
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <SelectDropdown
                                            id="countryOfImport" placeholder="Destination Country..."
                                            options={COUNTRIES.map(c => ({ label: c.n, value: c.n }))}
                                            value={formData.countryOfImport} onChange={handleDropdownChange}
                                            error={errors.countryOfImport}
                                        />
                                    </div>

                                    {errors.submit && (
                                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium text-center">
                                            {errors.submit}
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <div className="mt-12 pt-8 flex items-center justify-between border-t border-black/5">
                        <button onClick={handlePrev} className={`flex items-center gap-2 font-bold transition-all ${step === 1 ? "opacity-0 pointer-events-none" : "opacity-100 text-zinc-500 hover:text-[#4da8da]"}`}>
                            <ArrowLeft size={18} /> Back
                        </button>
                        {step < TOTAL_STEPS ? (
                            <button onClick={handleNext} className="bg-[#4da8da] text-white px-10 py-4 rounded-full font-bold hover:bg-[#3d92c2] hover:scale-105 transition-all shadow-[0_10px_20px_rgba(77,168,218,0.3)]">Continue</button>
                        ) : (
                            <button onClick={handleSubmit} disabled={isSubmitting} className="bg-[#4da8da] text-white px-10 py-4 rounded-full font-bold hover:bg-[#3d92c2] hover:scale-105 transition-all shadow-[0_10px_20px_rgba(77,168,218,0.3)] disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2">
                                {isSubmitting ? <><Loader2 className="animate-spin" size={18} /> Processing...</> : "Submit Inquiry"}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    );
}