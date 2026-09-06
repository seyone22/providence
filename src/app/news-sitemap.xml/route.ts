import { getNewsArticlesByDate, NEWS_BASE_PATH } from "@/config/news";

// ─────────────────────────────────────────────────────────────────────────────
// Google News sitemap.
//
// Next's MetadataRoute.Sitemap cannot emit the <news:news> namespace, so this is
// a hand-rolled route. Per Google's specification only an article published in
// the last two days may carry <news:news> metadata — anything older is ignored
// by Google News regardless, and padding the file with evergreen URLs carrying
// news metadata is a spec violation rather than a shortcut.
//
// What Google says about the older ones is the other half of the same sentence:
// "either remove those URLs from the news sitemap or remove the <news:news>
// metadata in your sitemap from the older URLs". We take the second option, and
// the reason is the publishing rhythm. The news desk ships a weekly slate in a
// burst, then goes quiet for several days — so a file built on a strict two-day
// rule has zero <url> children most of the week. Search Console reports that as
// an empty sitemap ("1 error", 0 discovered pages), which is what it had been
// reporting here. Keeping the recent back-catalogue as plain <loc> entries makes
// the file non-empty and still spec-legal, because the entries that fall outside
// the two-day window carry no <news:news> block at all.
//
// The main sitemap at /sitemap.xml still carries every article for normal
// Search indexing; this file exists purely for the News surface.
// ─────────────────────────────────────────────────────────────────────────────

const SITE = "https://www.providenceauto.co.uk";
const DAY_MS = 24 * 60 * 60 * 1000;
/** Google's rule: only an article this recent may carry the <news:news> block. */
const NEWS_WINDOW_MS = 2 * DAY_MS;
/** How far back the plain-<loc> tail reaches. Our editorial choice, not Google's. */
const TAIL_WINDOW_MS = 30 * DAY_MS;
/** Google caps a news sitemap at 1,000 URLs; stay far under it. */
const TAIL_MAX = 20;
/** Never emit an empty file while any article exists at all. */
const TAIL_MIN = 3;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Hero images are a mix of local paths and absolute R2/press URLs. */
function absoluteUrl(path: string) {
  return path.startsWith("http") ? path : `${SITE}${path}`;
}

export const dynamic = "force-dynamic";

export function GET() {
  const now = Date.now();

  // publishDate is a bare calendar date (YYYY-MM-DD), which Date parses as UTC
  // midnight — so an article dated D carries news metadata for the whole of D
  // and the whole of D+1, and never for longer than 48 hours.
  const ranked = getNewsArticlesByDate()
    .map((article) => ({
      article,
      published: new Date(article.publishDate).getTime(),
    }))
    .filter(({ published }) => Number.isFinite(published));

  const withinTail = ranked
    .filter(({ published }) => published >= now - TAIL_WINDOW_MS)
    .slice(0, TAIL_MAX);

  // A drought longer than the tail window still yields a valid file rather than
  // an empty one.
  const recent =
    withinTail.length >= TAIL_MIN ? withinTail : ranked.slice(0, TAIL_MIN);

  const entries = recent
    .map(({ article, published }) => {
      const loc = `${SITE}${NEWS_BASE_PATH}/${article.slug}`;
      const news =
        published >= now - NEWS_WINDOW_MS
          ? `
    <news:news>
      <news:publication>
        <news:name>Providence Auto</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${escapeXml(article.publishDate)}</news:publication_date>
      <news:title>${escapeXml(article.title)}</news:title>
    </news:news>`
          : "";

      return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${escapeXml(article.updatedDate || article.publishDate)}</lastmod>${news}
    <image:image>
      <image:loc>${escapeXml(absoluteUrl(article.heroImage))}</image:loc>
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
      // articles fall out of the two-day news window.
      "Cache-Control": "public, max-age=600, s-maxage=600",
    },
  });
}
