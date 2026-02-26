import Link from "next/link";

export default function MinimalHeader() {
    return (
        <header className="fixed top-0 w-full px-6 py-4 flex justify-between items-center z-50 bg-gray-500/20 backdrop-blur-md border-b border-gray-500/30 shadow-sm transition-colors duration-300">
            <Link href="/" className="flex items-center gap-3">
                <div>
                    <img src="/logo.png" width={40} alt="Providence Auto Logo" />
                </div>
                <div>
                    <h1 className="font-sans text-lg font-bold tracking-tight text-white drop-shadow-md">
                        Providence Auto
                    </h1>
                </div>
            </Link>

            {/* FIXED: Wrapped the button in a Link component to navigate to your request page */}
            <Link href="/request">
                <button className="px-6 py-2 text-sm font-medium text-white bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full border border-white/10 transition-all duration-200">
                    Begin Inquiry
                </button>
            </Link>
        </header>
    );
}