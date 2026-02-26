import { Car, Code, DollarSign, Users, Activity, ExternalLink, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";

// Mock Data for the Dealer's generated leads
const mockLeads = [
    { id: "REQ-001", client: "Sarah Jenkins", car: "Porsche 911 GT3", budget: "$220,000", status: "Processing", date: "Oct 24, 2024" },
    { id: "REQ-002", client: "Michael Chen", car: "Mercedes G63 AMG", budget: "$185,000", status: "Shipped", date: "Oct 22, 2024" },
    { id: "REQ-003", client: "David Alaba", car: "Land Rover Defender", budget: "$90,000", status: "New Lead", date: "Oct 24, 2024" },
];

export default function DealerDashboard() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
            {/* Dashboard Header */}
            <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 border border-white/20 p-2 rounded-xl">
                            <Car size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg tracking-tight">Providence Auto</h1>
                            <p className="text-xs text-blue-400 font-medium tracking-widest uppercase">Dealer Portal</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400">Elite Motors LLC</span>
                        <div className="h-10 w-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold">
                            EM
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome back.</h2>
                        <p className="text-gray-400">Here is an overview of your borderless inventory performance.</p>
                    </div>
                    <Button className="bg-white text-black hover:bg-gray-200 rounded-full px-6 font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                        + New Manual Request
                    </Button>
                </div>

                {/* KPI Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    {[
                        { title: "Active Leads", value: "14", icon: Users, color: "text-blue-400" },
                        { title: "Vehicles Sourcing", value: "6", icon: Activity, color: "text-orange-400" },
                        { title: "Successfully Shipped", value: "24", icon: Car, color: "text-green-400" },
                        { title: "Est. Commission", value: "$42,500", icon: DollarSign, color: "text-emerald-400" },
                    ].map((stat, i) => (
                        <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-md">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400">{stat.title}</CardTitle>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-white">{stat.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* The "Smart-Embed" Widget Card */}
                    <Card className="bg-gradient-to-br from-blue-900/20 to-black border-white/10 backdrop-blur-md lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Code className="text-blue-400" /> Smart-Embed Widget
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-gray-400 text-sm">
                                Copy and paste this code snippet into your website's HTML to display the global sourcing form to your customers.
                            </p>
                            <div className="relative">
                                <pre className="bg-black/60 p-4 rounded-xl border border-white/10 text-xs text-blue-300 overflow-x-auto">
                                    <code>{`<script src="https://providenceauto.com/embed.js" \ndata-dealer-id="EM-98273"></script>\n<div id="providence-widget"></div>`}</code>
                                </pre>
                                <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-gray-400 hover:text-white hover:bg-white/10">
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 mt-4 rounded-full">
                                View Installation Guide <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Recent Leads Table */}
                    <Card className="bg-white/5 border-white/10 backdrop-blur-md lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-xl">Recent Widget Leads</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader className="border-b border-white/10">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="text-gray-400">Client</TableHead>
                                        <TableHead className="text-gray-400">Requested Vehicle</TableHead>
                                        <TableHead className="text-gray-400">Budget</TableHead>
                                        <TableHead className="text-gray-400">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockLeads.map((lead, i) => (
                                        <TableRow key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <TableCell className="font-medium text-white">
                                                {lead.client}<br/>
                                                <span className="text-xs text-gray-500 font-normal">{lead.date}</span>
                                            </TableCell>
                                            <TableCell className="text-gray-300">{lead.car}</TableCell>
                                            <TableCell className="text-gray-300">{lead.budget}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`
                                                        ${lead.status === "New Lead" ? "border-blue-500/50 text-blue-400" : ""}
                                                        ${lead.status === "Processing" ? "border-orange-500/50 text-orange-400" : ""}
                                                        ${lead.status === "Shipped" ? "border-green-500/50 text-green-400" : ""}
                                                        bg-black/40 backdrop-blur-md
                                                    `}
                                                >
                                                    {lead.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="mt-4 text-center">
                                <Link href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                                    View all leads &rarr;
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}