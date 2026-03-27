import mongoose, { Schema, models } from "mongoose";

const SpecDossierSchema = new Schema(
    {
        // Provenance
        countryOfOrigin: { type: String, default: "japan" },
        mileage: { type: String, default: "" },
        serviceHistory: { type: String, default: "full" },
        owners: { type: String, default: "" },

        // Identification
        vin: { type: String, required: true, unique: true }, // VIN should usually be unique
        engineNumber: { type: String, default: "" },

        // Mechanics
        engineConfig: { type: String, default: "" },
        displacement: { type: String, default: "" },
        maxPower: { type: String, default: "" },
        maxTorque: { type: String, default: "" },
        transmission: { type: String, default: "" },
        fuelSystem: { type: String, default: "" },

        // Interior & Tech
        upholstery: { type: String, default: "" },
        infotainment: { type: String, default: "" },
        features: [{ type: String }], // Array of strings for our dynamic tags
        notes: { type: String, default: "" },

        // Compliance
        auctionGrade: { type: String, default: "S" },
        emissions: { type: String, default: "" },
        steering: { type: String, default: "RHD" },

        // Metadata
        status: { type: String, default: "Draft" }, // Draft, Published, Sold
    },
    { timestamps: true }
);

const SpecDossier = models.SpecDossier || mongoose.model("SpecDossier", SpecDossierSchema);

export default SpecDossier;