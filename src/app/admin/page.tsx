import MinimalHeader from "@/app/components/MinimalHeader";
import { getRequests } from "@/actions/admin-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { LayoutDashboard } from "lucide-react";
import RequestTableClient from "./RequestTableClient";

export default async function AdminDashboard() {
    // Fetch data directly on the server
    const requests = await getRequests();

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans relative overflow-x-hidden">
            {/* Dark background glow */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/10 to-[#0a0a0a] z-0 pointer-events-none" />

            <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 border border-white/20 p-2 rounded-xl text-white">
                            <LayoutDashboard size={20} />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg tracking-tight">Providence Auto</h1>
                            <p className="text-xs text-blue-400 font-medium tracking-widest uppercase">Command Center</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 py-12 px-4 md:px-8 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h2 className="font-sans text-3xl font-bold text-white tracking-tight mb-2">
                            Operations Overview
                        </h2>
                        <p className="text-gray-400">Manage incoming vehicle requests and client inquiries.</p>
                    </div>

                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl overflow-hidden">
                        <CardHeader className="border-b border-white/5 pb-4 bg-white/[0.02]">
                            <CardTitle className="text-lg font-medium text-white">Recent Vehicle Requests</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {/* Render the Client Component and pass the fetched data to it */}
                            <RequestTableClient initialRequests={requests} />
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}