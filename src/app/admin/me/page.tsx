"use client";

import React, { useState } from "react";
import {
    TrendingUp, Users, DollarSign, Target, Award, ArrowUpRight,
    MessageCircle, Calendar, Zap, Clock, ShieldCheck, CheckCircle2,
    Briefcase, AlertCircle, RefreshCw, BarChart3, PieChart
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// --- MOCK PERFORMANCE & STATISTICS DATA ENGINE ---
const SALES_LEADERBOARD = [
    { name: "Sarah Jenkins", role: "Senior Account Executive", dealsWon: 24, volume: 1840000, conversionRate: "34.2%", avatar: "S" },
    { name: "Alex Kincaid", role: "Mid-Market Sourcing Specialist", dealsWon: 19, volume: 1425000, conversionRate: "29.8%", avatar: "A" },
    { name: "Michael Chang", role: "JDM Import Operations", dealsWon: 16, volume: 1190000, conversionRate: "31.5%", avatar: "M" },
    { name: "Elena Rostova", role: "Luxury Sourcing Agent", dealsWon: 14, volume: 1055000, conversionRate: "27.1%", avatar: "E" },
];

const RECENT_TEAM_LOGS = [
    { id: 1, operator: "Sarah Jenkins", action: "Changed Sales Status to: \"SQL: Moved to vehicle offering stage\"", target: "Marcus Vance (Land Cruiser 300)", time: "12 mins ago", type: "status" },
    { id: 2, operator: "Michael Chang", action: "Advanced milestone pipeline step sequence towards \"Shipped\"", target: "David Miller (Porsche 911 GT3)", time: "45 mins ago", type: "pipeline" },
    { id: 3, operator: "Alex Kincaid", action: "Added Sales Status Update Note", comment: "Client requested follow-up next Tuesday via WhatsApp to confirm the security deposit terms.", target: "Sophia Lorrent (Aston Martin DB12)", time: "2 hours ago", type: "comment" },
    { id: 4, operator: "System Admin", action: "Synchronized dynamic catalog blueprint template mapping", target: "Toyota Century SUV (Slug: century-suv-v1)", time: "4 hours ago", type: "system" },
];

const TARGET_MARKET_DISTRIBUTION = [
    { country: "Ireland", volume: 2450000, color: "w-[68%]", percentage: "45%" },
    { country: "United Kingdom", volume: 1630000, color: "w-[42%]", percentage: "30%" },
    { country: "Australia", volume: 815000, color: "w-[22%]", percentage: "15%" },
    { country: "New Zealand", volume: 544000, color: "w-[14%]", percentage: "10%" },
];

export default function OperationsOverviewDashboard() {
    const [timeframe, setTimeframe] = useState("month");

    return (
        <div className="p-6 lg:p-10 space-y-10 max-w-[1600px] mx-auto bg-[#FDFCFB] min-h-screen text-black">

            {/* Atlassian Home Header Interface */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-black/5">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
                        <Briefcase className="text-zinc-400" size={28} /> Operations Control Home
                    </h1>
                    <p className="text-zinc-500 mt-1">Cross-team performance statistics, conversion ratios, and pipeline health indices.</p>
                </div>

                {/* Segmented Timeframe Switcher */}
                <div className="flex bg-zinc-100 p-1 rounded-xl border border-black/5">
                    {["week", "month", "quarter"].map((t) => (
                        <button
                            key={t}
                            onClick={() => setTimeframe(t)}
                            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                                timeframe === t
                                    ? "bg-white text-black shadow-sm"
                                    : "text-zinc-400 hover:text-zinc-900"
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </header>

            {/* Atlassian Matrix Gadgets (Overview Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                <div className="bg-white border border-black/5 rounded-[2rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex flex-col justify-between group hover:border-black/10 transition-all">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Gross Managed Pipeline</p>
                            <h3 className="text-3xl font-bold font-mono tracking-tight">$5,514,000</h3>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><DollarSign size={20} /></div>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                        <TrendingUp size={14} /> +12.4% <span className="text-zinc-400 font-normal">vs dynamic historic index</span>
                    </div>
                </div>

                <div className="bg-white border border-black/5 rounded-[2rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex flex-col justify-between group hover:border-black/10 transition-all">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Active Client Conversions</p>
                            <h3 className="text-3xl font-bold font-mono tracking-tight">73.2%</h3>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600"><Target size={20} /></div>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                        <TrendingUp size={14} /> +3.1% <span className="text-zinc-400 font-normal">sourcing fulfillment rate</span>
                    </div>
                </div>

                <div className="bg-white border border-black/5 rounded-[2rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex flex-col justify-between group hover:border-black/10 transition-all">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Secured Escrow Deposits</p>
                            <h3 className="text-3xl font-bold font-mono tracking-tight">38 Leads</h3>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-2xl text-purple-600"><Zap size={20} /></div>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-zinc-500 text-xs font-medium">
                        <Clock size={14} className="text-zinc-400" /> Avg. 4.2 days from selection to capture
                    </div>
                </div>

                <div className="bg-white border border-black/5 rounded-[2rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex flex-col justify-between group hover:border-black/10 transition-all">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Landed Logistics Volume</p>
                            <h3 className="text-3xl font-bold font-mono tracking-tight">14 Cars</h3>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-2xl text-amber-600"><CheckCircle2 size={20} /></div>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-amber-700 text-xs font-semibold bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full w-fit">
                        <AlertCircle size={12} /> 4 Arriving at Port this week
                    </div>
                </div>

            </div>

            {/* Central Workstations Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Section Workspace: Sales Performance Leaderboard */}
                <div className="lg:col-span-7 space-y-8">
                    <div className="bg-white border border-black/5 rounded-[3rem] p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-zinc-100 rounded-xl text-black"><Award size={20} /></div>
                                <div>
                                    <h3 className="text-xl font-bold tracking-tight">Sales Team Leaderboard</h3>
                                    <p className="text-xs text-zinc-400 font-medium">Fulfillment capacity mapped by gross settled operations volume.</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-xl"><RefreshCw size={16} className="text-zinc-400" /></Button>
                        </div>

                        {/* Leaderboard Array View */}
                        <div className="space-y-4">
                            {SALES_LEADERBOARD.map((rep, idx) => (
                                <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-zinc-50/50 rounded-2xl border border-black/5 group hover:bg-zinc-50 transition-colors gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full font-bold bg-black text-white flex items-center justify-center shadow-inner relative text-sm">
                                            {rep.avatar}
                                            <span className="absolute -bottom-1 -right-1 bg-zinc-100 border border-black/5 rounded-full w-5 h-5 flex items-center justify-center text-[10px] text-zinc-900 font-black">
                                                {idx + 1}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-zinc-900 flex items-center gap-2">{rep.name}</h4>
                                            <p className="text-xs text-zinc-400 font-medium">{rep.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-8 items-center w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-black/5">
                                        <div className="text-left sm:text-right">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Deals Won</span>
                                            <span className="font-bold text-sm text-zinc-900">{rep.dealsWon} units</span>
                                        </div>
                                        <div className="text-left sm:text-right">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Conv. Rate</span>
                                            <Badge variant="outline" className="bg-white font-mono mt-0.5">{rep.conversionRate}</Badge>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Settled Gross</span>
                                            <span className="font-mono font-bold text-sm text-black">${rep.volume.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Operational Funnel Target Analysis Analytics */}
                    <div className="bg-white border border-black/5 rounded-[3rem] p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-zinc-100 rounded-xl text-black"><BarChart3 size={20} /></div>
                            <div>
                                <h3 className="text-xl font-bold tracking-tight">Active Pipeline Velocity</h3>
                                <p className="text-xs text-zinc-400 font-medium">Conversion volume weight mapping across pipeline states.</p>
                            </div>
                        </div>

                        {/* Funnel Graph Graphic Bar Simulation */}
                        <div className="space-y-4 pt-4">
                            {[
                                { stage: "Sourcing & Selection", count: 24, percentage: "w-full", color: "bg-zinc-900" },
                                { stage: "Price / Escrow Verification", count: 18, percentage: "w-[75%]", color: "bg-zinc-700" },
                                { stage: "Procurement Fulfillments", count: 12, percentage: "w-[50%]", color: "bg-zinc-500" },
                                { stage: "Logistics & Customs Manifests", count: 8, percentage: "w-[33%]", color: "bg-zinc-300" },
                            ].map((bar, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-semibold">
                                        <span className="text-zinc-700">{bar.stage}</span>
                                        <span className="text-zinc-400 font-mono">{bar.count} files ({bar.percentage.replace('w-[', '').replace(']', '')})</span>
                                    </div>
                                    <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-1000 ${bar.color} ${bar.percentage}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Section Workspace: Atlassian Activity Stream & Regional Volume Charts */}
                <div className="lg:col-span-5 space-y-8">

                    {/* Destination Volume Weight Block Widget */}
                    <div className="bg-white border border-black/5 rounded-[3rem] p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-zinc-100 rounded-xl text-black"><PieChart size={20} /></div>
                            <div>
                                <h3 className="text-xl font-bold tracking-tight">Regional Sourcing Weights</h3>
                                <p className="text-xs text-zinc-400 font-medium">Gross settled allocations mapped by target destination marketplace.</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-2">
                            {TARGET_MARKET_DISTRIBUTION.map((market, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span className="text-zinc-800 font-bold">{market.country}</span>
                                        <span className="text-zinc-500 font-mono">${market.volume.toLocaleString()} ({market.percentage})</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-zinc-50 rounded-full">
                                        <div className={`h-full bg-zinc-400 rounded-full ${market.color}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Unified Team Operation Logs Stream */}
                    <div className="bg-white border border-black/5 rounded-[3rem] p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-zinc-100 rounded-xl text-black"><Clock size={20} /></div>
                                <div>
                                    <h3 className="text-xl font-bold tracking-tight">Live Pipeline Activity</h3>
                                    <p className="text-xs text-zinc-400 font-medium">Real-time update streams generated by global handlers.</p>
                                </div>
                            </div>
                        </div>

                        {/* Stream Log Map Loop */}
                        <div className="space-y-6 relative before:absolute before:top-2 before:bottom-2 before:left-3 before:w-px before:bg-black/5">
                            {RECENT_TEAM_LOGS.map((log) => (
                                <div key={log.id} className="relative pl-8 text-sm group">
                                    {/* Abstract Activity Dot Element Indicator */}
                                    <div className={`absolute left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm ring-1 ring-black/5 ${
                                        log.type === "status" ? "bg-blue-500" :
                                            log.type === "pipeline" ? "bg-purple-500" :
                                                log.type === "comment" ? "bg-emerald-500" : "bg-zinc-400"
                                    }`} />

                                    <div className="flex justify-between items-start gap-2 mb-1">
                                        <span className="font-bold text-zinc-900">{log.operator}</span>
                                        <span className="text-[10px] text-zinc-400 font-medium whitespace-nowrap bg-zinc-50 border border-black/5 px-2 py-0.5 rounded-md">{log.time}</span>
                                    </div>
                                    <p className="text-xs text-zinc-600 leading-relaxed font-light">{log.action}</p>
                                    <div className="text-xs font-semibold text-black mt-1 flex items-center gap-1 group-hover:underline cursor-pointer">
                                        <ArrowUpRight size={12} className="text-zinc-400" /> {log.target}
                                    </div>

                                    {/* Conditional inline comment log bubble render */}
                                    {log.comment && (
                                        <div className="mt-2 p-3 bg-zinc-50 border border-black/5 rounded-xl text-xs text-zinc-500 font-light italic leading-relaxed">
                                            "{log.comment}"
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}