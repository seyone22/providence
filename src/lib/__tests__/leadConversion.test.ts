import { describe, expect, it } from "vitest";
import {
  isKnownLeadStatus,
  isTeamDecidedStatus,
  leadOutcome,
  SALES_STATUSES,
} from "@/lib/leadConversion";

describe("leadOutcome", () => {
  it("treats the SQL status as the only qualifying label in the dropdown", () => {
    const qualifying = SALES_STATUSES.filter(
      (s) => leadOutcome(s) === "qualified",
    );
    expect(qualifying).toEqual(["SQL: Moved to vehicle offering stage"]);
  });

  // The whole reason this module exists. "Not Qualified" contains the
  // substring "qualified", and the old matcher uploaded it to Meta and Google
  // as a positive conversion.
  it("never reads a rejection as a qualification", () => {
    expect(leadOutcome("Not Qualified")).toBe("disqualified");
    expect(leadOutcome("Unqualified")).toBe("neutral");
    expect(leadOutcome("Lead Lost")).toBe("disqualified");
    expect(leadOutcome("Lead Closed")).toBe("disqualified");
  });

  it("leaves every in-play status neutral so it can still convert later", () => {
    for (const status of [
      "Action required",
      "No Response",
      "Stopped Responding",
      "Replied (Email)",
      "Replied (WhatsApp)",
      "Replied (Both)",
      "Active Conversation",
    ]) {
      expect(leadOutcome(status)).toBe("neutral");
    }
  });

  it("maps every dropdown label explicitly", () => {
    for (const status of SALES_STATUSES) {
      expect(isKnownLeadStatus(status)).toBe(true);
    }
  });

  it("recognises the legacy labels still stored in old rows", () => {
    expect(leadOutcome("Qualified")).toBe("qualified");
    expect(leadOutcome("Opened")).toBe("neutral");
    expect(leadOutcome("New")).toBe("neutral");
  });

  it("survives the casing and whitespace production actually stores", () => {
    expect(leadOutcome("not qualified")).toBe("disqualified");
    expect(leadOutcome("  NOT QUALIFIED  ")).toBe("disqualified");
    expect(leadOutcome("SQL:  Moved to vehicle offering stage")).toBe(
      "qualified",
    );
  });

  it("falls back to neutral rather than guessing", () => {
    expect(leadOutcome(null)).toBe("neutral");
    expect(leadOutcome(undefined)).toBe("neutral");
    expect(leadOutcome("")).toBe("neutral");
    expect(leadOutcome("Some Status Nobody Wired Up")).toBe("neutral");
    expect(isKnownLeadStatus("Some Status Nobody Wired Up")).toBe(false);
  });

  // A status invented later that happens to contain "qualified" must not
  // silently start converting.
  it("does not match on substrings", () => {
    expect(leadOutcome("Probably Qualified")).toBe("neutral");
    expect(leadOutcome("SQL-ish")).toBe("neutral");
    expect(leadOutcome("Not Qualified (duplicate)")).toBe("neutral");
  });
});

describe("isTeamDecidedStatus", () => {
  it("protects both a qualification and a rejection from being overwritten", () => {
    expect(isTeamDecidedStatus("SQL: Moved to vehicle offering stage")).toBe(
      true,
    );
    expect(isTeamDecidedStatus("Not Qualified")).toBe(true);
    expect(isTeamDecidedStatus("Lead Lost")).toBe(true);
  });

  it("leaves an in-play lead free to be promoted", () => {
    expect(isTeamDecidedStatus("Action required")).toBe(false);
    expect(isTeamDecidedStatus("Active Conversation")).toBe(false);
    expect(isTeamDecidedStatus(null)).toBe(false);
  });
});
