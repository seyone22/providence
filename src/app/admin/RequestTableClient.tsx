"use client";

import { useState } from "react";
import { MoreHorizontal, Trash, CheckCircle, Truck, Wrench, Loader2, FileText } from "lucide-react";
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
import Link from "next/link";
import { ExternalLink } from "lucide-react"; // add this to your existing lucide-react imports

type ActionModalState = {
    isOpen: boolean;
    type: "delete" | "processing" | "shipped" | "specs" | null;
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
        setTrackingNumber("");
        setGarageNotes("");
    };

    if (initialRequests.length === 0) {
        return (
            <div className="p-12 text-center text-gray-500 font-medium bg-black/20 rounded-xl border border-white/5">
                No requests found. When a client submits a form, it will appear here.
            </div>
        );
    }

    const glassInputClasses = "bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-white/20 focus-visible:border-white/30 transition-all";

    return (
        <div className="rounded-xl border border-white/10 overflow-hidden bg-black/40 backdrop-blur-md">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-white/10">
                        <TableHead className="text-gray-400">Date</TableHead>
                        <TableHead className="text-gray-400">Client</TableHead>
                        <TableHead className="text-gray-400">Contact</TableHead>
                        <TableHead className="text-gray-400">Requested Vehicle</TableHead>
                        <TableHead className="text-gray-400">Requirements</TableHead>
                        <TableHead className="text-gray-400">Status</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialRequests.map((req: any) => (
                        <TableRow key={req._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <TableCell className="text-sm text-gray-400 whitespace-nowrap">
                                {new Date(req.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="font-medium text-white">
                                {req.name}<br />
                                <span className="text-xs text-gray-500 font-normal">Import to: {req.countryOfImport}</span>
                            </TableCell>
                            <TableCell className="text-sm text-gray-300">
                                {req.email}<br />
                                <span className="text-gray-400">{req.countryCode} {req.phone}</span>
                            </TableCell>
                            <TableCell>
                                <span className="font-medium text-white">{req.make} {req.vehicle_model}</span><br />
                                <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                    {req.condition === "Used" ? (
                                        <>
                                            <Badge variant="outline" className="text-[10px] h-4 px-1 py-0 bg-white/5 border-white/10 text-gray-300 rounded">Pre-Owned</Badge>
                                            {req.yearFrom || "Any"} - {req.yearTo || "Any"} | Max {req.mileage || "Any"} mi
                                        </>
                                    ) : (
                                        <Badge variant="outline" className="text-[10px] h-4 px-1 py-0 bg-white/10 border-white/20 text-white rounded">Brand New</Badge>
                                    )}
                                </span>
                            </TableCell>
                            <TableCell className="text-sm text-gray-400 max-w-[200px]">
                                {req.specs ? (
                                    <div className="truncate cursor-pointer hover:text-white transition-colors" title={req.specs} onClick={() => setModal({ isOpen: true, type: "specs", request: req })}>
                                        {req.specs}
                                    </div>
                                ) : (
                                    <span className="text-gray-600 italic">None specified</span>
                                )}
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant="outline"
                                    className={`
                                        bg-black/40 backdrop-blur-md
                                        ${req.status === "New" ? "border-blue-500/50 text-blue-400" : ""}
                                        ${req.status === "Processing" ? "border-orange-500/50 text-orange-400" : ""}
                                        ${req.status === "Shipped" ? "border-green-500/50 text-green-400" : ""}
                                        ${req.status === "Accepted" ? "border-emerald-500/50 text-emerald-400" : ""}
                                    `}
                                >
                                    {req.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10 focus-visible:ring-0 focus-visible:ring-offset-0 outline-none border-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-[#111] border-white/10 text-white shadow-2xl">
                                        <DropdownMenuLabel className="text-gray-400">Actions</DropdownMenuLabel>

                                        {/* NEW: Permalink Tracker Button */}
                                        <DropdownMenuItem asChild className="hover:bg-white/10 focus:bg-white/10 cursor-pointer">
                                            <Link href={`/track/${req._id}`} target="_blank">
                                                <ExternalLink className="mr-2 h-4 w-4 text-purple-400" /> View Live Tracker
                                            </Link>
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator className="bg-white/10" />


                                        <DropdownMenuLabel className="text-gray-400">Actions</DropdownMenuLabel>

                                        {req.specs && (
                                            <DropdownMenuItem onClick={() => setModal({ isOpen: true, type: "specs", request: req })} className="hover:bg-white/10 focus:bg-white/10 cursor-pointer">
                                                <FileText className="mr-2 h-4 w-4 text-gray-300" /> View Full Specs
                                            </DropdownMenuItem>
                                        )}

                                        <DropdownMenuSeparator className="bg-white/10" />

                                        <DropdownMenuItem onClick={() => handleQuickStatus(req._id, "Accepted")} className="hover:bg-white/10 focus:bg-white/10 cursor-pointer">
                                            <CheckCircle className="mr-2 h-4 w-4 text-emerald-400" /> Mark as Accepted
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setModal({ isOpen: true, type: "processing", request: req })} className="hover:bg-white/10 focus:bg-white/10 cursor-pointer">
                                            <Wrench className="mr-2 h-4 w-4 text-orange-400" /> Move to Processing
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setModal({ isOpen: true, type: "shipped", request: req })} className="hover:bg-white/10 focus:bg-white/10 cursor-pointer">
                                            <Truck className="mr-2 h-4 w-4 text-blue-400" /> Mark as Shipped
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-white/10" />
                                        <DropdownMenuItem onClick={() => setModal({ isOpen: true, type: "delete", request: req })} className="text-red-400 focus:text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer">
                                            <Trash className="mr-2 h-4 w-4" /> Delete Request
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Dark/Glass Modal Dialog */}
            <Dialog open={modal.isOpen} onOpenChange={closeDialog}>
                <DialogContent className="bg-[#0f0f0f] border-white/10 text-white shadow-2xl sm:rounded-2xl max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">
                            {modal.type === "delete" && "Delete Request"}
                            {modal.type === "processing" && "Update to Processing"}
                            {modal.type === "shipped" && "Update to Shipped"}
                            {modal.type === "specs" && "Special Requirements"}
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                            {modal.type === "delete" && `Are you sure you want to delete the request for ${modal.request?.name}? This cannot be undone.`}
                            {modal.type === "processing" && "Enter preliminary garage notes or preparation details for this vehicle."}
                            {modal.type === "shipped" && "Enter the shipping details to notify the client."}
                            {modal.type === "specs" && `Requirements requested by ${modal.request?.name} for the ${modal.request?.make} ${modal.request?.vehicle_model}.`}
                        </DialogDescription>
                    </DialogHeader>

                    {/* View Specs Modal Content */}
                    {modal.type === "specs" && (
                        <div className="py-4 text-gray-300 leading-relaxed whitespace-pre-wrap bg-white/5 p-4 rounded-xl border border-white/10 mt-2">
                            {modal.request?.specs}
                        </div>
                    )}

                    {modal.type === "processing" && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="notes" className="text-right text-gray-300">Garage Notes</Label>
                                <Input id="notes" value={garageNotes} onChange={(e) => setGarageNotes(e.target.value)} className={`col-span-3 ${glassInputClasses}`} placeholder="e.g. Awaiting inspection..." />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="photo" className="text-right text-gray-300">Photos</Label>
                                <Input id="photo" type="file" className={`col-span-3 ${glassInputClasses} pt-2`} disabled placeholder="File upload coming soon" />
                            </div>
                        </div>
                    )}

                    {modal.type === "shipped" && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="tracking" className="text-right text-gray-300">Tracking #</Label>
                                <Input id="tracking" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} className={`col-span-3 ${glassInputClasses}`} placeholder="e.g. MSCU1234567" />
                            </div>
                        </div>
                    )}

                    <DialogFooter className="mt-4">
                        {modal.type === "specs" ? (
                            <Button variant="default" onClick={closeDialog} className="bg-white text-black hover:bg-gray-200">
                                Close
                            </Button>
                        ) : (
                            <>
                                <Button variant="outline" onClick={closeDialog} disabled={isProcessing} className="border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent">
                                    Cancel
                                </Button>
                                <Button
                                    variant={modal.type === "delete" ? "destructive" : "default"}
                                    onClick={handleActionSubmit}
                                    disabled={isProcessing}
                                    className={modal.type !== "delete" ? "bg-white text-black hover:bg-gray-200" : ""}
                                >
                                    {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin text-current" />}
                                    {modal.type === "delete" ? "Delete" : "Confirm Update"}
                                </Button>
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}