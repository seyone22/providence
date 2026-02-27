import mongoose, { Schema, Document } from 'mongoose';

export interface IRequest extends Document {
    // Original Fields
    make: string;
    vehicle_model: string;
    condition: string;
    yearFrom?: number;
    yearTo?: number;
    mileage?: string;
    specs?: string;
    name: string;
    email: string;
    countryCode: string;
    phone: string;
    countryOfImport: string;
    status: string;

    // === NEW PIPELINE FIELDS ===
    options?: string;
    agreedPrice?: number;
    depositAmount?: number;
    transactionId?: string;
    invoiceNumber?: string;
    inspectionNotes?: string;
    trackingNumber?: string;
    vesselName?: string;
    eta?: Date;
    portName?: string;
    customsNotes?: string;

    createdAt: Date;
    updatedAt: Date;
}

const RequestSchema: Schema = new Schema(
    {
        // Original Fields
        make: { type: String, required: true },
        vehicle_model: { type: String, required: true },
        condition: { type: String, required: true, default: 'New' },
        yearFrom: { type: Number },
        yearTo: { type: Number },
        mileage: { type: String },
        specs: { type: String },
        name: { type: String, required: true },
        email: { type: String, required: true },
        countryCode: { type: String, required: true },
        phone: { type: String, required: true },
        countryOfImport: { type: String, required: true },
        status: { type: String, default: 'New' },

        // === NEW PIPELINE FIELDS ===
        options: { type: String },
        agreedPrice: { type: Number },
        depositAmount: { type: Number },
        transactionId: { type: String },
        invoiceNumber: { type: String },
        inspectionNotes: { type: String },
        trackingNumber: { type: String },
        vesselName: { type: String },
        eta: { type: Date },
        portName: { type: String },
        customsNotes: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.Request || mongoose.model<IRequest>('Request', RequestSchema);