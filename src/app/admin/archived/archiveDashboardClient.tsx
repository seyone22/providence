"use client";

import {useMemo, useState} from "react";
import {Archive, ArrowUpDown, Search, ThumbsDown, ThumbsUp, Users, X} from "lucide-react";
import RequestTableClient from "@/components/RequestTableClient";

const PIPELINE_STAGES = [
    "New", "Vehicle Selection", "Price Agreement", "Deposit Collected",
    "Vehicle Purchased", "Preparation", "Shipped", "Arrived at Port", "Cleared Customs"
];

const ARCHIVE_STATUSES = [
    "Lead Closed",
    "Lead Lost",
    "Not Qualified"
];

export default function ArchiveDashboardClient({requests, staffUsers, currentUserId}: any) {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [staffFilter, setStaffFilter] = useState("All");
    const [carFilter, setCarFilter] = useState("All");
    const [sortBy, setSortBy] = useState("newest");
    const [countryFilter, setCountryFilter] = useState("All");

    const uniqueCars = useMemo(() => {
        const cars = new Set(requests.map((req: any) => `${req.make} ${req.vehicle_model}`.trim()));
        return Array.from(cars).filter(Boolean).sort();
    }, [requests]);

    const uniqueCountries = useMemo(() => {
        const countries = new Set(requests.map((req: any) => req.countryOfImport).filter(Boolean));
        return Array.from(countries).sort();
    }, [requests]);

    const filteredRequests = useMemo(() => {
        return requests
            .filter((req: any) => {
                const matchesSearch =
                    (req.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (req.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (req.make || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (req.vehicle_model || "").toLowerCase().includes(searchQuery.toLowerCase());

                const currentStatus = req.leadStatus || "Action required";
                const matchesStatus = statusFilter === "All" || currentStatus === statusFilter;
                const matchesCountry = countryFilter === "All" || req.countryOfImport === countryFilter;

                const assignedValue = req.assignedToName || "Unassigned";
                const matchesStaff = staffFilter === "All" || assignedValue === staffFilter;

                const carName = `${req.make} ${req.vehicle_model}`.trim();
                const matchesCar = carFilter === "All" || carName === carFilter;

                return matchesSearch && matchesStatus && matchesStaff && matchesCar && matchesCountry;
            })
            .sort((a: any, b: any) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return sortBy === "newest" ? dateB - dateA : dateA - dateB;
            });
    }, [requests, searchQuery, countryFilter, statusFilter, staffFilter, carFilter, sortBy]);

    // Contextual metric cards optimized for analyzing historic performance data
    const stats = [
        {
            label: "Total Archived",
            value: filteredRequests.length,
            icon: Archive,
            color: "bg-zinc-100 text-zinc-600"
        },
        {
            label: "Successful Conversions",
            value: filteredRequests.filter((r: any) => r.leadStatus === "Lead Closed").length,
            icon: ThumbsUp,
            color: "bg-emerald-50 text-emerald-600"
        },
        {
            label: "Lost Opportunities",
            value: filteredRequests.filter((r: any) => r.leadStatus === "Lead Lost").length,
            icon: ThumbsDown,
            color: "bg-red-50 text-red-600"
        },
        {
            label: "Disqualified Inquiries",
            value: filteredRequests.filter((r: any) => r.leadStatus === "Not Qualified").length,
            icon: Users,
            color: "bg-amber-50 text-amber-600"
        },
    ];

    return (
        <div className="space-y-10">
            {/* Search & Filtration Panels */}
            <div className="space-y-4 w-full">
                <div className="relative group">
                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-black transition-colors"/>
                    <input
                        type="text"
                        placeholder="Search archived files by client, brand name, or model variants..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 text-base bg-white border border-zinc-200 shadow-sm focus:border-black focus:ring-4 focus:ring-black/5 outline-none rounded-2xl transition-all font-medium text-black placeholder:text-zinc-400"
                    />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <select
                            value={staffFilter}
                            onChange={(e) => setStaffFilter(e.target.value)}
                            className="pl-3 pr-8 py-2 text-sm bg-white border border-zinc-200 hover:border-zinc-300 rounded-xl text-zinc-600 font-semibold cursor-pointer outline-none transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat"
                        >
                            <option value="All">All Staff Handlers</option>
                            <option value="Unassigned">Unassigned</option>
                            {staffUsers.map((staff: any) => (
                                <option key={staff._id} value={staff.name}>{staff.name}</option>
                            ))}
                        </select>

                        <select
                            value={carFilter}
                            onChange={(e) => setCarFilter(e.target.value)}
                            className="pl-3 pr-8 py-2 text-sm bg-white border border-zinc-200 hover:border-zinc-300 rounded-xl text-zinc-600 font-semibold cursor-pointer outline-none transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat"
                        >
                            <option value="All">All Vehicle Models</option>
                            {uniqueCars.map((car: any) => (
                                <option key={car} value={car}>{car}</option>
                            ))}
                        </select>

                        <select
                            value={countryFilter}
                            onChange={(e) => setCountryFilter(e.target.value)}
                            className="pl-3 pr-8 py-2 text-sm bg-white border border-zinc-200 hover:border-zinc-300 rounded-xl text-zinc-600 font-semibold cursor-pointer outline-none transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat"
                        >
                            <option value="All">All Destinations</option>
                            {uniqueCountries.map((country: any) => (
                                <option key={country} value={country}>{country}</option>
                            ))}
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="pl-3 pr-8 py-2 text-sm bg-white border border-zinc-200 hover:border-zinc-300 rounded-xl text-zinc-600 font-semibold cursor-pointer outline-none transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat"
                        >
                            <option value="All">All Archive Outcomes</option>
                            {ARCHIVE_STATUSES.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setSortBy(sortBy === "newest" ? "oldest" : "newest")}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl transition-colors"
                            title={sortBy === "newest" ? "Sort by Oldest" : "Sort by Newest"}
                        >
                            <ArrowUpDown size={16}/>
                            <span className="hidden sm:inline capitalize">{sortBy}</span>
                        </button>

                        {(searchQuery || staffFilter !== "All" || carFilter !== "All" || countryFilter !== "All" || statusFilter !== "All") && (
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setStaffFilter("All");
                                    setCarFilter("All");
                                    setStatusFilter("All");
                                    setCountryFilter("All");
                                }}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
                                title="Reset Layout"
                            >
                                <X size={20}/>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Metrics Dashboard Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white border border-zinc-200/60 p-6 rounded-[2rem] shadow-sm">
                        <div className="flex justify-between items-start">
                            <div className={`p-2.5 rounded-2xl ${stat.color}`}>
                                <stat.icon size={20}/>
                            </div>
                            <span className="text-2xl font-bold tracking-tight">{stat.value}</span>
                        </div>
                        <p className="mt-4 text-sm font-medium text-zinc-500 uppercase tracking-wider">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Table Shell Injecting Existing Components */}
            <div className="bg-white border border-zinc-200/60 shadow-sm rounded-[2.5rem] overflow-hidden">
                <div className="px-8 py-6 border-b border-zinc-100">
                    <h3 className="font-bold text-lg">Archived Records Index ({filteredRequests.length})</h3>
                </div>
                <div className="p-2">
                    <RequestTableClient
                        processedRequests={filteredRequests}
                        staffUsers={staffUsers}
                        currentUserId={currentUserId}
                    />
                </div>
            </div>
        </div>
    );
}