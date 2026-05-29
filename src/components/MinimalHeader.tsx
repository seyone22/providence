"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function MinimalHeader() {
    const pathname = usePathname();
    const router = useRouter();

    const handleBeginInquiry = () => {
        // Home page: jump to the pathway-selection section (For Direct Buyers / For Dealerships)
        if (pathname === "/") {
            document.getElementById("pathway-section")?.scrollIntoView({ behavior: "smooth" });
            return;
        }

        // Any page with an embedded inquiry form: scroll directly to it
        const formEl = document.getElementById("inquiry-form");
        if (formEl) {
            formEl.scrollIntoView({ behavior: "smooth" });
            return;
        }

        // No form on this page: navigate to /request, tagging the originating page
        // so the form can attribute the lead correctly.
        router.push(`/request?ref=${encodeURIComponent(pathname)}`);
    };

    return (
        <header className="fixed top-0 inset-x-0 z-50">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="mt-3 flex justify-between items-center rounded-2xl border border-black/5 bg-white/70 backdrop-blur-xl px-4 sm:px-5 py-2.5 shadow-[0_8px_30px_rgba(2,6,23,0.06)]">

                <Link href="/" className="flex items-center gap-0">
                    <img src="/logo.png" width={44} alt="Providence Auto Logo" className="block" />

                    <div className="flex flex-col justify-center">
                        <span className="font-sans text-sm font-regular tracking-tight text-[#474646] drop-shadow-md leading-none mb-0.5">
                            Providence
                        </span>
                        <span className="font-sans text-sm font-regular tracking-tight text-[#474646] drop-shadow-md leading-none">
                            Auto
                        </span>
                    </div>
                </Link>

                <button
                    onClick={handleBeginInquiry}
                    className="px-6 py-2 text-sm font-medium text-white
                        bg-sky-400/60 backdrop-blur-xl
                        border border-sky-400/30
                        shadow-[0_8px_32px_rgba(14,165,233,0.25)]
                        hover:bg-sky-500/60 hover:shadow-[0_8px_12px_rgba(14,165,233,0.4)]
                        rounded-full transition-all duration-300 active:scale-95">
                    Begin Inquiry
                </button>
                </div>
            </div>
        </header>
    );
}
