import { getNewsArticlesByDate, NEWS_BASE_PATH } from "@/config/news";

// RSS 2.0 feed for the news section. Feeds are still how aggregators, Google
// Discover partners and trade-press bots find new stories quickly, and they cost
// nothing to serve from a static registry.

const SITE = "https://www.providenceauto.co.uk";
const TITLE = "Providence Auto — Automotive News";
const DESCRIPTION =
  "New car releases, industry moves, auction records, market data and the tax and policy changes that decide what a car actually costs.";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(iso: string) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? new Date(0).toUTCString()
    : date.toUTCString();
}

export function GET() {
  const articles = getNewsArticlesByDate();
  const feedUrl = `${SITE}${NEWS_BASE_PATH}/rss.xml`;
  const lastBuild = articles[0]?.publishDate;

  const items = articles
    .map((article) => {
      const url = `${SITE}${NEWS_BASE_PATH}/${article.slug}`;
      const image = article.heroImage.startsWith("http")
        ? article.heroImage
        : `${SITE}${article.heroImage}`;
      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${toRfc822(article.publishDate)}</pubDate>
      <category>${escapeXml(article.category)}</category>
      <description>${escapeXml(article.excerpt)}</description>
      <enclosure url="${escapeXml(image)}" type="image/jpeg" />
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(TITLE)}</title>
    <link>${escapeXml(`${SITE}${NEWS_BASE_PATH}`)}</link>
    <description>${escapeXml(DESCRIPTION)}</description>
    <language>en-IE</language>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${lastBuild ? `    <lastBuildDate>${toRfc822(lastBuild)}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=1800, s-maxage=1800",
    },
  });
}
