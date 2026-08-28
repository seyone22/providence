/**
 * Offline conversion uploads to Meta and Google Ads.
 *
 * These functions only ever *send* — the decision about whether a lead has
 * earned a conversion lives in src/lib/leadConversion.ts, and the record of
 * what has already been sent lives in the request row's ledger columns.
 *
 * Two facts from Meta's documentation shape everything below:
 *
 *   1. "If you send us two consecutive server events with the same information,
 *      we do not discard either." Server-to-server deduplication does not
 *      exist. `event_id` only dedupes a browser pixel event against a server
 *      event. So a retry is a double-count, and nothing here retries.
 *
 *   2. "If any event you send in a batch is invalid, we reject the entire
 *      batch." There is no partial success — a 200 with events_received short
 *      of what you sent means something silently went wrong, so the caller
 *      checks the count rather than trusting the status code.
 */

import crypto from "node:crypto";

/**
 * The Conversions API is a *Marketing* API product, and Marketing API versions
 * are not Graph API versions. As of August 2026 the latest Graph API is v26.0
 * but Marketing API v26.0 does not exist — /docs/marketing-api/changelog/
 * version26.0 is a 404. v25.0 (released 18 Feb 2026) is current.
 *
 * The Conversions API carries a support guarantee the rest of the Marketing
 * API does not: "every version is supported for at least two years. This
 * exception is only valid for the Conversions API." That puts v25.0's floor at
 * roughly February 2028.
 *
 * The version this replaced was v19.0, whose Marketing API support ended on
 * 4 February 2025. Calls to a dead version are not reliably rejected — Meta
 * auto-upgrades an unaffected endpoint rather than failing it, and flags that
 * in a response header we now log (see VERSION_WARNING_HEADER).
 */
const META_API_VERSION = "v25.0";

/**
 * Meta sets this when it has silently rewritten your call to a newer version.
 * Its presence means the pinned version above has expired and needs bumping.
 */
const VERSION_WARNING_HEADER = "x-ad-api-version-warning";

/**
 * Meta's own guidance: "setting a timeout of 1500 milliseconds on the request",
 * most responses arriving "under 600 milliseconds".
 */
const META_TIMEOUT_MS = 1500;

/** What a caller gets back. Never throws — a failed upload must not fail a sale. */
export type ConversionResult =
  | { ok: true; eventsReceived: number; fbtraceId: string | null }
  | {
      ok: false;
      reason:
        | "not-configured"
        | "no-identifiers"
        | "rejected"
        | "network"
        | "partial";
      detail: string;
    };

/* -------------------------------------------------------------------------- */
/*  Normalisation + hashing                                                    */
/* -------------------------------------------------------------------------- */

/** SHA-256 hex digest, or null when there is nothing to hash. */
function sha256(value: string): string | null {
  if (!value) return null;
  return crypto.createHash("sha256").update(value).digest("hex");
}

/**
 * Email: "Trim any leading and trailing spaces. Convert all characters to
 * lowercase."
 */
export function hashData(data: string | null | undefined): string | null {
  if (!data) return null;
  return sha256(data.trim().toLowerCase());
}

/**
 * Phone: "Remove symbols, letters, and any leading zeros. Phone numbers must
 * include a country code to be used for matching."
 *
 * The subtlety the old implementation missed is the leading zero. It
 * concatenated the dial code and the number and stripped only non-digits, so a
 * UK lead who typed 07700 900123 with a +44 dial code hashed as
 * 4407700900123 — a number that exists nowhere and matches nobody. It has to
 * be 447700900123.
 *
 * When the customer typed the number in international form themselves (a
 * leading + or 00) the stored dial code is ignored rather than prepended
 * twice. Anything else is treated as a national number: leading zeros are
 * trimmed and the dial code goes in front. Guessing beyond that is worse than
 * not guessing — a wrong hash is not a weaker match, it is a false one.
 */
export function hashPhone(
  countryCode: string | null | undefined,
  phone?: string | null,
): string | null {
  // Back-compat: called with a single already-joined string.
  const raw = (phone === undefined ? countryCode : phone) || "";
  const dial = (phone === undefined ? "" : countryCode || "").replace(
    /\D/g,
    "",
  );

  const trimmed = raw.trim();
  if (!trimmed) return null;

  const alreadyInternational =
    trimmed.startsWith("+") || trimmed.startsWith("00");

  let digits: string;
  if (alreadyInternational) {
    digits = trimmed.replace(/\D/g, "").replace(/^00/, "");
  } else {
    const national = trimmed.replace(/\D/g, "").replace(/^0+/, "");
    if (!national) return null;
    digits = dial ? `${dial}${national}` : national;
  }

  // E.164 tops out at 15 digits; a country code needs at least a few more than
  // itself to be a number at all.
  if (digits.length < 6 || digits.length > 15) return null;
  return sha256(digits);
}

/**
 * Meta's click identifier, rebuilt from a raw fbclid when the _fbc cookie was
 * never set (which is every lead that arrives before the browser pixel has
 * written one). Format is fb.1.<millis>.<fbclid>, where the timestamp is when
 * we observed the click.
 */
export function deriveFbc(
  fbc: string | null | undefined,
  fbclid: string | null | undefined,
  observedAt: Date | null | undefined,
): string | null {
  if (fbc) return fbc;
  if (!fbclid) return null;
  const ms = (observedAt ?? new Date()).getTime();
  return `fb.1.${ms}.${fbclid}`;
}

/* -------------------------------------------------------------------------- */
/*  Meta Conversions API                                                       */
/* -------------------------------------------------------------------------- */

/** The subset of a request row these uploads read. */
export interface ConversionLead {
  id: string;
  email?: string | null;
  countryCode?: string | null;
  phone?: string | null;
  condition?: string | null;
  make?: string | null;
  vehicleModel?: string | null;
  countryOfImport?: string | null;
  gclid?: string | null;
  fbc?: string | null;
  fbp?: string | null;
  fbclid?: string | null;
  createdAt?: Date | null;
  agreedPrice?: number | null;
  totalAmount?: number | null;
}

export interface MetaEventOptions {
  /** Distinguishes this upload from other events for the same lead. */
  eventId?: string;
  /** Monetary value, for value-based optimisation. */
  value?: number | null;
  currency?: string;
}

/**
 * Upload one server event.
 *
 * `action_source: "system_generated"` is what Meta's own CRM-integration
 * examples use for a lead whose stage changed inside a CRM, as opposed to
 * `physical_store` (in-person transactions) or `website` (browser activity).
 * A non-web action source is also why no `event_source_url` or
 * `client_user_agent` is required here.
 */
export async function sendMetaConversion(
  lead: ConversionLead,
  eventName = "QualifiedLead",
  options: MetaEventOptions = {},
): Promise<ConversionResult> {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    return {
      ok: false,
      reason: "not-configured",
      detail: "META_PIXEL_ID / META_ACCESS_TOKEN are not set.",
    };
  }

  const email = hashData(lead.email);
  const phone = hashPhone(lead.countryCode, lead.phone);
  const fbc = deriveFbc(lead.fbc, lead.fbclid, lead.createdAt);

  // "You must provide at least one of the following user_data parameters."
  // A hash of the empty string is not a weak identifier, it is a wrong one —
  // every field below is omitted rather than sent blank.
  const userData: Record<string, unknown> = {};
  if (email) userData.em = [email];
  if (phone) userData.ph = [phone];
  if (fbc) userData.fbc = fbc;
  if (lead.fbp) userData.fbp = lead.fbp;
  // Hashing external_id is "recommended" rather than required.
  const externalId = hashData(lead.id);
  if (externalId) userData.external_id = [externalId];

  if (Object.keys(userData).length === 0) {
    return {
      ok: false,
      reason: "no-identifiers",
      detail: `Lead ${lead.id} has no email, phone, fbc or fbp to match on.`,
    };
  }

  const customData: Record<string, unknown> = {
    // Meta's CRM examples carry both of these so the event is attributed to a
    // CRM rather than to site activity.
    lead_event_source: "Providence Auto CRM",
    event_source: "crm",
    lead_type: lead.condition || undefined,
    make: lead.make || undefined,
    model: lead.vehicleModel || undefined,
    destination: lead.countryOfImport || undefined,
  };
  if (typeof options.value === "number" && Number.isFinite(options.value)) {
    customData.value = options.value;
    customData.currency = options.currency || "USD";
  }

  const event = {
    event_name: eventName,
    // Meta rejects the entire request if any event_time is more than 7 days
    // old, so events are always stamped at upload time.
    event_time: Math.floor(Date.now() / 1000),
    action_source: "system_generated",
    event_id: options.eventId || lead.id,
    user_data: userData,
    custom_data: customData,
  };

  // Form-encoded with the token as a field, which is the shape Meta's own
  // cURL example uses. The token stays out of the URL, where it would end up
  // in access logs and proxy history.
  const body = new URLSearchParams({
    data: JSON.stringify([event]),
    access_token: accessToken,
  });

  // Recommended for server-to-server calls: proves the call came from us even
  // if the token leaks. Only sent when the app secret is configured.
  const appSecret = process.env.META_APP_SECRET;
  if (appSecret) {
    body.set(
      "appsecret_proof",
      crypto.createHmac("sha256", appSecret).update(accessToken).digest("hex"),
    );
  }

  // When set, events land in the Test Events tool instead of live
  // optimisation. Must be unset in production.
  const testCode = process.env.META_TEST_EVENT_CODE;
  if (testCode) body.set("test_event_code", testCode);

  try {
    const response = await fetch(
      `https://graph.facebook.com/${META_API_VERSION}/${pixelId}/events`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
        signal: AbortSignal.timeout(META_TIMEOUT_MS),
      },
    );

    // Present only when Meta has silently rewritten the call because
    // META_API_VERSION has expired.
    const versionWarning = response.headers.get(VERSION_WARNING_HEADER);
    if (versionWarning) {
      console.warn(
        `[META CAPI] Pinned version ${META_API_VERSION} is deprecated: ${versionWarning}`,
      );
    }

    const payload = (await response.json().catch(() => null)) as {
      events_received?: number;
      messages?: unknown[];
      fbtrace_id?: string;
      error?: { message?: string; code?: number; fbtrace_id?: string };
    } | null;

    if (!response.ok || payload?.error) {
      const detail = payload?.error
        ? `${payload.error.message} (code ${payload.error.code}, fbtrace ${payload.error.fbtrace_id})`
        : `HTTP ${response.status}`;
      console.error(
        `[META CAPI] ${eventName} rejected for lead ${lead.id}: ${detail}`,
      );
      return { ok: false, reason: "rejected", detail };
    }

    const received = payload?.events_received ?? 0;
    if (payload?.messages?.length) {
      console.warn(
        `[META CAPI] ${eventName} warnings for lead ${lead.id}:`,
        payload.messages,
      );
    }

    // A 200 is not proof the event landed — check the count Meta echoes back.
    if (received < 1) {
      const detail = `events_received=${received} (fbtrace ${payload?.fbtrace_id})`;
      console.error(
        `[META CAPI] ${eventName} not recorded for lead ${lead.id}: ${detail}`,
      );
      return { ok: false, reason: "partial", detail };
    }

    console.info(
      `[META CAPI] ${eventName} accepted for lead ${lead.id} (fbtrace ${payload?.fbtrace_id})`,
    );
    return {
      ok: true,
      eventsReceived: received,
      fbtraceId: payload?.fbtrace_id ?? null,
    };
  } catch (error) {
    // Deliberately no retry. Meta does not deduplicate two server events, so a
    // retry after a timeout that actually landed would count the lead twice.
    const detail = error instanceof Error ? error.message : String(error);
    console.error(
      `[META CAPI] ${eventName} failed for lead ${lead.id}: ${detail}`,
    );
    return { ok: false, reason: "network", detail };
  }
}

/* -------------------------------------------------------------------------- */
/*  Google Ads offline click conversions                                       */
/* -------------------------------------------------------------------------- */

/**
 * Google Ads API version. v25 is current as of August 2026 (v25.1 being the
 * latest minor release); Google keeps roughly the last three majors alive.
 *
 * The version this replaced was v17, which sunset around June 2025 — so every
 * Google upload this codebase has attempted for the last fifteen months went
 * to a dead endpoint and landed nowhere. Unlike Meta, Google does not
 * auto-upgrade a sunset version; the call simply fails.
 *
 * Overridable by env so the pin can be bumped without a deploy.
 */
const GOOGLE_ADS_API_VERSION = process.env.GOOGLE_ADS_API_VERSION || "v25";

/**
 * Google's hashing rules differ from Meta's for Gmail addresses: for
 * gmail.com and googlemail.com only, periods and any +suffix are stripped from
 * the username before hashing. Applying that to other domains — or failing to
 * apply it to Gmail — silently loses matches.
 */
export function hashGoogleEmail(
  email: string | null | undefined,
): string | null {
  if (!email) return null;
  const trimmed = email.trim().toLowerCase();
  const at = trimmed.lastIndexOf("@");
  if (at < 1) return null;

  let user = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);

  if (domain === "gmail.com" || domain === "googlemail.com") {
    user = user.split("+")[0].split(".").join("");
  }
  if (!user) return null;

  return sha256(`${user}@${domain}`);
}

export async function sendGoogleConversion(
  lead: ConversionLead,
  options: { value?: number | null; currency?: string } = {},
): Promise<ConversionResult> {
  const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID;
  const devToken = process.env.GOOGLE_DEV_TOKEN;
  const oauthToken = process.env.GOOGLE_OAUTH_TOKEN;
  const conversionActionId = process.env.GOOGLE_CONVERSION_ACTION_ID;
  const loginCustomerId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID;

  if (!customerId || !devToken || !oauthToken || !conversionActionId) {
    return {
      ok: false,
      reason: "not-configured",
      detail: "Google Ads credentials are not fully set.",
    };
  }

  const email = hashGoogleEmail(lead.email);
  const phone = hashPhone(lead.countryCode, lead.phone);

  // A click conversion needs either the click that produced it or enough
  // hashed identity to match one.
  if (!lead.gclid && !email && !phone) {
    return {
      ok: false,
      reason: "no-identifiers",
      detail: `Lead ${lead.id} has no gclid and no hashable identifiers.`,
    };
  }

  const userIdentifiers: Record<string, string>[] = [];
  if (email) userIdentifiers.push({ hashedEmail: email });
  if (phone) userIdentifiers.push({ hashedPhoneNumber: phone });

  const conversion: Record<string, unknown> = {
    conversionAction: `customers/${customerId}/conversionActions/${conversionActionId}`,
    conversionDateTime: googleTimestamp(new Date()),
    // Lets us retract this exact upload later if it turns out to be wrong.
    orderId: lead.id,
  };
  if (lead.gclid) conversion.gclid = lead.gclid;
  if (userIdentifiers.length) conversion.userIdentifiers = userIdentifiers;
  if (typeof options.value === "number" && Number.isFinite(options.value)) {
    conversion.conversionValue = options.value;
    conversion.currencyCode = options.currency || "USD";
  }
  // Consent is not rejected by the API when absent, but Google's EU user
  // consent policy names the UK explicitly, and unattributed conversions are
  // the practical penalty for omitting it. It is read from env rather than
  // hardcoded: only the cookie banner knows what the customer actually agreed
  // to, and asserting GRANTED on their behalf would be a policy claim this
  // file has no standing to make. Set both once the banner is confirmed, or
  // configure account-level defaults under Tools > Data Manager > Consent
  // settings instead.
  const adUserData = process.env.GOOGLE_ADS_CONSENT_AD_USER_DATA;
  const adPersonalization = process.env.GOOGLE_ADS_CONSENT_AD_PERSONALIZATION;
  if (adUserData || adPersonalization) {
    conversion.consent = {
      ...(adUserData ? { adUserData } : {}),
      ...(adPersonalization ? { adPersonalization } : {}),
    };
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "developer-token": devToken,
    Authorization: `Bearer ${oauthToken}`,
  };
  if (loginCustomerId) headers["login-customer-id"] = loginCustomerId;

  try {
    const response = await fetch(
      `https://googleads.googleapis.com/${GOOGLE_ADS_API_VERSION}/customers/${customerId}:uploadClickConversions`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          conversions: [conversion],
          partialFailure: true,
          validateOnly: process.env.GOOGLE_ADS_VALIDATE_ONLY === "true",
        }),
        signal: AbortSignal.timeout(5000),
      },
    );

    const payload = (await response.json().catch(() => null)) as {
      partialFailureError?: { message?: string };
      results?: unknown[];
      error?: { message?: string; status?: string };
    } | null;

    if (!response.ok || payload?.error) {
      const detail = payload?.error?.message || `HTTP ${response.status}`;
      console.error(
        `[GOOGLE ADS] Conversion rejected for lead ${lead.id}: ${detail}`,
      );
      return { ok: false, reason: "rejected", detail };
    }

    // partialFailure means the HTTP call succeeded while the row inside it did
    // not — the exact case a bare status check misses.
    if (payload?.partialFailureError?.message) {
      const detail = payload.partialFailureError.message;
      console.error(
        `[GOOGLE ADS] Conversion partially failed for lead ${lead.id}: ${detail}`,
      );
      return { ok: false, reason: "partial", detail };
    }

    console.info(`[GOOGLE ADS] Conversion accepted for lead ${lead.id}`);
    return { ok: true, eventsReceived: 1, fbtraceId: null };
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error(
      `[GOOGLE ADS] Conversion failed for lead ${lead.id}: ${detail}`,
    );
    return { ok: false, reason: "network", detail };
  }
}

/** Google Ads wants "yyyy-MM-dd HH:mm:ss+|-HH:mm". */
export function googleTimestamp(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const offsetMin = -date.getTimezoneOffset();
  const sign = offsetMin >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMin);
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}` +
    `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`
  );
}
