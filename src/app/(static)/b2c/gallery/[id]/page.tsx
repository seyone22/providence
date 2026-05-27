import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { Metadata } from "next"; // <-- Import Metadata
import { getSpecDossierById } from "@/actions/spec-actions";
import GalleryDetailClient from "@/components/GalleryDetailClient";
import { auth } from "@/utils/auth";

export const revalidate = 60;

// 1. Add the generateMetadata function
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const id = (await params).id;
    const response = await getSpecDossierById(id);

    // If no car is found, return some fallback metadata
    if (!response.success || !response.data) {
        return {
            title: "Vehicle Not Found",
            description: "The requested vehicle dossier could not be located."
        };
    }

    const car = response.data;

    // Build your dynamic strings based on your actual database fields
    // Adjust 'make', 'model', 'year', and 'imageUrl' to match your schema
    const pageTitle = `${car.year || ''} ${car.make || ''} ${car.model || ''}`.trim();
    const pageDescription = `View full specifications, gallery, and details for the ${pageTitle}.`;
    const ogImage = car.imageUrl || "/images/default-fallback-image.jpg";

    return {
        title: pageTitle,
        description: pageDescription,
        openGraph: {
            title: pageTitle,
            description: pageDescription,
            url: `https://yourdomain.com/gallery/${id}`,
            siteName: "Your Site Name",
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: pageTitle,
                },
            ],
            locale: "en_US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: pageTitle,
            description: pageDescription,
            images: [ogImage],
        },
    };
}

// 2. Your existing page component remains exactly the same
export default async function GalleryDetailPage({ params }: { params: { id: string } }) {
    const id = (await params).id;
    const response = await getSpecDossierById(id);

    if (!response.success || !response.data) {
        notFound();
    }

    const car = response.data;

    const session = await auth.api.getSession({
        headers: await headers()
    });

    const isLoggedIn = !!session;

    if (!isLoggedIn) {
        if (car.status !== "Active" && car.status !== "Published") {
            redirect("/");
        }
    }

    return <GalleryDetailClient car={car} />;
}