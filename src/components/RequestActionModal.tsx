"use client";

import { useState, useEffect } from "react";
import { Loader2, Paperclip, File, Image as ImageIcon, UserPlus, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import DynamicFileUploader, { PendingFile } from "@/components/dynamicFileUploader";
import { updateRequestStatus, deleteRequest } from "@/actions/admin-actions";
import { uploadToR2 } from "@/lib/file-actions";
import {SALES_STATUSES} from "@/app/admin/RequestTableClient";

export default function RequestActionModal({
                                               modal,
                                               onClose,
                                               staffUsers,
                                               currentUserId
                                           }: {
    modal: any;
    onClose: () => void;
    staffUsers: any[];
    currentUserId: string;
}) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [payload, setPayload] = useState<any>({});
    const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);

    const inputClasses = "bg-zinc-50 border-black/10 text-black placeholder:text-zinc-400 focus-visible:ring-black/5 focus-visible:border-black/30 transition-all rounded-xl";
    const selectClasses = "w-full bg-zinc-50 border border-black/10 text-black focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/30 transition-all rounded-xl px-4 py-3 appearance-none cursor-pointer";

    // Initialize payload when modal opens
    useEffect(() => {
        if (modal.isOpen && modal.request) {
            if (modal.type === "details") {
                setPayload({ adminNotes: modal.request.adminNotes || "" });
            } else if (modal.type === "assign") {
                setPayload({
                    assignedToId: modal.request.assignedToId || "",
                    assignedToName: modal.request.assignedToName || ""
                });
            } else if (modal.type === "sales_status") {
                // Initialize with current sales status, fallback to legacy leadStatus
                setPayload({
                    leadStatus: modal.request.leadStatus || "Action required"
                });
            } else {
                setPayload({});
            }
            setPendingFiles([]); // Reset files
        }
    }, [modal]);

    const handlePayloadChange = (key: string, value: string) => {
        setPayload((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleActionSubmit = async () => {
        if (!modal.request) return;
        setIsProcessing(true);

        try {
            if (modal.type === "delete") {
                await deleteRequest(modal.request._id);
            } else if (modal.type === "advance" && modal.targetStage) {
                let finalDocuments = modal.request.documents ? [...modal.request.documents] : [];

                const validFiles = pendingFiles.filter(pf => pf.file !== null);
                if (validFiles.length > 0) {
                    const formData = new FormData();
                    validFiles.forEach(pf => {
                        formData.append("files", pf.file as File);
                        formData.append("fieldNames", pf.fieldName || "Unnamed Document");
                        formData.append("fileTypes", pf.fileType);
                    });

                    const uploadRes: any = await uploadToR2(formData);
                    if (!uploadRes.success) throw new Error(uploadRes.message);

                    const newDocuments = uploadRes.uploadedFiles.map((file: any) => ({
                        ...file,
                        stageAdded: modal.targetStage
                    }));
                    finalDocuments = [...finalDocuments, ...newDocuments];
                }

                await updateRequestStatus(modal.request._id, modal.targetStage, { ...payload, documents: finalDocuments });
            } else if (modal.type === "revert" && modal.targetStage) {
                await updateRequestStatus(modal.request._id, modal.targetStage, payload);
            } else if (modal.type === "details" || modal.type === "assign" || modal.type === "sales_status") {
                // For these three types, we pass the *current* pipeline status so it doesn't move stages
                await updateRequestStatus(modal.request._id, modal.request.status, payload);
            }
        } catch (error) {
            console.error("Action failed:", error);
            alert(error instanceof Error ? error.message : "An error occurred.");
        } finally {
            setIsProcessing(false);
            onClose();
        }
    };

    return (
        <Dialog open={modal.isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white border-black/5 text-black shadow-2xl sm:rounded-[2rem] max-w-4xl min-w-3xl p-8 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold tracking-tight">
                        {modal.type === "delete" && "Delete Lead"}
                        {modal.type === "advance" && `Advance to ${modal.targetStage}`}
                        {modal.type === "revert" && `Revert to ${modal.targetStage}`}
                        {modal.type === "details" && "Lead Details & Notes"}
                        {modal.type === "assign" && "Assign Staff"}
                        {modal.type === "sales_status" && "Update Sales Status"}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 font-light mt-2">
                        {modal.type === "delete" && `Are you sure you want to delete ${modal.request?.name}'s inquiry? This cannot be undone.`}
                        {modal.type === "advance" && "Please provide the required details to move this lead to the next stage."}
                        {modal.type === "revert" && `Are you sure you want to move this lead back to the "${modal.targetStage}" stage?`}
                        {modal.type === "details" && `Review collected data, documents, and notes for ${modal.request?.name}.`}
                        {modal.type === "assign" && `Assign this request to a team member.`}
                        {modal.type === "sales_status" && `Select the current communication status for ${modal.request?.name}.`}
                    </DialogDescription>
                </DialogHeader>

                {/* --- SALES STATUS UPDATE --- */}
                {modal.type === "sales_status" && (
                    <div className="py-6 space-y-4">
                        <Label className="text-zinc-600 font-bold">Current Communication Status</Label>
                        <div className="relative">
                            <select
                                className={selectClasses}
                                // FIX 1: Read from payload.leadStatus
                                value={payload.leadStatus || "Action required"}
                                // FIX 2: Write to leadStatus
                                onChange={(e) => handlePayloadChange("leadStatus", e.target.value)}
                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a1a1aa' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
                            >
                                {SALES_STATUSES.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {/* --- ASSIGNMENT --- */}
                {modal.type === "assign" && (
                    <div className="py-6 space-y-4">
                        <Label className="text-zinc-600 font-bold">Select Staff Member</Label>
                        <div className="relative">
                            <select
                                className={selectClasses}
                                value={payload.assignedToId || ""}
                                onChange={(e) => {
                                    const selected = staffUsers.find(u => u.id === e.target.value);
                                    handlePayloadChange("assignedToId", selected?.id || "");
                                    handlePayloadChange("assignedToName", selected?.name || "");
                                }}
                            >
                                <option value="">-- Unassigned --</option>
                                {staffUsers.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} {user.id === currentUserId ? "(You)" : ""}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {payload.assignedToId !== currentUserId && (
                            <button
                                type="button"
                                onClick={() => {
                                    const me = staffUsers.find(u => u.id === currentUserId);
                                    if (me) {
                                        handlePayloadChange("assignedToId", me.id);
                                        handlePayloadChange("assignedToName", me.name);
                                    }
                                }}
                                className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1 mt-2"
                            >
                                <UserPlus size={14} /> Assign to me
                            </button>
                        )}
                    </div>
                )}

                {/* --- DETAILS & NOTES (Now includes Initial Lead Data) --- */}
                {modal.type === "details" && modal.request && (
                    <div className="space-y-6 mt-4">

                        {/* 1. INITIAL LEAD DATA */}
                        <div className="bg-white border border-black/5 shadow-sm rounded-2xl p-5 space-y-4 text-sm">
                            <h4 className="font-bold text-black border-b border-black/5 pb-2">Initial Lead Request</h4>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                                <div><span className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-1">Client Name</span><span className="font-medium text-black">{modal.request.name}</span></div>
                                <div><span className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-1">Contact Details</span><span className="font-medium text-black">{modal.request.email}<br />{modal.request.countryCode} {modal.request.phone}</span></div>
                                <div><span className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-1">Destination</span><span className="font-medium text-black">{modal.request.countryOfImport}</span></div>
                                <div><span className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-1">Vehicle</span><span className="font-medium text-black">{modal.request.make} {modal.request.vehicle_model}</span></div>
                                <div><span className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-1">Condition</span><span className="font-medium text-black">{modal.request.condition}</span></div>

                                {modal.request.condition === "Used" && (
                                    <>
                                        <div><span className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-1">Year Range</span><span className="font-medium text-black">{modal.request.yearFrom || "Any"} - {modal.request.yearTo || "Any"}</span></div>
                                        <div><span className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-1">Max Mileage</span><span className="font-medium text-black">{modal.request.mileage || "Any"}</span></div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* 2. PIPELINE DATA */}
                        <div className="bg-zinc-50 border border-black/5 rounded-2xl p-5 space-y-4 text-sm">
                            <h4 className="font-bold text-black border-b border-black/5 pb-2">Collected Pipeline Data</h4>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                                {modal.request.agreedPrice && <div><span className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-1">Agreed Price</span><span className="font-medium text-black">${modal.request.agreedPrice}</span></div>}
                                {modal.request.depositAmount && <div><span className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-1">Deposit</span><span className="font-medium text-black">${modal.request.depositAmount}</span></div>}
                                {modal.request.transactionId && <div><span className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-1">Receipt ID</span><span className="font-medium text-black">{modal.request.transactionId}</span></div>}
                                {modal.request.invoiceNumber && <div><span className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-1">Invoice #</span><span className="font-medium text-black">{modal.request.invoiceNumber}</span></div>}
                                {modal.request.trackingNumber && <div><span className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-1">Tracking #</span><span className="font-medium text-black">{modal.request.trackingNumber}</span></div>}
                                {modal.request.vesselName && <div><span className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-1">Vessel</span><span className="font-medium text-black">{modal.request.vesselName}</span></div>}
                                {modal.request.portName && <div><span className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-1">Arrival Port</span><span className="font-medium text-black">{modal.request.portName}</span></div>}
                                {modal.request.eta && <div><span className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-1">ETA</span><span className="font-medium text-black">{new Date(modal.request.eta).toLocaleDateString()}</span></div>}
                            </div>
                        </div>

                        {/* 3. DOCUMENTS */}
                        <div className="space-y-3">
                            <Label className="text-zinc-600 font-bold flex items-center gap-2">
                                <Paperclip size={16} /> Attached Documents
                            </Label>
                            {modal.request.documents && modal.request.documents.length > 0 ? (
                                <div className="grid gap-2">
                                    {modal.request.documents.map((doc: any, i: number) => (
                                        <a key={i} href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white border border-black/5 rounded-xl hover:bg-zinc-50 hover:border-black/10 transition-all group">
                                            <div className="p-2 bg-zinc-100 rounded-lg text-zinc-500 group-hover:text-black group-hover:bg-black/5 transition-colors">
                                                {doc.fileType === "pdf" ? <File size={18} /> : <ImageIcon size={18} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-black truncate">{doc.fieldName}</p>
                                                <Badge variant="outline" className="text-[9px] uppercase tracking-tighter py-0 px-1.5 h-4 bg-zinc-100 border-none text-zinc-500 mt-1">
                                                    {doc.stageAdded}
                                                </Badge>
                                            </div>
                                            <ExternalLink size={14} className="text-zinc-300 group-hover:text-black mr-2 transition-colors" />
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-4 text-center border border-dashed border-black/10 rounded-xl">
                                    <p className="text-xs text-zinc-400 italic">No files have been uploaded for this lead yet.</p>
                                </div>
                            )}
                        </div>

                        {/* 4. ADMIN NOTES */}
                        <div className="space-y-2">
                            <Label className="text-zinc-600 font-bold">Internal Admin Notes</Label>
                            <Textarea
                                value={payload.adminNotes || ""}
                                onChange={(e) => handlePayloadChange("adminNotes", e.target.value)}
                                className={`${inputClasses} min-h-[100px] resize-none`}
                                placeholder="Add private internal notes about this client or vehicle..."
                            />
                        </div>
                    </div>
                )}

                {/* --- REVERT NOTES --- */}
                {modal.type === "revert" && (
                    <div className="py-6 space-y-4">
                        <Label className="text-zinc-600 font-bold">Reason for Reverting (Optional)</Label>
                        <Textarea onChange={(e) => handlePayloadChange("adminNotes", e.target.value)} className={`${inputClasses} min-h-[100px] resize-none`} placeholder="Make a note of why this lead is moving backwards in the pipeline..." />
                    </div>
                )}

                {/* --- ADVANCE DYNAMIC FIELDS --- */}
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
                                <div className="space-y-2"><Label className="text-zinc-600 font-bold">Deposit Amount Collected</Label><Input type="number" onChange={(e) => handlePayloadChange("depositAmount", e.target.value)} className={inputClasses} placeholder="e.g. 5000" /></div>
                                <div className="space-y-2"><Label className="text-zinc-600 font-bold">Transaction / Receipt ID</Label><Input onChange={(e) => handlePayloadChange("transactionId", e.target.value)} className={inputClasses} placeholder="e.g. TXN-998231" /></div>
                            </>
                        )}
                        {modal.targetStage === "Vehicle Purchased" && (
                            <div className="space-y-2"><Label className="text-zinc-600 font-bold">Internal Invoice / Purchase #</Label><Input onChange={(e) => handlePayloadChange("invoiceNumber", e.target.value)} className={inputClasses} placeholder="e.g. INV-2023-A4" /></div>
                        )}
                        {modal.targetStage === "Preparation" && (
                            <div className="space-y-2"><Label className="text-zinc-600 font-bold">Inspection & Prep Notes</Label><Textarea onChange={(e) => handlePayloadChange("inspectionNotes", e.target.value)} className={inputClasses} placeholder="e.g. Car received at garage. Export physical checks passed..." /></div>
                        )}
                        {modal.targetStage === "Shipped" && (
                            <>
                                <div className="space-y-2"><Label className="text-zinc-600 font-bold">Shipping Tracking Number</Label><Input onChange={(e) => handlePayloadChange("trackingNumber", e.target.value)} className={inputClasses} placeholder="e.g. MSCU1234567" /></div>
                                <div className="space-y-2"><Label className="text-zinc-600 font-bold">Vessel Name</Label><Input onChange={(e) => handlePayloadChange("vesselName", e.target.value)} className={inputClasses} placeholder="e.g. Ever Given" /></div>
                                <div className="space-y-2"><Label className="text-zinc-600 font-bold">Estimated Arrival (ETA)</Label><Input type="date" onChange={(e) => handlePayloadChange("eta", e.target.value)} className={inputClasses} /></div>
                            </>
                        )}
                        {modal.targetStage === "Arrived at Port" && (
                            <div className="space-y-2"><Label className="text-zinc-600 font-bold">Port of Arrival</Label><Input onChange={(e) => handlePayloadChange("portName", e.target.value)} className={inputClasses} placeholder="e.g. Port of Los Angeles" /></div>
                        )}
                        {modal.targetStage === "Cleared Customs" && (
                            <div className="space-y-2"><Label className="text-zinc-600 font-bold">Final Notes / Delivery Instructions</Label><Textarea onChange={(e) => handlePayloadChange("customsNotes", e.target.value)} className={inputClasses} placeholder="e.g. Duties paid, ready for flatbed pickup." /></div>
                        )}

                        <div className="mt-2 border-t border-black/5 pt-6">
                            <DynamicFileUploader onFilesChange={setPendingFiles} />
                        </div>
                    </div>
                )}

                <DialogFooter className="mt-6 border-t border-black/5 pt-6">
                    <Button variant="outline" onClick={onClose} disabled={isProcessing} className="border-black/10 text-zinc-600 hover:bg-zinc-50 hover:text-black rounded-xl px-6">
                        Cancel
                    </Button>
                    <Button
                        variant={modal.type === "delete" ? "destructive" : modal.type === "revert" ? "secondary" : "default"}
                        onClick={handleActionSubmit}
                        disabled={isProcessing}
                        className={modal.type === "advance" || modal.type === "details" || modal.type === "assign" || modal.type === "sales_status" ? "bg-black text-white hover:bg-zinc-800 rounded-xl px-8" : "rounded-xl px-8"}
                    >
                        {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin text-current" />}
                        {modal.type === "delete" ? "Delete Lead" :
                            modal.type === "revert" ? "Revert Stage" :
                                modal.type === "details" ? "Save Notes" :
                                    modal.type === "assign" ? "Confirm Assignment" :
                                        modal.type === "sales_status" ? "Save Status" :
                                            `Update to ${modal.targetStage}`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}