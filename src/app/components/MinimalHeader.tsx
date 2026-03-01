import Link from "next/link";

export default function MinimalHeader() {
    return (
        <header className="fixed top-0 w-full z-50 bg-gray-500/20 backdrop-blur-md border-b border-gray-500/30 shadow-sm transition-colors duration-300">
            {/* Added a container with max-width and mx-auto to pull content away from the screen edges */}
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                <Link href="/" className="flex items-center gap-3">
                    <div>
                        <img src="/logo.png" width={40} alt="Providence Auto Logo" />
                    </div>
                    {/* leading-tight reduces the vertical space between the two lines */}
                    <div className="flex flex-col items-start">
                        <p className="font-sans text-lg font-bold tracking-tight text-black drop-shadow-md">
                            Providence
                        </p>
                        {/* -mt-1 or -mt-2 will physically pull the text upward */}
                        <p className="font-sans text-lg font-bold tracking-tight text-black drop-shadow-md -mt-2">
                            Auto
                        </p>
                    </div>
                </Link>

                <Link href="/request">
                    <button className="px-6 py-2 text-sm font-medium text-white bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full border border-white/10 transition-all duration-200">
                        Begin Inquiry
                    </button>
                </Link>
            </div>
        </header>
    );
}