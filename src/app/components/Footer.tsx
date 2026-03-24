import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full border-t border-white/5 bg-black pt-16 pb-8 relative z-50">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-16">

                {/* Left Column: Logo & Brand */}
                <div className="flex flex-col justify-start">
                    <Link href="/" className="inline-flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
                        <div>
                            <Image
                                src="/logo.png"
                                alt="Providence Auto Logo"
                                width={32}
                                height={32}
                                className="grayscale brightness-200" // Forces the logo to be sleek and white
                            />
                        </div>
                        <div className="leading-tight tracking-[0.15em] font-semibold text-[10px] text-white">
                            PROVIDENCE<br />AUTO
                        </div>
                    </Link>
                </div>

                {/* Middle Column: Contact Details */}
                <div className="flex flex-col gap-4">
                    <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500">
                        Contact
                    </h4>
                    <address className="flex flex-col gap-2 not-italic text-sm font-light text-zinc-400">
                        <p>
                            468 Church Lane, Kingsbury<br />
                            London, NW9 8UA
                        </p>
                        <a href="tel:+442080043000" className="hover:text-white transition-colors mt-2">
                            +44 208 004 3000
                        </a>
                        <a href="mailto:info@providenceauto.uk.com" className="hover:text-white transition-colors">
                            info@providenceauto.uk.com
                        </a>
                    </address>
                </div>

                {/* Right Column: Connect */}
                <div className="flex flex-col gap-4">
                    <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500">
                        Connect
                    </h4>

                    <div className="flex flex-col gap-3">
                        {/* WhatsApp */}
                        <a
                            href="https://wa.me/442080043000"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-light text-zinc-400 hover:text-emerald-400 transition-colors group"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400 transition-colors"
                            >
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                            </svg>
                            WhatsApp
                        </a>

                        {/* Instagram 👉 Add your link in href */}
                        <a
                            href="https://www.instagram.com/providenceautouk/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-light text-zinc-400 hover:text-sky-400 transition-colors group"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-5 h-5 text-zinc-500 group-hover:text-sky-400 transition-colors"
                            >
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                            Instagram
                        </a>
                    </div>
                </div>

            </div>

            {/* Bottom Bar: Copyright & Credits */}
            <div className="max-w-7xl mx-auto px-6 border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light text-zinc-500 tracking-wide">

                {/* Copyright */}
                <div>
                    &copy; {currentYear} Providence Auto. All rights reserved.
                </div>

                {/* Built By Credit */}
                <div>
                    Built by{" "}
                    <a
                        href="https://github.com/seyone22"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-300 hover:text-white transition-colors underline decoration-white/20 hover:decoration-white/60 underline-offset-4"
                    >
                        Seyone Gunasingham
                    </a>
                </div>

            </div>
        </footer>
    );
}