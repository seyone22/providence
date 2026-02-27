"use client";

import { useState } from "react";
import { MoreHorizontal, Trash, Loader2, FileText, ExternalLink, ArrowRight, Eye } from "lucide-react";
import { updateRequestStatus, deleteRequest } from "@/actions/admin-actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import Link from "next/link";

// The official workflow stages
const PIPELINE_STAGES = [
    "New",
    "Vehicle Selection",
    "Price Agreement",
    "Deposit Collected",
    "Vehicle Purchased",
    "Preparation",
    "Shipped",
    "Arrived at Port",
    "Cleared Customs"
];

type ActionModalState = {
    isOpen: boolean;
    type: "advance" | "delete" | "specs" | "details" | null;
    request: any | null;
    targetStage: string | null;
};

export default function RequestTableClient({ initialRequests }: { initialRequests: any[] }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [modal, setModal] = useState<ActionModalState>({ isOpen: false, type: null, request: null, targetStage: null });

    // Universal payload state for the form fields
    const [payload, setPayload] = useState<any>({});

    const closeDialog = () => {
        setModal({ isOpen: false, type: null, request: null, targetStage: null });
        setPayload({}); // Reset form
    };

    const handlePayloadChange = (key: string, value: string) => {
        setPayload((prev: any) => ({ ...prev, [key]: value }));
    };

    const getNextStage = (currentStatus: string) => {
        const currentIndex = PIPELINE_STAGES.indexOf(currentStatus || "New");
        if (currentIndex === -1 || currentIndex === PIPELINE_STAGES.length - 1) return null;
        return PIPELINE_STAGES[currentIndex + 1];
    };

    const openAdvanceModal = (req: any) => {
        const next = getNextStage(req.status || "New");
        if (next) {
            setModal({ isOpen: true, type: "advance", request: req, targetStage: next });
        }
    };

    const openDetailsModal = (req: any) => {
        setPayload({ adminNotes: req.adminNotes || "" }); // Pre-fill existing notes
        setModal({ isOpen: true, type: "details", request: req, targetStage: null });
    };

    const handleActionSubmit = async () => {
        if (!modal.request) return;
        setIsProcessing(true);

        if (modal.type === "delete") {
            await deleteRequest(modal.request._id);
        } else if (modal.type === "advance" && modal.targetStage) {
            await updateRequestStatus(modal.request._id, modal.targetStage, payload);
        } else if (modal.type === "details") {
            // Re-saving the existing status, just patching the adminNotes
            await updateRequestStatus(modal.request._id, modal.request.status, { adminNotes: payload.adminNotes });
        }

        setIsProcessing(false);
        closeDialog();
    };

    if (initialRequests.length === 0) {
        return (
            <div className="p-16 text-center text-zinc-500 font-medium bg-white">
                No active requests found. When a client submits an inquiry, it will appear here.
            </div>
        );
    }

    const inputClasses = "bg-zinc-50 border-black/10 text-black placeholder:text-zinc-400 focus-visible:ring-black/5 focus-visible:border-black/30 transition-all rounded-xl";

    const getStatusBadge = (status: string) => {
        const current = status || "New";
        const isEarly = ["New", "Vehicle Selection", "Price Agreement"].includes(current);
        const isMiddle = ["Deposit Collected", "Vehicle Purchased", "Preparation"].includes(current);
        const isShipping = ["Shipped", "Arrived at Port"].includes(current);
        const isDone = current === "Cleared Customs";

        if (isDone) return <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 rounded-full px-3">{current}</Badge>;
        if (isShipping) return <Badge className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 rounded-full px-3">{current}</Badge>;
        if (isMiddle) return <Badge className="bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100 rounded-full px-3">{current}</Badge>;
        return <Badge className="bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200 rounded-full px-3">{current}</Badge>;
    };

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader className="bg-zinc-50">
                    <TableRow className="border-black/5">
                        <TableHead className="text-zinc-500 font-semibold py-4 pl-6">Client</TableHead>
                        <TableHead className="text-zinc-500 font-semibold">Contact</TableHead>
                        <TableHead className="text-zinc-500 font-semibold">Requested Vehicle</TableHead>
                        <TableHead className="text-zinc-500 font-semibold">Stage</TableHead>
                        <TableHead className="w-[80px] pr-6"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialRequests.map((req: any) => {
                        const nextStage = getNextStage(req.status || "New");

                        return (
                            <TableRow key={req._id} className="border-b border-black/5 hover:bg-zinc-50/50 transition-colors">
                                <TableCell className="py-4 pl-6">
                                    <div className="font-bold text-black">{req.name}</div>
                                    <div className="text-xs text-zinc-500 font-medium mt-0.5">Import to: {req.countryOfImport}</div>
                                    <div className="text-[10px] text-zinc-400 mt-1">{new Date(req.createdAt).toLocaleDateString()}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm font-medium text-zinc-800">{req.email}</div>
                                    <div className="text-sm text-zinc-500">{req.countryCode} {req.phone}</div>
                                </TableCell>
                                <TableCell>
                                    <span className="font-bold text-black">{req.make} {req.vehicle_model}</span><br />
                                    <span className="text-xs text-zinc-500 flex items-center gap-2 mt-1">
                                        {req.condition === "Used" ? (
                                            <>
                                                <span className="px-2 py-0.5 bg-zinc-100 border border-black/5 rounded-md text-zinc-600 font-medium">Pre-Owned</span>
                                                {req.yearFrom || "Any"} - {req.yearTo || "Any"} | Max {req.mileage || "Any"} mi
                                            </>
                                        ) : (
                                            <span className="px-2 py-0.5 bg-black/5 border border-black/10 rounded-md text-black font-medium">Brand New</span>
                                        )}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {getStatusBadge(req.status)}
                                </TableCell>
                                <TableCell className="pr-6">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 text-zinc-400 hover:text-black hover:bg-black/5 border-0 rounded-lg">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-white border-black/5 text-black shadow-xl rounded-xl w-56 p-2">

                                            {nextStage && (
                                                <DropdownMenuItem onClick={() => openAdvanceModal(req)} className="font-bold text-black hover:bg-black/5 focus:bg-black/5 cursor-pointer rounded-lg mb-1 py-2">
                                                    <ArrowRight className="mr-2 h-4 w-4" /> Advance to: {nextStage}
                                                </DropdownMenuItem>
                                            )}

                                            <DropdownMenuItem onClick={() => openDetailsModal(req)} className="hover:bg-black/5 focus:bg-black/5 cursor-pointer rounded-lg">
                                                <Eye className="mr-2 h-4 w-4 text-zinc-500" /> View Details & Notes
                                            </DropdownMenuItem>

                                            <DropdownMenuItem asChild className="hover:bg-black/5 focus:bg-black/5 cursor-pointer rounded-lg">
                                                <Link href={`/track/${req._id}`} target="_blank">
                                                    <ExternalLink className="mr-2 h-4 w-4 text-blue-500" /> Live Tracker
                                                </Link>
                                            </DropdownMenuItem>

                                            {req.specs && (
                                                <DropdownMenuItem onClick={() => setModal({ isOpen: true, type: "specs", request: req } as any)} className="hover:bg-black/5 focus:bg-black/5 cursor-pointer rounded-lg">
                                                    <FileText className="mr-2 h-4 w-4 text-zinc-400" /> View User Specs
                                                </DropdownMenuItem>
                                            )}

                                            <DropdownMenuSeparator className="bg-black/5 my-2" />

                                            <DropdownMenuItem onClick={() => setModal({ isOpen: true, type: "delete", request: req } as any)} className="text-red-500 focus:text-red-600 hover:bg-red-50 focus:bg-red-50 cursor-pointer rounded-lg">
                                                <Trash className="mr-2 h-4 w-4" /> Delete Lead
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            {/* ACTION MODAL */}
            <Dialog open={modal.isOpen} onOpenChange={closeDialog}>
                <DialogContent className="bg-white border-black/5 text-black shadow-2xl sm:rounded-[2rem] max-w-lg p-8 max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold tracking-tight">
                            {modal.type === "delete" && "Delete Lead"}
                            {modal.type === "specs" && "Special Requirements"}
                            {modal.type === "advance" && `Advance to ${modal.targetStage}`}
                            {modal.type === "details" && "Lead Details & Notes"}
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500 font-light mt-2">
                            {modal.type === "delete" && `Are you sure you want to delete ${modal.request?.name}'s inquiry? This cannot be undone.`}
                            {modal.type === "specs" && `Requested by ${modal.request?.name} for the ${modal.request?.make} ${modal.request?.vehicle_model}.`}
                            {modal.type === "advance" && "Please provide the required details to move this lead to the next stage."}
                            {modal.type === "details" && `Review collected data and internal notes for ${modal.request?.name}.`}
                        </DialogDescription>
                    </DialogHeader>

                    {/* Content: Specs */}
                    {modal.type === "specs" && (
                        <div className="py-4 text-black leading-relaxed whitespace-pre-wrap bg-zinc-50 p-5 rounded-2xl border border-black/5 mt-4 text-sm">
                            {modal.request?.specs}
                        </div>
                    )}

                    {/* Content: Details & Notes (NEW) */}
                    {modal.type === "details" && modal.request && (
                        <div className="space-y-6 mt-4">
                            {/* Read-Only Pipeline Data Grid */}
                            <div className="bg-zinc-50 border border-black/5 rounded-2xl p-5 space-y-4 text-sm">
                                <h4 className="font-bold text-black border-b border-black/5 pb-2">Collected Pipeline Data</h4>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                    {modal.request.agreedPrice && <div><span className="block text-zinc-500 text-xs uppercase tracking-wider mb-1">Agreed Price</span><span className="font-medium">${modal.request.agreedPrice}</span></div>}
                                    {modal.request.depositAmount && <div><span className="block text-zinc-500 text-xs uppercase tracking-wider mb-1">Deposit</span><span className="font-medium">${modal.request.depositAmount}</span></div>}
                                    {modal.request.transactionId && <div><span className="block text-zinc-500 text-xs uppercase tracking-wider mb-1">Receipt ID</span><span className="font-medium">{modal.request.transactionId}</span></div>}
                                    {modal.request.invoiceNumber && <div><span className="block text-zinc-500 text-xs uppercase tracking-wider mb-1">Invoice #</span><span className="font-medium">{modal.request.invoiceNumber}</span></div>}
                                    {modal.request.trackingNumber && <div><span className="block text-zinc-500 text-xs uppercase tracking-wider mb-1">Tracking #</span><span className="font-medium">{modal.request.trackingNumber}</span></div>}
                                    {modal.request.vesselName && <div><span className="block text-zinc-500 text-xs uppercase tracking-wider mb-1">Vessel</span><span className="font-medium">{modal.request.vesselName}</span></div>}
                                    {modal.request.portName && <div><span className="block text-zinc-500 text-xs uppercase tracking-wider mb-1">Arrival Port</span><span className="font-medium">{modal.request.portName}</span></div>}
                                    {modal.request.eta && <div><span className="block text-zinc-500 text-xs uppercase tracking-wider mb-1">ETA</span><span className="font-medium">{new Date(modal.request.eta).toLocaleDateString()}</span></div>}
                                </div>

                                {/* Full width text areas */}
                                {modal.request.options && <div className="pt-2"><span className="block text-zinc-500 text-xs uppercase tracking-wider mb-1">Options Sent</span><span className="font-medium whitespace-pre-wrap">{modal.request.options}</span></div>}
                                {modal.request.inspectionNotes && <div className="pt-2"><span className="block text-zinc-500 text-xs uppercase tracking-wider mb-1">Inspection Notes</span><span className="font-medium whitespace-pre-wrap">{modal.request.inspectionNotes}</span></div>}
                                {modal.request.customsNotes && <div className="pt-2"><span className="block text-zinc-500 text-xs uppercase tracking-wider mb-1">Customs Notes</span><span className="font-medium whitespace-pre-wrap">{modal.request.customsNotes}</span></div>}
                            </div>

                            {/* Editable Internal Notes */}
                            <div className="space-y-2">
                                <Label className="text-zinc-600 font-bold">Internal Admin Notes</Label>
                                <Textarea
                                    value={payload.adminNotes || ""}
                                    onChange={(e) => handlePayloadChange("adminNotes", e.target.value)}
                                    className={`${inputClasses} min-h-[120px] resize-none`}
                                    placeholder="Add private internal notes about this client or vehicle..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Content: Dynamic Form Fields based on Next Stage */}
                    {modal.type === "advance" && (
                        <div className="grid gap-5 py-6">

                            {modal.targetStage === "Vehicle Selection" && (
                                <div className="space-y-2">
                                    <Label className="text-zinc-600 font-bold">Proposed Options / Links</Label>
                                    <Textarea onChange={(e) => handlePayloadChange("options", e.target.value)} className={inputClasses} placeholder="Paste links to cars or list options sent to the client..." />
                                </div>
                            )}

                            {modal.targetStage === "Price Agreement" && (
                                <div className="space-y-2">
                                    <Label className="text-zinc-600 font-bold">Agreed Price (USD)</Label>
                                    <Input type="number" onChange={(e) => handlePayloadChange("agreedPrice", e.target.value)} className={inputClasses} placeholder="e.g. 125000" />
                                </div>
                            )}

                            {modal.targetStage === "Deposit Collected" && (
                                <>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-600 font-bold">Deposit Amount Collected</Label>
                                        <Input type="number" onChange={(e) => handlePayloadChange("depositAmount", e.target.value)} className={inputClasses} placeholder="e.g. 5000" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-600 font-bold">Transaction / Receipt ID</Label>
                                        <Input onChange={(e) => handlePayloadChange("transactionId", e.target.value)} className={inputClasses} placeholder="e.g. TXN-998231" />
                                    </div>
                                </>
                            )}

                            {modal.targetStage === "Vehicle Purchased" && (
                                <div className="space-y-2">
                                    <Label className="text-zinc-600 font-bold">Internal Invoice / Purchase #</Label>
                                    <Input onChange={(e) => handlePayloadChange("invoiceNumber", e.target.value)} className={inputClasses} placeholder="e.g. INV-2023-A4" />
                                </div>
                            )}

                            {modal.targetStage === "Preparation" && (
                                <div className="space-y-2">
                                    <Label className="text-zinc-600 font-bold">Inspection & Prep Notes</Label>
                                    <Textarea onChange={(e) => handlePayloadChange("inspectionNotes", e.target.value)} className={inputClasses} placeholder="e.g. Car received at garage. Export physical checks passed..." />
                                </div>
                            )}

                            {modal.targetStage === "Shipped" && (
                                <>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-600 font-bold">Shipping Tracking Number</Label>
                                        <Input onChange={(e) => handlePayloadChange("trackingNumber", e.target.value)} className={inputClasses} placeholder="e.g. MSCU1234567" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-600 font-bold">Vessel Name</Label>
                                        <Input onChange={(e) => handlePayloadChange("vesselName", e.target.value)} className={inputClasses} placeholder="e.g. Ever Given" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-600 font-bold">Estimated Arrival (ETA)</Label>
                                        <Input type="date" onChange={(e) => handlePayloadChange("eta", e.target.value)} className={inputClasses} />
                                    </div>
                                </>
                            )}

                            {modal.targetStage === "Arrived at Port" && (
                                <div className="space-y-2">
                                    <Label className="text-zinc-600 font-bold">Port of Arrival</Label>
                                    <Input onChange={(e) => handlePayloadChange("portName", e.target.value)} className={inputClasses} placeholder="e.g. Port of Los Angeles" />
                                </div>
                            )}

                            {modal.targetStage === "Cleared Customs" && (
                                <div className="space-y-2">
                                    <Label className="text-zinc-600 font-bold">Final Notes / Delivery Instructions</Label>
                                    <Textarea onChange={(e) => handlePayloadChange("customsNotes", e.target.value)} className={inputClasses} placeholder="e.g. Duties paid, ready for flatbed pickup." />
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter className="mt-6 border-t border-black/5 pt-6">
                        {modal.type === "specs" ? (
                            <Button variant="default" onClick={closeDialog} className="bg-black text-white hover:bg-zinc-800 rounded-xl px-8">
                                Close
                            </Button>
                        ) : (
                            <>
                                <Button variant="outline" onClick={closeDialog} disabled={isProcessing} className="border-black/10 text-zinc-600 hover:bg-zinc-50 hover:text-black rounded-xl px-6">
                                    Cancel
                                </Button>
                                <Button
                                    variant={modal.type === "delete" ? "destructive" : "default"}
                                    onClick={handleActionSubmit}
                                    disabled={isProcessing}
                                    className={modal.type !== "delete" ? "bg-black text-white hover:bg-zinc-800 rounded-xl px-8" : "rounded-xl px-8"}
                                >
                                    {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin text-current" />}
                                    {modal.type === "delete" ? "Delete Lead" : modal.type === "details" ? "Save Notes" : `Update to ${modal.targetStage}`}
                                </Button>
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}