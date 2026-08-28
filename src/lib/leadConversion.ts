/**
 * The bridge between the label a salesperson picks in the dashboard and the
 * offline conversion we upload to Meta and Google Ads.
 *
 * This file exists because that bridge used to be a substring test:
 *
 *     status.toLowerCase().includes("qualified")
 *
 * "Not Qualified" contains "qualified", so every lead the team explicitly
 * threw away was uploaded to Meta as a positive conversion — training the ad
 * algorithm to go and find more of exactly the leads we had just rejected.
 * Nothing here may ever go back to matching on substrings. The map below is
 * exhaustive and exact, and an unrecognised label is silently neutral: the
 * failure mode of a new status nobody wired up is "we send nothing", never
 * "we send the wrong thing".
 */

/**
 * The sales statuses the team can set, in dashboard order.
 *
 * This is the canonical list. `RequestTableClient` and `DashboardClient` both
 * re-export/consume it rather than keeping their own copies, so a status added
 * to the dropdown cannot drift away from the conversion mapping underneath it.
 */
export const SALES_STATUSES = [
  "Action required",
  "No Response",
  "Stopped Responding",
  "Replied (Email)",
  "Replied (WhatsApp)",
  "Replied (Both)",
  "Active Conversation",
  "SQL: Moved to vehicle offering stage",
  "Not Qualified",
  "Lead Lost",
] as const;

export type SalesStatus = (typeof SALES_STATUSES)[number];

/**
 * What a label means to the ad platforms.
 *
 * - `qualified`   — the team has confirmed this is a real buyer. Upload it.
 * - `disqualified`— the team has confirmed this is not. Upload nothing, ever.
 * - `neutral`     — still in play, or we simply don't know yet. Upload nothing
 *                   *yet*; the lead can still become `qualified` later.
 *
 * The distinction between `disqualified` and `neutral` is not cosmetic. A
 * disqualified lead is a permanent no. A neutral lead is a not-yet, and must
 * stay eligible to convert if the team later moves it to SQL.
 */
export type LeadOutcome = "qualified" | "disqualified" | "neutral";

/**
 * Every label that can reach us, mapped explicitly.
 *
 * Keys are normalised (see `normalise`) because production has historically
 * stored labels with different capitalisation than the code expects — the same
 * trap that makes literal role checks miss on production.
 *
 * The block below the current dropdown is legacy: labels written by older code
 * that are still sitting in rows in the database.
 *   - "Qualified" / "Opened" were written by the /track page's own tracking.
 *   - "Unqualified" was the old column default before it became
 *     "Action required".
 *   - "Lead Closed" was retired from the dropdown and folded into "Lead Lost".
 *     It means the lead died, not that we won it — the dashboard badge groups
 *     it with the red statuses. The old code read the word "closed" and fired
 *     a *Purchase* event for it.
 */
const LEAD_OUTCOMES: Record<string, LeadOutcome> = {
  // — current dropdown —
  "action required": "neutral",
  "no response": "neutral",
  "stopped responding": "neutral",
  "replied (email)": "neutral",
  "replied (whatsapp)": "neutral",
  "replied (both)": "neutral",
  "active conversation": "neutral",
  "sql: moved to vehicle offering stage": "qualified",
  "not qualified": "disqualified",
  "lead lost": "disqualified",

  // — legacy labels still present in stored rows —
  qualified: "qualified",
  opened: "neutral",
  unqualified: "neutral",
  new: "neutral",
  "lead closed": "disqualified",
};

/** Lower-case, trim, and collapse runs of whitespace. */
function normalise(status: string): string {
  return status.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * What a stored `leadStatus` means for the ad platforms.
 *
 * An unknown label is `neutral` — if someone adds a status to the dropdown and
 * forgets this file, we under-report rather than mis-report.
 */
export function leadOutcome(status: string | null | undefined): LeadOutcome {
  if (!status) return "neutral";
  return LEAD_OUTCOMES[normalise(status)] ?? "neutral";
}

/** True when this label is one we have deliberately mapped. */
export function isKnownLeadStatus(status: string | null | undefined): boolean {
  return !!status && normalise(status) in LEAD_OUTCOMES;
}

/**
 * Statuses the team has set deliberately and that the customer's own actions
 * must not overwrite.
 *
 * The /track page promotes a lead to "Qualified" when the customer clicks
 * through to their agent. That is a useful engagement signal, but it used to
 * overwrite whatever the team had already decided — so a lead a salesperson
 * had marked "Not Qualified" would silently flip back to qualified the moment
 * the customer opened their tracking link.
 */
export function isTeamDecidedStatus(
  status: string | null | undefined,
): boolean {
  const outcome = leadOutcome(status);
  return outcome === "qualified" || outcome === "disqualified";
}

/**
 * The delivery pipeline, in order. A lead's `status` column holds one of these
 * — it is a different column from the `leadStatus` sales label above, and the
 * two must not be confused. The old conversion code searched the *sales*
 * label for the words "closed" or "won", which no sales label contains, so
 * the Purchase event never fired once.
 */
export const PIPELINE_STAGES: readonly string[] = [
  "New",
  "Vehicle Selection",
  "Price Agreement",
  "Deposit Collected",
  "Vehicle Purchased",
  "Preparation",
  "Shipped",
  "Arrived at Port",
  "Cleared Customs",
];

/**
 * The stage at which the customer has actually committed money.
 *
 * "Deposit Collected" rather than "Vehicle Purchased": the deposit is the
 * customer paying us, which is the conversion. "Vehicle Purchased" is us
 * paying the auction, which is a cost.
 */
export const PURCHASE_STAGE = "Deposit Collected";

/**
 * Whether a lead has reached or passed the point of payment.
 *
 * Deliberately "at or past" rather than "equals": a deal that jumps straight
 * from Price Agreement to Shipped still took a deposit, and an equality test
 * would drop the conversion on the floor. Firing only once is the ledger's
 * job, not this function's.
 */
export function hasReachedPurchaseStage(
  stage: string | null | undefined,
): boolean {
  if (!stage) return false;
  const normalised = normalise(stage);
  const index = PIPELINE_STAGES.findIndex((s) => normalise(s) === normalised);
  if (index === -1) return false;
  return index >= PIPELINE_STAGES.indexOf(PURCHASE_STAGE);
}

/** The currency every agreed amount in the pipeline is entered in. */
export const DEAL_CURRENCY = "USD";

/** The event name uploaded when the team qualifies a lead. */
export const QUALIFIED_LEAD_EVENT = "QualifiedLead";

/** The event name uploaded when the customer pays a deposit. */
export const PURCHASE_EVENT = "Purchase";

/** The event name uploaded when a lead is first submitted. */
export const LEAD_EVENT = "Lead";
