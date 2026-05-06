"use client";

import {Suspense, useEffect, useState} from "react";
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
import {uploadDossierImages} from "@/lib/file-actions";
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

const initialSpecData = {
    make: "",
    model: "",
    year: "",
    trim: "",
    countryOfOrigin: "Japan",
    engineConfig: "",
    displacement: "",
    maxPower: "",
    maxTorque: "",
    transmission: "",
    fuelSystem: "Petrol",
    upholstery: "",
    infotainment: "",
    notes: "",
    emissions: "",
    steering: "RHD",
    status: "Draft"
};

function SpecBuilderContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const editId = searchParams.get("editId");

    const [isPrinting, setIsPrinting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Core Data
    const [specData, setSpecData] = useState(initialSpecData);

    // Tagging Systems
    const [features, setFeatures] = useState<string[]>([]);
    const [newFeature, setNewFeature] = useState("");
    const [searchTags, setSearchTags] = useState<string[]>([]);
    const [newSearchTag, setNewSearchTag] = useState("");

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
                    setSpecData(res.data);
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
        setSpecData(prev => ({...prev, [field]: value}));
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setPendingFiles(prev => [...prev, ...filesArray]);
            setPreviewUrls(prev => [...prev, ...filesArray.map(f => URL.createObjectURL(f))]);
        }
    };

    const removeExistingImage = (urlToRemove: string) => setExistingImages(prev => prev.filter(url => url !== urlToRemove));
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

        try {
            let finalImageUrls = [...existingImages];

            if (pendingFiles.length > 0) {
                const formData = new FormData();
                pendingFiles.forEach(file => formData.append("files", file));
                const uploadRes = await uploadDossierImages(formData);
                if (uploadRes.success && uploadRes.uploadedUrls) {
                    finalImageUrls = [...finalImageUrls, ...uploadRes.uploadedUrls];
                } else throw new Error("Failed to upload images.");
            }

            const payload = {...specData, features, searchTags, images: finalImageUrls};
            const result = await saveSpecDossier(payload);

            if (result.success) {
                alert(editId ? "Dossier Template Updated!" : "New Dossier Template Created!");
                router.push("/admin/dossiers");
            } else {
                alert(result.message);
            }
        } catch (err: any) {
            alert(err.message || "An unexpected error occurred.");
        } finally {
            setIsSaving(false);
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
                </div>

                {/* --- MAIN COLUMN --- */}
                <div className="lg:col-span-8 space-y-10">

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
                            <div className="p-8 bg-zinc-950 rounded-[2.5rem] space-y-6">
                                <div className="flex flex-wrap gap-2">
                                    {features.map(tag => (
                                        <Badge key={tag}
                                               className="bg-white/10 text-white hover:bg-white/20 border-transparent px-4 py-2 rounded-full gap-2 transition-colors cursor-default">
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => setFeatures(features.filter(t => t !== tag))}
                                                className="focus:outline-none flex items-center justify-center rounded-full hover:bg-red-500/50 p-0.5 transition-colors"
                                            >
                                                <Trash2 size={12} className="text-zinc-300 hover:text-white"/>
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
                                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                                        placeholder="Add a feature (e.g. Panoramic Roof)..."
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddFeature();
                                            }
                                        }}
                                    />
                                    <Button type="button" onClick={handleAddFeature}
                                            className="bg-white text-black hover:bg-zinc-200 rounded-xl h-12 px-6">Add</Button>
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

                    {/* Final Status & Notes */}
                    <div
                        className="bg-white border border-black/5 rounded-[3rem] p-10 shadow-sm flex flex-col md:flex-row gap-10">
                        <div className="flex-1 space-y-4">
                            <Label className="font-bold flex items-center gap-2"><Info size={18}/> Additional Template
                                Notes</Label>
                            <Textarea
                                placeholder="Internal notes regarding this specific vehicle blueprint..."
                                value={specData.notes}
                                onChange={(e) => handleInputChange("notes", e.target.value)}
                                className="min-h-[150px] rounded-[2rem] bg-zinc-50 border-transparent p-6 focus:bg-white transition-all"
                            />
                        </div>
                        <div className="w-full md:w-64 space-y-4">
                            <Label className="font-bold">Template Status</Label>
                            <Select value={specData.status} onValueChange={(v) => handleInputChange("status", v)}>
                                <SelectTrigger className="h-12 rounded-xl"><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Draft">Draft</SelectItem>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 mt-4">
                                <p className="text-[10px] text-amber-700 font-bold leading-tight flex gap-2">
                                    <ShieldCheck size={14} className="shrink-0"/>
                                    Drafts cannot be assigned to concrete vehicles.
                                </p>
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