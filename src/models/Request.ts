import mongoose, { Schema, Document } from 'mongoose';

export interface IRequest extends Document {
    name: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    make: string;
    vehicle_model: string;
    yearFrom?: number;
    yearTo?: number;
    budget: string;
    currency: string;
    specs?: string;
    status: string; // e.g., 'New', 'In Progress', 'Closed'
    createdAt: Date;
}

const RequestSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        country: { type: String, required: true },
        city: { type: String, required: true },
        make: { type: String, required: true },
        model: { type: String, required: true },
        yearFrom: { type: Number },
        yearTo: { type: Number },
        budget: { type: String, required: true },
        currency: { type: String, required: true, default: 'usd' },
        specs: { type: String },
        status: { type: String, default: 'New' },
    },
    { timestamps: true } // Automatically manages createdAt and updatedAt
);

// Prevent Next.js hot-reloading from recompiling the model multiple times
export default mongoose.models.Request || mongoose.model<IRequest>('Request', RequestSchema);