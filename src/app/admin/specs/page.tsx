"use client";

import {Suspense, useEffect, useRef, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {
    Armchair,
    Globe,
    Hash,
    Info,
    Loader2,
    Printer,
    Save,
    Settings2,
    ShieldCheck,
    Tag,
    Trash2,
    Zap
} from "lucide-react";

// UI Components
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Badge} from "@/components/ui/badge";

// Actions & Components
import {getSpecDossierById, saveSpecDossier} from "@/actions/spec-actions";
import {SpecSection} from "@/components/SpecSection";
import {getPresignedUrls, uploadDossierImages} from "@/lib/file-actions";
import {generateDossierPdfAction} from "@/actions/pdf-actions";

// Full Country List for the Datalist
const COUNTRIES = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
    "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
    "Côte d'Ivoire", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)",
    "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
    "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini (fmr. \"Swaziland\")", "Ethiopia",
    "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
    "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
    "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
    "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
    "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)",
    "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
    "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
    "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
    "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
    "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam",
    "Yemen", "Zambia", "Zimbabwe"
];

const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://pub-0c6552f09f244121ac51914a1f782578.r2.dev";

// --- REPLACE YOUR CURRENT initialSpecData WITH THIS DESIGNATED TYPE STRUCTURE ---

interface PriceEntry {
    country: string;
    currency: string;
    amount: number;
    type: string;
}

interface CustomDataEntry {
    label: string;
    value: string;
}

interface ValuePointEntry {
    title: string;
    description: string;
}

interface SpecDataType {
    make: string;
    model: string;
    year: string;
    trim: string;
    countryOfOrigin: string;
    engineConfig: string;
    displacement: string;
    pricing: PriceEntry[];
    maxPower: string;
    maxTorque: string;
    transmission: string;
    fuelSystem: string;
    upholstery: string;
    infotainment: string;
    slug: string;
    notes: string;
    emissions: string;
    steering: string;
    status: string;
    customData: CustomDataEntry[];
    valuePoints: ValuePointEntry[];
}

const initialSpecData: SpecDataType = {
    make: "",
    model: "",
    year: "",
    trim: "",
    countryOfOrigin: "Japan",
    engineConfig: "",
    displacement: "",
    pricing: [],
    maxPower: "",
    maxTorque: "",
    transmission: "",
    fuelSystem: "Petrol",
    slug: "",
    upholstery: "",
    infotainment: "",
    notes: "",
    emissions: "",
    steering: "RHD",
    status: "Draft",
    customData: [],
    valuePoints: []
};

function SpecBuilderContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const editId = searchParams.get("editId");

    const [pricing, setPricing] = useState<any[]>([]);
    const [newPrice, setNewPrice] = useState({ country: "", currency: "USD", amount: "", type: "CIF" });

    const [isPrinting, setIsPrinting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [isDirty, setIsDirty] = useState(false);
    const isSavingRef = useRef(false);

    // Core Data
    const [specData, setSpecData] = useState(initialSpecData);

    // Tagging Systems
    const [features, setFeatures] = useState<string[]>([]);
    const [newFeature, setNewFeature] = useState("");
    const [searchTags, setSearchTags] = useState<string[]>([]);
    const [newSearchTag, setNewSearchTag] = useState("");

    const [newCustomLabel, setNewCustomLabel] = useState("");
    const [newCustomValue, setNewCustomValue] = useState("");

    const [newValueTitle, setNewValueTitle] = useState("");
    const [newValueDesc, setNewValueDesc] = useState("");

    // Image Management State
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const getImageUrl = (path: string) => {
        if (!path) return "";
        if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("blob:")) return path;
        const base = R2_PUBLIC_URL.replace(/\/$/, "");
        const cleanPath = path.replace(/^\//, "");
        return `${base}/${cleanPath}`;
    };

    useEffect(() => {
        if (editId) {
            const loadDossier = async () => {
                setIsLoading(true);
                const res = await getSpecDossierById(editId);
                if (res.success && res.data) {
                    // --- ADD THESE INSIDE THE loadDossier useEffect SUCCESS BLOCK ---
                    setSpecData(prev => ({
                        ...res.data,
                        slug: res.data.slug || "",
                        customData: res.data.customData || [],
                        valuePoints: res.data.valuePoints || []
                    }));
                    setPricing(res.data.pricing || []);
                    setFeatures(res.data.features || []);
                    setSearchTags(res.data.searchTags || []);
                    setExistingImages(res.data.images || []);
                } else {
                    alert("Dossier not found or error fetching.");
                }
                setIsLoading(false);
            };
            loadDossier();
        }
    }, [editId]);

    useEffect(() => {
        const handleRouteChange = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            const link = target.closest("a");

            if (
                link &&
                isDirty &&
                !isSavingRef.current
            ) {
                const confirmed = window.confirm(
                    "You have unsaved changes. Are you sure you want to leave this page?"
                );

                if (!confirmed) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        };

        document.addEventListener("click", handleRouteChange, true);

        return () => {
            document.removeEventListener("click", handleRouteChange, true);
        };
    }, [isDirty]);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty && !isSavingRef.current) {
                e.preventDefault();
                e.returnValue = "";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isDirty]);

    const handleAddPrice = () => {
        if (!newPrice.country || !newPrice.amount) return;

        setIsDirty(true);

        setPricing([...pricing, { ...newPrice, amount: parseFloat(newPrice.amount) }]);
        setNewPrice({ country: "", currency: "USD", amount: "", type: "CIF" });
    };

    const removePrice = (index: number) => {
        setIsDirty(true);
        setPricing(pricing.filter((_, i) => i !== index));
    };

    const handlePrint = async () => {
        if (!editId) return alert("Please save the dossier first before generating a PDF.");
        setIsPrinting(true);
        try {
            const res = await generateDossierPdfAction(editId);
            if (res.success && res.pdfBase64) {
                const byteCharacters = atob(res.pdfBase64);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i);
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], {type: 'application/pdf'});
                const blobUrl = URL.createObjectURL(blob);
                window.open(blobUrl, '_blank');
                setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
            } else {
                alert(res.message || "Failed to generate PDF.");
            }
        } catch (error) {
            alert("An error occurred while generating the PDF.");
        } finally {
            setIsPrinting(false);
        }
    };

    const handleInputChange = (field: keyof typeof initialSpecData, value: string) => {
        setIsDirty(true);

        setSpecData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setPendingFiles(prev => [...prev, ...filesArray]);
            setPreviewUrls(prev => [...prev, ...filesArray.map(f => URL.createObjectURL(f))]);

            setIsDirty(true);
        }
    };

    const removeExistingImage = (urlToRemove: string) => {
        setIsDirty(true);
        setExistingImages(prev => prev.filter(url => url !== urlToRemove));
    };

    const removePendingFile = (index: number) => {
        setPendingFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    // --- Tag Helpers to prevent empty or duplicate tags ---
    const handleAddFeature = () => {
        const val = newFeature.trim();
        if (val && !features.includes(val)) setFeatures([...features, val]);
        setNewFeature("");
    };

    const handleAddSearchTag = () => {
        const val = newSearchTag.trim().toLowerCase();
        if (val && !searchTags.includes(val)) setSearchTags([...searchTags, val]);
        setNewSearchTag("");
    };

    const handleSave = async () => {
        if (!specData.make || !specData.model) return alert("Make and Model are required.");
        setIsSaving(true);
        isSavingRef.current = true;

        try {
            let finalImageUrls = [...existingImages];

            if (pendingFiles.length > 0) {
                // Get secure URLs
                const fileMeta = pendingFiles.map(f => ({ name: f.name, type: f.type, size: f.size }));
                const { success, uploadData, message } = await getPresignedUrls(fileMeta, "dossiers");

                if (!success || !uploadData) throw new Error(message || "Failed to get upload URLs.");

                // Upload all files directly to Cloudflare concurrently
                const uploadPromises = pendingFiles.map(async (file, index) => {
                    const { uploadUrl, fileUrl } = uploadData[index];

                    const uploadRes = await fetch(uploadUrl, {
                        method: "PUT",
                        body: file,
                        headers: { "Content-Type": file.type },
                    });

                    if (!uploadRes.ok) throw new Error(`Failed to upload ${file.name}`);
                    return fileUrl;
                });

                const uploadedUrls = await Promise.all(uploadPromises);
                finalImageUrls = [...finalImageUrls, ...uploadedUrls];
            }

            const payload = {
                ...specData,
                features,
                searchTags,
                images: finalImageUrls,
                pricing
            };
            const result = await saveSpecDossier(payload);

            if (result.success) {
                alert(editId ? "Dossier Template Updated!" : "New Dossier Template Created!");

                setIsDirty(false);

                if (!editId && (result as any).id) {
                    router.replace(`/admin/dossiers/builder?editId=${(result as any).id}`);
                }

                alert(editId ? "Dossier Template Updated!" : "New Dossier Template Created!");

            } else {
                alert(result.message);
            }
        } catch (err: any) {
            alert(err.message || "An unexpected error occurred.");
        } finally {
            setIsSaving(false);
            isSavingRef.current = false;
        }
    };

    if (isLoading) return (
        <div className="h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-zinc-400" size={40}/>
        </div>
    );

    return (
        <div className="p-6 lg:p-10 space-y-10 max-w-[1400px] mx-auto pb-24">
            <header
                className="sticky top-0 z-40 bg-zinc-50/80 backdrop-blur-md border-b border-black/5 pb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">{editId ? "Edit Dossier Template" : "Master Spec Builder"}</h1>
                    <p className="text-zinc-500 mt-1">{editId ? `Editing Template ID: ${editId}` : "Create a new blueprint for vehicles"}</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={handlePrint} disabled={isPrinting}
                            className="rounded-2xl h-12 px-6">
                        {isPrinting ? <Loader2 className="animate-spin mr-2" size={20}/> :
                            <Printer size={20} className="mr-2"/>}
                        {isPrinting ? "Generating..." : "Print PDF"}
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}
                            className="rounded-2xl gap-2 bg-black text-white h-12 px-8 shadow-xl shadow-black/10">
                        {isSaving ? <Loader2 className="animate-spin"/> : <Save/>}
                        {editId ? "Update Template" : "Save Template"}
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* --- SIDEBAR (PROVENANCE & COMPLIANCE) --- */}
                <div className="lg:col-span-4 space-y-8">
                    <SpecSection title="Target Market & Origin" icon={Globe}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-zinc-400">Spec / Country of
                                    Origin</Label>
                                <Input
                                    list="country-list"
                                    value={specData.countryOfOrigin}
                                    onChange={(e) => handleInputChange("countryOfOrigin", e.target.value)}
                                    className="h-11 rounded-xl"
                                    placeholder="Type to search countries..."
                                />
                                <datalist id="country-list">
                                    {COUNTRIES.map(country => (
                                        <option key={country} value={country}/>
                                    ))}
                                </datalist>
                            </div>
                        </div>
                    </SpecSection>

                    <SpecSection title="Compliance" icon={ShieldCheck}>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-zinc-400">Steering
                                    Configuration</Label>
                                <Select value={specData.steering}
                                        onValueChange={(v) => handleInputChange("steering", v)}>
                                    <SelectTrigger className="rounded-xl h-11"><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="RHD">Right Hand (RHD)</SelectItem>
                                        <SelectItem value="LHD">Left Hand (LHD)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-zinc-400">Emissions
                                    Standard</Label>
                                <Input
                                    value={specData.emissions}
                                    onChange={(e) => handleInputChange("emissions", e.target.value)}
                                    className="h-11 rounded-xl"
                                    placeholder="e.g., Euro 6d"
                                />
                            </div>
                        </div>
                    </SpecSection>

                    {/* Final Status & Notes */}
                    <div className="bg-white border border-black/5 rounded-[3rem] p-10 shadow-sm flex flex-col gap-10">

                        {/* Top: Notes Area */}
                        <div className="space-y-4">
                            <Label className="font-bold flex items-center gap-2">
                                <Info size={18}/> Additional Template Notes
                            </Label>
                            <Textarea
                                placeholder="Internal notes regarding this specific vehicle blueprint..."
                                value={specData.notes}
                                onChange={(e) => handleInputChange("notes", e.target.value)}
                                className="min-h-[150px] rounded-[2rem] bg-zinc-50 border-transparent p-6 focus:bg-white transition-all"
                            />
                        </div>

                        {/* Bottom: Status Selection */}
                        <div className="pt-6 border-t border-black/5 space-y-4">
                            <div className="max-w-xs"> {/* Keeps the select at a reasonable width */}
                                <Label className="font-bold mb-2 block">Template Status</Label>
                                <Select value={specData.status} onValueChange={(v) => handleInputChange("status", v)}>
                                    <SelectTrigger className="h-12 rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Draft">Draft</SelectItem>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Archived">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 inline-flex">
                                <p className="text-[10px] text-amber-700 font-bold leading-tight flex gap-2 items-center">
                                    <ShieldCheck size={14} className="shrink-0"/>
                                    Drafts cannot be assigned to concrete vehicles.
                                </p>
                            </div>
                        </div>

                        {/* --- ADD THIS SLUG INPUT BOX DIRECTLY UNDER THE NOTES AREA CONTAINER --- */}
                        <div className="space-y-4 pt-4 border-t border-black/5">
                            <Label className="font-bold flex items-center gap-2 text-zinc-700">
                                <Tag size={18} className="text-zinc-400" /> URL Slug Configuration
                            </Label>
                            <div className="space-y-1">
                                <Input
                                    placeholder="e.g. land-cruiser-300-gr-sport"
                                    value={specData.slug || ""}
                                    onChange={(e) => {
                                        // Auto-formats input to url-safe slugs (lowercase, dashes instead of spaces)
                                        const processedSlug = e.target.value
                                            .toLowerCase()
                                            .replace(/\s+/g, "-")
                                            .replace(/[^a-z0-9-_]/g, "");
                                        handleInputChange("slug", processedSlug);
                                    }}
                                    className="h-11 rounded-xl bg-zinc-50 border-transparent focus:bg-white transition-all font-mono text-sm text-zinc-800"
                                />
                                <p className="text-[10px] text-zinc-400 pl-1 font-medium">
                                    Used for building clean routing addresses. Spaces automatically convert to hyphens.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- MAIN COLUMN --- */}
                <div className="lg:col-span-8 space-y-10">

                    {/* Media & Gallery Section */}
                    <div className="bg-white border border-black/5 rounded-[3rem] p-10 shadow-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="bg-purple-50 text-purple-600 p-4 rounded-2xl">
                                <Settings2 size={28} />
                            </div>
                            <h3 className="text-2xl font-bold">Media & Gallery</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {/* Existing Images (from R2) */}
                                {existingImages.map((url, idx) => (
                                    <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-200 group">
                                        <img
                                            src={getImageUrl(url)}
                                            alt="Gallery"
                                            className="object-cover w-full h-full"
                                        />
                                        <button
                                            onClick={() => removeExistingImage(url)}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}

                                {/* Pending Upload Previews */}
                                {previewUrls.map((url, idx) => (
                                    <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-blue-200 group">
                                        <img src={url} alt="Preview" className="object-cover w-full h-full opacity-60" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Badge className="bg-blue-500 text-white">Pending</Badge>
                                        </div>
                                        <button
                                            onClick={() => removePendingFile(idx)}
                                            className="absolute top-2 right-2 p-1.5 bg-zinc-800 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}

                                {/* Upload Trigger */}
                                <label className="flex flex-col items-center justify-center aspect-video rounded-2xl border-2 border-dashed border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 transition-all cursor-pointer">
                                    <div className="flex flex-col items-center gap-2 text-zinc-500">
                                        <Save size={24} />
                                        <span className="text-xs font-bold uppercase tracking-wider">Upload Images</span>
                                    </div>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileSelect}
                                    />
                                </label>
                            </div>
                            <p className="text-[11px] text-zinc-400 font-medium">
                                Images will be uploaded to the R2 storage bucket upon saving the template.
                            </p>
                        </div>
                    </div>

                    {/* Vehicle Overview Section */}
                    <div
                        className="bg-white border border-black/5 rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl"><Tag size={28}/></div>
                            <h3 className="text-2xl font-bold">Template Overview</h3>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-2">
                                <Label className="font-bold text-zinc-700">Make (Brand)</Label>
                                <Input value={specData.make} onChange={(e) => handleInputChange("make", e.target.value)}
                                       className="rounded-xl h-12 bg-zinc-50" placeholder="e.g. Toyota"/>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-zinc-700">Model</Label>
                                <Input value={specData.model}
                                       onChange={(e) => handleInputChange("model", e.target.value)}
                                       className="rounded-xl h-12 bg-zinc-50" placeholder="e.g. Land Cruiser 300"/>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-zinc-700">Year (Model Year)</Label>
                                <Input value={specData.year} onChange={(e) => handleInputChange("year", e.target.value)}
                                       className="rounded-xl h-12 bg-zinc-50" placeholder="e.g. 2024"/>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-zinc-700">Trim / Edition</Label>
                                <Input value={specData.trim} onChange={(e) => handleInputChange("trim", e.target.value)}
                                       className="rounded-xl h-12 bg-zinc-50" placeholder="e.g. GR Sport"/>
                            </div>
                        </div>
                    </div>

                    {/* Mechanics Section */}
                    <div
                        className="bg-white border border-black/5 rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl"><Zap size={28}/></div>
                            <h3 className="text-2xl font-bold">Mechanical Specifications</h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">
                            {[
                                {id: 'engineConfig', label: 'Engine Configuration', placeholder: 'V8 Twin-Turbo'},
                                {id: 'displacement', label: 'Displacement', placeholder: '3,445 cc'},
                                {id: 'maxPower', label: 'Max Power Output', placeholder: '304 kW / 409 HP'},
                                {id: 'maxTorque', label: 'Max Torque', placeholder: '700 Nm'},
                                {id: 'transmission', label: 'Transmission Type', placeholder: '10-Speed Direct Shift'},
                            ].map((item) => (
                                <div key={item.id} className="space-y-2">
                                    <Label className="font-bold text-zinc-700">{item.label}</Label>
                                    <Input
                                        value={(specData as any)[item.id]}
                                        onChange={(e) => handleInputChange(item.id as any, e.target.value)}
                                        className="rounded-xl h-12 bg-zinc-50 border-transparent focus:bg-white transition-all"
                                        placeholder={item.placeholder}
                                    />
                                </div>
                            ))}

                            <div className="space-y-2">
                                <Label className="font-bold text-zinc-700">Fuel System</Label>
                                <Select value={specData.fuelSystem}
                                        onValueChange={(v) => handleInputChange("fuelSystem", v)}>
                                    <SelectTrigger
                                        className="rounded-xl h-12 bg-zinc-50 border-transparent focus:bg-white transition-all">
                                        <SelectValue placeholder="Select Fuel Type"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Petrol">Petrol</SelectItem>
                                        <SelectItem value="Diesel">Diesel</SelectItem>
                                        <SelectItem value="Electric">Electric (EV)</SelectItem>
                                        <SelectItem value="Hybrid">Hybrid (HEV / PHEV)</SelectItem>
                                        <SelectItem value="Hydrogen">Hydrogen</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Tags & Features Section */}
                    <div className="bg-white border border-black/5 rounded-[3rem] p-10 shadow-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl"><Armchair size={28}/></div>
                            <h3 className="text-2xl font-bold">Interior & Technology</h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 mb-10">
                            <div className="space-y-2">
                                <Label className="font-bold">Standard Upholstery</Label>
                                <Input value={specData.upholstery}
                                       onChange={(e) => handleInputChange("upholstery", e.target.value)}
                                       placeholder="Semi-Aniline Leather Black" className="rounded-xl h-12 bg-zinc-50"/>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold">Infotainment System</Label>
                                <Input value={specData.infotainment}
                                       onChange={(e) => handleInputChange("infotainment", e.target.value)}
                                       placeholder="12.3-inch Multimedia Display"
                                       className="rounded-xl h-12 bg-zinc-50"/>
                            </div>
                        </div>

                        {/* Physical Features Array */}
                        <div className="space-y-4 mb-10">
                            <Label className="font-bold text-lg flex items-center gap-2">
                                <Settings2 size={20} className="text-zinc-400"/> Hardware & Features
                            </Label>
                            <p className="text-sm text-zinc-500">List specific physical attributes of this trim (e.g.
                                Sunroof, 360 Camera).</p>
                            <div className="p-8 bg-zinc-50 rounded-[2.5rem] space-y-6 border border-zinc-200">
                                <div className="flex flex-wrap gap-2">
                                    {features.map(tag => (
                                        <Badge key={tag}
                                               className="bg-zinc-200 text-zinc-800 hover:bg-zinc-300 border-transparent px-4 py-2 rounded-full gap-2 transition-colors cursor-default">
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => setFeatures(features.filter(t => t !== tag))}
                                                className="focus:outline-none flex items-center justify-center rounded-full hover:bg-red-500/50 p-0.5 transition-colors"
                                            >
                                                <Trash2 size={12} className="text-zinc-500 hover:text-red-600"/>
                                            </button>
                                        </Badge>
                                    ))}
                                    {features.length === 0 &&
                                        <p className="text-zinc-600 text-sm italic">No features added yet...</p>}
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        value={newFeature}
                                        onChange={(e) => setNewFeature(e.target.value)}
                                        className="bg-white border-zinc-200 text-black h-12 rounded-xl"
                                        placeholder="Add a feature (e.g. Panoramic Roof)..."
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddFeature();
                                            }
                                        }}
                                    />
                                    <Button type="button" onClick={handleAddFeature}
                                            className="bg-zinc-950 text-white hover:bg-zinc-900 rounded-xl h-12 px-6">Add</Button>
                                </div>
                            </div>
                        </div>

                        {/* Search Tags Array */}
                        <div className="space-y-4">
                            <Label className="font-bold text-lg flex items-center gap-2">
                                <Hash size={20} className="text-zinc-400"/> Search & Filtration Tags
                            </Label>
                            <p className="text-sm text-zinc-500">Add metadata keywords to help customers filter and
                                search (e.g. SUV, Off-Road, Family).</p>
                            <div className="p-8 bg-zinc-50 rounded-[2.5rem] space-y-6 border border-zinc-200">
                                <div className="flex flex-wrap gap-2">
                                    {searchTags.map(tag => (
                                        <Badge key={tag}
                                               className="bg-zinc-200 text-zinc-800 hover:bg-zinc-300 border-transparent px-4 py-2 rounded-full gap-2 transition-colors cursor-default">
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => setSearchTags(searchTags.filter(t => t !== tag))}
                                                className="focus:outline-none flex items-center justify-center rounded-full hover:bg-red-200 p-0.5 transition-colors"
                                            >
                                                <Trash2 size={12} className="text-zinc-500 hover:text-red-600"/>
                                            </button>
                                        </Badge>
                                    ))}
                                    {searchTags.length === 0 &&
                                        <p className="text-zinc-400 text-sm italic">No search tags added yet...</p>}
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        value={newSearchTag}
                                        onChange={(e) => setNewSearchTag(e.target.value)}
                                        className="bg-white border-zinc-200 text-black h-12 rounded-xl"
                                        placeholder="Add a tag (e.g. JDM)..."
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddSearchTag();
                                            }
                                        }}
                                    />
                                    <Button type="button" onClick={handleAddSearchTag}
                                            className="bg-black text-white hover:bg-zinc-800 rounded-xl h-12 px-6">Add
                                        Tag</Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-black/5 rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="bg-amber-50 text-amber-600 p-4 rounded-2xl"><Globe size={28}/></div>
                            <h3 className="text-2xl font-bold">International Pricing Matrix</h3>
                        </div>

                        <div className="space-y-6">
                            {/* Price Table Headings */}
                            <div className="grid grid-cols-12 gap-4 px-4 text-[10px] font-black uppercase text-zinc-400">
                                <div className="col-span-4">Country</div>
                                <div className="col-span-2">Currency</div>
                                <div className="col-span-3">Amount</div>
                                <div className="col-span-2">Type</div>
                                <div className="col-span-1"></div>
                            </div>

                            {/* Existing Prices */}
                            {pricing.map((p, idx) => (
                                <div key={idx} className="grid grid-cols-12 gap-4 items-center bg-zinc-50 p-3 rounded-2xl border border-black/5">
                                    <div className="col-span-4 font-bold text-sm">{p.country}</div>
                                    <div className="col-span-2 text-zinc-500 text-sm">{p.currency}</div>
                                    <div className="col-span-3 font-mono font-bold">{p.amount.toLocaleString()}</div>
                                    <div className="col-span-2">
                                        <Badge variant="outline" className="bg-white">{p.type}</Badge>
                                    </div>
                                    <div className="col-span-1 flex justify-end">
                                        <Button variant="ghost" size="icon" onClick={() => removePrice(idx)} className="text-zinc-400 hover:text-red-500">
                                            <Trash2 size={16}/>
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {/* Add New Price Row */}
                            <div className="grid grid-cols-12 gap-4 items-end bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 mt-4">
                                <div className="col-span-4 space-y-2">
                                    <Label className="text-[10px] font-bold uppercase">Destination</Label>
                                    <Input
                                        list="country-list"
                                        placeholder="Select Country"
                                        value={newPrice.country}
                                        onChange={(e) => setNewPrice({...newPrice, country: e.target.value})}
                                        className="bg-white rounded-xl"
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label className="text-[10px] font-bold uppercase">Curr.</Label>
                                    <Input
                                        placeholder="USD"
                                        value={newPrice.currency}
                                        onChange={(e) => setNewPrice({...newPrice, currency: e.target.value})}
                                        className="bg-white rounded-xl"
                                    />
                                </div>
                                <div className="col-span-3 space-y-2">
                                    <Label className="text-[10px] font-bold uppercase">Price</Label>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={newPrice.amount}
                                        onChange={(e) => setNewPrice({...newPrice, amount: e.target.value})}
                                        className="bg-white rounded-xl"
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label className="text-[10px] font-bold uppercase">Basis</Label>
                                    <Select value={newPrice.type} onValueChange={(v) => setNewPrice({...newPrice, type: v})}>
                                        <SelectTrigger className="bg-white rounded-xl"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CIF">CIF</SelectItem>
                                            <SelectItem value="FOB">FOB</SelectItem>
                                            <SelectItem value="Landed">Landed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-1">
                                    <Button onClick={handleAddPrice} className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
                                        Add
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- CUSTOM SPEC DATA & VALUE POINTS SECTION --- */}
                    <div className="bg-white border border-black/5 rounded-[3rem] p-10 shadow-sm space-y-12">

                        {/* 1. Custom Data Engine */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-zinc-100 text-zinc-800 p-4 rounded-2xl">
                                    <Settings2 size={28} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">Custom Specific Data</h3>
                                    <p className="text-sm text-zinc-500">Add unique parameters not found globally (e.g., "4L Engine" or "Special Edition Color").</p>
                                </div>
                            </div>

                            {/* Render Custom Specs */}
                            <div className="space-y-3">
                                {(specData.customData || []).map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center bg-zinc-50 p-4 rounded-2xl border border-black/5">
                                        <div>
                                            <span className="text-xs font-black uppercase text-zinc-400 block">{item.label}</span>
                                            <span className="font-semibold text-zinc-900">{item.value}</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setIsDirty(true);
                                                setSpecData(prev => ({ ...prev, customData: prev.customData.filter((_, i) => i !== idx) }));
                                            }}
                                            className="text-zinc-400 hover:text-red-500"
                                        >
                                            <Trash2 size={16}/>
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            {/* Add Custom Spec Form Row */}
                            <div className="flex flex-col sm:flex-row gap-4 p-6 bg-zinc-50 rounded-[2rem] border border-zinc-200">
                                <div className="flex-1 space-y-2">
                                    <Label className="text-[10px] font-bold uppercase">Metric Label</Label>
                                    <Input
                                        placeholder="e.g. Engine Variant"
                                        value={newCustomLabel}
                                        onChange={(e) => setNewCustomLabel(e.target.value)}
                                        className="bg-white rounded-xl h-11"
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <Label className="text-[10px] font-bold uppercase">Value / Description</Label>
                                    <Input
                                        placeholder="e.g. 4.0L V8 Twin-Turbo"
                                        value={newCustomValue}
                                        onChange={(e) => setNewCustomValue(e.target.value)}
                                        className="bg-white rounded-xl h-11"
                                    />
                                </div>
                                <div className="sm:self-end">
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            if (!newCustomLabel.trim() || !newCustomValue.trim()) return;
                                            setIsDirty(true);
                                            setSpecData(prev => ({
                                                ...prev,
                                                customData: [...(prev.customData || []), { label: newCustomLabel.trim(), value: newCustomValue.trim() }]
                                            }));
                                            setNewCustomLabel("");
                                            setNewCustomValue("");
                                        }}
                                        className="bg-black text-white rounded-xl h-11 px-6 w-full"
                                    >
                                        Add Metric
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <hr className="border-black/5" />

                        {/* 2. Providence Value Points Engine */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-amber-50 text-amber-600 p-4 rounded-2xl">
                                    <Zap size={28} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">Providence Value Points</h3>
                                    <p className="text-sm text-zinc-500">Highlight unique structural advantages (e.g., tax loop-holes, regional financial savings).</p>
                                </div>
                            </div>

                            {/* Render Value Points */}
                            <div className="space-y-4">
                                {(specData.valuePoints || []).map((point: any, idx: number) => (
                                    <div key={idx} className="bg-zinc-50 p-6 rounded-3xl border border-black/5 relative group">
                                        <button
                                            onClick={() => {
                                                setIsDirty(true);
                                                setSpecData(prev => ({ ...prev, valuePoints: prev.valuePoints.filter((_, i) => i !== idx) }));
                                            }}
                                            className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <h4 className="text-lg font-bold text-zinc-900 mb-2">### {point.title}</h4>
                                        <p className="text-sm text-zinc-600 leading-relaxed">{point.description}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Add Value Point Entry Area */}
                            <div className="p-6 bg-blue-50/40 rounded-[2rem] border border-blue-100 space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase">Value Hook Heading (H3)</Label>
                                    <Input
                                        placeholder="e.g. Lowest VAT in Ireland"
                                        value={newValueTitle}
                                        onChange={(e) => setNewValueTitle(e.target.value)}
                                        className="bg-white rounded-xl h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase">Contextual Narrative Description</Label>
                                    <Textarea
                                        placeholder="Since this model from Japan qualifies criteria 1, 2, and 3..."
                                        value={newValueDesc}
                                        onChange={(e) => setNewValueDesc(e.target.value)}
                                        className="bg-white rounded-2xl min-h-[80px]"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            if (!newValueTitle.trim() || !newValueDesc.trim()) return;
                                            setIsDirty(true);
                                            setSpecData(prev => ({
                                                ...prev,
                                                valuePoints: [...(prev.valuePoints || []), { title: newValueTitle.trim(), description: newValueDesc.trim() }]
                                            }));
                                            setNewValueTitle("");
                                            setNewValueDesc("");
                                        }}
                                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-8"
                                    >
                                        Add Value Advantage
                                    </Button>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default function AdvancedSpecSheetBuilder() {
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2
            className="animate-spin text-zinc-400" size={32}/></div>}>
            <SpecBuilderContent/>
        </Suspense>
    );
}