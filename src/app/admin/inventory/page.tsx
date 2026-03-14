"use client";

import { useState } from "react";
import {
    Plus, Search, Filter, MoreHorizontal, Car,
    ArrowUpRight, Box, History, MapPin,
    DollarSign, Package, AlertTriangle, Edit3, Trash2
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/app/components/ui/table";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

// Mock Data for the Inventory
const MOCK_INVENTORY = [
    { id: "1", make: "Toyota", model: "Land Cruiser 300", year: 2024, trim: "GR Sport", color: "Precious White", price: 115000, status: "In Stock", location: "Dubai Port", mileage: 0 },
    { id: "2", make: "Mercedes-Benz", model: "G63 AMG", year: 2023, trim: "Magno Edition", color: "G Manufaktur Black", price: 245000, status: "Reserved", location: "Local Warehouse", mileage: 1200 },
    { id: "3", make: "Land Rover", model: "Defender 110", year: 2024, trim: "V8 Carpathian", color: "Carpathian Grey", price: 142000, status: "In Transit", location: "On Vessel (MSC)", mileage: 0 },
    { id: "4", make: "Lexus", model: "LX600", year: 2024, trim: "VIP 4-Seater", color: "Sonic Quartz", price: 178000, status: "In Stock", location: "Dubai Port", mileage: 15 },
];

export default function InventoryPage() {
    const [search, setSearch] = useState("");

    const getStatusColor = (status: string) => {
        switch (status) {
            case "In Stock": return "bg-emerald-50 text-emerald-700 border-emerald-100";
            case "Reserved": return "bg-amber-50 text-amber-700 border-amber-100";
            case "In Transit": return "bg-blue-50 text-blue-700 border-blue-100";
            default: return "bg-zinc-100 text-zinc-600";
        }
    };

    return (
        <div className="p-6 lg:p-10 space-y-8 max-w-[1600px] mx-auto">

            {/* HEADER & TOP ACTIONS */}
            <div className="flex flex-col md:grow md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-black">Inventory Fleet</h1>
                    <p className="text-zinc-500 mt-1">Manage global vehicle stock, pricing, and availability.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl border-black/10 gap-2 h-11 bg-white">
                        <History size={18} /> Audit Log
                    </Button>
                    <Button className="rounded-xl bg-black text-white gap-2 h-11 px-6 hover:bg-zinc-800 shadow-lg shadow-black/5">
                        <Plus size={18} /> Add Vehicle
                    </Button>
                </div>
            </div>

            {/* QUICK STATS STRIP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Units", value: "42", icon: Car, color: "text-black" },
                    { label: "Available", value: "28", icon: Package, color: "text-emerald-600" },
                    { label: "On Water", value: "9", icon: Box, color: "text-blue-600" },
                    { label: "Fleet Value", value: "$4.2M", icon: DollarSign, color: "text-zinc-500" },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white border border-black/5 rounded-[2rem] p-6 flex items-center justify-between shadow-sm">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-bold">{stat.value}</h3>
                        </div>
                        <div className={`p-3 rounded-2xl bg-zinc-50 ${stat.color}`}>
                            <stat.icon size={22} />
                        </div>
                    </div>
                ))}
            </div>

            {/* FILTER & SEARCH BAR */}
            <div className="flex flex-col sm:grow sm:flex-row justify-between gap-4 bg-white p-4 rounded-[2rem] border border-black/5 shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <Input
                        placeholder="Search by Make, Model, or VIN..."
                        className="pl-12 h-12 rounded-2xl border-transparent bg-zinc-50 focus:bg-white focus:ring-black/5 transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="rounded-2xl border-black/5 bg-zinc-50 h-12 px-5 gap-2 hover:bg-zinc-100">
                        <Filter size={18} /> Filters
                    </Button>
                    <Select defaultValue="newest">
                        <SelectTrigger className="w-[180px] h-12 rounded-2xl border-black/5 bg-zinc-50">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest Arrival</SelectItem>
                            <SelectItem value="price-high">Price: High to Low</SelectItem>
                            <SelectItem value="price-low">Price: Low to High</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* INVENTORY TABLE */}
            <div className="bg-white border border-black/5 rounded-[2.5rem] overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow className="hover:bg-transparent border-black/5">
                            <TableHead className="py-5 pl-8 text-black font-bold">Vehicle Details</TableHead>
                            <TableHead className="text-black font-bold">Pricing (USD)</TableHead>
                            <TableHead className="text-black font-bold">Status</TableHead>
                            <TableHead className="text-black font-bold">Location</TableHead>
                            <TableHead className="w-[80px] pr-8"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {MOCK_INVENTORY.map((item) => (
                            <TableRow key={item.id} className="border-black/5 group transition-colors hover:bg-zinc-50/50">
                                <TableCell className="py-5 pl-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-black group-hover:text-white transition-all">
                                            <Car size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-black text-base">{item.year} {item.make} {item.model}</h4>
                                            <p className="text-xs text-zinc-500 font-medium">{item.trim} • {item.color}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="font-bold text-black text-base">${item.price.toLocaleString()}</div>
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">MSRP / Asking</p>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`rounded-full px-3 py-1 font-semibold text-xs border ${getStatusColor(item.status)}`}>
                                        {item.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-zinc-600 font-medium">
                                        <MapPin size={14} className="text-zinc-400" />
                                        {item.location}
                                    </div>
                                </TableCell>
                                <TableCell className="pr-8 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-black/5">
                                                <MoreHorizontal className="h-5 w-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-xl border-black/5">
                                            <DropdownMenuLabel>Vehicle Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="gap-2 rounded-xl cursor-pointer py-2.5">
                                                <Edit3 size={16} className="text-zinc-500" /> Edit Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="gap-2 rounded-xl cursor-pointer py-2.5">
                                                <Box size={16} className="text-zinc-500" /> Update Location
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="gap-2 rounded-xl cursor-pointer py-2.5">
                                                <ArrowUpRight size={16} className="text-blue-500" /> Create Spec Sheet
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="gap-2 rounded-xl cursor-pointer py-2.5 text-red-600 focus:bg-red-50 focus:text-red-600">
                                                <Trash2 size={16} /> Remove from Fleet
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* FOOTER PAGINATION */}
                <div className="px-8 py-6 border-t border-black/5 flex justify-between items-center bg-zinc-50/30">
                    <p className="text-sm text-zinc-500 font-medium">Showing 4 of 42 vehicles in stock</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="rounded-xl border-black/5 bg-white h-9 px-4 disabled:opacity-50">Previous</Button>
                        <Button variant="outline" size="sm" className="rounded-xl border-black/5 bg-white h-9 px-4">Next</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Quick helper for Select component imports if needed
const Select = ({ children, defaultValue }: any) => <div>{children}</div>; // Proxy for actual Shadcn Select
const SelectTrigger = ({ children, className }: any) => <div className={className}>{children}</div>;
const SelectValue = ({ placeholder }: any) => <span>{placeholder}</span>;
const SelectContent = ({ children }: any) => <div>{children}</div>;
const SelectItem = ({ children }: any) => <div>{children}</div>;