import Navbar from "@/app/components/Navbar";
import { getRequests } from "@/actions/admin-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { LayoutDashboard } from "lucide-react";
import RequestTableClient from "./RequestTableClient"; // Import the client component

export default async function AdminDashboard() {
    // Fetch data directly on the server
    const requests = await getRequests();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-1 py-12 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h2 className="font-serif text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <LayoutDashboard className="text-blue-600" />
                            Operations Command Center
                        </h2>
                        <p className="text-gray-600 mt-1">Manage incoming vehicle requests and client inquiries.</p>
                    </div>

                    <Card className="shadow-sm border-gray-100">
                        <CardHeader className="bg-white border-b border-gray-100 pb-4">
                            <CardTitle className="text-lg font-medium">Recent Vehicle Requests</CardTitle>
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