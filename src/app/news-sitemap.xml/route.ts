import { getNewsArticlesByDate, NEWS_BASE_PATH } from "@/config/news";

// ─────────────────────────────────────────────────────────────────────────────
// Google News sitemap.
//
// Next's MetadataRoute.Sitemap cannot emit the <news:news> namespace, so this is
// a hand-rolled route. Per Google's specification it must contain only articles
// published in the last two days — an article older than that is ignored by
// Google News regardless of whether it appears here, and padding the file with
// evergreen URLs is a spec violation rather than a shortcut.
//
// The main sitemap at /sitemap.xml still carries every article for normal
// Search indexing; this file exists purely for the News surface.
// ─────────────────────────────────────────────────────────────────────────────

const SITE = "https://www.providenceauto.co.uk";
const WINDOW_MS = 2 * 24 * 60 * 60 * 1000;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const dynamic = "force-dynamic";

export function GET() {
  const cutoff = Date.now() - WINDOW_MS;

  const recent = getNewsArticlesByDate().filter((article) => {
    const published = new Date(article.publishDate).getTime();
    return Number.isFinite(published) && published >= cutoff;
  });

  const entries = recent
    .map((article) => {
      const loc = `${SITE}${NEWS_BASE_PATH}/${article.slug}`;
      return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <news:news>
      <news:publication>
        <news:name>Providence Auto</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${escapeXml(article.publishDate)}</news:publication_date>
      <news:title>${escapeXml(article.title)}</news:title>
      <news:keywords>${escapeXml(article.keywords.join(", "))}</news:keywords>
    </news:news>
    <image:image>
      <image:loc>${escapeXml(article.heroImage.startsWith("http") ? article.heroImage : `${SITE}${article.heroImage}`)}</image:loc>
      <image:caption>${escapeXml(article.heroAlt)}</image:caption>
    </image:image>
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Short cache: the whole point of this file is that it changes daily as
      // articles fall out of the two-day window.
      "Cache-Control": "public, max-age=600, s-maxage=600",
    },
  });
}
