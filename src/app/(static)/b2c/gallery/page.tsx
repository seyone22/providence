import { getAllSpecDossiers } from "@/actions/spec-actions";
import GalleryClient from "@/components/GalleryClient";

export const revalidate = 60; // Optional: Revalidate the page every 60 seconds

export default async function GalleryPage() {
    const response = await getAllSpecDossiers();
    const dossiers = response.success ? response.data : [];

    return <GalleryClient dossiers={dossiers} />;
}