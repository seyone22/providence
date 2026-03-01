import Link from "next/link";

export default function MinimalHeader() {
    return (
        <header className="fixed top-0 w-full z-50 bg-gray-500/20 backdrop-blur-md border-b border-gray-500/30 shadow-sm transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                <Link href="/" className="flex items-center gap-3">
                    {/* Kept the logo clean and simple */}
                    <img src="/logo.png" width={60} alt="Providence Auto Logo" className="block" />

                    <div className="flex flex-col justify-center">
                        <span className="font-sans text-md font-bold tracking-tight text-black drop-shadow-md leading-none mb-0.5">
                            Providence
                        </span>
                        <span className="font-sans text-md font-bold tracking-tight text-black drop-shadow-md leading-none">
                            Auto
                        </span>
                    </div>
                </Link>

                <Link href="/request">
                    <button className="px-6 py-2 text-sm font-medium text-white
                        bg-sky-500/20 backdrop-blur-xl
                        border border-sky-400/30
                        shadow-[0_8px_32px_rgba(14,165,233,0.25)]
                        hover:bg-sky-500/30 hover:shadow-[0_8px_32px_rgba(14,165,233,0.4)]
                        rounded-full transition-all duration-300 active:scale-95">
                        Begin Inquiry
                    </button>
                </Link>
            </div>
        </header>
    );
}