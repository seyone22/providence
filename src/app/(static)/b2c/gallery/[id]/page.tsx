import { notFound } from "next/navigation";
import {getSpecDossierById} from "@/actions/spec-actions";
import GalleryDetailClient from "@/components/GalleryDetailClient";

export const revalidate = 60;

export default async function GalleryDetailPage({ params }: { params: { id: string } }) {
    const id = (await params).id
    const response = await getSpecDossierById(id);

    if (!response.success || !response.data) {
        notFound(); // Renders the 404 page if the car doesn't exist
    }

    return <GalleryDetailClient car={response.data} />;
}