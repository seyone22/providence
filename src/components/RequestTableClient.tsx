"use client";

import { useState, useMemo } from "react";
import {
    ArrowLeft, ArrowRight, ExternalLink, Eye, MoreHorizontal, Trash,
    User, UserPlus, DollarSign, Ship, Search, ListFilter, MessageCircle, MapPin, Box, Activity
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import RequestActionModal from "@/components/RequestActionModal";

const PIPELINE_STAGES = [
    "New", "Vehicle Selection", "Price Agreement", "Deposit Collected",
    "Vehicle Purchased", "Preparation", "Shipped", "Arrived at Port", "Cleared Customs"
];

// Exporting this so you can potentially import it in your Modal component
export const SALES_STATUSES = [
    "Action required",
    "No Response",
    "Stopped Responding",
    "Replied (Email)",
    "Replied (WhatsApp)",
    "Replied (Both)",
    "Active Conversation",
    "SQL: Moved to vehicle offering stage",
    "Not Qualified",
    "Lead Lost",
    "Lead Closed"
];

// ADDED "sales_status" to the type definition
type ActionModalState = {
    isOpen: boolean;
    type: "advance" | "revert" | "delete" | "details" | "assign" | "sales_status" | null;
    request: any | null;
    targetStage: string | null;
};

export default function RequestTableClient({
                                               processedRequests,
                                               staffUsers,
                                               currentUserId
                                           }: {
    processedRequests: any[];
    staffUsers: any[];
    currentUserId: string;
}) {
    const [modal, setModal] = useState<ActionModalState>({ isOpen: false, type: null, request: null, targetStage: null });

    // Filter & Sort States
    const [searchQuery, setSearchQuery] = useState("");
    const [stageFilter, setStageFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [staffFilter, setStaffFilter] = useState("All");
    const [carFilter, setCarFilter] = useState("All");
    const [sortBy, setSortBy] = useState("newest");

    const closeDialog = () => setModal({ isOpen: false, type: null, request: null, targetStage: null });

    const getNextStage = (currentStatus: string) => {
        const currentIndex = PIPELINE_STAGES.indexOf(currentStatus || "New");
        if (currentIndex === -1 || currentIndex === PIPELINE_STAGES.length - 1) return null;
        return PIPELINE_STAGES[currentIndex + 1];
    };

    const getPreviousStage = (currentStatus: string) => {
        const currentIndex = PIPELINE_STAGES.indexOf(currentStatus || "New");
        if (currentIndex <= 0) return null;
        return PIPELINE_STAGES[currentIndex - 1];
    };

    const getPipelineBadge = (status: string) => {
        const current = status || "New";
        const isMiddle = ["Deposit Collected", "Vehicle Purchased", "Preparation"].includes(current);
        const isShipping = ["Shipped", "Arrived at Port"].includes(current);
        const isDone = current === "Cleared Customs";

        if (isDone) return <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 rounded-full px-3">{current}</Badge>;
        if (isShipping) return <Badge className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 rounded-full px-3">{current}</Badge>;
        if (isMiddle) return <Badge className="bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100 rounded-full px-3">{current}</Badge>;

        return <Badge className="bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200 rounded-full px-3">{current}</Badge>;
    };

    // Color-coded Sales Status Badge
    const getSalesStatusBadge = (status: string) => {
        const current = status || "Action required";

        if (["Action required", "Lead Lost"].includes(current)) {
            return <Badge className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 rounded-full px-3">{current}</Badge>;
        }
        if (["No Response", "Stopped Responding"].includes(current)) {
            return <Badge className="bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100 rounded-full px-3">{current}</Badge>;
        }
        if (["Replied (Email)", "Replied (WhatsApp)", "Replied (Both)", "Active Conversation", "SQL: Moved to vehicle offering stage", "Lead Closed"].includes(current)) {
            return <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 rounded-full px-3">{current}</Badge>;
        }

        return <Badge className="bg-zinc-100 text-zinc-500 border-zinc-200 hover:bg-zinc-200 rounded-full px-3">{current}</Badge>;
    };

    return (
        <div className="w-full flex flex-col gap-4">
            {/* --- TABLE AREA --- */}
            <div className="overflow-x-auto w-full pb-4">
                {processedRequests.length === 0 ? (
                    <div className="p-16 text-center text-zinc-500 font-medium bg-white border border-black/5 rounded-[2rem] mt-4">
                        No requests match your current filters. Try adjusting your search or clearing the dropdowns.
                    </div>
                ) : (
                    <Table className="min-w-[800px]">
                        <TableHeader className="bg-zinc-50">
                            <TableRow className="border-black/5">
                                <TableHead className="text-zinc-500 font-semibold py-4 pl-6">Client Info</TableHead>
                                <TableHead className="text-zinc-500 font-semibold">Requested Vehicle</TableHead>
                                <TableHead className="text-zinc-500 font-semibold">Pipeline Stage</TableHead>
                                <TableHead className="text-zinc-500 font-semibold">Sales Status</TableHead>
                                <TableHead className="text-zinc-500 font-semibold hidden md:table-cell">Key Details</TableHead>
                                <TableHead className="w-[60px] pr-6"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {processedRequests.map((req: any) => {
                                const nextStage = getNextStage(req.status || "New");
                                const prevStage = getPreviousStage(req.status || "New");
                                const currentSalesStatus = req.leadStatus || "Action required";

                                // Clean up phone for WhatsApp link
                                const cleanPhone = req.phone?.replace(/[^0-9]/g, '');
                                const cleanCountryCode = req.countryCode?.replace(/[^0-9]/g, '');

                                return (
                                    <TableRow key={req._id} className="border-b border-black/5 hover:bg-zinc-50/50 transition-colors bg-white">
                                        <TableCell className="py-4 pl-6 align-top">
                                            <div className="font-bold text-black text-sm">{req.name}</div>
                                            <div className="text-xs text-zinc-500 mb-1">{req.email}</div>

                                            {/* WhatsApp Link integration */}
                                            <a
                                                href={`https://wa.me/${cleanCountryCode}${cleanPhone}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 hover:underline font-medium mb-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 transition-colors"
                                            >
                                                <MessageCircle size={12} /> {req.countryCode} {req.phone}
                                            </a>

                                            <div className="text-[10px] uppercase font-bold text-zinc-400 mt-1">
                                                Import to: {req.countryOfImport}
                                            </div>
                                            <div className="text-[10px] text-zinc-400 mt-0.5">
                                                Created: {new Date(req.createdAt).toLocaleString()}
                                            </div>
                                        </TableCell>

                                        <TableCell className="align-top">
                                            <span className="font-bold text-black text-sm">{req.make} {req.vehicle_model}</span><br />
                                            <div className="flex flex-wrap gap-1 mt-1.5">
                                                {req.condition === "Used" ? (
                                                    <>
                                                        <span className="px-1.5 py-0.5 bg-zinc-100 border border-black/5 rounded text-[10px] text-zinc-600 font-medium">Pre-Owned</span>
                                                        <span className="text-xs text-zinc-500 self-center">
                                                            {req.yearFrom || "Any"} - {req.yearTo || "Any"} | Max {req.mileage || "Any"}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="px-1.5 py-0.5 bg-black/5 border border-black/10 rounded text-[10px] text-black font-medium">Brand New</span>
                                                )}
                                            </div>
                                        </TableCell>

                                        <TableCell className="align-top">
                                            <div className="flex flex-col items-start gap-2 mt-1">
                                                {getPipelineBadge(req.status)}
                                                {req.assignedToName ? (
                                                    <div className="inline-flex items-center gap-1.5 text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 font-medium">
                                                        <User size={10} /> {req.assignedToName}
                                                    </div>
                                                ) : (
                                                    <div className="inline-flex items-center gap-1.5 text-[11px] text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded border border-zinc-200">
                                                        Unassigned
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>

                                        <TableCell className="align-top">
                                            <div className="mt-1">
                                                {/* Wrap the badge in a button for accessibility and click handling */}
                                                <button
                                                    onClick={() => setModal({
                                                        isOpen: true,
                                                        type: "sales_status",
                                                        request: req,
                                                        targetStage: null
                                                    })}
                                                    className="block hover:opacity-80 transition-opacity focus:outline-none"
                                                    title="Click to change sales status"
                                                >
                                                    {getSalesStatusBadge(currentSalesStatus)}
                                                </button>

                                                {/* Timestamp for status change */}
                                                {(req.statusUpdatedAt || req.updatedAt) && (
                                                    <div className="text-[10px] text-zinc-400 mt-1 ml-1">
                                                        Updated: {new Date(req.statusUpdatedAt || req.updatedAt).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>

                                        <TableCell className="align-top hidden md:table-cell">
                                            <div className="flex flex-col gap-1.5 mt-1">

                                                {/* PAYMENT INFO DISPLAY */}
                                                {req.paymentType === "Full payment" ? (
                                                    <div className="flex flex-col text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                                                        <div className="font-bold mb-0.5">Full Payment</div>
                                                        <div className="flex items-center gap-1"><DollarSign size={12} /> Total: ${(req.totalAmount || req.agreedPrice || 0).toLocaleString()}</div>
                                                    </div>
                                                ) : req.paymentType === "Partial Payments" ? (
                                                    <div className="flex flex-col text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                                                        <div className="font-bold mb-0.5">Partial Payments</div>
                                                        <div className="flex justify-between items-center"><span className="text-zinc-600">Total:</span> <span>${(req.totalAmount || req.agreedPrice || 0).toLocaleString()}</span></div>
                                                        <div className="flex justify-between items-center"><span className="text-zinc-600">Advance:</span> <span>${(req.advancePaymentAmount || 0).toLocaleString()}</span></div>
                                                        <div className="flex flex-col mt-0.5 pt-0.5 border-t border-blue-200/50">
                                                            <div className="flex justify-between items-center font-medium"><span>Balance:</span> <span>${(req.balancePaymentAmount || 0).toLocaleString()}</span></div>
                                                            <div className="text-[9px] text-blue-500 uppercase font-bold mt-0.5">Due: {req.balancePaymentStage || 'TBD'}</div>
                                                        </div>
                                                    </div>
                                                ) : req.agreedPrice ? (
                                                    // Fallback for older leads before Payment Type was added
                                                    <div className="flex items-center gap-1.5 text-xs text-emerald-700">
                                                        <DollarSign size={12} /> Price: ${req.agreedPrice.toLocaleString()}
                                                    </div>
                                                ) : (
                                                    <div className="text-xs text-zinc-400 italic">No pricing terms set</div>
                                                )}

                                                {/* SHIPPING INFO DISPLAY */}
                                                {(req.status === "Shipped" || req.status === "Arrived at Port" || req.status === "Cleared Customs") && (
                                                    <div className="mt-1 pt-1 border-t border-black/5 flex flex-col gap-1 text-xs">
                                                        {req.vesselName && (
                                                            <div className="flex items-center gap-1.5 text-blue-600">
                                                                <Ship size={12} /> {req.vesselName}
                                                                {req.eta && <span className="text-[10px] text-zinc-400">(ETA: {new Date(req.eta).toLocaleDateString()})</span>}
                                                            </div>
                                                        )}
                                                        {req.containerNumber && (
                                                            <div className="flex items-center gap-1.5 text-zinc-600">
                                                                <Box size={12} className="text-zinc-400"/> Cont: <span className="font-medium text-black">{req.containerNumber}</span>
                                                            </div>
                                                        )}
                                                        {req.portOfArrival && (
                                                            <div className="flex items-center gap-1.5 text-zinc-600">
                                                                <MapPin size={12} className="text-zinc-400"/> Port: <span className="font-medium text-black">{req.portOfArrival}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>

                                        <TableCell className="pr-6 align-top pt-5">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 text-zinc-400 hover:text-black hover:bg-black/5 border-0 rounded-lg">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-white border-black/5 text-black shadow-xl rounded-xl w-56 p-2">

                                                    {/* NEW: Update Sales Status Button */}
                                                    <DropdownMenuItem onClick={() => setModal({ isOpen: true, type: "sales_status", request: req, targetStage: null })} className="font-bold text-blue-600 hover:bg-blue-50 focus:bg-blue-50 cursor-pointer rounded-lg mb-1 py-2">
                                                        <Activity className="mr-2 h-4 w-4" /> Update Sales Status
                                                    </DropdownMenuItem>

                                                    <DropdownMenuSeparator className="bg-black/5 my-1" />

                                                    {nextStage && (
                                                        <DropdownMenuItem onClick={() => setModal({ isOpen: true, type: "advance", request: req, targetStage: nextStage })} className="font-bold text-black hover:bg-black/5 focus:bg-black/5 cursor-pointer rounded-lg mb-1 py-2">
                                                            <ArrowRight className="mr-2 h-4 w-4" /> Advance to: {nextStage}
                                                        </DropdownMenuItem>
                                                    )}

                                                    {prevStage && (
                                                        <DropdownMenuItem onClick={() => setModal({ isOpen: true, type: "revert", request: req, targetStage: prevStage })} className="font-bold text-amber-600 hover:bg-amber-50 focus:bg-amber-50 cursor-pointer rounded-lg mb-1 py-2">
                                                            <ArrowLeft className="mr-2 h-4 w-4" /> Revert to: {prevStage}
                                                        </DropdownMenuItem>
                                                    )}

                                                    <DropdownMenuItem onClick={() => setModal({ isOpen: true, type: "assign", request: req, targetStage: null })} className="hover:bg-black/5 focus:bg-black/5 cursor-pointer rounded-lg">
                                                        <UserPlus className="mr-2 h-4 w-4 text-zinc-500" /> Assign Staff
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem onClick={() => setModal({ isOpen: true, type: "details", request: req, targetStage: null })} className="hover:bg-black/5 focus:bg-black/5 cursor-pointer rounded-lg">
                                                        <Eye className="mr-2 h-4 w-4 text-zinc-500" /> View Details & Notes
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem asChild className="hover:bg-black/5 focus:bg-black/5 cursor-pointer rounded-lg">
                                                        <Link href={`/track/${req._id}`} target="_blank">
                                                            <ExternalLink className="mr-2 h-4 w-4 text-emerald-500" /> Live Tracker
                                                        </Link>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuSeparator className="bg-black/5 my-2" />

                                                    <DropdownMenuItem onClick={() => setModal({ isOpen: true, type: "delete", request: req, targetStage: null })} className="text-red-500 focus:text-red-600 hover:bg-red-50 focus:bg-red-50 cursor-pointer rounded-lg">
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
                )}
            </div>

            <RequestActionModal
                modal={modal}
                onClose={closeDialog}
                staffUsers={staffUsers}
                currentUserId={currentUserId}
            />

            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}