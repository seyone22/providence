// One-off seed: create/refresh Abdallah's sales profile page (/team/abdallah).
//
// It finds the user named "Abdallah" (case-insensitive) who can own leads
// (role Sales or admin), then upserts a SalesProfile document with the launch
// content pack from sales-profile-spec.md. Figures/testimonials marked ⚠️ in the
// spec are launch placeholders — replace them via the editor before promoting.
//
// The profile is seeded UNPUBLISHED so it can be reviewed at /admin/my-profile
// (or previewed) before going live.
//
// Run (Node >= 20.6 for --env-file):
//   node --env-file=.env.local scripts/seed-abdallah.mjs
// Optional flags:
//   --publish            seed with isPublished: true
//   --name="Abu Dhabi"   match a different user name than "Abdallah"
//   --create-user        if no matching Sales/admin user exists, provision a
//                        demo one (role Sales) so the sample page is viewable.
//                        The demo user has no password — it exists only to own
//                        the profile and receive direct-assigned leads. Delete
//                        it (and the profile) when you attach the page to the
//                        real Abdallah account.

import { MongoClient, ObjectId } from "mongodb";

const args = process.argv.slice(2);
const PUBLISH = args.includes("--publish");
const CREATE_USER = args.includes("--create-user");
const nameArg = args.find((a) => a.startsWith("--name="));
const USER_NAME = nameArg ? nameArg.split("=")[1] : "Abdallah";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error(
    "Missing MONGODB_URI. Run with: node --env-file=.env.local scripts/seed-abdallah.mjs",
  );
  process.exit(1);
}

// Better-Auth stores users in the "test" database (see src/utils/auth.ts).
const DB_NAME = "test";

const CONTENT = {
  slug: "abdallah",
  displayName: "Abdallah",
  headline: "Your car, sourced by someone\nwho picks up the phone.",
  tagline:
    "I'm Abdallah. I find, verify and land cars from Japan, India and the UK for clients who want a specialist on their side — not a ticket number.",
  bio: [
    "Most people buy a car from a listing. My clients buy from a person.",
    "I started in this trade because I watched too many buyers get burned by photos that hid rust and \"clean\" cars with rolled-back odometers. Seven years later, I've built my reputation on one habit: I never ask a client to pay for a car I wouldn't buy myself. If the auction sheet doesn't add up, I walk away — and I tell you why.",
    "When you send an inquiry through this page, it doesn't go into a pool. It comes to my phone, and I answer it personally — usually within the hour. From the first search to the day your car clears customs, you deal with one person: me.",
  ].join("\n\n"),
  yearsExperience: 7,
  languages: ["English", "Arabic"],
  whatsappNumber: "", // ⚠️ set Abdallah's real WhatsApp number before publish
  photoUrl: "", // ⚠️ upload a portrait via the editor
  expertise: [
    {
      icon: "FileSearch",
      title: "Auction-Sheet Literacy",
      desc: "I read Japanese auction grade sheets daily and translate what they actually mean for you — grade, repair history, the notes other importers skim past.",
    },
    {
      icon: "Handshake",
      title: "Straight-Talk Negotiation",
      desc: "I bid with your ceiling, not mine. If the car runs past its value, I let it go and find the next one — there is always a next one.",
    },
    {
      icon: "Landmark",
      title: "Landed-Cost Clarity",
      desc: "One all-in figure — car, freight, insurance, duty and VAT — before you commit a penny. The price I quote is the price you pay.",
    },
    {
      icon: "Ship",
      title: "Door-to-Door Ownership",
      desc: "I stay on your file through shipping, customs and registration. You get milestone updates from me, not a tracking portal.",
    },
  ],
  sourcingCountries: [
    {
      country: "Japan",
      flag: "🇯🇵",
      note: "Grade-verified auction cars — my home turf. Low mileage, honest history, wholesale pricing.",
    },
    {
      country: "India",
      flag: "🇮🇳",
      note: "Factory-fresh value through Providence's direct dealer network — the same badges for ~30% less.",
    },
    {
      country: "United Kingdom",
      flag: "🇬🇧",
      note: "Right-hand-drive stock and UK-market specials, sourced and inspected before export.",
    },
    {
      country: "UAE",
      flag: "🇦🇪",
      note: "GCC-spec cars and re-exports through Dubai's trade hubs.",
    },
  ],
  trackRecord: [
    { value: "120+", label: "cars delivered" },
    { value: "14", label: "countries served" },
    { value: "< 1 hr", label: "avg. first response" },
  ],
  testimonials: [
    {
      name: "Omar R.",
      title: "He talked me out of the first car.",
      rating: 5,
      text: "The auction grade looked fine to me, but Abdallah spotted repair notes on the sheet and refused to bid. The car he found a week later was better and cheaper. That's whose hands you want your money in.",
    },
    {
      name: "Ciara N.",
      title: "One person, start to finish.",
      rating: 5,
      text: "Every question — shipping, VAT, registration in Ireland — answered by the same person on WhatsApp, usually in minutes. My Swace landed exactly on the quoted price.",
    },
    {
      name: "Yusuf A.",
      title: "Felt like having a friend in the trade.",
      rating: 5,
      text: "Abdallah sent me videos from the yard before shipping and flagged a scratch I'd never have seen. Second car already on the way.",
    },
  ],
};

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(DB_NAME);

  let user = await db.collection("user").findOne({
    name: { $regex: `^${USER_NAME}`, $options: "i" },
    role: { $in: ["Sales", "admin"] },
  });

  if (!user && CREATE_USER) {
    const now = new Date();
    const email = `${USER_NAME.toLowerCase().replace(/\s+/g, ".")}@providenceauto.co.uk`;
    const res = await db.collection("user").insertOne({
      name: USER_NAME,
      email,
      emailVerified: false,
      role: "Sales",
      isBanned: false,
      badges: [],
      whatsappNumber: "",
      image: "",
      createdAt: now,
      updatedAt: now,
    });
    user = await db.collection("user").findOne({ _id: res.insertedId });
    console.log(
      `Provisioned demo Sales user: ${USER_NAME} <${email}> (${res.insertedId})`,
    );
  }

  if (!user) {
    console.error(
      `No lead-owning user found whose name starts with "${USER_NAME}" (role Sales/admin).\n` +
        `Pass --create-user to provision a demo one, --name="Exact Name" to match another, ` +
        `or create the real user first.`,
    );
    await client.close();
    process.exit(1);
  }

  console.log(`Matched user: ${user.name} <${user.email}> (${user._id})`);

  const now = new Date();
  const doc = {
    ...CONTENT,
    userId: new ObjectId(user._id),
    isPublished: PUBLISH,
    whatsappNumber: CONTENT.whatsappNumber || user.whatsappNumber || "",
    photoUrl: CONTENT.photoUrl || user.image || "",
    featuredDossierIds: [], // pick vehicles via the editor
    updatedAt: now,
  };

  const existing = await db
    .collection("salesprofiles")
    .findOne({ userId: doc.userId });

  if (existing) {
    // Preserve any vehicles / overrides already curated in the editor.
    await db.collection("salesprofiles").updateOne(
      { _id: existing._id },
      {
        $set: {
          ...doc,
          featuredDossierIds: existing.featuredDossierIds || [],
          isPublished: existing.isPublished ?? PUBLISH,
        },
      },
    );
    console.log(
      `Updated existing profile (${existing._id}). Published: ${existing.isPublished ?? PUBLISH}`,
    );
  } else {
    const res = await db
      .collection("salesprofiles")
      .insertOne({ ...doc, createdAt: now });
    console.log(`Created profile ${res.insertedId}. Published: ${PUBLISH}`);
  }

  console.log(
    `\nDone. Review at /admin/my-profile, preview at /team/${CONTENT.slug}.`,
  );
  console.log(
    "⚠️ Set WhatsApp number, portrait, and real testimonials/figures before promoting.",
  );
  await client.close();
}

main().catch((err) => {
  console.error("Seed aborted:", err);
  process.exit(1);
});
