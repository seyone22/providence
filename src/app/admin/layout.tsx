import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/utils/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Single gate for the entire /admin section. Because every admin page is
  // nested under this layout, one server-side session check here protects all
  // of them — including the client-component pages (specs, dossiers, etc.)
  // that cannot redirect on their own.
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/auth/sign-in");

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-zinc-50/50">
        <AdminSidebar />
        {/* `h-screen` bounds the scroll to <main>. Without it `overflow-y-auto`
            is inert, the window scrolls instead, and page content rides up over
            the `fixed` sidebar. */}
        <main className="flex-1 h-screen overflow-y-auto">
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
