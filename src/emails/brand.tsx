// ─────────────────────────────────────────────────────────────────────────────
// Shared branding bits for transactional email.
//
// Email clients can't resolve relative URLs or run CSS, so everything here is
// absolute and inline. The site's own /logo.png is reused as the brand mark so
// there is only one asset to keep in sync.
// ─────────────────────────────────────────────────────────────────────────────

import { Column, Img, Row, Section, Text } from "@react-email/components";

/** Absolute origin for anything an email links to or embeds. */
export const EMAIL_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.providenceauto.co.uk";

/** The Providence Auto mark — also the fallback when an agent has no photo. */
export const LOGO_URL = `${EMAIL_BASE_URL}/logo.png`;

/** Turn a possibly-relative asset path into something an email client can load. */
export function absoluteUrl(path: string): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${EMAIL_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

/**
 * Round profile image for the top of an email. Falls back to the Providence
 * Auto logo when the assigned agent hasn't uploaded a picture, so the slot is
 * never empty and never shows a broken-image icon.
 */
export const EmailAvatar = ({
  src,
  alt,
  size = 56,
}: {
  src?: string | null;
  alt: string;
  size?: number;
}) => {
  const hasPhoto = Boolean(src?.trim());
  return (
    <Img
      src={hasPhoto ? absoluteUrl(src as string) : LOGO_URL}
      alt={hasPhoto ? alt : "Providence Auto"}
      width={String(size)}
      height={String(size)}
      style={{
        borderRadius: "999px",
        // A photo should fill the circle; the logo is a mark on white and must
        // sit inside it with a little breathing room instead of being cropped.
        objectFit: hasPhoto ? "cover" : "contain",
        backgroundColor: "#ffffff",
        padding: hasPhoto ? "0" : "6px",
        border: "2px solid #e6f3fa",
      }}
    />
  );
};

/**
 * Brand lockup used at the top of every email: the logo mark next to the
 * Providence Auto wordmark.
 */
export const EmailBrandHeader = ({
  marginBottom = "24px",
}: {
  marginBottom?: string;
}) => (
  <Section style={{ marginBottom }}>
    <Row>
      <Column style={{ width: "44px", verticalAlign: "middle" }}>
        <Img src={LOGO_URL} alt="Providence Auto" width="36" height="36" />
      </Column>
      <Column style={{ verticalAlign: "middle", paddingLeft: "10px" }}>
        <Text
          style={{
            fontSize: "22px",
            fontWeight: "800",
            color: "#0f172a",
            letterSpacing: "-0.025em",
            margin: "0",
          }}
        >
          Providence <span style={{ color: "#0ea5e9" }}>Auto</span>
        </Text>
      </Column>
    </Row>
  </Section>
);
