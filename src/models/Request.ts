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
    importTimeline?: string;

    dossierIds: (mongoose.Types.ObjectId | string)[]; // <-- CHANGED TO ARRAY

    // Contact preferences (captured after delivery details)
    contactMethods?: string[];         // one or more of: WhatsApp | Call | WhatsApp Call | Email
    contactDays?: string[];            // e.g. ["Today"], ["Weekdays"], ["Monday","Wednesday"]
    contactTimeWindow?: string;        // Morning (9–12) | Afternoon (12–5) | Evening (5–8)
    contactTimezone?: string;          // IANA zone the customer selected (e.g. "Europe/Dublin")
    contactTimezoneLabel?: string;     // Human label shown to the customer (e.g. "Ireland (GMT)")
    preferredContactAt?: Date;         // Concrete UTC instant computed from day + window + tz

    // True while the lead has been created (delivery details captured) but the
    // customer hasn't submitted contact preferences yet. Drafts are hidden from
    // the admin pipeline and purged if abandoned.
    isDraft?: boolean;

    status: string;
    leadStatus: string;
    statusUpdatedAt?: Date; // Added missing type from previous step
    options?: string;

    // Legacy Payment Field
    agreedPrice?: number;

    // Add this to your IRequest interface:
    statusHistory?: {
        action: string;
        performedBy: string;
        date: Date;
        comment?: string; // ADD THIS PROPERTY
    }[];

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

    source?: string;

    // Follow-up timer
    followUpAt?: Date;
    followUpSetAt?: Date;

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
        importTimeline: {type: String},

        dossierIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SpecDossier' }], // <-- CHANGED TO ARRAY REFERENCE

        // Contact preferences
        contactMethods: {type: [String], default: undefined},
        contactDays: {type: [String], default: undefined},
        contactTimeWindow: {type: String},
        contactTimezone: {type: String},
        contactTimezoneLabel: {type: String},
        preferredContactAt: {type: Date},
        isDraft: {type: Boolean, default: false},

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

        source: {type: String},

        // Follow-up timer
        followUpAt: {type: Date},
        followUpSetAt: {type: Date},

        gclid: {type: String},
        fbclid: {type: String},
        fbc: {type: String},
        fbp: {type: String},

        assignedToId: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
        assignedToName: {type: String},

        // Add this inside your new Schema({ ... }) definition:
        statusHistory: [{
            action: {type: String, required: true},
            performedBy: {type: String, required: true},
            date: {type: Date, default: Date.now},
            comment: {type: String, default: ""} // ADD THIS CONFIGURATION
        }],

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