"use client";

import { useState } from "react";
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import MinimalHeader from "@/app/components/MinimalHeader"; // Adjust path if needed
import { submitCarRequest } from "@/actions/request-actions"; // Adjust path if needed

const TOTAL_STEPS = 4;

export default function RequestCar() {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // Form State
    const [formData, setFormData] = useState({
        make: "", vehicle_model: "",
        yearFrom: "", yearTo: "", specs: "",
        budget: "", currency: "usd",
        name: "", email: "", phone: "", country: "", city: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleNext = () => {
        // Basic validation before advancing
        if (step === 1 && (!formData.make || !formData.vehicle_model)) {
            setErrorMsg("Please fill in the required vehicle details.");
            return;
        }
        if (step === 3 && !formData.budget) {
            setErrorMsg("Please provide your maximum budget.");
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
        if (!formData.name || !formData.email || !formData.phone || !formData.country || !formData.city) {
            setErrorMsg("Please fill in all contact details.");
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

    // Styling for the minimal, Apple-like input fields
    const minimalInput = "w-full bg-transparent border-b border-gray-300 text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors rounded-none px-0 py-3 text-lg";
    const minimalSelect = "w-full bg-transparent border-b border-gray-300 text-black focus:outline-none focus:border-black transition-colors rounded-none px-0 py-3 text-lg appearance-none cursor-pointer";

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-x-hidden font-sans">
            {/* Dark cinematic background */}
            <div className="absolute top-0 left-0 w-full h-[800px] bg-[radial-gradient(ellipse_at_top,rgba(40,40,40,0.8)_0%,rgba(0,0,0,1)_70%)] z-0 pointer-events-none" />

            <MinimalHeader />

            <main className="flex-1 flex flex-col items-center justify-center py-24 px-4 relative z-10 w-full">

                {/* Titles */}
                <div className="text-center mb-12 mt-10">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-4">
                        Create your inquiry.
                    </h2>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto font-light">
                        Provide your exact specifications, and we will handle the rest.
                    </p>
                </div>

                {/* Form Card (Stark White for high contrast luxury feel) */}
                <div className="w-full max-w-3xl bg-white rounded-2xl shadow-[0_0_60px_rgba(255,255,255,0.05)] overflow-hidden relative text-black">

                    {/* Top Progress Bar */}
                    <div className="w-full h-1.5 bg-gray-100 absolute top-0 left-0">
                        <div
                            className="h-full bg-black transition-all duration-500 ease-out"
                            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                        />
                    </div>

                    {successMsg ? (
                        // Success State
                        <div className="p-12 md:p-20 text-center flex flex-col items-center justify-center min-h-[400px]">
                            <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 className="h-10 w-10 text-green-600" />
                            </div>
                            <h3 className="text-3xl font-bold mb-4 tracking-tight">Inquiry Received.</h3>
                            <p className="text-gray-500 text-lg mb-8 max-w-md">
                                {successMsg}
                            </p>
                            <button onClick={() => window.location.reload()} className="text-sm font-medium border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors">
                                Submit another inquiry
                            </button>
                        </div>
                    ) : (
                        // The Multi-step Form
                        <div className="p-8 md:p-14 min-h-[450px] flex flex-col">

                            {/* Step Header */}
                            <div className="flex justify-between items-end border-b border-gray-100 pb-6 mb-8">
                                <h3 className="text-2xl font-bold tracking-tight">
                                    {step === 1 && "1. Vehicle Selection"}
                                    {step === 2 && "2. Specifications"}
                                    {step === 3 && "3. Financials"}
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

                            {/* --- STEP 1: Vehicle Selection --- */}
                            {step === 1 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <input
                                                id="make" required value={formData.make} onChange={handleChange}
                                                placeholder="Make / Brand (e.g. Porsche)"
                                                className={minimalInput} autoFocus
                                            />
                                        </div>
                                        <div>
                                            <input
                                                id="vehicle_model" required value={formData.vehicle_model} onChange={handleChange}
                                                placeholder="Model (e.g. 911 Carrera)"
                                                className={minimalInput}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- STEP 2: Specifications --- */}
                            {step === 2 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <input
                                                id="yearFrom" type="number" value={formData.yearFrom} onChange={handleChange}
                                                placeholder="Year From (Optional)"
                                                className={minimalInput} autoFocus
                                            />
                                        </div>
                                        <div>
                                            <input
                                                id="yearTo" type="number" value={formData.yearTo} onChange={handleChange}
                                                placeholder="Year To (Optional)"
                                                className={minimalInput}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <textarea
                                            id="specs" value={formData.specs} onChange={handleChange}
                                            placeholder="Colors, trims, mileage, specific packages..."
                                            className={`${minimalInput} resize-none min-h-[100px]`}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* --- STEP 3: Financials --- */}
                            {step === 3 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="grid grid-cols-[2fr_1fr] gap-8">
                                        <div>
                                            <input
                                                id="budget" required value={formData.budget} onChange={handleChange}
                                                placeholder="Maximum Budget (e.g. 150,000)"
                                                className={minimalInput} autoFocus
                                            />
                                        </div>
                                        <div className="relative">
                                            <select
                                                id="currency" value={formData.currency} onChange={handleChange}
                                                className={minimalSelect}
                                            >
                                                <option value="usd">USD ($)</option>
                                                <option value="gbp">GBP (£)</option>
                                                <option value="eur">EUR (€)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 text-sm">
                                        Providing an accurate budget allows us to source the best possible spec and calculate landed customs duties efficiently.
                                    </p>
                                </div>
                            )}

                            {/* --- STEP 4: Contact Details --- */}
                            {step === 4 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <input
                                                id="name" required value={formData.name} onChange={handleChange}
                                                placeholder="Full Name" className={minimalInput} autoFocus
                                            />
                                        </div>
                                        <div>
                                            <input
                                                id="email" type="email" required value={formData.email} onChange={handleChange}
                                                placeholder="Email Address" className={minimalInput}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div>
                                            <input
                                                id="phone" type="tel" required value={formData.phone} onChange={handleChange}
                                                placeholder="Phone Number" className={minimalInput}
                                            />
                                        </div>
                                        <div>
                                            <select
                                                id="country" required value={formData.country} onChange={handleChange}
                                                className={minimalSelect}
                                            >
                                                <option value="" disabled>Select Country</option>
                                                <option value="uk">United Kingdom</option>
                                                <option value="uae">UAE</option>
                                                <option value="sl">Sri Lanka</option>
                                            </select>
                                        </div>
                                        <div>
                                            <input
                                                id="city" required value={formData.city} onChange={handleChange}
                                                placeholder="City" className={minimalInput}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="mt-auto pt-12 flex items-center justify-between">
                                {step > 1 ? (
                                    <button
                                        type="button"
                                        onClick={handlePrev}
                                        className="text-gray-400 hover:text-black transition-colors flex items-center gap-2 font-medium"
                                    >
                                        <ArrowLeft size={18} /> Back
                                    </button>
                                ) : (
                                    <div /> // Empty div to keep 'Continue' button on the right
                                )}

                                {step < TOTAL_STEPS ? (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="bg-[#111] hover:bg-black text-white px-8 py-4 rounded-full font-medium transition-all flex items-center gap-2"
                                    >
                                        Continue
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="bg-[#111] hover:bg-black text-white px-10 py-4 rounded-full font-medium transition-all flex items-center gap-2 disabled:opacity-70"
                                    >
                                        {isSubmitting ? (
                                            <><Loader2 className="animate-spin" size={18} /> Processing</>
                                        ) : (
                                            "Submit Inquiry"
                                        )}
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