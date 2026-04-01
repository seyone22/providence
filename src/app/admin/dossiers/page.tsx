"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
    Plus, Search, MoreHorizontal, Car,
    Edit3, Trash2, Globe, Hash, Zap, ExternalLink, Loader2
} from "lucide-react";

// UI Components
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/app/components/ui/table";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {deleteSpecDossier, getAllSpecDossiers} from "@/actions/spec-actions";

// Actions

export default function InventoryPage() {
    const [dossiers, setDossiers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isPending, startTransition] = useTransition();

    // 1. Fetch Data on Mount
    const fetchDossiers = async () => {
        setLoading(true);
        const res = await getAllSpecDossiers();
        if (res.success) setDossiers(res.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchDossiers();
    }, []);

    // 2. Delete Handler
    const handleDelete = async (vin: string) => {
        if (!confirm("Are you sure? This will permanently remove this dossier.")) return;

        startTransition(async () => {
            const res = await deleteSpecDossier(vin);
            if (res.success) {
                setDossiers(prev => prev.filter(d => d.vin !== vin));
            } else {
                alert(res.message);
            }
        });
    };

    // 3. Filter Logic
    const filteredDossiers = dossiers.filter(d =>
        d.vin.toLowerCase().includes(search.toLowerCase()) ||
        d.engineConfig?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 lg:p-10 space-y-8 max-w-[1600px] mx-auto">

            {/* HEADER */}
            <div className="flex justify-between items-end">
                {/* Header Section */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Dossier List</h1>
                    <p className="text-zinc-500 mt-1">Live Dossier Database | Providence Auto</p>
                </div>

                <Link href="/admin/specs">
                    <Button className="rounded-2xl bg-black text-white h-12 px-8 hover:scale-[1.02] transition-transform gap-2">
                        <Plus size={18} /> New Spec Sheet
                    </Button>
                </Link>
            </div>

            {/* SEARCH & STATS STRIP */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                <div className="lg:col-span-8 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <Input
                        placeholder="Filter by VIN or Configuration..."
                        className="pl-12 h-14 rounded-[1.5rem] border-black/5 bg-white shadow-sm focus:ring-black"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="lg:col-span-4 flex gap-4">
                    <div className="flex-1 bg-zinc-900 rounded-[1.5rem] p-4 text-white">
                        <p className="text-[9px] uppercase font-bold text-white tracking-[0.2em]">Active Dossiers</p>
                        <p className="text-2xl font-black italic">{dossiers.length}</p>
                    </div>
                    <div className="flex-1 bg-white border border-black/5 rounded-[1.5rem] p-4">
                        <p className="text-[9px] uppercase font-bold text-zinc-400 tracking-[0.2em]">Pending Drafts</p>
                        <p className="text-2xl font-black italic">--</p>
                    </div>
                </div>
            </div>

            {/* DATA TABLE */}
            <div className="bg-white border border-black/5 rounded-[2.5rem] overflow-hidden shadow-sm min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-[400px] gap-3 text-zinc-400">
                        <Loader2 className="animate-spin" size={32} />
                        <p className="font-medium">Accessing Database...</p>
                    </div>
                ) : filteredDossiers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[400px] text-zinc-400">
                        <Car size={48} strokeWidth={1} className="mb-4 opacity-20" />
                        <p className="font-medium">No dossiers found matching your search.</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-zinc-50/50">
                            <TableRow className="border-black/5 hover:bg-transparent">
                                <TableHead className="py-6 pl-10 text-[11px] font-black uppercase text-zinc-400 tracking-widest">Identification</TableHead>
                                <TableHead className="text-[11px] font-black uppercase text-zinc-400 tracking-widest">Mechanical Spec</TableHead>
                                <TableHead className="text-[11px] font-black uppercase text-zinc-400 tracking-widest">Origin & Compliance</TableHead>
                                <TableHead className="text-[11px] font-black uppercase text-zinc-400 tracking-widest text-right pr-10">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDossiers.map((d) => (
                                <TableRow key={d._id} className="border-black/5 group hover:bg-zinc-50/30 transition-colors">
                                    {/* ID Column */}
                                    <TableCell className="py-6 pl-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white transition-all">
                                                <Hash size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-zinc-900 text-base font-mono">{d.vin}</h4>
                                                <p className="text-xs text-zinc-500 font-medium">Engine: {d.engineNumber || "N/A"}</p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Mechanical Column */}
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 rounded-lg py-1 px-3">
                                                <Zap size={12} className="mr-1.5" /> {d.engineConfig || "Unspecified"}
                                            </Badge>
                                            <span className="text-zinc-300">|</span>
                                            <span className="text-sm font-bold text-zinc-700">{d.transmission}</span>
                                        </div>
                                    </TableCell>

                                    {/* Compliance Column */}
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-sm font-bold text-zinc-800 capitalize">
                                                <Globe size={14} className="text-blue-500" /> {d.countryOfOrigin}
                                            </div>
                                            <div className="text-[10px] text-zinc-400 font-black uppercase">
                                                Grade {d.auctionGrade} • {d.steering}
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell className="pr-10 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-black hover:text-white transition-colors">
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-2xl border-black/5 bg-white">
                                                <DropdownMenuLabel className="text-[10px] font-black uppercase text-zinc-400 px-3 py-2">Dossier Control</DropdownMenuLabel>
                                                <DropdownMenuSeparator className="bg-black/5" />
                                                <Link href={`/admin/specs?vin=${d.vin}`}>
                                                    <DropdownMenuItem className="gap-3 rounded-xl cursor-pointer py-3 font-medium">
                                                        <Edit3 size={16} className="text-zinc-400" /> Edit Spec Sheet
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuItem className="gap-3 rounded-xl cursor-pointer py-3 font-medium">
                                                    <ExternalLink size={16} className="text-zinc-400" /> View Public Page
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-black/5" />
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(d.vin)}
                                                    disabled={isPending}
                                                    className="gap-3 rounded-xl cursor-pointer py-3 text-red-600 focus:bg-red-50 focus:text-red-600 font-bold"
                                                >
                                                    <Trash2 size={16} /> Delete Record
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}