"use client";

import {useState} from "react";
import {ArrowLeft, ArrowRight, ExternalLink, Eye, MoreHorizontal, Trash, User, UserPlus} from "lucide-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/app/components/ui/table";
import {Badge} from "@/app/components/ui/badge";
import {Button} from "@/app/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/app/components/ui/dropdown-menu";
import Link from "next/link";
import RequestActionModal from "../components/RequestActionModal";

const PIPELINE_STAGES = [
    "New", "Vehicle Selection", "Price Agreement", "Deposit Collected",
    "Vehicle Purchased", "Preparation", "Shipped", "Arrived at Port", "Cleared Customs"
];

type ActionModalState = {
    isOpen: boolean;
    type: "advance" | "revert" | "delete" | "details" | "assign" | null;
    request: any | null;
    targetStage: string | null;
};

export default function RequestTableClient({
                                               initialRequests,
                                               staffUsers,
                                               currentUserId
                                           }: {
    initialRequests: any[];
    staffUsers: any[];
    currentUserId: string;
}) {
    const [modal, setModal] = useState<ActionModalState>({isOpen: false, type: null, request: null, targetStage: null});

    const closeDialog = () => setModal({isOpen: false, type: null, request: null, targetStage: null});

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

    const getStatusBadge = (status: string) => {
        const current = status || "New";
        const isMiddle = ["Deposit Collected", "Vehicle Purchased", "Preparation"].includes(current);
        const isShipping = ["Shipped", "Arrived at Port"].includes(current);
        const isDone = current === "Cleared Customs";

        if (isDone) return <Badge
            className="bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 rounded-full px-3">{current}</Badge>;
        if (isShipping) return <Badge
            className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 rounded-full px-3">{current}</Badge>;
        if (isMiddle) return <Badge
            className="bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100 rounded-full px-3">{current}</Badge>;
        return <Badge
            className="bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200 rounded-full px-3">{current}</Badge>;
    };

    if (initialRequests.length === 0) {
        return (
            <div className="p-16 text-center text-zinc-500 font-medium bg-white border border-black/5 rounded-[2rem]">
                No active requests found. When a client submits an inquiry, it will appear here.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader className="bg-zinc-50">
                    <TableRow className="border-black/5">
                        <TableHead className="text-zinc-500 font-semibold py-4 pl-6">Client</TableHead>
                        <TableHead className="text-zinc-500 font-semibold">Contact</TableHead>
                        <TableHead className="text-zinc-500 font-semibold">Requested Vehicle</TableHead>
                        <TableHead className="text-zinc-500 font-semibold">Status</TableHead>
                        <TableHead className="w-[80px] pr-6"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialRequests.map((req: any) => {
                        const nextStage = getNextStage(req.status || "New");
                        const prevStage = getPreviousStage(req.status || "New");

                        return (
                            <TableRow key={req._id}
                                      className="border-b border-black/5 hover:bg-zinc-50/50 transition-colors">
                                <TableCell className="py-4 pl-6">
                                    <div className="font-bold text-black">{req.name}</div>
                                    <div className="text-xs text-zinc-500 font-medium mt-0.5">Import
                                        to: {req.countryOfImport}</div>
                                    <div
                                        className="text-[10px] text-zinc-400 mt-1">{new Date(req.createdAt).toLocaleDateString()}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm font-medium text-zinc-800">{req.email}</div>
                                    <div className="text-sm text-zinc-500">{req.countryCode} {req.phone}</div>
                                </TableCell>
                                <TableCell>
                                    <span className="font-bold text-black">{req.make} {req.vehicle_model}</span><br/>
                                    <span className="text-xs text-zinc-500 flex items-center gap-2 mt-1">
                                        {req.condition === "Used" ? (
                                            <>
                                                <span
                                                    className="px-2 py-0.5 bg-zinc-100 border border-black/5 rounded-md text-zinc-600 font-medium">Pre-Owned</span>
                                                {req.yearFrom || "Any"} - {req.yearTo || "Any"} |
                                                Max {req.mileage || "Any"} mi
                                            </>
                                        ) : (
                                            <span
                                                className="px-2 py-0.5 bg-black/5 border border-black/10 rounded-md text-black font-medium">Brand New</span>
                                        )}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col items-start gap-2">
                                        {getStatusBadge(req.status)}
                                        {req.assignedToName ? (
                                            <div
                                                className="inline-flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 font-medium">
                                                <User size={12}/> {req.assignedToName}
                                            </div>
                                        ) : (
                                            <div
                                                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-50 px-2.5 py-1 rounded-md border border-zinc-200">
                                                Unassigned
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="pr-6">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost"
                                                    className="h-8 w-8 p-0 text-zinc-400 hover:text-black hover:bg-black/5 border-0 rounded-lg">
                                                <MoreHorizontal className="h-4 w-4"/>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end"
                                                             className="bg-white border-black/5 text-black shadow-xl rounded-xl w-56 p-2">

                                            {nextStage && (
                                                <DropdownMenuItem onClick={() => setModal({
                                                    isOpen: true,
                                                    type: "advance",
                                                    request: req,
                                                    targetStage: nextStage
                                                })}
                                                                  className="font-bold text-black hover:bg-black/5 focus:bg-black/5 cursor-pointer rounded-lg mb-1 py-2">
                                                    <ArrowRight className="mr-2 h-4 w-4"/> Advance to: {nextStage}
                                                </DropdownMenuItem>
                                            )}

                                            {prevStage && (
                                                <DropdownMenuItem onClick={() => setModal({
                                                    isOpen: true,
                                                    type: "revert",
                                                    request: req,
                                                    targetStage: prevStage
                                                })}
                                                                  className="font-bold text-amber-600 hover:bg-amber-50 focus:bg-amber-50 cursor-pointer rounded-lg mb-1 py-2">
                                                    <ArrowLeft className="mr-2 h-4 w-4"/> Revert to: {prevStage}
                                                </DropdownMenuItem>
                                            )}

                                            <DropdownMenuItem onClick={() => setModal({
                                                isOpen: true,
                                                type: "assign",
                                                request: req,
                                                targetStage: null
                                            })} className="hover:bg-black/5 focus:bg-black/5 cursor-pointer rounded-lg">
                                                <UserPlus className="mr-2 h-4 w-4 text-blue-500"/> Assign Staff
                                            </DropdownMenuItem>

                                            <DropdownMenuItem onClick={() => setModal({
                                                isOpen: true,
                                                type: "details",
                                                request: req,
                                                targetStage: null
                                            })} className="hover:bg-black/5 focus:bg-black/5 cursor-pointer rounded-lg">
                                                <Eye className="mr-2 h-4 w-4 text-zinc-500"/> View Details & Notes
                                            </DropdownMenuItem>

                                            <DropdownMenuItem asChild
                                                              className="hover:bg-black/5 focus:bg-black/5 cursor-pointer rounded-lg">
                                                <Link href={`/track/${req._id}`} target="_blank">
                                                    <ExternalLink className="mr-2 h-4 w-4 text-emerald-500"/> Live
                                                    Tracker
                                                </Link>
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator className="bg-black/5 my-2"/>

                                            <DropdownMenuItem onClick={() => setModal({
                                                isOpen: true,
                                                type: "delete",
                                                request: req,
                                                targetStage: null
                                            })}
                                                              className="text-red-500 focus:text-red-600 hover:bg-red-50 focus:bg-red-50 cursor-pointer rounded-lg">
                                                <Trash className="mr-2 h-4 w-4"/> Delete Lead
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            {/* Mount the abstracted modal component */}
            <RequestActionModal
                modal={modal}
                onClose={closeDialog}
                staffUsers={staffUsers}
                currentUserId={currentUserId}
            />
        </div>
    );
}