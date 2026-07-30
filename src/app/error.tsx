"use client";

import { AlertCircle, Home, RotateCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/**
 * Root error boundary.
 *
 * A segment's own `error.tsx` does not catch throws from the layout at that
 * same level — the error bubbles to the boundary *above* it. So a throw in
 * `admin/layout.tsx` (the `auth.api.getSession()` call, a saturated DB pool)
 * sails straight past `admin/error.tsx`. Before this file there was nothing
 * above it, which is why a sidebar click could die with a blank screen and no
 * message: the navigation failed and nothing rendered the failure.
 */
export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[root] render error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-10 text-center">
      <AlertCircle className="mb-4 text-zinc-300" size={40} />
      <h1 className="text-xl font-bold text-zinc-900">
        Something went wrong loading this page
      </h1>
      <p className="mt-2 max-w-md text-sm text-zinc-500">
        {error.message || "An unexpected error occurred."}
        {error.digest ? (
          <span className="mt-1 block font-mono text-[11px] text-zinc-400">
            {error.digest}
          </span>
        ) : null}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset} className="gap-2">
          <RotateCw size={14} />
          Try again
        </Button>
        <Button asChild variant="outline" className="gap-2">
          <Link href="/">
            <Home size={14} />
            Go home
          </Link>
        </Button>
      </div>
    </div>
  );
}
