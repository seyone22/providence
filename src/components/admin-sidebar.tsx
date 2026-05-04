"use client";

import {
    Car, ChevronRight, LayoutDashboard, Settings,
    Users, LogOut, User as UserIcon
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client"; // Adjust this path to your auth client

const navItems = [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    { title: "Dossiers", url: "/admin/dossiers", icon: Car },
    { title: "Specs", url: "/admin/specs", icon: Car },
    { title: "Users", url: "/admin/users", icon: Users },
    { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    // Better Auth session hook
    const { data: session, isPending } = authClient.useSession();

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login"); // Redirect after logout
                },
            },
        });
    };

    const user = session?.user;

    return (
        <Sidebar variant="inset" className="border-r border-black/5">
            <SidebarHeader className="h-20 flex items-center px-6">
                <div className="flex items-center gap-3">
                    <div className="bg-black text-white p-1.5 rounded-lg">
                        <Car size={20}/>
                    </div>
                    <div>
                        <h2 className="font-bold text-sm tracking-tight">Providence Auto</h2>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Admin</p>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="px-6 text-zinc-400">Main Menu</SidebarGroupLabel>
                    <SidebarMenu className="px-4">
                        {navItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname === item.url}
                                    className="rounded-xl h-11 px-4 hover:bg-black/5 data-[active=true]:bg-black data-[active=true]:text-white transition-all"
                                >
                                    <Link href={item.url}>
                                        <item.icon/>
                                        <span className="font-medium">{item.title}</span>
                                        {pathname === item.url && <ChevronRight className="ml-auto size-4"/>}
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-black/5">
                <div className="bg-zinc-50 rounded-[1.5rem] p-3 border border-black/5">
                    <div className="flex items-center gap-3 mb-3 pl-1">
                        <Avatar className="h-9 w-9 border border-white shadow-sm">
                            <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                            <AvatarFallback className="bg-black text-white text-[10px] font-bold uppercase">
                                {user?.name?.substring(0, 2) || <UserIcon size={14}/>}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-black truncate">
                                {isPending ? "Loading..." : user?.name || "Admin User"}
                            </span>
                            <span className="text-[10px] text-zinc-500 truncate leading-tight">
                                {user?.email}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-2 text-[11px] font-bold text-zinc-600 hover:text-red-600 bg-white hover:bg-red-50 border border-black/5 rounded-xl transition-all shadow-sm"
                    >
                        <LogOut size={14} />
                        Sign Out
                    </button>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}