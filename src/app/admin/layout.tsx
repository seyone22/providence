import { SidebarProvider, SidebarTrigger } from "@/app/components/ui/sidebar";
import {AdminSidebar} from "@/app/components/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-zinc-50/50">
                <AdminSidebar />
                <main className="flex-1 overflow-y-auto">
                    {/* Mobile Trigger */}
                    <div className="md:hidden p-4 border-b bg-white">
                        <SidebarTrigger />
                    </div>
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
}