"use client";

import { useState } from "react";
import {
    FileText, Plus, Printer, Save, Car, Settings2, Zap, ShieldCheck,
    Globe, Trash2, Loader2, PlusCircle
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
// We will import our server action here later
// import { saveSpecDossier } from "@/actions/spec-actions";

const initialSpecData = {
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
    fuelSystem: "",
    // Interior & Tech
    upholstery: "",
    infotainment: "",
    notes: "",
    // Compliance
    auctionGrade: "S",
    emissions: "",
    steering: "RHD"
};

export default function AdvancedSpecSheetBuilder() {
    const [isSaving, setIsSaving] = useState(false);
    const [sourceType, setSourceType] = useState<"scratch" | "preset">("scratch");

    // Core Form State
    const [specData, setSpecData] = useState(initialSpecData);

    // Dynamic Tags State
    const [tags, setTags] = useState<string[]>(["Apple CarPlay", "Adaptive Cruise"]);
    const [newTag, setNewTag] = useState("");

    // --- HANDLERS ---

    const handleInputChange = (field: keyof typeof initialSpecData, value: string) => {
        setSpecData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            setTags(prev => [...prev, newTag.trim()]);
            setNewTag(""); // Clear input after adding
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(prev => prev.filter(t => t !== tagToRemove));
    };

    const handleSaveDossier = async () => {
        setIsSaving(true);
        try {
            // Combine the base data with our dynamic tags array
            const finalPayload = {
                ...specData,
                features: tags
            };

            console.log("Saving payload to DB:", finalPayload);
            // TODO: Await server action here
            // const res = await saveSpecDossier(finalPayload);

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert("Dossier Saved Successfully!");

        } catch (error) {
            console.error("Failed to save:", error);
            alert("Error saving dossier.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-6 lg:p-10 space-y-10 max-w-[1400px] mx-auto pb-24">

            {/* HEADER ACTIONS */}
            <div className="sticky top-0 z-40 bg-zinc-50/80 backdrop-blur-md border-b border-black/5 pb-6 mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-black">Master Spec Builder</h1>
                    <p className="text-zinc-500 font-medium">Providence Auto | Professional Export Dossier Generation</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-2xl gap-2 h-12 px-6">
                        <Printer size={20} /> Preview & Print
                    </Button>
                    <Button onClick={handleSaveDossier} disabled={isSaving} className="rounded-2xl gap-2 bg-black text-white h-12 px-8">
                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Finalize & Save
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* --- LEFT SIDEBAR --- */}
                <div className="lg:col-span-4 space-y-8">

                    {/* Provenance */}
                    <section className="bg-white border border-black/5 rounded-[2.5rem] p-8 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 font-bold text-black border-b border-black/5 pb-5">
                            <Globe size={20} className="text-blue-500" /> Provenance & History
                        </div>
                        <div className="grid gap-5">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Country of Origin</Label>
                                <Select value={specData.countryOfOrigin} onValueChange={(val) => handleInputChange("countryOfOrigin", val)}>
                                    <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="japan">Japan (JDM)</SelectItem>
                                        <SelectItem value="uk">United Kingdom</SelectItem>
                                        <SelectItem value="uae">UAE (GCC Spec)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Mileage (km)</Label>
                                    <Input type="number" value={specData.mileage} onChange={(e) => handleInputChange("mileage", e.target.value)} className="h-11 rounded-xl" placeholder="42000" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Service History</Label>
                                    <Select value={specData.serviceHistory} onValueChange={(val) => handleInputChange("serviceHistory", val)}>
                                        <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="full">Full Agency</SelectItem>
                                            <SelectItem value="partial">Partial</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Identification */}
                    <section className="bg-zinc-900 text-white rounded-[2.5rem] p-8 shadow-xl space-y-6">
                        <div className="flex items-center gap-3 font-bold border-b border-white/10 pb-5">
                            <Car size={20} className="text-zinc-400" /> Vehicle Identification
                        </div>
                        <div className="grid gap-5">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">VIN / Chassis Number</Label>
                                <Input value={specData.vin} onChange={(e) => handleInputChange("vin", e.target.value)} className="bg-white/10 border-white/10 text-white h-11 rounded-xl" placeholder="JTEBX123..." />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Engine Number</Label>
                                <Input value={specData.engineNumber} onChange={(e) => handleInputChange("engineNumber", e.target.value)} className="bg-white/10 border-white/10 text-white h-11 rounded-xl" placeholder="1VD-FTV..." />
                            </div>
                        </div>
                    </section>
                </div>

                {/* --- MAIN TECHNICAL AREA --- */}
                <div className="lg:col-span-8 space-y-10">

                    {/* Mechanics */}
                    <div className="bg-white border border-black/5 rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="bg-emerald-50 text-emerald-600 p-4 rounded-[1.5rem]"><Zap size={28} /></div>
                            <div>
                                <h3 className="text-2xl font-bold">Mechanics</h3>
                                <p className="text-zinc-500">Powertrain and Drivetrain Details</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Example Input Wiring */}
                            <div className="space-y-2">
                                <Label className="font-bold">Engine Configuration</Label>
                                <Input value={specData.engineConfig} onChange={(e) => handleInputChange("engineConfig", e.target.value)} className="rounded-2xl h-12 bg-zinc-50/50" placeholder="V6 Twin-Turbo" />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold">Max Power</Label>
                                <Input value={specData.maxPower} onChange={(e) => handleInputChange("maxPower", e.target.value)} className="rounded-2xl h-12 bg-zinc-50/50" placeholder="304 HP" />
                            </div>
                            {/* Add other inputs matching this pattern... */}
                        </div>
                    </div>

                    {/* Features & Tags Builder */}
                    <div className="bg-white border border-black/5 rounded-[3rem] p-10 shadow-sm">
                        <div className="space-y-3">
                            <Label className="font-bold">Key Options & Features</Label>
                            <div className="p-6 bg-zinc-50 rounded-[2rem] border border-black/5 space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag) => (
                                        <Badge key={tag} className="bg-white text-black border-black/5 rounded-full px-4 py-2 flex items-center gap-2">
                                            {tag}
                                            <Trash2 onClick={() => handleRemoveTag(tag)} size={14} className="cursor-pointer text-red-400 hover:text-red-600" />
                                        </Badge>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                        placeholder="Add a feature (e.g. Panoramic Roof) and press Enter"
                                        className="rounded-xl h-10 border-black/10"
                                    />
                                    <Button type="button" onClick={handleAddTag} variant="outline" className="rounded-xl px-4">Add</Button>
                                </div>
                                <Separator className="bg-black/5" />
                                <Textarea value={specData.notes} onChange={(e) => handleInputChange("notes", e.target.value)} className="bg-transparent border-0 resize-none min-h-[100px]" placeholder="Additional notes..." />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}