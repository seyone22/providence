// actions/file-actions.ts
"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import sharp from "sharp";
import { BUCKET_NAME, PUBLIC_BUCKET_URL, r2 } from "@/lib/r2";

type FileMetadata = {
  name: string;
  type: string;
  size: number;
};

// Phone photos carry an EXIF orientation flag. Browsers auto-rotate <img> from
// it, but link-preview crawlers (iMessage, Slack, WhatsApp) ignore EXIF and
// render the raw bytes — so portrait shots show up sideways in shared links.
// sharp.rotate() (no args) bakes the EXIF orientation into the pixels and drops
// the metadata, leaving an upright image everywhere. GIFs are skipped to keep
// animation intact; any failure falls back to the original bytes.
async function normalizeImageOrientation(
  buffer: Buffer,
  contentType: string,
): Promise<Buffer> {
  if (!contentType?.startsWith("image/") || contentType === "image/gif") {
    return buffer;
  }
  try {
    return await sharp(buffer).rotate().toBuffer();
  } catch (error) {
    console.error(
      "Image orientation normalization failed, using original:",
      error,
    );
    return buffer;
  }
}

export async function getPresignedUrls(files: FileMetadata[], folder: string) {
  try {
    const uploadData = await Promise.all(
      files.map(async (file) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const extension = file.name.split(".").pop() || "bin";
        const fileName = `${folder}/${uniqueSuffix}.${extension}`;

        const command = new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: fileName,
          ContentType: file.type || "application/octet-stream",
        });

        // URL valid for 5 minutes
        const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 300 });

        return {
          uploadUrl,
          fileUrl: `${PUBLIC_BUCKET_URL}/${fileName}`,
        };
      }),
    );

    return { success: true, uploadData };
  } catch (error) {
    console.error("Presigned URL Error:", error);
    return { success: false, message: "Failed to generate upload URLs." };
  }
}

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
      const extension = file.name.split(".").pop();
      const fileName = `pipeline-docs/${uniqueSuffix}.${extension}`;

      // Upload to Cloudflare R2
      await r2.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: fileName,
          Body: buffer,
          ContentType: file.type,
        }),
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

      // Bake EXIF orientation into the pixels so shared-link previews
      // (which ignore EXIF) don't show portrait photos sideways.
      const body = await normalizeImageOrientation(buffer, file.type);

      // Create a unique filename
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const extension = file.name.split(".").pop();
      const fileName = `dossiers/${uniqueSuffix}.${extension}`;

      // Upload to Cloudflare R2
      await r2.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: fileName,
          Body: body,
          ContentType: file.type,
        }),
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
    const extension = file.name.split(".").pop();
    const fileName = `profiles/${uniqueSuffix}.${extension}`;

    // Upload to Cloudflare R2
    await r2.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      }),
    );

    return { success: true, url: `${PUBLIC_BUCKET_URL}/${fileName}` };
  } catch (error) {
    console.error("R2 Upload Error:", error);
    return { success: false, message: "Failed to upload profile picture." };
  }
}
