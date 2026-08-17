"use client";

import { ClipboardCopy, Download, Sheet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  buildLeadsCsv,
  buildLeadsTsv,
  leadsExportFilename,
} from "@/lib/leadsExport";

type ExportLeadsButtonProps = {
  // biome-ignore lint/suspicious/noExplicitAny: leads are the loosely-typed admin payload
  rows: any[];
  filenamePrefix?: string;
};

/**
 * Exports whatever the dashboard filters currently resolve to — what you see is
 * what you get, so "export the leads for Ireland this month" is just a filter
 * away. Runs entirely in the browser: the rows are already in memory, so no
 * server round trip and no second copy of the auth check.
 */
export default function ExportLeadsButton({
  rows,
  filenamePrefix = "providence-leads",
}: ExportLeadsButtonProps) {
  const [busy, setBusy] = useState(false);
  const count = rows.length;

  const downloadCsv = () => {
    if (count === 0) {
      toast.error("Nothing to export — no leads match the current filters.");
      return;
    }
    setBusy(true);
    try {
      const blob = new Blob([buildLeadsCsv(rows)], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = leadsExportFilename(filenamePrefix);
      document.body.appendChild(a);
      a.click();
      a.remove();
      // Revoke on the next tick — revoking synchronously can cancel the
      // download in Safari before it has read the blob.
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast.success(`Exported ${count} ${count === 1 ? "lead" : "leads"}.`);
    } catch (error) {
      console.error("[ExportLeadsButton] CSV export failed:", error);
      toast.error("Could not build the export file.");
    } finally {
      setBusy(false);
    }
  };

  const copyForSheets = async () => {
    if (count === 0) {
      toast.error("Nothing to export — no leads match the current filters.");
      return;
    }
    setBusy(true);
    try {
      await navigator.clipboard.writeText(buildLeadsTsv(rows));
      toast.success(
        `${count} ${count === 1 ? "lead" : "leads"} copied — paste into Google Sheets.`,
      );
    } catch (error) {
      console.error("[ExportLeadsButton] Clipboard copy failed:", error);
      toast.error(
        "Clipboard blocked by the browser — use Download CSV instead.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={busy}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-black text-white rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Export the leads currently shown"
        >
          <Download size={16} />
          Export
          <span className="text-white/50 font-medium">({count})</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-white border-black/5 text-black shadow-xl rounded-xl w-72 p-2"
      >
        <DropdownMenuItem
          onClick={downloadCsv}
          className="hover:bg-black/5 focus:bg-black/5 cursor-pointer rounded-lg py-2"
        >
          <Sheet className="mr-2 h-4 w-4 text-emerald-600" />
          <div className="flex flex-col">
            <span className="font-semibold">Download spreadsheet (.csv)</span>
            <span className="text-[11px] text-zinc-500 font-light">
              Opens in Excel · import into Google Sheets
            </span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-black/5 my-1" />

        <DropdownMenuItem
          onClick={copyForSheets}
          className="hover:bg-black/5 focus:bg-black/5 cursor-pointer rounded-lg py-2"
        >
          <ClipboardCopy className="mr-2 h-4 w-4 text-sky-600" />
          <div className="flex flex-col">
            <span className="font-semibold">Copy for Google Sheets</span>
            <span className="text-[11px] text-zinc-500 font-light">
              Paste straight into a sheet — no import step
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
