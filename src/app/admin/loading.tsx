import { Loader2 } from "lucide-react";

/**
 * Pending UI for every /admin navigation. Without this, App Router keeps the
 * previous page on screen while it fetches the next RSC payload, so clicking a
 * sidebar link looks like nothing happened.
 */
export default function AdminLoading() {
  return (
    <div className="flex h-full min-h-[60vh] items-center justify-center">
      <Loader2 className="animate-spin text-zinc-400" size={40} />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
