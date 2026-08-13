// ─────────────────────────────────────────────────────────────────────────────
// "While you wait, here's what to read" block for customer emails.
//
// A fresh lead is at their most curious in the minutes after they submit the
// form, so the confirmation email carries two or three guides picked for their
// destination country plus a link back to the full guide index. The same set is
// shown on the form's success screen (see src/components/BlogSuggestions.tsx).
// ─────────────────────────────────────────────────────────────────────────────

import { Column, Hr, Link, Row, Section, Text } from "@react-email/components";
import type { BlogPost } from "@/config/blog";
import { BLOG_BASE_PATH } from "@/config/blog";
import { EMAIL_BASE_URL } from "./brand";

/** The only fields the email needs — kept flat so it stays easy to serialize. */
export type EmailBlogPost = {
  title: string;
  excerpt: string;
  href: string;
  readingTimeMins: number;
};

/** Map registry posts down to the email shape, with absolute links. */
export function toEmailBlogPosts(posts: BlogPost[]): EmailBlogPost[] {
  return posts.map((p) => ({
    title: p.title,
    excerpt: p.excerpt,
    href: `${EMAIL_BASE_URL}${BLOG_BASE_PATH}/${p.slug}`,
    readingTimeMins: p.readingTimeMins,
  }));
}

export const BlogSuggestionsSection = ({
  posts,
  heading = "While you wait — worth reading",
  intro = "Most of what surprises people about importing is knowable up front. These are the guides our customers find most useful:",
}: {
  posts: EmailBlogPost[];
  heading?: string;
  intro?: string;
}) => {
  if (!posts.length) return null;
  const blogUrl = `${EMAIL_BASE_URL}${BLOG_BASE_PATH}`;

  return (
    <Section style={wrapStyle}>
      <Hr style={hrStyle} />
      <Text style={headingStyle}>{heading}</Text>
      <Text style={introStyle}>{intro}</Text>

      {posts.map((post) => (
        <Section key={post.href} style={cardStyle}>
          <Row>
            <Column>
              <Text style={cardTitleStyle}>
                <Link href={post.href} style={cardTitleLinkStyle}>
                  {post.title}
                </Link>
              </Text>
              <Text style={cardExcerptStyle}>{post.excerpt}</Text>
              <Text style={cardMetaStyle}>
                {post.readingTimeMins} min read ·{" "}
                <Link href={post.href} style={cardMetaLinkStyle}>
                  Read the guide →
                </Link>
              </Text>
            </Column>
          </Row>
        </Section>
      ))}

      <Section style={{ textAlign: "center" as const, marginTop: "20px" }}>
        <Link href={blogUrl} style={allGuidesButtonStyle}>
          Browse all import guides
        </Link>
      </Section>
    </Section>
  );
};

export default BlogSuggestionsSection;

// --- STYLES ---
const wrapStyle = { margin: "8px 0 4px 0" };
const hrStyle = {
  borderColor: "#e2e8f0",
  margin: "24px 0 20px 0",
  borderTop: "1px solid #e2e8f0",
};
const headingStyle = {
  fontSize: "17px",
  fontWeight: "700",
  color: "#0f172a",
  margin: "0 0 6px 0",
};
const introStyle = {
  fontSize: "14px",
  lineHeight: "21px",
  color: "#64748b",
  margin: "0 0 16px 0",
};
const cardStyle = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  padding: "14px 16px",
  marginBottom: "10px",
};
const cardTitleStyle = { margin: "0 0 4px 0" };
const cardTitleLinkStyle = {
  fontSize: "15px",
  fontWeight: "700",
  color: "#0f172a",
  textDecoration: "none",
  lineHeight: "21px",
};
const cardExcerptStyle = {
  fontSize: "13px",
  lineHeight: "19px",
  color: "#64748b",
  margin: "0 0 8px 0",
};
const cardMetaStyle = {
  fontSize: "12px",
  color: "#94a3b8",
  margin: "0",
};
const cardMetaLinkStyle = {
  color: "#0369a1",
  fontWeight: "600",
  textDecoration: "none",
};
const allGuidesButtonStyle = {
  display: "inline-block",
  backgroundColor: "#ffffff",
  border: "1px solid #4da8da",
  color: "#0369a1",
  padding: "11px 26px",
  borderRadius: "10px",
  fontSize: "14px",
  fontWeight: "bold",
  textDecoration: "none",
};
