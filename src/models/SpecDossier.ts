import mongoose, { Schema, models } from "mongoose";

const SpecDossierSchema = new Schema(
    {
            // Vehicle Overview (The Basics)
            make: { type: String, required: true },
            model: { type: String, required: true },
            year: { type: String, default: "" },
            trim: { type: String, default: "" },
            color: { type: String, default: "" },
            price: { type: String, default: "" },

            // Provenance
            countryOfOrigin: { type: String, default: "japan" },
            mileage: { type: String, default: "" },
            serviceHistory: { type: String, default: "full" },
            owners: { type: String, default: "" },

            // Identification
            vin: { type: String, required: true, unique: true },
            engineNumber: { type: String, default: "" },

            // Mechanics
            engineConfig: { type: String, default: "" },
            displacement: { type: String, default: "" },
            maxPower: { type: String, default: "" },
            maxTorque: { type: String, default: "" },
            transmission: { type: String, default: "" },
            fuelSystem: { type: String, default: "Petrol" },

            // Interior & Tech
            upholstery: { type: String, default: "" },
            infotainment: { type: String, default: "" },
            features: [{ type: String }],
            images: [{ type: String }], // Array to store Cloudflare R2 URLs
            notes: { type: String, default: "" },

            // Compliance
            auctionGrade: { type: String, default: "S" },
            emissions: { type: String, default: "" },
            steering: { type: String, default: "RHD" },

            // Metadata
            status: { type: String, default: "Draft" },
    },
    { timestamps: true }
);

const SpecDossier = models.SpecDossier || mongoose.model("SpecDossier", SpecDossierSchema);

export default SpecDossier;