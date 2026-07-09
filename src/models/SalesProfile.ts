// @/models/SalesProfile.ts
import mongoose, { models, Schema } from "mongoose";

/**
 * A personal marketing landing page for a Sales team member, served at
 * /team/[slug]. One document per user. Inquiries submitted through the page are
 * assigned directly to `userId` (bypassing round-robin) — see
 * submitCarRequest in request-actions.ts.
 */

const ExpertiseSchema = new Schema(
  {
    icon: { type: String, default: "Star" }, // lucide icon name, resolved on the client
    title: { type: String, required: true },
    desc: { type: String, default: "" },
  },
  { _id: false },
);

const SourcingCountrySchema = new Schema(
  {
    country: { type: String, required: true },
    flag: { type: String, default: "" }, // emoji flag
    note: { type: String, default: "" },
  },
  { _id: false },
);

// Public "vanity" figures the member maintains themselves — marketing claims,
// NOT live DB numbers. Deliberately free-text so "< 1 hr" style values work.
const TrackRecordSchema = new Schema(
  {
    value: { type: String, required: true },
    label: { type: String, required: true },
  },
  { _id: false },
);

const TestimonialSchema = new Schema(
  {
    name: { type: String, required: true },
    title: { type: String, default: "" },
    text: { type: String, default: "" },
    rating: { type: Number, default: 5, min: 1, max: 5 },
  },
  { _id: false },
);

const SalesProfileSchema = new Schema(
  {
    // Owner — the Better-Auth user (role must be Sales or admin). Unique so a
    // member can only ever have one profile page.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
      index: true,
    },

    // Public URL segment: /team/[slug]. Unique, kebab-case, reserved words blocked.
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    isPublished: { type: Boolean, default: false },

    // Identity / hero
    displayName: { type: String, default: "" },
    headline: { type: String, default: "" },
    tagline: { type: String, default: "" },
    bio: { type: String, default: "" }, // paragraphs split on \n\n
    photoUrl: { type: String, default: "" },
    coverImageUrl: { type: String, default: "" },

    // Personality / expertise
    yearsExperience: { type: Number, default: 0 },
    languages: [{ type: String }],
    expertise: [ExpertiseSchema],
    sourcingCountries: [SourcingCountrySchema],
    trackRecord: [TrackRecordSchema],
    testimonials: [TestimonialSchema],

    // Vehicles the member promotes, chosen from the gallery.
    featuredDossierIds: [
      { type: mongoose.Schema.Types.ObjectId, ref: "SpecDossier" },
    ],

    whatsappNumber: { type: String, default: "" },
  },
  { timestamps: true },
);

export const SalesProfile =
  models.SalesProfile || mongoose.model("SalesProfile", SalesProfileSchema);

export default SalesProfile;
