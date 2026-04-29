// @/models/Request.ts
import mongoose, {Document, Schema} from 'mongoose';

export interface IRequestDocument {
    fieldName: string;
    fileType: 'image' | 'pdf';
    fileUrl: string;
    stageAdded: string;
    uploadedAt?: Date;
}

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
    statusUpdatedAt?: Date; // Added missing type from previous step
    options?: string;

    // Legacy Payment Field
    agreedPrice?: number;

    // NEW Payment Fields
    paymentType?: string;
    totalAmount?: number;
    advancePaymentAmount?: number;
    balancePaymentAmount?: number;
    balancePaymentStage?: string;

    depositAmount?: number;
    transactionId?: string;
    invoiceNumber?: string;
    inspectionNotes?: string;

    // Shipping Fields
    trackingNumber?: string;
    vesselName?: string;
    eta?: Date;
    portName?: string;
    containerNumber?: string; // NEW
    portOfArrival?: string;   // NEW

    customsNotes?: string;
    adminNotes?: string;

    gclid?: string;
    fbclid?: string;
    fbc?: string;
    fbp?: string;

    assignedToId?: mongoose.Types.ObjectId;
    assignedToName?: string;

    documents: IRequestDocument[];
    createdAt: Date;
    updatedAt: Date;
}

const RequestSchema: Schema = new Schema(
    {
        make: {type: String, required: true},
        vehicle_model: {type: String, required: true},
        condition: {type: String, required: true, default: 'New'},
        yearFrom: {type: Number},
        yearTo: {type: Number},
        mileage: {type: String},
        specs: {type: String},
        name: {type: String, required: true},
        email: {type: String, required: true},
        countryCode: {type: String, required: true},
        phone: {type: String, required: true},
        countryOfImport: {type: String, required: true},
        status: {type: String, default: 'New'},
        leadStatus: {type: String, default: 'Action required'}, // Updated default
        statusUpdatedAt: {type: Date},

        options: {type: String},

        // Payment
        agreedPrice: {type: Number},
        paymentType: {type: String, enum: ['Full payment', 'Partial Payments']},
        totalAmount: {type: Number},
        advancePaymentAmount: {type: Number},
        balancePaymentAmount: {type: Number},
        balancePaymentStage: {type: String},

        depositAmount: {type: Number},
        transactionId: {type: String},
        invoiceNumber: {type: String},
        inspectionNotes: {type: String},

        // Shipping
        trackingNumber: {type: String},
        vesselName: {type: String},
        eta: {type: Date},
        portName: {type: String},
        containerNumber: {type: String}, // NEW
        portOfArrival: {type: String},   // NEW

        customsNotes: {type: String},
        adminNotes: {type: String},

        gclid: {type: String},
        fbclid: {type: String},
        fbc: {type: String},
        fbp: {type: String},

        assignedToId: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
        assignedToName: {type: String},

        documents: [{
            fieldName: {type: String, required: true},
            fileType: {type: String, enum: ['image', 'pdf'], required: true},
            fileUrl: {type: String, required: true},
            stageAdded: {type: String, required: true},
            uploadedAt: {type: Date, default: Date.now}
        }]
    },
    {timestamps: true}
);

export default mongoose.models.Request || mongoose.model<IRequest>('Request', RequestSchema);