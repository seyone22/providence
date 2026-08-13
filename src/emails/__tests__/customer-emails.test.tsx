// Renders the two customer-facing templates and asserts the things that are
// easy to break silently: the brand mark / rep photo in the profile slot, the
// suggested-reading block, and which WhatsApp number each button dials.

import { render } from "@react-email/render";
import { describe, expect, it } from "vitest";
import { getSuggestedPosts } from "@/config/blog";
import { GENERAL_WHATSAPP_NUMBER, whatsappDigits } from "@/config/contact";
import { toEmailBlogPosts } from "@/emails/blog-suggestions";
import ContactScheduledEmail from "@/emails/contact-scheduled";
import CustomerConfirmationEmail from "@/emails/customer-confirmation";

const POSTS = toEmailBlogPosts(
  getSuggestedPosts({ destinationCountry: "Ireland", limit: 3 }),
);
const GENERAL_DIGITS = whatsappDigits(GENERAL_WHATSAPP_NUMBER);
const AGENT_PHOTO = "https://cdn.example.com/profiles/abdallah.jpg";

const BASE = {
  userName: "Aoife Byrne",
  make: "Toyota",
  model: "Land Cruiser",
  requestId: "req-123",
  contactMethods: ["WhatsApp"],
  contactDays: ["Monday"],
  contactTimeWindow: "Morning",
  contactTimezoneLabel: "Irish Standard Time",
  suggestedPosts: POSTS,
  destinationCountry: "Ireland",
};

describe("ContactScheduledEmail", () => {
  it("leads with the rep's own photo and dials their WhatsApp", async () => {
    const html = await render(
      ContactScheduledEmail({
        ...BASE,
        agent: {
          name: "Abdallah K",
          email: "abdallah@providenceauto.uk.com",
          image: AGENT_PHOTO,
          whatsappNumber: "+44 7911 123456",
        },
      }),
    );

    expect(html).toContain(AGENT_PHOTO);
    expect(html).toContain("wa.me/447911123456");
    expect(html).toContain("Talk to me on WhatsApp");
    // Brand mark still appears in the header lockup alongside the photo.
    expect(html).toContain("/logo.png");
  });

  it("falls back to the Providence mark and the general WhatsApp number", async () => {
    const html = await render(
      ContactScheduledEmail({
        ...BASE,
        agent: {
          name: "Providence Support",
          email: "info@providenceauto.uk.com",
          image: "",
        },
      }),
    );

    // Header lockup + the empty avatar slot both resolve to the logo, so the
    // profile picture is never a broken image.
    expect((html.match(/logo\.png/g) || []).length).toBeGreaterThanOrEqual(2);
    expect(html).toContain(`wa.me/${GENERAL_DIGITS}`);
    expect(html).toContain("Message us on WhatsApp");
  });

  it("carries the suggested guides and a link to the blog index", async () => {
    const html = await render(
      ContactScheduledEmail({
        ...BASE,
        agent: {
          name: "Abdallah K",
          email: "abdallah@providenceauto.uk.com",
          image: AGENT_PHOTO,
        },
      }),
    );

    expect(POSTS).toHaveLength(3);
    for (const post of POSTS) {
      expect(html).toContain(post.href);
      expect(html).toContain(post.title);
    }
    expect(html).toContain("Browse all import guides");
    // Framed by the destination the customer actually picked.
    expect(html).toContain("importing into Ireland");
  });
});

describe("CustomerConfirmationEmail", () => {
  it("renders the rep photo, the guides and the general WhatsApp number", async () => {
    const html = await render(
      CustomerConfirmationEmail({
        ...BASE,
        staffName: "Abdallah K",
        staffImage: AGENT_PHOTO,
      }),
    );

    expect(html).toContain(AGENT_PHOTO);
    expect(html).toContain(GENERAL_DIGITS);
    for (const post of POSTS) {
      expect(html).toContain(post.href);
    }
    expect(html).toContain("Browse all import guides");
  });

  it("falls back to the logo when the rep has no profile picture", async () => {
    const html = await render(
      CustomerConfirmationEmail({
        ...BASE,
        staffName: "Providence Support",
        staffImage: null,
      }),
    );

    expect((html.match(/logo\.png/g) || []).length).toBeGreaterThanOrEqual(2);
  });

  it("hides the reading block when there is nothing to suggest", async () => {
    const html = await render(
      CustomerConfirmationEmail({
        ...BASE,
        staffName: "Providence Support",
        suggestedPosts: [],
      }),
    );

    expect(html).not.toContain("Browse all import guides");
  });
});
