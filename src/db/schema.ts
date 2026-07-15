import {
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// --- Better-Auth Tables ---

export const users = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  role: text("role").default("user").notNull(),
  isBanned: boolean("isBanned").default(false).notNull(),
  badges: text("badges").array().notNull().default([]),
  whatsappNumber: text("whatsappNumber").default(""),
});

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const verifications = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
});

// --- Application Tables ---

export const salesProfiles = pgTable("salesprofile", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  slug: text("slug").notNull().unique(),
  isPublished: boolean("isPublished").default(false).notNull(),
  displayName: text("displayName").notNull(),
  headline: text("headline").notNull(),
  tagline: text("tagline").notNull(),
  bio: text("bio").notNull(),
  photoUrl: text("photoUrl").notNull(),
  coverImageUrl: text("coverImageUrl").notNull(),
  yearsExperience: integer("yearsExperience").default(0).notNull(),
  languages: text("languages").array().notNull().default([]),
  expertise: jsonb("expertise").notNull().default([]),
  sourcingCountries: jsonb("sourcingCountries").notNull().default([]),
  trackRecord: jsonb("trackRecord").notNull().default([]),
  testimonials: jsonb("testimonials").notNull().default([]),
  featuredDossierIds: text("featuredDossierIds").array().notNull().default([]),
  whatsappNumber: text("whatsappNumber").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const requests = pgTable("request", {
  id: text("id").primaryKey(),
  make: text("make").notNull(),
  vehicleModel: text("vehicle_model").notNull(), // maps to vehicle_model in mongoose
  condition: text("condition").default("New").notNull(),
  yearFrom: integer("yearFrom"),
  yearTo: integer("yearTo"),
  mileage: text("mileage"),
  specs: text("specs"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  countryCode: text("countryCode").notNull(),
  phone: text("phone").notNull(),
  countryOfImport: text("countryOfImport").notNull(),
  importTimeline: text("importTimeline"),
  dossierIds: text("dossierIds").array().notNull().default([]),
  contactMethods: text("contactMethods").array().notNull().default([]),
  contactDays: text("contactDays").array().notNull().default([]),
  contactTimeWindow: text("contactTimeWindow"),
  contactTimezone: text("contactTimezone"),
  contactTimezoneLabel: text("contactTimezoneLabel"),
  preferredContactAt: timestamp("preferredContactAt"),
  isDraft: boolean("isDraft").default(false).notNull(),
  status: text("status").default("New").notNull(),
  leadStatus: text("leadStatus").default("Action required").notNull(),
  statusUpdatedAt: timestamp("statusUpdatedAt"),
  options: text("options"),
  agreedPrice: doublePrecision("agreedPrice"),
  statusHistory: jsonb("statusHistory").notNull().default([]),
  paymentType: text("paymentType"),
  totalAmount: doublePrecision("totalAmount"),
  advancePaymentAmount: doublePrecision("advancePaymentAmount"),
  balancePaymentAmount: doublePrecision("balancePaymentAmount"),
  balancePaymentStage: text("balancePaymentStage"),
  depositAmount: doublePrecision("depositAmount"),
  transactionId: text("transactionId"),
  invoiceNumber: text("invoiceNumber"),
  inspectionNotes: text("inspectionNotes"),
  trackingNumber: text("trackingNumber"),
  vesselName: text("vesselName"),
  eta: timestamp("eta"),
  portName: text("portName"),
  containerNumber: text("containerNumber"),
  portOfArrival: text("portOfArrival"),
  customsNotes: text("customsNotes"),
  adminNotes: text("adminNotes"),
  source: text("source"),
  followUpAt: timestamp("followUpAt"),
  followUpSetAt: timestamp("followUpSetAt"),
  gclid: text("gclid"),
  fbclid: text("fbclid"),
  fbc: text("fbc"),
  fbp: text("fbp"),
  assignedToId: text("assignedToId").references(() => users.id, {
    onDelete: "set null",
  }),
  assignedToName: text("assignedToName"),
  assignmentMethod: text("assignmentMethod").default("round-robin").notNull(),
  documents: jsonb("documents").notNull().default([]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const specDossiers = pgTable("specdossier", {
  id: text("id").primaryKey(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: text("year").default("").notNull(),
  trim: text("trim").default("").notNull(),
  condition: text("condition").default("New").notNull(),
  mileage: text("mileage").default("").notNull(),
  countryOfOrigin: text("countryOfOrigin").default("Japan").notNull(),
  engineConfig: text("engineConfig").default("").notNull(),
  displacement: text("displacement").default("").notNull(),
  maxPower: text("maxPower").default("").notNull(),
  maxTorque: text("maxTorque").default("").notNull(),
  transmission: text("transmission").default("").notNull(),
  fuelSystem: text("fuelSystem").default("Petrol").notNull(),
  steering: text("steering").default("RHD").notNull(),
  emissions: text("emissions").default("").notNull(),
  pricing: jsonb("pricing").notNull().default([]),
  upholstery: text("upholstery").default("").notNull(),
  infotainment: text("infotainment").default("").notNull(),
  features: text("features").array().notNull().default([]),
  searchTags: text("searchTags").array().notNull().default([]),
  heroImageUrl: text("heroImageUrl").default("").notNull(),
  images: text("images").array().notNull().default([]),
  customData: jsonb("customData").notNull().default([]),
  valuePoints: jsonb("valuePoints").notNull().default([]),
  slug: text("slug").default("").notNull(),
  notes: text("notes").default("").notNull(),
  status: text("status").default("Draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const socialPosts = pgTable(
  "socialpost",
  {
    id: text("id").primaryKey(),
    url: text("url").notNull(),
    shortcode: text("shortcode").notNull(),
    page: text("page").notNull(),
    order: integer("order").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => [index("page_order_idx").on(table.page, table.order)],
);

export const sourcingAnalyses = pgTable("sourcinganalysis", {
  id: text("id").primaryKey(),
  make: text("make").notNull(),
  vehicleModel: text("vehicleModel").notNull(),
  edition: text("edition"),
  year: integer("year"),
  mileage: integer("mileage"),
  landedCostGbp: doublePrecision("landedCostGbp").notNull(),
  currency: text("currency").default("JPY").notNull(),
  dutyBasis: text("dutyBasis"),
  vatBasis: text("vatBasis"),
  sources: text("sources").array().notNull().default([]),
  listingCount: integer("listingCount").default(0).notNull(),
  matchUsed: text("matchUsed"),
  widened: boolean("widened").default(false).notNull(),
  marketMin: doublePrecision("marketMin"),
  marketMedian: doublePrecision("marketMedian"),
  marketMean: doublePrecision("marketMean"),
  marketMax: doublePrecision("marketMax"),
  recommendation: text("recommendation").notNull(),
  headline: text("headline"),
  reasoning: text("reasoning"),
  confidence: text("confidence"),
  grossMargin: doublePrecision("grossMargin"),
  marginPct: doublePrecision("marginPct"),
  createdById: text("createdById"),
  createdByName: text("createdByName"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const dealerProfiles = pgTable("dealerprofile", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  dealerId: text("dealerId").notNull().unique(), // e.g. "DL-98273"
  companyName: text("companyName").notNull(),
  website: text("website"),
  commissionRate: doublePrecision("commissionRate").default(10.0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
