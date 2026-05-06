import mongoose, {models, Schema} from "mongoose";

const PriceEntrySchema = new Schema({
        country: { type: String, required: true },
        currency: { type: String, default: "USD" },
        amount: { type: Number, required: true },
        type: { type: String, enum: ["CIF", "FOB", "Landed", "Ex-Works"], default: "CIF" },
        isPublic: { type: Boolean, default: true }
});

const SpecDossierSchema = new Schema(
    {
        // Vehicle Overview (Template details)
        make: {type: String, required: true},
        model: {type: String, required: true},
        year: {type: String, default: ""},
        trim: {type: String, default: ""},

        // Provenance (Spec market origin)
        countryOfOrigin: {type: String, default: "Japan"},

        // Mechanics
        engineConfig: {type: String, default: ""},
        displacement: {type: String, default: ""},
        maxPower: {type: String, default: ""},
        maxTorque: {type: String, default: ""},
        transmission: {type: String, default: ""},
        fuelSystem: {type: String, default: "Petrol"},
        steering: {type: String, default: "RHD"},
        emissions: {type: String, default: ""},

        // New Pricing Matrix field
        pricing: [PriceEntrySchema],

        // Interior & Tech
        upholstery: {type: String, default: ""},
        infotainment: {type: String, default: ""},

        // Tagging & Arrays
        features: [{type: String}], // e.g., "Panoramic Roof", "Heated Seats"
        searchTags: [{type: String}], // e.g., "SUV", "Off-Road", "Family", "JDM"
        images: [{type: String}], // Array to store Cloudflare R2 URLs

        // Metadata
        notes: {type: String, default: ""},
        status: {type: String, default: "Draft"},
    },
    {timestamps: true}
);

export const SpecDossier = models.SpecDossier || mongoose.model("SpecDossier", SpecDossierSchema);