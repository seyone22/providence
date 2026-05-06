import {notFound, redirect} from "next/navigation";
import {headers} from "next/headers";
import {getSpecDossierById} from "@/actions/spec-actions";
import GalleryDetailClient from "@/components/GalleryDetailClient";
import {auth} from "@/utils/auth";

export const revalidate = 60;

export default async function GalleryDetailPage({params}: { params: { id: string } }) {
    const id = (await params).id;
    const response = await getSpecDossierById(id);

    // 1. Does the record even exist?
    if (!response.success || !response.data) {
        notFound(); // Renders the 404 page
    }

    const car = response.data;

    // 2. Check if the user is currently authenticated on the server
    // (This is the standard Better Auth approach. Adapt if using a different library).
    const session = await auth.api.getSession({
        headers: await headers()
    });

    const isLoggedIn = !!session;

    // 3. Access Control Logic
    // If they are NOT logged in, we strictly enforce the status check.
    // (Checking for both "Active" and "Published" to handle your legacy database entries safely).
    if (!isLoggedIn) {
        if (car.status !== "Active" && car.status !== "Published") {
            redirect("/"); // Boot them to the homepage
        }
    }

    // 4. If they are logged in OR the car is Active/Published, render the page
    return <GalleryDetailClient car={car}/>;
}