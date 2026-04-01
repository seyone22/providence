"use client";

import {Car, ChevronRight, LayoutDashboard, Settings, Users} from "lucide-react";
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
} from "@/app/components/ui/sidebar";
import Link from "next/link";
import {usePathname} from "next/navigation";

const navItems = [
    {title: "Dashboard", url: "/admin", icon: LayoutDashboard},
    {title: "Dossiers", url: "/admin/dossiers", icon: Car},
    {title: "Specs", url: "/admin/specs", icon: Car},
    {title: "Users", url: "/admin/users", icon: Users},
    {title: "Settings", url: "/admin/settings", icon: Settings},
];

export function AdminSidebar() {
    const pathname = usePathname();

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
                <div className="bg-zinc-50 rounded-2xl p-4">
                    {/* Your existing LogoutButton component */}
                    <p className="text-[10px] font-bold text-zinc-400 uppercase mb-2 ml-1">Account</p>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-600">Admin Session</span>
                        {/* If LogoutButton is a custom component, we put it here */}
                        {/* <LogoutButton /> */}
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}