import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {auth} from "@/utils/auth";
import {getRequests, getStaffUsers} from "@/actions/admin-actions";
import ArchiveDashboardClient from "@/app/admin/archived/archiveDashboardClient";

export default async function AdminArchiveDashboard() {
    const session = await auth.api.getSession({headers: await headers()});
    if (!session) redirect("/auth/sign-in");

    const [requests, staffUsers] = await Promise.all([
        getRequests(),
        getStaffUsers()
    ]);

    // Filter requests at server initialization step to ONLY include closed, lost, or unqualified records
    const archivedRequests = requests.filter((req: any) =>
        ["Not Qualified", "Lead Lost", "Lead Closed"].includes(req.leadStatus)
    );

    return (
        <div className="p-6 lg:p-10 space-y-10 max-w-[1600px] mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Archived Leads Vault</h1>
                <p className="text-zinc-500 mt-1">Historic records of completed operations, disqualified inquiries, and
                    lost opportunities.</p>
            </div>

            <ArchiveDashboardClient
                requests={archivedRequests}
                staffUsers={staffUsers}
                currentUserId={session.user.id}
            />
        </div>
    );
}