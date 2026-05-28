import mongoose, { Schema, models, model } from "mongoose";

export interface ISocialPost {
    _id: string;
    url: string;
    shortcode: string;
    page: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const SocialPostSchema = new Schema(
    {
        url: { type: String, required: true },
        shortcode: { type: String, required: true },
        page: {
            type: String,
            required: true,
            enum: ["home", "b2c", "b2b"],
            index: true,
        },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Compound index for efficient queries: get all posts for a page, sorted by order
SocialPostSchema.index({ page: 1, order: 1 });

export function extractShortcode(url: string): string | null {
    // Matches instagram.com/p/XXXXX/ and /reel/XXXXX/
    const match = url.match(/instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
    return match ? match[1] : null;
}

const SocialPost = models.SocialPost || model("SocialPost", SocialPostSchema);
export default SocialPost;
