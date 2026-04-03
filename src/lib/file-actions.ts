// actions/file-actions.ts
"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2, BUCKET_NAME, PUBLIC_BUCKET_URL } from "@/lib/r2";

export async function uploadToR2(formData: FormData) {
    try {
        const uploadedFiles = [];
        const files = formData.getAll("files") as File[];
        const fieldNames = formData.getAll("fieldNames") as string[];
        const fileTypes = formData.getAll("fileTypes") as string[];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file) continue;

            // Convert Web File to Node Buffer
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Create a unique filename to prevent overwriting
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            const extension = file.name.split('.').pop();
            const fileName = `pipeline-docs/${uniqueSuffix}.${extension}`;

            // Upload to Cloudflare R2
            await r2.send(
                new PutObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: fileName,
                    Body: buffer,
                    ContentType: file.type,
                })
            );

            // Store the result
            uploadedFiles.push({
                fieldName: fieldNames[i],
                fileType: fileTypes[i],
                fileUrl: `${PUBLIC_BUCKET_URL}/${fileName}`,
            });
        }

        return { success: true, uploadedFiles };
    } catch (error) {
        console.error("R2 Upload Error:", error);
        return { success: false, message: "Failed to upload files." };
    }
}

export async function uploadDossierImages(formData: FormData) {
    try {
        const uploadedUrls: string[] = [];
        const files = formData.getAll("files") as File[];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file) continue;

            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Create a unique filename
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            const extension = file.name.split('.').pop();
            const fileName = `dossiers/${uniqueSuffix}.${extension}`;

            // Upload to Cloudflare R2
            await r2.send(
                new PutObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: fileName,
                    Body: buffer,
                    ContentType: file.type,
                })
            );

            uploadedUrls.push(`${PUBLIC_BUCKET_URL}/${fileName}`);
        }

        return { success: true, uploadedUrls };
    } catch (error) {
        console.error("R2 Upload Error:", error);
        return { success: false, message: "Failed to upload files." };
    }
}

export async function uploadProfileImage(formData: FormData) {
    try {
        const file = formData.get("file") as File;
        if (!file) return { success: false, message: "No file provided" };

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Create a unique filename
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const extension = file.name.split('.').pop();
        const fileName = `profiles/${uniqueSuffix}.${extension}`;

        // Upload to Cloudflare R2
        await r2.send(
            new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: fileName,
                Body: buffer,
                ContentType: file.type,
            })
        );

        return { success: true, url: `${PUBLIC_BUCKET_URL}/${fileName}` };
    } catch (error) {
        console.error("R2 Upload Error:", error);
        return { success: false, message: "Failed to upload profile picture." };
    }
}