"use client";

import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { useState } from "react";
import {signOut} from "@/lib/auth-client";

export function LogoutButton() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    return (
        <button
            onClick={async () => {
                setIsLoading(true);
                await signOut({
                    fetchOptions: {
                        onSuccess: () => {
                            router.push("/auth/sign-in");
                            router.refresh();
                        }
                    }
                });
            }}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-50"
        >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
            Sign Out
        </button>
    );
}