"use client";

import { AlertCircle, RotateCw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/**
 * Error boundary for the /admin segment. The admin pages fetch on the server
 * (session lookup + Postgres); without a boundary a throw bubbles to the root
 * and the navigation dies with no explanation.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin] render error:", error);
  }, [error]);

  return (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center p-10 text-center">
      <AlertCircle className="mb-4 text-zinc-300" size={40} />
      <h1 className="text-xl font-bold text-zinc-900">
        This page failed to load
      </h1>
      <p className="mt-2 max-w-md text-sm text-zinc-500">
        {error.message || "An unexpected error occurred."}
        {error.digest ? (
          <span className="mt-1 block font-mono text-[11px] text-zinc-400">
            {error.digest}
          </span>
        ) : null}
      </p>
      <Button onClick={reset} className="mt-6 gap-2">
        <RotateCw size={14} />
        Try again
      </Button>
    </div>
  );
}
