// ─────────────────────────────────────────────────────────────────────────────
// Providence Auto — public contact channels.
//
// Single source of truth for the numbers and mailboxes we publish on the site
// and in transactional email. Per-office numbers live in src/config/countries.ts;
// per-agent WhatsApp numbers live on the user record (users.whatsappNumber).
// Everything here is the *general* head-office channel, used when there is no
// more specific one to route to.
// ─────────────────────────────────────────────────────────────────────────────

/** Head-office landline, in display form. */
export const HEAD_OFFICE_PHONE = "+44 208 004 3000";

/** General enquiries mailbox. */
export const CONTACT_EMAIL = "info@providenceauto.uk.com";

/**
 * Main WhatsApp number for general enquiries — the one we publish on the home
 * page and fall back to in email when the assigned agent has no personal
 * WhatsApp number set on their profile.
 */
export const GENERAL_WHATSAPP_NUMBER = "+44 7480 318501";

/** Strip a number down to the bare international digits wa.me requires. */
export function whatsappDigits(number: string): string {
  return (number || "").replace(/\D/g, "");
}

/**
 * Build a wa.me deep link. Defaults to the general enquiries number; pass a
 * different `number` (e.g. an agent's own) to route the chat to them instead.
 * Returns "" when there are no digits to dial, so callers can skip rendering.
 */
export function whatsappLink(
  message?: string,
  number: string = GENERAL_WHATSAPP_NUMBER,
): string {
  const digits = whatsappDigits(number);
  if (!digits) return "";
  return message
    ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${digits}`;
}

/** Ready-made link for the general enquiries chat. */
export const GENERAL_WHATSAPP_LINK = whatsappLink(
  "Hi Providence Auto, I'd like to ask about importing a car.",
);
