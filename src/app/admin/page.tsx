import { LayoutDashboard, Car, Ship, CheckCircle2, AlertCircle } from "lucide-react";
import RequestTableClient from "./RequestTableClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/utils/auth";
import { getRequests, getStaffUsers } from "@/actions/admin-actions";
import { LogoutButton } from "@/app/components/LogoutButton";

export default async function AdminDashboard() {
    // 1. Authenticate the user on the server
    const session = await auth.api.getSession({
        headers: await headers()
    });

    // 2. Protect the route
    if (!session) {
        redirect("/auth/sign-in");
    }

    // Fetch data directly on the server
    const requests = await getRequests();

    // NEW: Fetch staff users
    const staffUsers = await getStaffUsers();

    // Calculate Dashboard Statistics
    const totalInquiries = requests.length;
    const pendingAction = requests.filter((r: any) => !r.status || r.status === "New" || r.status === "Vehicle Selection").length;
    const inTransit = requests.filter((r: any) => ["Shipped", "Arrived at Port"].includes(r.status)).length;
    const completed = requests.filter((r: any) => r.status === "Cleared Customs").length;

    return (
        <div className="min-h-screen bg-zinc-50 text-black flex flex-col font-sans relative overflow-x-hidden selection:bg-black/10 selection:text-black">

            <header className="border-b border-black/5 bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-black/5 border border-black/10 p-2.5 rounded-2xl text-black">
                            <LayoutDashboard size={22} />
                        </div>
                        <div>
                            <h1 className="font-bold text-xl tracking-tight text-black">Providence Auto</h1>
                            <p className="text-xs text-zinc-500 font-bold tracking-[0.2em] uppercase">Command Center</p>
                        </div>
                    </div>
                    {/* Inject the Logout Button here */}
                    <LogoutButton />
                </div>
            </header>

            <main className="flex-1 py-12 px-4 md:px-8 relative z-10">
                <div className="max-w-7xl mx-auto">

                    <div className="mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight mb-3">
                            Operations Overview
                        </h2>
                        <p className="text-zinc-500 text-lg font-light">Manage incoming vehicle requests and track active global shipments.</p>
                    </div>

                    {/* STATS GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <div className="bg-white border border-black/5 rounded-[2rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-zinc-500 font-medium">Total Inquiries</p>
                                <div className="p-2 bg-black/5 rounded-xl"><Car size={18} className="text-black" /></div>
                            </div>
                            <h3 className="text-4xl font-bold text-black">{totalInquiries}</h3>
                        </div>

                        <div className="bg-white border border-black/5 rounded-[2rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-zinc-500 font-medium">Action Required</p>
                                <div className="p-2 bg-red-50 rounded-xl"><AlertCircle size={18} className="text-red-500" /></div>
                            </div>
                            <h3 className="text-4xl font-bold text-black">{pendingAction}</h3>
                        </div>

                        <div className="bg-white border border-black/5 rounded-[2rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-zinc-500 font-medium">In Transit</p>
                                <div className="p-2 bg-blue-50 rounded-xl"><Ship size={18} className="text-blue-500" /></div>
                            </div>
                            <h3 className="text-4xl font-bold text-black">{inTransit}</h3>
                        </div>

                        <div className="bg-white border border-black/5 rounded-[2rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-zinc-500 font-medium">Completed</p>
                                <div className="p-2 bg-emerald-50 rounded-xl"><CheckCircle2 size={18} className="text-emerald-500" /></div>
                            </div>
                            <h3 className="text-4xl font-bold text-black">{completed}</h3>
                        </div>
                    </div>

                    {/* TABLE CARD */}
                    <div className="bg-white border border-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.04)] rounded-[2rem] overflow-hidden">
                        <div className="border-b border-black/5 p-6 bg-zinc-50/50">
                            <h3 className="text-xl font-bold text-black tracking-tight">Active Pipeline</h3>
                        </div>
                        <div className="p-0">
                            {/* NEW: Passing down the newly fetched data */}
                            <RequestTableClient
                                initialRequests={requests}
                                staffUsers={staffUsers}
                                currentUserId={session.user.id}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}