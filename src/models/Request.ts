import mongoose, { Schema, Document } from 'mongoose';

export interface IRequest extends Document {
    make: string;
    vehicle_model: string;
    condition: string; // 'New' or 'Used'
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
    createdAt: Date;
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
    },
    { timestamps: true }
);

export default mongoose.models.Request || mongoose.model<IRequest>('Request', RequestSchema);