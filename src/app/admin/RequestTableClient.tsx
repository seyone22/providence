"use client";

import { useState } from "react";
import { MoreHorizontal, Trash, CheckCircle, Truck, Wrench, Loader2 } from "lucide-react";
import { updateRequestStatus, deleteRequest } from "@/actions/admin-actions";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/app/components/ui/dialog";

type ActionModalState = {
    isOpen: boolean;
    type: "delete" | "processing" | "shipped" | null;
    request: any | null;
};

export default function RequestTableClient({ initialRequests }: { initialRequests: any[] }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [modal, setModal] = useState<ActionModalState>({ isOpen: false, type: null, request: null });

    // Form states for modals
    const [trackingNumber, setTrackingNumber] = useState("");
    const [garageNotes, setGarageNotes] = useState("");

    const closeDialog = () => setModal({ isOpen: false, type: null, request: null });

    const handleQuickStatus = async (id: string, status: string) => {
        setIsProcessing(true);
        await updateRequestStatus(id, status);
        setIsProcessing(false);
    };

    const handleActionSubmit = async () => {
        if (!modal.request) return;
        setIsProcessing(true);

        if (modal.type === "delete") {
            await deleteRequest(modal.request._id);
        } else if (modal.type === "processing") {
            await updateRequestStatus(modal.request._id, "Processing", { garageNotes });
        } else if (modal.type === "shipped") {
            await updateRequestStatus(modal.request._id, "Shipped", { trackingNumber });
        }

        setIsProcessing(false);
        closeDialog();
        // Reset local states
        setTrackingNumber("");
        setGarageNotes("");
    };

    if (initialRequests.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500">
                No requests found. When a client submits a form, it will appear here.
            </div>
        );
    }

    return (
        <>
            <Table>
                <TableHeader className="bg-gray-50/50">
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Requested Vehicle</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialRequests.map((req: any) => (
                        <TableRow key={req._id} className="hover:bg-gray-50/50">
                            <TableCell className="text-sm text-gray-500 whitespace-nowrap">
                                {new Date(req.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="font-medium">
                                {req.name}<br />
                                <span className="text-xs text-gray-500 font-normal">{req.country} - {req.city}</span>
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                                {req.email}<br />{req.phone}
                            </TableCell>
                            <TableCell>
                                <span className="font-medium">{req.make} {req.model}</span><br />
                                <span className="text-xs text-gray-500">
                                    Years: {req.yearFrom || "Any"} - {req.yearTo || "Any"}
                                </span>
                            </TableCell>
                            <TableCell className="text-sm font-medium">
                                {req.budget.toLocaleString()} {req.currency.toUpperCase()}
                            </TableCell>
                            <TableCell>
                                <Badge variant={req.status === "New" ? "default" : "secondary"} className={req.status === "New" ? "bg-blue-600 hover:bg-blue-700" : ""}>
                                    {req.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => handleQuickStatus(req._id, "Accepted")}>
                                            <CheckCircle className="mr-2 h-4 w-4 text-green-600" /> Mark as Accepted
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setModal({ isOpen: true, type: "processing", request: req })}>
                                            <Wrench className="mr-2 h-4 w-4 text-orange-600" /> Move to Processing
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setModal({ isOpen: true, type: "shipped", request: req })}>
                                            <Truck className="mr-2 h-4 w-4 text-blue-600" /> Mark as Shipped
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => setModal({ isOpen: true, type: "delete", request: req })} className="text-red-600 focus:text-red-600">
                                            <Trash className="mr-2 h-4 w-4" /> Delete Request
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Reusable Dialog for Modals */}
            <Dialog open={modal.isOpen} onOpenChange={closeDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {modal.type === "delete" && "Delete Request"}
                            {modal.type === "processing" && "Update to Processing"}
                            {modal.type === "shipped" && "Update to Shipped"}
                        </DialogTitle>
                        <DialogDescription>
                            {modal.type === "delete" && `Are you sure you want to delete the request for ${modal.request?.name}? This cannot be undone.`}
                            {modal.type === "processing" && "Enter preliminary garage notes or preparation details for this vehicle."}
                            {modal.type === "shipped" && "Enter the shipping details to notify the client."}
                        </DialogDescription>
                    </DialogHeader>

                    {/* Modal specific inputs */}
                    {modal.type === "processing" && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="notes" className="text-right">Garage Notes</Label>
                                <Input id="notes" value={garageNotes} onChange={(e) => setGarageNotes(e.target.value)} className="col-span-3" placeholder="e.g. Awaiting inspection..." />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="photo" className="text-right">Photos</Label>
                                <Input id="photo" type="file" className="col-span-3" disabled placeholder="File upload coming soon" />
                            </div>
                        </div>
                    )}

                    {modal.type === "shipped" && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="tracking" className="text-right">Tracking #</Label>
                                <Input id="tracking" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} className="col-span-3" placeholder="e.g. MSCU1234567" />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={closeDialog} disabled={isProcessing}>Cancel</Button>
                        <Button
                            variant={modal.type === "delete" ? "destructive" : "default"}
                            onClick={handleActionSubmit}
                            disabled={isProcessing}
                        >
                            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {modal.type === "delete" ? "Delete" : "Confirm Update"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}