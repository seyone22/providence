import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/utils/auth";
import { getRequests, getStaffUsers } from "@/actions/admin-actions";
import DashboardClient from "@/components/DashboardClient";

export default async function AdminDashboard() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/auth/sign-in");

    const [requests, staffUsers] = await Promise.all([
        getRequests(),
        getStaffUsers()
    ]);

    return (
        <div className="p-6 lg:p-10 space-y-10 max-w-[1600px] mx-auto">
            {/* Header Section */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Sales & Operations Pipeline</h1>
                <p className="text-zinc-500 mt-1">Real-time overview of lead progression and vehicle statuses.</p>
            </div>

            {/* Client Controller Handles Stats, Charts, Filters, and Table */}
            <DashboardClient
                requests={requests}
                staffUsers={staffUsers}
                currentUserId={session.user.id}
            />
        </div>
    );
}