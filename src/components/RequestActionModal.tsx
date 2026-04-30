"use client";

import { useState, useEffect } from "react";
import {Loader2, Paperclip, File, Image as ImageIcon, UserPlus, ExternalLink, Activity} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import DynamicFileUploader, { PendingFile } from "@/components/dynamicFileUploader";
import { updateRequestStatus, deleteRequest } from "@/actions/admin-actions";
import { uploadToR2 } from "@/lib/file-actions";
import { SALES_STATUSES } from "@/app/admin/RequestTableClient"; // Adjust path if needed

// Add the pipeline stages here so we can map them in the dropdown
const PIPELINE_STAGES = [
    "New", "Vehicle Selection", "Price Agreement", "Deposit Collected",
    "Vehicle Purchased", "Preparation", "Shipped", "Arrived at Port", "Cleared Customs"
];

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
                setPayload({
                    leadStatus: modal.request.leadStatus || "Action required"
                });
            } else {
                // Initialize default payment type if we are opening Price Agreement
                if (modal.type === "advance" && modal.targetStage === "Price Agreement") {
                    setPayload({ paymentType: "Full payment" });
                } else {
                    setPayload({});
                }
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
            // --- NEW: PAYLOAD SANITIZATION ---
            let formattedPayload = { ...payload };

            if (modal.targetStage === "Price Agreement") {
                // 1. Safely convert string inputs to actual Numbers
                if (formattedPayload.totalAmount) formattedPayload.totalAmount = Number(formattedPayload.totalAmount);
                if (formattedPayload.agreedPrice) formattedPayload.agreedPrice = Number(formattedPayload.agreedPrice);

                // 2. Prevent dirty data: Wipe partial payment fields if Full Payment is selected
                if (formattedPayload.paymentType === "Full payment") {
                    formattedPayload.advancePaymentAmount = null;
                    formattedPayload.balancePaymentAmount = null;
                    formattedPayload.balancePaymentStage = null;
                } else if (formattedPayload.paymentType === "Partial Payments") {
                    // Convert partial inputs to Numbers
                    if (formattedPayload.advancePaymentAmount) formattedPayload.advancePaymentAmount = Number(formattedPayload.advancePaymentAmount);
                    if (formattedPayload.balancePaymentAmount) formattedPayload.balancePaymentAmount = Number(formattedPayload.balancePaymentAmount);
                }
            }
            // ---------------------------------

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

                // Make sure to pass `formattedPayload` here instead of `payload`
                await updateRequestStatus(modal.request._id, modal.targetStage, { ...formattedPayload, documents: finalDocuments });
            } else if (modal.type === "revert" && modal.targetStage) {
                // Make sure to pass `formattedPayload` here too
                await updateRequestStatus(modal.request._id, modal.targetStage, formattedPayload);
            } else if (modal.type === "details" || modal.type === "assign" || modal.type === "sales_status") {
                // Make sure to pass `formattedPayload` here too
                await updateRequestStatus(modal.request._id, modal.request.status, formattedPayload);
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
                                value={payload.leadStatus || "Action required"}
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

                {/* 5. HISTORY & TIMELINE */}
                <div className="space-y-3 pt-2">
                    <Label className="text-zinc-600 font-bold flex items-center gap-2">
                        <Activity size={16} /> Activity History
                    </Label>

                    <div className="bg-white border border-black/5 rounded-2xl p-4 max-h-[250px] overflow-y-auto hide-scrollbar">
                        {modal.request?.statusHistory && modal.request.statusHistory.length > 0 ? (
                            <div className="relative space-y-4 before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-black/10 before:to-transparent">
                                {/* Sort history so newest is at the top */}
                                {[...modal.request.statusHistory].reverse().map((log: any, i: number) => (
                                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-white bg-zinc-300 group-[.is-active]:bg-black text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                                        <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1rem)] p-3 rounded-xl bg-zinc-50 border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="font-bold text-black text-xs">{log.performedBy}</div>
                                                <time className="text-[9px] font-medium text-zinc-400">{new Date(log.date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</time>
                                            </div>
                                            <div className="text-xs text-zinc-600 font-medium leading-snug">{log.action}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-center text-zinc-400 italic py-4">No status changes have been recorded yet.</p>
                        )}
                    </div>
                </div>

                {/* --- DETAILS & NOTES (Includes Initial Lead Data & ALL Pipeline Data) --- */}
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

                        {/* 2. PIPELINE DATA (Updated to show Payment & Shipping fields) */}
                        <div className="bg-zinc-50 border border-black/5 rounded-2xl p-5 space-y-4 text-sm">
                            <h4 className="font-bold text-black border-b border-black/5 pb-2">Collected Pipeline Data</h4>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-4">

                                {/* Payment Fields */}
                                {modal.request.paymentType && <div><span className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-1">Payment Type</span><span className="font-medium text-black">{modal.request.paymentType}</span></div>}
                                {(modal.request.totalAmount || modal.request.agreedPrice) && <div><span className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-1">Total Agreed Price</span><span className="font-medium text-black">${modal.request.totalAmount || modal.request.agreedPrice}</span></div>}

                                {modal.request.paymentType === "Partial Payments" && (
                                    <>
                                        {modal.request.advancePaymentAmount && <div><span className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-1">Advance Amount</span><span className="font-medium text-black">${modal.request.advancePaymentAmount}</span></div>}
                                        {modal.request.balancePaymentAmount && <div><span className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-1">Balance Amount</span><span className="font-medium text-black">${modal.request.balancePaymentAmount}</span></div>}
                                        {modal.request.balancePaymentStage && <div className="col-span-2"><span className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-1">Balance Due Trigger</span><span className="font-medium text-black">{modal.request.balancePaymentStage}</span></div>}
                                    </>
                                )}

                                {/* General Logistics Fields */}
                                {modal.request.depositAmount && <div><span className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-1">Deposit</span><span className="font-medium text-black">${modal.request.depositAmount}</span></div>}
                                {modal.request.transactionId && <div><span className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-1">Receipt ID</span><span className="font-medium text-black">{modal.request.transactionId}</span></div>}
                                {modal.request.invoiceNumber && <div><span className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-1">Invoice #</span><span className="font-medium text-black">{modal.request.invoiceNumber}</span></div>}

                                {/* Shipping Fields */}
                                {modal.request.vesselName && <div><span className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-1">Vessel</span><span className="font-medium text-black">{modal.request.vesselName}</span></div>}
                                {modal.request.trackingNumber && <div><span className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-1">Tracking #</span><span className="font-medium text-black">{modal.request.trackingNumber}</span></div>}
                                {modal.request.containerNumber && <div><span className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-1">Container #</span><span className="font-medium text-black">{modal.request.containerNumber}</span></div>}
                                {modal.request.portOfArrival && <div><span className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-1">Dest. Port (Shipping)</span><span className="font-medium text-black">{modal.request.portOfArrival}</span></div>}
                                {modal.request.portName && <div><span className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-1">Arrival Port (Confirmed)</span><span className="font-medium text-black">{modal.request.portName}</span></div>}
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

                        {/* --- NEW: COMPREHENSIVE PRICE AGREEMENT --- */}
                        {modal.targetStage === "Price Agreement" && (
                            <div className="space-y-6 bg-zinc-50/50 p-5 rounded-2xl border border-black/5">
                                <div className="space-y-2">
                                    <Label className="text-zinc-600 font-bold">Payment Type</Label>
                                    <div className="relative">
                                        <select
                                            className={selectClasses}
                                            value={payload.paymentType || "Full payment"}
                                            onChange={(e) => handlePayloadChange("paymentType", e.target.value)}
                                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a1a1aa' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
                                        >
                                            <option value="Full payment">Full payment</option>
                                            <option value="Partial Payments">Partial Payments</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-zinc-600 font-bold">Total Agreed Amount (USD)</Label>
                                    <Input
                                        type="number"
                                        onChange={(e) => {
                                            handlePayloadChange("totalAmount", e.target.value);
                                            // Keep legacy field synced for backward compatibility
                                            handlePayloadChange("agreedPrice", e.target.value);
                                        }}
                                        className={inputClasses}
                                        placeholder="e.g. 125000"
                                    />
                                </div>

                                {payload.paymentType === "Partial Payments" && (
                                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-black/5">
                                        <div className="space-y-2">
                                            <Label className="text-zinc-600 font-bold text-xs">Advance Amount</Label>
                                            <Input
                                                type="number"
                                                onChange={(e) => handlePayloadChange("advancePaymentAmount", e.target.value)}
                                                className={inputClasses}
                                                placeholder="e.g. 50000"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-zinc-600 font-bold text-xs">Balance Amount</Label>
                                            <Input
                                                type="number"
                                                onChange={(e) => handlePayloadChange("balancePaymentAmount", e.target.value)}
                                                className={inputClasses}
                                                placeholder="e.g. 75000"
                                            />
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <Label className="text-zinc-600 font-bold text-xs">Balance Due Stage</Label>
                                            <div className="relative">
                                                <select
                                                    className={selectClasses}
                                                    value={payload.balancePaymentStage || ""}
                                                    onChange={(e) => handlePayloadChange("balancePaymentStage", e.target.value)}
                                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a1a1aa' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
                                                >
                                                    <option value="" disabled>Select a stage...</option>
                                                    {PIPELINE_STAGES.map(stage => (
                                                        <option key={stage} value={stage}>{stage}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}
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

                        {/* --- NEW: UPDATED SHIPPING FIELDS --- */}
                        {modal.targetStage === "Shipped" && (
                            <>
                                <div className="space-y-2"><Label className="text-zinc-600 font-bold">Shipping Tracking Number</Label><Input onChange={(e) => handlePayloadChange("trackingNumber", e.target.value)} className={inputClasses} placeholder="e.g. MSCU1234567" /></div>
                                <div className="space-y-2"><Label className="text-zinc-600 font-bold">Vessel Name</Label><Input onChange={(e) => handlePayloadChange("vesselName", e.target.value)} className={inputClasses} placeholder="e.g. Ever Given" /></div>
                                <div className="space-y-2"><Label className="text-zinc-600 font-bold">Container Number</Label><Input onChange={(e) => handlePayloadChange("containerNumber", e.target.value)} className={inputClasses} placeholder="e.g. HLBU1234567" /></div>
                                <div className="space-y-2"><Label className="text-zinc-600 font-bold">Port of Arrival</Label><Input onChange={(e) => handlePayloadChange("portOfArrival", e.target.value)} className={inputClasses} placeholder="e.g. Port of Los Angeles" /></div>
                                <div className="space-y-2"><Label className="text-zinc-600 font-bold">Estimated Arrival (ETA)</Label><Input type="date" onChange={(e) => handlePayloadChange("eta", e.target.value)} className={inputClasses} /></div>
                            </>
                        )}

                        {modal.targetStage === "Arrived at Port" && (
                            <div className="space-y-2"><Label className="text-zinc-600 font-bold">Arrival Notes / Confirm Port</Label><Input onChange={(e) => handlePayloadChange("portName", e.target.value)} className={inputClasses} placeholder="e.g. Confirmed at Port of Los Angeles" /></div>
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