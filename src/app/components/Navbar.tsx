import Link from "next/link";
import { Car } from "lucide-react";
import {Button} from "@/app/components/ui/button";

export default function Navbar() {
    return (
        <nav className="w-full flex items-center justify-between px-8 py-4 bg-[#1a2b4c] text-white border-b border-white/10 relative z-50">
            <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-full text-[#1a2b4c]">
                    <Car size={24} />
                </div>
                <div>
                    <h1 className="font-serif text-xl font-bold tracking-wide">Providence Auto</h1>
                    <p className="text-xs text-gray-300">Global Car Imports</p>
                </div>
            </div>

            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-200">
                <Link href="/" className="hover:text-white transition">Home</Link>
                <Link href="/request" className="hover:text-white transition">Request a Car</Link>
                <Link href="#" className="hover:text-white transition">Import Calculator</Link>
                <Link href="#" className="hover:text-white transition">For Showrooms</Link>
            </div>

            <div className="flex items-center gap-4">
                <Link href="#" className="text-sm font-medium hover:text-white transition hidden md:block">Sales Portal</Link>
                <Button className="bg-white text-[#1a2b4c] hover:bg-gray-100 rounded-full px-6 font-semibold">
                    Get Started
                </Button>
            </div>
        </nav>
    );
}