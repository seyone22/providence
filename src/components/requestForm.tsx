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
    { n: "Afghanistan", c: "+93" },
    { n: "Albania", c: "+355" },
    { n: "Algeria", c: "+213" },
    { n: "American Samoa", c: "+1-684" },
    { n: "Andorra", c: "+376" },
    { n: "Angola", c: "+244" },
    { n: "Anguilla", c: "+1-264" },
    { n: "Antarctica", c: "+672" },
    { n: "Antigua and Barbuda", c: "+1-268" },
    { n: "Argentina", c: "+54" },
    { n: "Armenia", c: "+374" },
    { n: "Aruba", c: "+297" },
    { n: "Australia", c: "+61" },
    { n: "Austria", c: "+43" },
    { n: "Azerbaijan", c: "+994" },
    { n: "Bahamas", c: "+1-242" },
    { n: "Bahrain", c: "+973" },
    { n: "Bangladesh", c: "+880" },
    { n: "Barbados", c: "+1-246" },
    { n: "Belarus", c: "+375" },
    { n: "Belgium", c: "+32" },
    { n: "Belize", c: "+501" },
    { n: "Benin", c: "+229" },
    { n: "Bermuda", c: "+1-441" },
    { n: "Bhutan", c: "+975" },
    { n: "Bolivia", c: "+591" },
    { n: "Bosnia and Herzegovina", c: "+387" },
    { n: "Botswana", c: "+267" },
    { n: "Brazil", c: "+55" },
    { n: "British Indian Ocean Territory", c: "+246" },
    { n: "British Virgin Islands", c: "+1-284" },
    { n: "Brunei", c: "+673" },
    { n: "Bulgaria", c: "+359" },
    { n: "Burkina Faso", c: "+226" },
    { n: "Burundi", c: "+257" },
    { n: "Cambodia", c: "+855" },
    { n: "Cameroon", c: "+237" },
    { n: "Canada", c: "+1" },
    { n: "Cape Verde", c: "+238" },
    { n: "Cayman Islands", c: "+1-345" },
    { n: "Central African Republic", c: "+236" },
    { n: "Chad", c: "+235" },
    { n: "Chile", c: "+56" },
    { n: "China", c: "+86" },
    { n: "Christmas Island", c: "+61" },
    { n: "Cocos (Keeling) Islands", c: "+61" },
    { n: "Colombia", c: "+57" },
    { n: "Comoros", c: "+269" },
    { n: "Cook Islands", c: "+682" },
    { n: "Costa Rica", c: "+506" },
    { n: "Croatia", c: "+385" },
    { n: "Cuba", c: "+53" },
    { n: "Curacao", c: "+599" },
    { n: "Cyprus", c: "+357" },
    { n: "Czech Republic", c: "+420" },
    { n: "Democratic Republic of the Congo", c: "+243" },
    { n: "Denmark", c: "+45" },
    { n: "Djibouti", c: "+253" },
    { n: "Dominica", c: "+1-767" },
    { n: "Dominican Republic", c: "+1-809" },
    { n: "East Timor (Timor-Leste)", c: "+670" },
    { n: "Ecuador", c: "+593" },
    { n: "Egypt", c: "+20" },
    { n: "El Salvador", c: "+503" },
    { n: "Equatorial Guinea", c: "+240" },
    { n: "Eritrea", c: "+291" },
    { n: "Estonia", c: "+372" },
    { n: "Eswatini (Swaziland)", c: "+268" },
    { n: "Ethiopia", c: "+251" },
    { n: "Falkland Islands", c: "+500" },
    { n: "Faroe Islands", c: "+298" },
    { n: "Fiji", c: "+679" },
    { n: "Finland", c: "+358" },
    { n: "France", c: "+33" },
    { n: "French Polynesia", c: "+689" },
    { n: "Gabon", c: "+241" },
    { n: "Gambia", c: "+220" },
    { n: "Georgia", c: "+995" },
    { n: "Germany", c: "+49" },
    { n: "Ghana", c: "+233" },
    { n: "Gibraltar", c: "+350" },
    { n: "Greece", c: "+30" },
    { n: "Greenland", c: "+299" },
    { n: "Grenada", c: "+1-473" },
    { n: "Guam", c: "+1-671" },
    { n: "Guatemala", c: "+502" },
    { n: "Guernsey", c: "+44-1481" },
    { n: "Guinea", c: "+224" },
    { n: "Guinea-Bissau", c: "+245" },
    { n: "Guyana", c: "+592" },
    { n: "Haiti", c: "+509" },
    { n: "Honduras", c: "+504" },
    { n: "Hong Kong", c: "+852" },
    { n: "Hungary", c: "+36" },
    { n: "Iceland", c: "+354" },
    { n: "India", c: "+91" },
    { n: "Indonesia", c: "+62" },
    { n: "Iran", c: "+98" },
    { n: "Iraq", c: "+964" },
    { n: "Ireland", c: "+353" },
    { n: "Isle of Man", c: "+44-1624" },
    { n: "Israel", c: "+972" },
    { n: "Italy", c: "+39" },
    { n: "Ivory Coast", c: "+225" },
    { n: "Jamaica", c: "+1-876" },
    { n: "Japan", c: "+81" },
    { n: "Jersey", c: "+44-1534" },
    { n: "Jordan", c: "+962" },
    { n: "Kazakhstan", c: "+7" },
    { n: "Kenya", c: "+254" },
    { n: "Kiribati", c: "+686" },
    { n: "Kosovo", c: "+383" },
    { n: "Kuwait", c: "+965" },
    { n: "Kyrgyzstan", c: "+996" },
    { n: "Laos", c: "+856" },
    { n: "Latvia", c: "+371" },
    { n: "Lebanon", c: "+961" },
    { n: "Lesotho", c: "+266" },
    { n: "Liberia", c: "+231" },
    { n: "Libya", c: "+218" },
    { n: "Liechtenstein", c: "+423" },
    { n: "Lithuania", c: "+370" },
    { n: "Luxembourg", c: "+352" },
    { n: "Macau", c: "+853" },
    { n: "Macedonia", c: "+389" },
    { n: "Madagascar", c: "+261" },
    { n: "Malawi", c: "+265" },
    { n: "Malaysia", c: "+60" },
    { n: "Maldives", c: "+960" },
    { n: "Mali", c: "+223" },
    { n: "Malta", c: "+356" },
    { n: "Marshall Islands", c: "+692" },
    { n: "Mauritania", c: "+222" },
    { n: "Mauritius", c: "+230" },
    { n: "Mayotte", c: "+262" },
    { n: "Mexico", c: "+52" },
    { n: "Micronesia", c: "+691" },
    { n: "Moldova", c: "+373" },
    { n: "Monaco", c: "+377" },
    { n: "Mongolia", c: "+976" },
    { n: "Montenegro", c: "+382" },
    { n: "Montserrat", c: "+1-664" },
    { n: "Morocco", c: "+212" },
    { n: "Mozambique", c: "+258" },
    { n: "Myanmar", c: "+95" },
    { n: "Namibia", c: "+264" },
    { n: "Nauru", c: "+674" },
    { n: "Nepal", c: "+977" },
    { n: "Netherlands", c: "+31" },
    { n: "Netherlands Antilles", c: "+599" },
    { n: "New Caledonia", c: "+687" },
    { n: "New Zealand", c: "+64" },
    { n: "Nicaragua", c: "+505" },
    { n: "Niger", c: "+227" },
    { n: "Nigeria", c: "+234" },
    { n: "Niue", c: "+683" },
    { n: "Norfolk Island", c: "+672" },
    { n: "North Korea", c: "+850" },
    { n: "Northern Ireland", c: "+44" },
    { n: "Northern Mariana Islands", c: "+1-670" },
    { n: "Norway", c: "+47" },
    { n: "Oman", c: "+968" },
    { n: "Pakistan", c: "+92" },
    { n: "Palau", c: "+680" },
    { n: "Palestine", c: "+970" },
    { n: "Panama", c: "+507" },
    { n: "Papua New Guinea", c: "+675" },
    { n: "Paraguay", c: "+595" },
    { n: "Peru", c: "+51" },
    { n: "Philippines", c: "+63" },
    { n: "Pitcairn Islands", c: "+64" },
    { n: "Poland", c: "+48" },
    { n: "Portugal", c: "+351" },
    { n: "Puerto Rico", c: "+1-787" },
    { n: "Qatar", c: "+974" },
    { n: "Republic of the Congo", c: "+242" },
    { n: "Reunion", c: "+262" },
    { n: "Romania", c: "+40" },
    { n: "Russia", c: "+7" },
    { n: "Rwanda", c: "+250" },
    { n: "Saint Barthelemy", c: "+590" },
    { n: "Saint Helena", c: "+290" },
    { n: "Saint Kitts and Nevis", c: "+1-869" },
    { n: "Saint Lucia", c: "+1-758" },
    { n: "Saint Martin", c: "+590" },
    { n: "Saint Pierre and Miquelon", c: "+508" },
    { n: "Saint Vincent and the Grenadines", c: "+1-784" },
    { n: "Samoa", c: "+685" },
    { n: "San Marino", c: "+378" },
    { n: "Sao Tome and Principe", c: "+239" },
    { n: "Saudi Arabia", c: "+966" },
    { n: "Senegal", c: "+221" },
    { n: "Serbia", c: "+381" },
    { n: "Seychelles", c: "+248" },
    { n: "Sierra Leone", c: "+232" },
    { n: "Singapore", c: "+65" },
    { n: "Sint Maarten", c: "+1-721" },
    { n: "Slovakia", c: "+421" },
    { n: "Slovenia", c: "+386" },
    { n: "Solomon Islands", c: "+677" },
    { n: "Somalia", c: "+252" },
    { n: "South Africa", c: "+27" },
    { n: "South Korea", c: "+82" },
    { n: "South Sudan", c: "+211" },
    { n: "Spain", c: "+34" },
    { n: "Sri Lanka", c: "+94" },
    { n: "Sudan", c: "+249" },
    { n: "Suriname", c: "+597" },
    { n: "Svalbard and Jan Mayen", c: "+47" },
    { n: "Sweden", c: "+46" },
    { n: "Switzerland", c: "+41" },
    { n: "Syria", c: "+963" },
    { n: "Taiwan", c: "+886" },
    { n: "Tajikistan", c: "+992" },
    { n: "Tanzania", c: "+255" },
    { n: "Thailand", c: "+66" },
    { n: "Togo", c: "+228" },
    { n: "Tokelau", c: "+690" },
    { n: "Tonga", c: "+676" },
    { n: "Trinidad and Tobago", c: "+1-868" },
    { n: "Tunisia", c: "+216" },
    { n: "Turkey", c: "+90" },
    { n: "Turkmenistan", c: "+993" },
    { n: "Turks and Caicos Islands", c: "+1-649" },
    { n: "Tuvalu", c: "+688" },
    { n: "U.S. Virgin Islands", c: "+1-340" },
    { n: "Uganda", c: "+256" },
    { n: "Ukraine", c: "+380" },
    { n: "United Arab Emirates", c: "+971" },
    { n: "United Kingdom", c: "+44" },
    { n: "United States", c: "+1" },
    { n: "Uruguay", c: "+598" },
    { n: "Uzbekistan", c: "+998" },
    { n: "Vanuatu", c: "+678" },
    { n: "Vatican", c: "+379" },
    { n: "Venezuela", c: "+58" },
    { n: "Vietnam", c: "+84" },
    { n: "Wallis and Futuna", c: "+681" },
    { n: "Western Sahara", c: "+212" },
    { n: "Yemen", c: "+967" },
    { n: "Zambia", c: "+260" },
    { n: "Zimbabwe", c: "+263" }
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
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Filter options based on user input
    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedLabel = options.find(o => o.value === value)?.label;

    // Sync search term with selection when closed
    useEffect(() => {
        if (!isOpen) setSearchTerm("");
    }, [isOpen]);

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
                className={`w-full bg-transparent border-b flex items-center justify-between px-0 py-3 text-lg transition-colors outline-none
                    ${disabled || isLoading ? "opacity-50 cursor-not-allowed" : ""}
                    ${error ? "border-red-500 text-red-500" : isOpen ? "border-sky-500 text-black" : "border-black/10 text-black hover:border-black/30"}
                `}
            >
                <input
                    type="text"
                    disabled={disabled || isLoading}
                    className="bg-transparent w-full outline-none placeholder:text-zinc-400 text-black"
                    placeholder={selectedLabel || placeholder}
                    value={isOpen ? searchTerm : (selectedLabel || "")}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                />

                <div className="flex items-center gap-2">
                    {isLoading ? (
                        <Loader2 size={18} className="animate-spin text-zinc-400" />
                    ) : (
                        <ChevronDown
                            size={18}
                            onClick={() => !disabled && setIsOpen(!isOpen)}
                            className={`transition-transform duration-300 cursor-pointer ${isOpen ? "rotate-180 text-sky-500" : "text-zinc-400"}`}
                        />
                    )}
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.2 }}
                        className="absolute z-50 top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-black/5 max-h-64 overflow-y-auto py-2"
                    >
                        {filteredOptions.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-zinc-500 italic">No results found</div>
                        ) : (
                            filteredOptions.map((opt) => (
                                <div
                                    key={opt.value}
                                    onClick={() => {
                                        onChange(id, opt.value);
                                        setSearchTerm("");
                                        setIsOpen(false);
                                    }}
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

export default function RequestForm({ prefill }: { prefill?: Partial<typeof initialFormState> }) {
    const searchParams = useSearchParams();

    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Success States
    const [isSuccess, setIsSuccess] = useState(false);
    const [submittedRequestId, setSubmittedRequestId] = useState<string>("");
    const [assignedAgent, setAssignedAgent] = useState<AgentData | null | undefined>(null);

    const [availableModels, setAvailableModels] = useState<string[]>([]);
    const [isLoadingModels, setIsLoadingModels] = useState(false);
    const [apiFailed, setApiFailed] = useState(false); // <-- NEW

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
        if (prefill) {
            setFormData(prev => ({
                ...prev,
                ...prefill,
                // Ensure condition is "Used" if it's a specific car from the gallery
                condition: "Used"
            }));
        }
    }, [prefill]);

    useEffect(() => {
        if (!formData.make) {
            setAvailableModels([]);
            setApiFailed(false); // Reset on empty
            return;
        }
        const fetchModels = async () => {
            setIsLoadingModels(true);
            setApiFailed(false); // Reset before new attempt

            try {
                const url = `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${encodeURIComponent(formData.make)}?format=json`;
                const res = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);

                if (res.status === 503) {
                    throw new Error("NHTSA Server is currently unavailable (503). Please try again later.");
                }

                if (!res.ok) throw new Error("Network response was not ok");

                const data = await res.json();

                if (data.Results) {
                    const models = data.Results.map((item: any) =>
                        item.Model_Name
                            .trim()
                            .toLowerCase()
                            .replace(/\b\w/g, (c: string) => c.toUpperCase())
                    );
                    setAvailableModels([...new Set(models)].sort() as string[]);
                }
            } catch (err) {
                console.error("Fetch Error:", err);
                setApiFailed(true); // <-- Trigger the manual input fallback
            } finally {
                setIsLoadingModels(false);
            }
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
                            href={`/track/${submittedRequestId}`}
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
                        <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex-1">
                            {step === 1 && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-16">
                                        <SelectDropdown
                                            id="make"
                                            placeholder="Select Make"
                                            options={CAR_MAKES.map(m => ({ label: m, value: m }))}
                                            value={formData.make}
                                            onChange={handleDropdownChange}
                                            error={errors.make}
                                        />

                                        {/* CONDITIONAL RENDER BASED ON API STATUS */}
                                        {apiFailed ? (
                                            <div className="relative">
                                                <input
                                                    id="vehicle_model"
                                                    value={formData.vehicle_model}
                                                    onChange={handleInputChange}
                                                    placeholder="Type Vehicle Model (e.g. 911, M3)"
                                                    className={inputClasses("vehicle_model")}
                                                />
                                                {errors.vehicle_model && (
                                                    <p className="absolute -bottom-5 left-0 text-[10px] font-bold text-red-500 flex items-center gap-1">
                                                        <AlertCircle size={10}/> {errors.vehicle_model}
                                                    </p>
                                                )}
                                                <p className="absolute -bottom-5 right-0 text-[10px] text-zinc-400">
                                                    Manual Entry Mode
                                                </p>
                                            </div>
                                        ) : (
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
                                        )}
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