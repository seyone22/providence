import Navbar from "@/app/components/Navbar";
import { getRequests } from "@/actions/admin-actions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { LayoutDashboard } from "lucide-react";

export default async function AdminDashboard() {
    // Fetch data directly on the server
    const requests = await getRequests();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* You might want a specific AdminNavbar later, but this works for now */}
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
                            {requests.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    No requests found. When a client submits a form, it will appear here.
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader className="bg-gray-50/50">
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Client</TableHead>
                                            <TableHead>Contact</TableHead>
                                            <TableHead>Requested Vehicle</TableHead>
                                            <TableHead>Budget</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {requests.map((req: any) => (
                                            <TableRow key={req._id} className="hover:bg-gray-50/50">
                                                <TableCell className="text-sm text-gray-500 whitespace-nowrap">
                                                    {new Date(req.createdAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {req.name}
                                                    <br />
                                                    <span className="text-xs text-gray-500 font-normal">{req.country} - {req.city}</span>
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-600">
                                                    {req.email}
                                                    <br />
                                                    {req.phone}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-medium">{req.make} {req.model}</span>
                                                    <br />
                                                    <span className="text-xs text-gray-500">
                            Years: {req.yearFrom || "Any"} - {req.yearTo || "Any"}
                          </span>
                                                </TableCell>
                                                <TableCell className="text-sm font-medium">
                                                    {req.budget.toLocaleString()} {req.currency.toUpperCase()}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={req.status === "New" ? "default" : "secondary"}
                                                        className={req.status === "New" ? "bg-blue-600 hover:bg-blue-700" : ""}
                                                    >
                                                        {req.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}