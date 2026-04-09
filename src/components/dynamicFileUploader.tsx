"use client";

import { useState } from "react";
import { Plus, X, File, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type PendingFile = {
    id: string;
    fieldName: string;
    fileType: "image" | "pdf";
    file: File | null;
};

export default function DynamicFileUploader({
                                                onFilesChange
                                            }: {
    onFilesChange: (files: PendingFile[]) => void
}) {
    const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);

    const addField = () => {
        setPendingFiles((prev: any) => {
            const updated = [
                ...prev,
                {
                    id: Math.random().toString(36).substring(7),
                    fieldName: "",
                    fileType: "pdf",
                    file: null
                }
            ];
            onFilesChange(updated);
            return updated;
        });
    };

    const removeField = (id: string) => {
        setPendingFiles((prev) => {
            const updated = prev.filter(f => f.id !== id);
            onFilesChange(updated);
            return updated;
        });
    };

    const updateField = (id: string, key: keyof PendingFile, value: any) => {
        setPendingFiles((prev) => {
            const updated = prev.map(f => {
                if (f.id !== id) return f;

                // If the user switches fileType, clear out the selected file to prevent mismatches
                if (key === "fileType" && f.fileType !== value) {
                    return { ...f, [key]: value, file: null };
                }

                return { ...f, [key]: value };
            });
            onFilesChange(updated);
            return updated;
        });
    };

    return (
        <div className="space-y-4 border border-black/5 rounded-2xl p-5 bg-zinc-50/50">
            <div className="flex items-center justify-between border-b border-black/5 pb-3">
                <Label className="text-zinc-800 font-bold text-base">Stage Documents</Label>
                <Button type="button" variant="outline" size="sm" onClick={addField} className="h-8 rounded-lg gap-1.5 text-xs border-black/10">
                    <Plus size={14} /> Add File Field
                </Button>
            </div>

            {pendingFiles.length === 0 ? (
                <p className="text-sm text-zinc-500 text-center py-4">No documents required for this stage.</p>
            ) : (
                <div className="space-y-4">
                    {pendingFiles.map((pf) => (
                        <div key={pf.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white p-3 rounded-xl border border-black/5 shadow-sm">

                            <Input
                                placeholder="Document Name (e.g. Invoice)"
                                value={pf.fieldName}
                                onChange={(e) => updateField(pf.id, "fieldName", e.target.value)}
                                className="sm:max-w-[180px] h-9 text-sm"
                            />

                            <Select value={pf.fileType} onValueChange={(val) => updateField(pf.id, "fileType", val)}>
                                <SelectTrigger className="sm:max-w-[110px] h-9 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pdf"><div className="flex items-center gap-2"><File size={14}/> PDF</div></SelectItem>
                                    <SelectItem value="image"><div className="flex items-center gap-2"><ImageIcon size={14}/> Image</div></SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex-1 w-full">
                                <Input
                                    type="file"
                                    // React uses the `key` to unmount and remount the input if the file type changes, forcing it to clear the browser's selected file
                                    key={pf.fileType}
                                    accept={pf.fileType === "pdf" ? ".pdf" : "image/*"}
                                    onChange={(e) => updateField(pf.id, "file", e.target.files?.[0] || null)}
                                    className="h-9 text-sm cursor-pointer file:text-zinc-600 file:font-medium file:border-0 file:bg-transparent file:mr-2"
                                />
                            </div>

                            <Button type="button" variant="ghost" size="icon" onClick={() => removeField(pf.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 h-9 w-9 shrink-0">
                                <X size={16} />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}