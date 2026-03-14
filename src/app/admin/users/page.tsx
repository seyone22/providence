import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/utils/auth";
import { getUsers } from "@/actions/admin-actions"; // Assume you have this
import UserManagementClient from "./UserManagementClient";

export default async function UsersPage() {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
        redirect("/auth/sign-in");
    }

    // Fetch users directly on the server
    const users = await getUsers();

    return (
        <div className="p-6 lg:p-10 space-y-8 max-w-[1600px] mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">User Management</h1>
                <p className="text-zinc-500 mt-1">Manage staff access, roles, and account security.</p>
            </div>

            <UserManagementClient initialUsers={users} />
        </div>
    );
}