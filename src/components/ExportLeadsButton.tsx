"use client";

import { Download, FileSpreadsheet, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ExportFormat = "xlsx" | "csv";

/**
 * Downloads the lead list as a spreadsheet. Filtering happens in the browser,
 * so the ids of the leads to export are posted to the server, which reads the
 * full records back from the database and returns the file. Both `visibleIds`
 * (the current filtered view) and `allIds` (everything the page holds) are
 * passed in — the archive vault only ever holds archived leads, so its "all"
 * option must not reach beyond them. Both formats open directly in Excel and
 * in Google Sheets (File → Import).
 */
export default function ExportLeadsButton({
  visibleIds,
  allIds,
  label = "Export",
}: {
  visibleIds: string[];
  allIds: string[];
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const isFiltered = visibleIds.length !== allIds.length;

  async function download(format: ExportFormat, scope: "view" | "all") {
    if (busy) return;
    setBusy(true);
    const toastId = toast.loading("Building your export…");

    try {
      const res = await fetch("/api/v1/admin/leads/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          format,
          ids: scope === "view" ? visibleIds : allIds,
        }),
      });

      if (!res.ok) {
        const detail = await res.json().catch(() => null);
        throw new Error(detail?.error || `Export failed (${res.status})`);
      }

      const blob = await res.blob();
      // Filename comes from the server's Content-Disposition; fall back to a
      // sensible one if a proxy stripped the header.
      const disposition = res.headers.get("Content-Disposition") || "";
      const match = disposition.match(/filename="?([^"]+)"?/);
      const filename =
        match?.[1] ||
        `providence-leads-${new Date().toISOString().slice(0, 10)}.${format}`;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      toast.success(`Downloaded ${filename}`, { id: toastId });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not export the leads.",
        { id: toastId },
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={busy}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-black text-white rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          title="Export leads to Excel or CSV"
        >
          {busy ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Download size={16} />
          )}
          {label}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        {isFiltered && (
          <>
            <DropdownMenuLabel className="text-xs uppercase tracking-wider text-zinc-400">
              Current view ({visibleIds.length})
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => download("xlsx", "view")}>
              <FileSpreadsheet size={16} className="mr-2" />
              Excel (.xlsx)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => download("csv", "view")}>
              <FileSpreadsheet size={16} className="mr-2" />
              CSV (Google Sheets)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuLabel className="text-xs uppercase tracking-wider text-zinc-400">
          {isFiltered
            ? `All leads (${allIds.length})`
            : `Export (${allIds.length})`}
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => download("xlsx", "all")}>
          <FileSpreadsheet size={16} className="mr-2" />
          Excel (.xlsx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => download("csv", "all")}>
          <FileSpreadsheet size={16} className="mr-2" />
          CSV (Google Sheets)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
