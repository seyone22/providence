import mongoose, { Schema, Document } from 'mongoose';

// 1. Define the shape of a single document object
export interface IRequestDocument {
    fieldName: string;
    fileType: 'image' | 'pdf';
    fileUrl: string;
    stageAdded: string;
    uploadedAt?: Date;
}

// 2. Update your main interface to include the array of documents
export interface IRequest extends Document {
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
    leadStatus: string;

    // Pipeline Fields
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

    // Internal Admin Notes
    adminNotes?: string;

    // Assignment Fields
    assignedToId?: string;
    assignedToName?: string;

    // The fixed documents array type
    documents: IRequestDocument[];

    createdAt: Date;
    updatedAt: Date;
}

const RequestSchema: Schema = new Schema(
    {
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
        leadStatus: { type: String, default: 'Unqualified'},

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

        adminNotes: { type: String },

        assignedToId: { type: String },
        assignedToName: { type: String },

        // The Mongoose schema definition for the documents
        documents: [{
            fieldName: { type: String, required: true },
            fileType: { type: String, enum: ['image', 'pdf'], required: true },
            fileUrl: { type: String, required: true },
            stageAdded: { type: String, required: true },
            uploadedAt: { type: Date, default: Date.now }
        }]
    },
    { timestamps: true }
);

export default mongoose.models.Request || mongoose.model<IRequest>('Request', RequestSchema);