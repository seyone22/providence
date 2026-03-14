import { Car, Ship, CheckCircle2, AlertCircle } from "lucide-react";
import RequestTableClient from "./RequestTableClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/utils/auth";
import { getRequests, getStaffUsers } from "@/actions/admin-actions";

export default async function AdminDashboard() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/auth/sign-in");

    const [requests, staffUsers] = await Promise.all([
        getRequests(),
        getStaffUsers()
    ]);

    const stats = [
        { label: "Total Inquiries", value: requests.length, icon: Car, color: "bg-black/5 text-black" },
        { label: "Action Required", value: requests.filter((r: any) => !r.status || r.status === "New").length, icon: AlertCircle, color: "bg-red-50 text-red-600" },
        { label: "In Transit", value: requests.filter((r: any) => ["Shipped"].includes(r.status)).length, icon: Ship, color: "bg-blue-50 text-blue-600" },
        { label: "Completed", value: requests.filter((r: any) => r.status === "Cleared Customs").length, icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600" },
    ];

    return (
        <div className="p-6 lg:p-10 space-y-10 max-w-[1600px] mx-auto">
            {/* Header Section */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Operations Overview</h1>
                <p className="text-zinc-500 mt-1">Real-time status of the global vehicle pipeline.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white border border-zinc-200/60 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className={`p-2.5 rounded-2xl ${stat.color}`}>
                                <stat.icon size={20} />
                            </div>
                            <span className="text-2xl font-bold tracking-tight">{stat.value}</span>
                        </div>
                        <p className="mt-4 text-sm font-medium text-zinc-500 uppercase tracking-wider">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Main Table */}
            <div className="bg-white border border-zinc-200/60 shadow-sm rounded-[2.5rem] overflow-hidden">
                <div className="px-8 py-6 border-b border-zinc-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg">Active Pipeline</h3>
                    <div className="flex gap-2">
                        {/* Optional table filters could go here */}
                    </div>
                </div>
                <div className="p-2">
                    <RequestTableClient
                        initialRequests={requests}
                        staffUsers={staffUsers}
                        currentUserId={session.user.id}
                    />
                </div>
            </div>
        </div>
    );
}