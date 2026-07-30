"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary. `error.tsx` renders *inside* the root layout, so it
 * cannot catch a throw from the root layout itself — that one needs
 * `global-error.tsx`, which replaces the root layout entirely.
 *
 * Because it replaces the layout, `globals.css` is never loaded here, so this
 * screen is styled inline on purpose. Do not swap these for Tailwind classes.
 * (Next.js only renders this in production builds; in dev the error overlay
 * takes over instead.)
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global] render error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          padding: "2.5rem",
          textAlign: "center",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          color: "#18181b",
          background: "#fafafa",
        }}
      >
        <h1 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
          Something went wrong
        </h1>
        <p
          style={{
            margin: 0,
            maxWidth: "32rem",
            fontSize: "0.875rem",
            color: "#71717a",
          }}
        >
          {error.message || "An unexpected error occurred."}
        </p>
        {error.digest ? (
          <code style={{ fontSize: "11px", color: "#a1a1aa" }}>
            {error.digest}
          </code>
        ) : null}
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: "0.75rem",
            padding: "0.5rem 1.25rem",
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "#ffffff",
            background: "#18181b",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
