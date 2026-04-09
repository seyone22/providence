"use client";

import {Suspense, useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {
    Armchair,
    Car,
    Globe,
    ImagePlus,
    Info,
    Loader2,
    Printer,
    Save,
    Settings2,
    ShieldCheck,
    Tag,
    Trash2,
    X,
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
import {getSpecDossierByVin, saveSpecDossier} from "@/actions/spec-actions";
import {SpecSection} from "@/components/SpecSection";
import {uploadDossierImages} from "@/lib/file-actions";
import {generateDossierPdfAction} from "@/actions/pdf-actions";

const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://pub-0c6552f09f244121ac51914a1f782578.r2.dev";

const initialSpecData = {
    // Basics
    make: "",
    model: "",
    year: "",
    trim: "",
    color: "",
    price: "",
    // Provenance
    countryOfOrigin: "japan",
    mileage: "",
    serviceHistory: "full",
    owners: "",
    // Identification
    vin: "",
    engineNumber: "",
    // Mechanics
    engineConfig: "",
    displacement: "",
    maxPower: "",
    maxTorque: "",
    transmission: "",
    fuelSystem: "Petrol",
    // Interior & Tech
    upholstery: "",
    infotainment: "",
    notes: "",
    // Compliance
    auctionGrade: "S",
    emissions: "",
    steering: "RHD",
    // Metadata
    status: "Draft"
};

function SpecBuilderContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const editVin = searchParams.get("vin");

    const [isPrinting, setIsPrinting] = useState(false);

    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Core Data
    const [specData, setSpecData] = useState(initialSpecData);
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState("");

    // Image Management State
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    // Helper to safely resolve R2 image URLs
    const getImageUrl = (path: string) => {
        if (!path) return "";
        if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("blob:")) {
            return path;
        }
        const base = R2_PUBLIC_URL.replace(/\/$/, "");
        const cleanPath = path.replace(/^\//, "");
        return `${base}/${cleanPath}`;
    };

    // 1. Fetch data if in Edit Mode
    useEffect(() => {
        if (editVin) {
            const loadDossier = async () => {
                setIsLoading(true);
                const res = await getSpecDossierByVin(editVin);
                if (res.success && res.data) {
                    setSpecData(res.data);
                    setTags(res.data.features || []);
                    setExistingImages(res.data.images || []);
                } else {
                    alert("Dossier not found or error fetching.");
                }
                setIsLoading(false);
            };
            loadDossier();
        }
    }, [editVin]);

    const handlePrint = async () => {
        if (!editVin) {
            return alert("Please save the dossier first before generating a PDF.");
        }

        setIsPrinting(true);
        try {
            const res = await generateDossierPdfAction(editVin);

            if (res.success && res.pdfBase64) {
                // Convert base64 to Blob
                const byteCharacters = atob(res.pdfBase64);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/pdf' });

                // Create a temporary URL and trigger download/view
                const blobUrl = URL.createObjectURL(blob);

                // To open in a new tab:
                window.open(blobUrl, '_blank');

                // OR to force download:
                // const link = document.createElement('a');
                // link.href = blobUrl;
                // link.download = res.fileName || 'Dossier.pdf';
                // link.click();

                // Cleanup
                setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
            } else {
                alert(res.message || "Failed to generate PDF.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while generating the PDF.");
        } finally {
            setIsPrinting(false);
        }
    };

    const handleInputChange = (field: keyof typeof initialSpecData, value: string) => {
        setSpecData(prev => ({...prev, [field]: value}));
    };

    // Image Handlers
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setPendingFiles(prev => [...prev, ...filesArray]);

            const newPreviews = filesArray.map(f => URL.createObjectURL(f));
            setPreviewUrls(prev => [...prev, ...newPreviews]);
        }
    };

    const removeExistingImage = (urlToRemove: string) => {
        setExistingImages(prev => prev.filter(url => url !== urlToRemove));
    };

    const removePendingFile = (index: number) => {
        setPendingFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    // Save Flow
    const handleSave = async () => {
        if (!specData.vin) return alert("VIN is required.");
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
                } else {
                    throw new Error("Failed to upload images to R2.");
                }
            }

            const payload = {...specData, features: tags, images: finalImageUrls};
            const result = await saveSpecDossier(payload);

            if (result.success) {
                alert(editVin ? "Dossier Updated!" : "New Dossier Created!");
                router.push("/admin/dossiers");
            } else {
                alert(result.message);
            }
        } catch (err: any) {
            console.error(err);
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
            {/* HEADER */}
            <header
                className="sticky top-0 z-40 bg-zinc-50/80 backdrop-blur-md border-b border-black/5 pb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">{editVin ? "Edit Dossier" : "Master Spec Builder"}</h1>
                    <p className="text-zinc-500 mt-1">{editVin ? `Editing Chassis: ${editVin}` : "Create New Vehicle Record"}</p>
                </div>


                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={handlePrint}
                        disabled={isPrinting}
                        className="rounded-2xl h-12 px-6"
                    >
                        {isPrinting ? <Loader2 className="animate-spin mr-2" size={20} /> : <Printer size={20} className="mr-2" />}
                        {isPrinting ? "Generating..." : "Print PDF"}
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}
                            className="rounded-2xl gap-2 bg-black text-white h-12 px-8 shadow-xl shadow-black/10">
                        {isSaving ? <Loader2 className="animate-spin"/> : <Save/>}
                        {editVin ? "Update Record" : "Save Dossier"}
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* --- SIDEBAR (PROVENANCE & ID) --- */}
                <div className="lg:col-span-4 space-y-8">

                    <SpecSection title="Identification" icon={Car} dark>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-zinc-500">VIN / Chassis
                                    Number</Label>
                                <Input
                                    placeholder="REQUIRED"
                                    className="bg-white/10 border-white/10 h-11 text-white font-mono"
                                    value={specData.vin}
                                    disabled={!!editVin}
                                    onChange={(e) => handleInputChange("vin", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-zinc-500">Engine Number</Label>
                                <Input
                                    placeholder="1VD-FTV..."
                                    className="bg-white/10 border-white/10 h-11 text-white"
                                    value={specData.engineNumber}
                                    onChange={(e) => handleInputChange("engineNumber", e.target.value)}
                                />
                            </div>
                        </div>
                    </SpecSection>

                    <SpecSection title="Provenance & History" icon={Globe}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-zinc-400">Country of
                                    Origin</Label>
                                <Select value={specData.countryOfOrigin}
                                        onValueChange={(v) => handleInputChange("countryOfOrigin", v)}>
                                    <SelectTrigger className="rounded-xl h-11"><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="japan">Japan (JDM)</SelectItem>
                                        <SelectItem value="uk">United Kingdom</SelectItem>
                                        <SelectItem value="uae">UAE (GCC)</SelectItem>
                                        <SelectItem value="usa">USA</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-zinc-400">Mileage</Label>
                                    <Input value={specData.mileage}
                                           onChange={(e) => handleInputChange("mileage", e.target.value)}
                                           className="h-11 rounded-xl" placeholder="e.g. 12,500km"/>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-zinc-400">Owners</Label>
                                    <Input value={specData.owners}
                                           onChange={(e) => handleInputChange("owners", e.target.value)}
                                           className="h-11 rounded-xl" placeholder="1"/>
                                </div>
                            </div>
                        </div>
                    </SpecSection>

                    <SpecSection title="Compliance & Grade" icon={ShieldCheck}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-zinc-400">Auction Grade</Label>
                                <Input value={specData.auctionGrade}
                                       onChange={(e) => handleInputChange("auctionGrade", e.target.value)}
                                       className="h-11 rounded-xl" placeholder="S / 4.5 / 5"/>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-zinc-400">Steering</Label>
                                <Select value={specData.steering}
                                        onValueChange={(v) => handleInputChange("steering", v)}>
                                    <SelectTrigger className="rounded-xl h-11"><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="RHD">Right Hand (RHD)</SelectItem>
                                        <SelectItem value="LHD">Left Hand (LHD)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </SpecSection>
                </div>

                {/* --- MAIN COLUMN (OVERVIEW, IMAGES, MECHANICS & INTERIOR) --- */}
                <div className="lg:col-span-8 space-y-10">

                    {/* NEW: Vehicle Overview Section */}
                    <div
                        className="bg-white border border-black/5 rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl"><Tag size={28}/></div>
                            <h3 className="text-2xl font-bold">Vehicle Overview</h3>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
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
                                <Label className="font-bold text-zinc-700">Year</Label>
                                <Input value={specData.year} onChange={(e) => handleInputChange("year", e.target.value)}
                                       className="rounded-xl h-12 bg-zinc-50" placeholder="e.g. 2024"/>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-zinc-700">Trim / Edition</Label>
                                <Input value={specData.trim} onChange={(e) => handleInputChange("trim", e.target.value)}
                                       className="rounded-xl h-12 bg-zinc-50" placeholder="e.g. GR Sport"/>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-zinc-700">Exterior Color</Label>
                                <Input value={specData.color}
                                       onChange={(e) => handleInputChange("color", e.target.value)}
                                       className="rounded-xl h-12 bg-zinc-50" placeholder="e.g. Precious White"/>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-zinc-700">Listing Price</Label>
                                <Input value={specData.price}
                                       onChange={(e) => handleInputChange("price", e.target.value)}
                                       className="rounded-xl h-12 bg-zinc-50 border-emerald-200 focus:border-emerald-500"
                                       placeholder="e.g. $115,000 / POA"/>
                            </div>
                        </div>
                    </div>

                    {/* Image Gallery Builder */}
                    <div className="bg-white border border-black/5 rounded-[3rem] p-10 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-purple-50 text-purple-600 p-4 rounded-2xl"><ImagePlus size={28}/></div>
                            <div>
                                <h3 className="text-2xl font-bold">Vehicle Gallery</h3>
                                <p className="text-zinc-500 font-medium text-sm">Upload high-res photos for the public
                                    dossier.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {existingImages.map((url) => (
                                <div key={url}
                                     className="relative aspect-video bg-zinc-100 rounded-2xl overflow-hidden group">
                                    <img src={getImageUrl(url)} alt="Dossier image"
                                         className="w-full h-full object-cover"/>
                                    <button onClick={() => removeExistingImage(url)}
                                            className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500">
                                        <X size={14}/>
                                    </button>
                                </div>
                            ))}

                            {previewUrls.map((url, index) => (
                                <div key={url}
                                     className="relative aspect-video bg-zinc-100 rounded-2xl overflow-hidden group border-2 border-dashed border-purple-400">
                                    <img src={url} alt="Pending upload"
                                         className="w-full h-full object-cover opacity-70"/>
                                    <span
                                        className="absolute bottom-2 left-2 bg-purple-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">Pending</span>
                                    <button onClick={() => removePendingFile(index)}
                                            className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500">
                                        <X size={14}/>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div
                            className="relative border-2 border-dashed border-zinc-200 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center hover:bg-zinc-50 transition-colors">
                            <Input type="file" multiple accept="image/*" onChange={handleFileSelect}
                                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
                            <ImagePlus size={40} className="text-zinc-300 mb-4"/>
                            <p className="font-bold text-lg">Drag & Drop Images Here</p>
                            <p className="text-zinc-400 text-sm mt-1">or click to browse from your device</p>
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

                    {/* Interior & Tech Section */}
                    <div className="bg-white border border-black/5 rounded-[3rem] p-10 shadow-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl"><Armchair size={28}/></div>
                            <h3 className="text-2xl font-bold">Interior & Technology</h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <Label className="font-bold">Upholstery & Material</Label>
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

                        <div className="mt-10 space-y-4">
                            <Label className="font-bold text-lg flex items-center gap-2">
                                <Settings2 size={20} className="text-zinc-400"/> Key Features & Options
                            </Label>
                            <div className="p-8 bg-zinc-950 rounded-[2.5rem] space-y-6">
                                <div className="flex flex-wrap gap-2">
                                    {tags.map(tag => (
                                        <Badge key={tag}
                                               className="bg-white/10 text-white hover:bg-red-500/20 border-transparent px-4 py-2 rounded-full gap-2 transition-colors cursor-default">
                                            {tag}
                                            <Trash2 size={12} className="text-zinc-500 cursor-pointer hover:text-white"
                                                    onClick={() => setTags(tags.filter(t => t !== tag))}/>
                                        </Badge>
                                    ))}
                                    {tags.length === 0 &&
                                        <p className="text-zinc-600 text-sm italic">No features added yet...</p>}
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                                        placeholder="Add a feature (e.g. Panoramic Roof)..."
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                setTags([...tags, newTag]);
                                                setNewTag("");
                                            }
                                        }}
                                    />
                                    <Button type="button" onClick={() => {
                                        setTags([...tags, newTag]);
                                        setNewTag("");
                                    }}
                                            className="bg-white text-black hover:bg-zinc-200 rounded-xl h-12 px-6">Add</Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Final Status & Notes */}
                    <div
                        className="bg-white border border-black/5 rounded-[3rem] p-10 shadow-sm flex flex-col md:flex-row gap-10">
                        <div className="flex-1 space-y-4">
                            <Label className="font-bold flex items-center gap-2"><Info size={18}/> Additional
                                Notes</Label>
                            <Textarea
                                placeholder="Write any extra details for the export dossier..."
                                value={specData.notes}
                                onChange={(e) => handleInputChange("notes", e.target.value)}
                                className="min-h-[150px] rounded-[2rem] bg-zinc-50 border-transparent p-6 focus:bg-white transition-all"
                            />
                        </div>
                        <div className="w-full md:w-64 space-y-4">
                            <Label className="font-bold">Dossier Status</Label>
                            <Select value={specData.status} onValueChange={(v) => handleInputChange("status", v)}>
                                <SelectTrigger className="h-12 rounded-xl"><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Draft">Draft</SelectItem>
                                    <SelectItem value="Published">Published</SelectItem>
                                    <SelectItem value="Sold">Sold / Archived</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 mt-4">
                                <p className="text-[10px] text-amber-700 font-bold leading-tight flex gap-2">
                                    <ShieldCheck size={14} className="shrink-0"/>
                                    Drafts are not visible on the public inventory portal.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

// Wrap in Suspense because of useSearchParams
export default function AdvancedSpecSheetBuilder() {
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2
            className="animate-spin text-zinc-400" size={32}/></div>}>
            <SpecBuilderContent/>
        </Suspense>
    );
}