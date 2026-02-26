import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full border-t border-white/10 bg-black/50 py-8 relative z-50">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">

                {/* Left Side: Logo & Stacked Text */}
                <Link href="/" className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                    <div>
                        <Image
                            src="/logo.png"
                            alt="Providence Auto Logo"
                            width={28}
                            height={28}
                            className="grayscale brightness-200" // Forces the logo to be sleek and white
                        />
                    </div>
                    <div className="leading-tight tracking-[0.15em] font-semibold text-[10px] text-white">
                        PROVIDENCE<br />AUTO
                    </div>
                </Link>

                {/* Right Side: Copyright */}
                <div className="text-zinc-500 text-sm font-light tracking-wide">
                    &copy; {currentYear} Providence Auto. All rights reserved.
                </div>

            </div>
        </footer>
    );
}