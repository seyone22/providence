// app/settings/page.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/utils/auth";
import SettingsClient from "@/components/SettingsClient";

export default async function SettingsPage() {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
        redirect("/auth/sign-in");
    }

    return (
        <div className="p-6 lg:p-10 space-y-8 max-w-250 mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Account Settings</h1>
                <p className="text-zinc-500 mt-1">Manage your profile information and security preferences.</p>
            </div>

            <SettingsClient user={session.user} />
        </div>
    );
}