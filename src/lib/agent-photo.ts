// @/lib/agent-photo.ts
//
// One rule for "which photograph of a consultant does a customer see", shared
// by every customer-facing surface: the inquiry confirmation, the "from the
// rep" email, and the tracking page's agent card.
//
// Two photographs exist per person and they are not interchangeable:
//
//   `salesProfiles.photoUrl` — the headshot the consultant uploads in My
//   Profile and maintains for customers on their own /team page. Deliberate,
//   and the one they expect a customer to see.
//
//   `users.image` — the account avatar, which is whatever a social login
//   happened to supply, and is empty for anyone who signed up with a password.
//
// So the profile photo wins, the account avatar is the fallback, and when
// neither exists the answer is an empty string. Callers render their own
// placeholder for that — ClientAgentCard shows a user icon, EmailAvatar shows
// the Providence mark. A customer must never be shown a different colleague's
// face above a consultant's name, which is what a hard-coded default URL did.

import { eq } from "drizzle-orm";
import { db, salesProfiles } from "@/db";

export async function getAgentPhotoUrl(
  userId: string | null | undefined,
  userImage?: string | null,
): Promise<string> {
  const accountAvatar = userImage?.trim() || "";
  if (!userId) return accountAvatar;

  try {
    const profile = await db.query.salesProfiles.findFirst({
      where: eq(salesProfiles.userId, userId),
      columns: { photoUrl: true },
    });
    return profile?.photoUrl?.trim() || accountAvatar;
  } catch (error) {
    // A missing photo is cosmetic; never let this lookup break a lead
    // submission, a confirmation email or the tracking page.
    console.error("[AGENT_PHOTO] Sales profile lookup failed:", error);
    return accountAvatar;
  }
}
