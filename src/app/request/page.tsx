"use client";

import { useState } from "react";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import MinimalHeader from "@/app/components/MinimalHeader";
import { submitCarRequest } from "@/actions/request-actions";

const TOTAL_STEPS = 4;

export default function RequestCar() {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // Updated Form State
    const [formData, setFormData] = useState({
        make: "",
        vehicle_model: "",
        condition: "New", // Default to New
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleConditionSelect = (condition: "New" | "Used") => {
        setFormData({ ...formData, condition });
    };

    const handleNext = () => {
        // Validation per step
        if (step === 1 && (!formData.make || !formData.vehicle_model)) {
            setErrorMsg("Please fill in the required vehicle details.");
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

        // Final validation
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

    const minimalInput = "w-full bg-transparent border-b border-gray-300 text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors rounded-none px-0 py-3 text-lg";
    const minimalSelect = "w-full bg-transparent border-b border-gray-300 text-black focus:outline-none focus:border-black transition-colors rounded-none px-0 py-3 text-lg appearance-none cursor-pointer";

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-x-hidden font-sans">
            <div className="absolute top-0 left-0 w-full h-[800px] bg-[radial-gradient(ellipse_at_top,rgba(40,40,40,0.8)_0%,rgba(0,0,0,1)_70%)] z-0 pointer-events-none" />

            <MinimalHeader />

            <main className="flex-1 flex flex-col items-center justify-center py-24 px-4 relative z-10 w-full">
                <div className="text-center mb-12 mt-10">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-4">
                        Create your inquiry.
                    </h2>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto font-light">
                        Provide your exact specifications, and we will handle the rest.
                    </p>
                </div>

                {/* UPDATED: Increased the white/grey shadow opacity and spread so it glows visibly against the black background */}
                <div className="w-full max-w-3xl bg-white rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.15)] overflow-hidden relative text-black">

                    {/* UPDATED: Changed the track to gray-200 and the active bar to gray-600 for a visible grey finish */}
                    <div className="w-full h-1.5 bg-gray-200 absolute top-0 left-0">
                        <div
                            className="h-full bg-gray-600 transition-all duration-500 ease-out"
                            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                        />
                    </div>

                    {successMsg ? (
                        <div className="p-12 md:p-20 text-center flex flex-col items-center justify-center min-h-[400px]">
                            <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 className="h-10 w-10 text-green-600" />
                            </div>
                            <h3 className="text-3xl font-bold mb-4 tracking-tight">Inquiry Received.</h3>
                            <p className="text-gray-500 text-lg mb-8 max-w-md">{successMsg}</p>
                            <button onClick={() => window.location.reload()} className="text-sm font-medium border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors">
                                Submit another inquiry
                            </button>
                        </div>
                    ) : (
                        <div className="p-8 md:p-14 min-h-[450px] flex flex-col">
                            <div className="flex justify-between items-end border-b border-gray-100 pb-6 mb-8">
                                <h3 className="text-2xl font-bold tracking-tight">
                                    {step === 1 && "1. Vehicle Selection"}
                                    {step === 2 && "2. Condition & History"}
                                    {step === 3 && "3. Special Requirements"}
                                    {step === 4 && "4. Your Details"}
                                </h3>
                                <span className="text-gray-400 text-sm font-medium">
                                    Step {step} of {TOTAL_STEPS}
                                </span>
                            </div>

                            {errorMsg && (
                                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
                                    {errorMsg}
                                </div>
                            )}

                            {/* STEP 1: Make & Model */}
                            {step === 1 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <input id="make" required value={formData.make} onChange={handleChange} placeholder="Make / Brand (e.g. Porsche)" className={minimalInput} autoFocus />
                                        </div>
                                        <div>
                                            <input id="vehicle_model" required value={formData.vehicle_model} onChange={handleChange} placeholder="Model (e.g. 911 Carrera)" className={minimalInput} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: Condition */}
                            {step === 2 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => handleConditionSelect("New")}
                                            className={`flex-1 py-4 border rounded-xl font-medium transition-all ${formData.condition === "New" ? "border-black bg-black text-white" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                                        >
                                            Brand New
                                        </button>
                                        <button
                                            onClick={() => handleConditionSelect("Used")}
                                            className={`flex-1 py-4 border rounded-xl font-medium transition-all ${formData.condition === "Used" ? "border-black bg-black text-white" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                                        >
                                            Pre-Owned
                                        </button>
                                    </div>

                                    {/* Conditionally reveal fields if 'Used' is selected */}
                                    {formData.condition === "Used" && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div>
                                                <input id="yearFrom" type="number" value={formData.yearFrom} onChange={handleChange} placeholder="Year From" className={minimalInput} />
                                            </div>
                                            <div>
                                                <input id="yearTo" type="number" value={formData.yearTo} onChange={handleChange} placeholder="Year To" className={minimalInput} />
                                            </div>
                                            <div>
                                                <input id="mileage" value={formData.mileage} onChange={handleChange} placeholder="Max Mileage (e.g. 30k)" className={minimalInput} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* STEP 3: Special Requirements */}
                            {step === 3 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div>
                                        <textarea
                                            id="specs" value={formData.specs} onChange={handleChange}
                                            placeholder="Specify preferred colors, interior trims, must-have packages, or any other special requirements..."
                                            className={`${minimalInput} resize-none min-h-[140px]`}
                                            autoFocus
                                        />
                                    </div>
                                </div>
                            )}

                            {/* STEP 4: Contact & Import Details */}
                            {step === 4 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <input id="name" required value={formData.name} onChange={handleChange} placeholder="Full Name" className={minimalInput} autoFocus />
                                        </div>
                                        <div>
                                            <input id="email" type="email" required value={formData.email} onChange={handleChange} placeholder="Email Address" className={minimalInput} />
                                        </div>
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
                                </div>
                            )}

                            {/* Navigation */}
                            <div className="mt-auto pt-12 flex items-center justify-between">
                                {step > 1 ? (
                                    <button type="button" onClick={handlePrev} className="text-gray-400 hover:text-black transition-colors flex items-center gap-2 font-medium">
                                        <ArrowLeft size={18} /> Back
                                    </button>
                                ) : <div />}

                                {step < TOTAL_STEPS ? (
                                    <button type="button" onClick={handleNext} className="bg-[#111] hover:bg-black text-white px-8 py-4 rounded-full font-medium transition-all flex items-center gap-2">
                                        Continue
                                    </button>
                                ) : (
                                    <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="bg-[#111] hover:bg-black text-white px-10 py-4 rounded-full font-medium transition-all flex items-center gap-2 disabled:opacity-70">
                                        {isSubmitting ? <><Loader2 className="animate-spin" size={18} /> Processing</> : "Submit Inquiry"}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}