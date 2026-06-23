// @/models/SourcingAnalysis.ts
// A saved run of the admin Sourcing & Profit analyzer: the vehicle, the landed
// cost, the market snapshot and the verdict — so the team has a searchable
// history of what was considered and why.
import mongoose, { type Document, Schema } from "mongoose";

export interface ISourcingAnalysis extends Document {
  // Vehicle
  make: string;
  vehicleModel: string;
  edition?: string;
  year?: number;
  mileage?: number; // miles

  // Cost side (GBP)
  landedCostGbp: number;
  currency: string;
  dutyBasis: string;
  vatBasis: string;

  // Market snapshot
  sources: string[];
  listingCount: number;
  matchUsed: string;
  widened: boolean;
  marketMin?: number;
  marketMedian?: number;
  marketMean?: number;
  marketMax?: number;

  // Verdict
  recommendation: "source" | "marginal" | "avoid";
  headline?: string;
  reasoning?: string;
  confidence?: string;
  grossMargin?: number;
  marginPct?: number;

  // Who ran it
  createdById?: string;
  createdByName?: string;

  createdAt: Date;
  updatedAt: Date;
}

const SourcingAnalysisSchema: Schema = new Schema(
  {
    make: { type: String, required: true },
    vehicleModel: { type: String, required: true },
    edition: { type: String },
    year: { type: Number },
    mileage: { type: Number },

    landedCostGbp: { type: Number, required: true },
    currency: { type: String, default: "JPY" },
    dutyBasis: { type: String },
    vatBasis: { type: String },

    sources: { type: [String], default: [] },
    listingCount: { type: Number, default: 0 },
    matchUsed: { type: String },
    widened: { type: Boolean, default: false },
    marketMin: { type: Number },
    marketMedian: { type: Number },
    marketMean: { type: Number },
    marketMax: { type: Number },

    recommendation: {
      type: String,
      enum: ["source", "marginal", "avoid"],
      required: true,
    },
    headline: { type: String },
    reasoning: { type: String },
    confidence: { type: String },
    grossMargin: { type: Number },
    marginPct: { type: Number },

    createdById: { type: String },
    createdByName: { type: String },
  },
  { timestamps: true },
);

export default mongoose.models.SourcingAnalysis ||
  mongoose.model<ISourcingAnalysis>("SourcingAnalysis", SourcingAnalysisSchema);
