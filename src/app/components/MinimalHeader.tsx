import { Car } from "lucide-react";
import Link from "next/link";

export default function MinimalHeader() {
    return (
        <header className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
            <Link href="/" className="flex items-center gap-3">
                <div className="">
                    <img src={'logo.png'} width={'40px'} />
                </div>
                <div>
                    <h1 className="font-sans text-lg font-bold tracking-tight text-white">Providence Auto</h1>
                </div>
            </Link>
            {/* Optional: A subtle, non-navigational contact button or just leave empty */}
        </header>
    );
}