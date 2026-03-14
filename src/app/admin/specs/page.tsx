"use client";

import { useState } from "react";
import {
    FileText, Plus, Printer, Save, Car, Settings2, Zap, ShieldCheck,
    Search, Globe, History, Gauge, MapPin, ClipboardList, Info, AlertTriangle,
    CheckCircle2, Loader2, PlusCircle, Trash2
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";

export default function AdvancedSpecSheetBuilder() {
    const [isSaving, setIsSaving] = useState(false);
    const [sourceType, setSourceType] = useState<"scratch" | "preset">("scratch");
    const [tags, setTags] = useState(["Apple CarPlay", "Adaptive Cruise", "Panoramic Roof"]);

    return (
        <div className="p-6 lg:p-10 space-y-10 max-w-[1400px] mx-auto pb-24">

            {/* STICKY HEADER ACTIONS */}
            <div className="sticky top-0 z-40 bg-zinc-50/80 backdrop-blur-md border-b border-black/5 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-black">Master Spec Builder</h1>
                    <p className="text-zinc-500 font-medium">Providence Auto | Professional Export Dossier Generation</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-2xl gap-2 border-black/10 bg-white h-12 px-6 hover:bg-zinc-50 transition-all shadow-sm">
                        <Printer size={20} /> Preview & Print
                    </Button>
                    <Button onClick={() => setIsSaving(true)} className="rounded-2xl gap-2 bg-black text-white h-12 px-8 hover:bg-zinc-800 transition-all shadow-lg shadow-black/10">
                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Finalize & Save
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* LEFT SIDEBAR: CORE METRICS (4 Cols) */}
                <div className="lg:col-span-4 space-y-8">

                    {/* 1. CONFIGURATION */}
                    <section className="bg-white border border-black/5 rounded-[2.5rem] p-8 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 font-bold text-black border-b border-black/5 pb-5">
                            <Settings2 size={20} className="text-zinc-400" />
                            Dossier Configuration
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-2 p-1.5 bg-zinc-100 rounded-2xl">
                                <button onClick={() => setSourceType("scratch")} className={`py-2.5 text-xs font-bold rounded-xl transition-all ${sourceType === "scratch" ? "bg-white shadow-sm text-black" : "text-zinc-500 hover:text-zinc-700"}`}>Manual Entry</button>
                                <button onClick={() => setSourceType("preset")} className={`py-2.5 text-xs font-bold rounded-xl transition-all ${sourceType === "preset" ? "bg-white shadow-sm text-black" : "text-zinc-500 hover:text-zinc-700"}`}>From Inventory</button>
                            </div>
                            {sourceType === "preset" && (
                                <Select>
                                    <SelectTrigger className="rounded-xl border-black/10 h-12 bg-zinc-50">
                                        <SelectValue placeholder="Search Inventory..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Toyota Land Cruiser 300 (2024)</SelectItem>
                                        <SelectItem value="2">G63 AMG Magno (2023)</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </section>

                    {/* 2. PROVENANCE & ORIGIN (Used Car Focus) */}
                    <section className="bg-white border border-black/5 rounded-[2.5rem] p-8 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 font-bold text-black border-b border-black/5 pb-5">
                            <Globe size={20} className="text-blue-500" />
                            Provenance & History
                        </div>
                        <div className="grid gap-5">
                            <div className="space-y-2">
                                <Label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Country of Origin</Label>
                                <Select defaultValue="japan">
                                    <SelectTrigger className="h-11 rounded-xl border-black/10"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="japan">Japan (JDM)</SelectItem>
                                        <SelectItem value="uk">United Kingdom</SelectItem>
                                        <SelectItem value="thailand">Thailand</SelectItem>
                                        <SelectItem value="uae">United Arab Emirates (GCC Spec)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Mileage (km)</Label>
                                    <Input type="number" className="h-11 rounded-xl border-black/10" placeholder="e.g. 42000" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Service History</Label>
                                    <Select defaultValue="full">
                                        <SelectTrigger className="h-11 rounded-xl border-black/10"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="full">Full Agency</SelectItem>
                                            <SelectItem value="partial">Partial</SelectItem>
                                            <SelectItem value="none">None/Unknown</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Owners</Label>
                                <Input type="number" className="h-11 rounded-xl border-black/10" placeholder="No. of previous owners" />
                            </div>
                        </div>
                    </section>

                    {/* 3. IDENTIFICATION CARD */}
                    <section className="bg-zinc-900 text-white rounded-[2.5rem] p-8 shadow-xl space-y-6">
                        <div className="flex items-center gap-3 font-bold border-b border-white/10 pb-5">
                            <Car size={20} className="text-zinc-400" />
                            Vehicle Identification
                        </div>
                        <div className="grid gap-5">
                            <div className="space-y-2">
                                <Label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">VIN / Chassis Number</Label>
                                <Input className="bg-white/10 border-white/10 text-white h-11 rounded-xl placeholder:text-zinc-600" placeholder="e.g. JTEBX123..." />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Engine Number</Label>
                                <Input className="bg-white/10 border-white/10 text-white h-11 rounded-xl placeholder:text-zinc-600" placeholder="e.g. 1VD-FTV..." />
                            </div>
                        </div>
                    </section>

                </div>

                {/* MAIN TECHNICAL AREA (8 Cols) */}
                <div className="lg:col-span-8 space-y-10">

                    {/* A. ENGINE & PERFORMANCE */}
                    <div className="bg-white border border-black/5 rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 text-zinc-50 opacity-10"><Zap size={140} /></div>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="bg-emerald-50 text-emerald-600 p-4 rounded-[1.5rem]"><Zap size={28} /></div>
                            <div>
                                <h3 className="text-2xl font-bold text-black">Mechanics</h3>
                                <p className="text-zinc-500">Powertrain, Transmission, and Drivetrain Details</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <Label className="font-bold">Engine Configuration</Label>
                                <Input className="rounded-2xl h-12 border-black/5 bg-zinc-50/50" placeholder="e.g. V6 Twin-Turbo Diesel" />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold">Displacement (cc)</Label>
                                <Input className="rounded-2xl h-12 border-black/5 bg-zinc-50/50" placeholder="e.g. 3346" />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold">Max Power (kW / HP)</Label>
                                <Input className="rounded-2xl h-12 border-black/5 bg-zinc-50/50" placeholder="e.g. 227 kW / 304 HP" />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold">Max Torque (Nm)</Label>
                                <Input className="rounded-2xl h-12 border-black/5 bg-zinc-50/50" placeholder="e.g. 700 Nm" />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold">Transmission Type</Label>
                                <Input className="rounded-2xl h-12 border-black/5 bg-zinc-50/50" placeholder="e.g. 10-Speed Direct Shift" />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold">Fuel System</Label>
                                <Input className="rounded-2xl h-12 border-black/5 bg-zinc-50/50" placeholder="Common Rail Direct Injection" />
                            </div>
                        </div>
                    </div>

                    {/* B. INTERIOR & TECHNOLOGY (Dynamic Tags) */}
                    <div className="bg-white border border-black/5 rounded-[3rem] p-10 shadow-sm">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="bg-blue-50 text-blue-600 p-4 rounded-[1.5rem]"><FileText size={28} /></div>
                            <div>
                                <h3 className="text-2xl font-bold text-black">Interior & Experience</h3>
                                <p className="text-zinc-500">Cabin materials, safety packages, and technology.</p>
                            </div>
                        </div>
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <Label className="font-bold">Upholstery & Materials</Label>
                                    <Input className="rounded-2xl h-12 border-black/5 bg-zinc-50/50" placeholder="e.g. Premium Quilted Semi-Aniline Leather" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold">Infotainment System</Label>
                                    <Input className="rounded-2xl h-12 border-black/5 bg-zinc-50/50" placeholder="e.g. 12.3-inch Multimedia with JBL Audio" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="font-bold">Key Options & Features</Label>
                                <div className="p-6 bg-zinc-50 rounded-[2rem] border border-black/5 space-y-4">
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag) => (
                                            <Badge key={tag} className="bg-white text-black border-black/5 rounded-full px-4 py-2 flex items-center gap-2 shadow-sm">
                                                {tag} <Trash2 size={12} className="cursor-pointer text-zinc-300 hover:text-red-500" />
                                            </Badge>
                                        ))}
                                        <Button variant="ghost" size="sm" className="rounded-full text-zinc-400 gap-1"><PlusCircle size={16}/> Add Feature</Button>
                                    </div>
                                    <Separator className="bg-black/5" />
                                    <Textarea className="bg-transparent border-0 focus-visible:ring-0 resize-none min-h-[100px] text-zinc-600" placeholder="Describe unique features or custom modifications here..." />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* C. EXPORT & COMPLIANCE (Customs focus) */}
                    <div className="bg-white border border-black/10 rounded-[3rem] p-10 shadow-sm border-dashed">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="bg-amber-50 text-amber-600 p-4 rounded-[1.5rem]"><ShieldCheck size={28} /></div>
                            <div>
                                <h3 className="text-2xl font-bold text-black">Export Readiness & Grading</h3>
                                <p className="text-zinc-500">Certification for customs and international clearance.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <Label className="font-bold">Auction/Condition Grade</Label>
                                <Select defaultValue="S">
                                    <SelectTrigger className="h-12 rounded-2xl bg-zinc-50 border-black/5"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="S">Grade S (New)</SelectItem>
                                        <SelectItem value="6">Grade 6 (As New)</SelectItem>
                                        <SelectItem value="5">Grade 5 (Premium)</SelectItem>
                                        <SelectItem value="4.5">Grade 4.5 (V. Good)</SelectItem>
                                        <SelectItem value="R">Grade R (Repaired)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold">Emissions Compliance</Label>
                                <Input className="rounded-2xl h-12 border-black/5 bg-zinc-50/50" placeholder="e.g. Euro 6d-ISC-FCM" />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold">Steering Orientation</Label>
                                <div className="flex items-center gap-4 h-12">
                                    <div className="flex items-center gap-2"><input type="radio" className="accent-black" name="str" /> RHD</div>
                                    <div className="flex items-center gap-2"><input type="radio" className="accent-black" name="str" /> LHD</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}