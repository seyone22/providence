"use client";

import { Star } from "lucide-react";
import Script from "next/script";
import { type MouseEvent, useEffect, useRef } from "react";

/**
 * "Add Providence Auto as a preferred source on Google."
 *
 * Google's preferred sources feature lets a reader nominate publications they
 * want to see more of — the nominated site then appears more often in that
 * reader's Top Stories, and is marked with a "preferred" badge in AI Overviews
 * and AI Mode. Publishers opt in purely by shipping a button; there is nothing
 * to claim in Search Console and no eligibility to apply for.
 * Docs: https://developers.google.com/search/docs/appearance/preferred-sources
 *
 * Why the *advanced* (manual) integration rather than Google's drop-in badge:
 * the drop-in scans the DOM once for `google-add-preferred-source-btn` when
 * publisher.js loads. This is an App Router site, so every route change after
 * the first is a client-side navigation — the scan never runs again and the
 * badge silently fails to render on every article but the first one landed on.
 * Manual mode binds our own element instead, which survives navigation.
 *
 * Custom-designed buttons are explicitly permitted so long as they lead to the
 * same place, which is why the fallback below is the documented deeplink.
 *
 * Degradation, in order:
 *  1. publisher.js loaded  → in-page dialog, reader stays on the article.
 *  2. script still loading, blocked, or JS off → the anchor's href is Google's
 *     source-preferences deeplink, so the button always does something.
 */

/** The domain the source-preferences tool identifies us by. Only domain- and
 *  subdomain-level sites are eligible — a path would be rejected. */
const SITE_DOMAIN = "www.providenceauto.co.uk";

const DEEPLINK = `https://www.google.com/preferences/source?q=${SITE_DOMAIN}`;

const PUBLISHER_JS = "https://news.google.com/swg/js/v1/publisher.js";

type PreferredSourceApi = {
  init: (config: { theme?: "light" | "dark"; lang?: string }) => void;
  addPreferredSource: () => void;
};

declare global {
  interface Window {
    /** Callback queue drained by publisher.js. After load, pushes run at once. */
    PREFERRED_SOURCE?: Array<(api: PreferredSourceApi) => void>;
  }
}

// Module scope, not component state: the API is a page-level singleton, so a
// second button on the same page must not re-init it, and a button mounted
// after a client-side navigation should already know it is ready.
let api: PreferredSourceApi | null = null;
let initialised = false;

function usePreferredSource(theme: "light" | "dark", lang?: string) {
  const themeRef = useRef(theme);
  const langRef = useRef(lang);
  themeRef.current = theme;
  langRef.current = lang;

  useEffect(() => {
    if (initialised) return;
    initialised = true;
    window.PREFERRED_SOURCE ??= [];
    window.PREFERRED_SOURCE.push((loaded) => {
      api = loaded;
      loaded.init({ theme: themeRef.current, lang: langRef.current });
    });
  }, []);
}

export default function PreferredSourceButton({
  theme = "light",
  lang,
  label = "Make us a preferred source on Google",
  className,
}: {
  /** Styling of Google's dialog, not of this button. Default light. */
  theme?: "light" | "dark";
  /** Force the dialog's language. Defaults to the reader's Google language. */
  lang?: string;
  label?: string;
  className?: string;
}) {
  usePreferredSource(theme, lang);

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    // No API yet — let the anchor follow the deeplink instead of dead-ending.
    if (!api) return;
    e.preventDefault();
    api.addPreferredSource();
  }

  return (
    <>
      {/* lazyOnload: this is an audience-building CTA, never on the critical
          path, and the deeplink covers the window before it lands. next/script
          de-dupes by id, so rendering several buttons loads it once. */}
      <Script
        id="google-preferred-source"
        src={PUBLISHER_JS}
        strategy="lazyOnload"
        preferred-sources-control="manual"
      />
      <a
        href={DEEPLINK}
        onClick={handleClick}
        target="_blank"
        rel="noopener noreferrer"
        data-analytics-id="preferred-source"
        className={
          className ??
          // Sits on .pa-cta-secondary's tinted wash, so it needs a solid white
          // ground and a sky edge to read as an action rather than a chip —
          // but stays light, because the black pill is the primary CTA.
          "group inline-flex items-center justify-center gap-2 rounded-full border border-sky-500/25 bg-white px-6 py-3.5 text-sm font-bold text-black shadow-[0_6px_18px_-8px_rgba(14,165,233,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-500/50 hover:shadow-[0_12px_28px_-10px_rgba(14,165,233,0.55)]"
        }
      >
        <Star
          size={15}
          className="text-sky-600 transition-transform group-hover:scale-110"
        />
        {label}
      </a>
    </>
  );
}
