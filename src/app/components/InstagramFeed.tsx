"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Instagram } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SocialPost {
    _id: string;
    shortcode: string;
    url: string;
    order: number;
}

interface InstagramFeedProps {
    page: "home" | "b2c" | "b2b";
    title?: string;
    subtitle?: string;
}

export default function InstagramFeed({
    page,
    title = "Follow the Journey",
    subtitle = "Latest from our Instagram",
}: InstagramFeedProps) {
    const [posts, setPosts] = useState<SocialPost[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`/api/social-posts?page=${page}`);
                const data = await res.json();
                setPosts(data);
            } catch (e) {
                console.error("Failed to load social posts", e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [page]);

    const scroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return;
        const amount = 340;
        scrollRef.current.scrollBy({
            left: direction === "left" ? -amount : amount,
            behavior: "smooth",
        });
    };

    if (loading) return null;
    if (posts.length === 0) return null;

    return (
        <section className="w-full py-20">
            <div className="max-w-7xl mx-auto px-6">

                {/* Section Header */}
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <p className="text-xs font-bold tracking-[0.3em] text-zinc-400 uppercase mb-3">
                            {subtitle}
                        </p>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black">
                            {title}
                        </h2>
                    </div>

                    {/* Nav Arrows (desktop) */}
                    {posts.length > 3 && (
                        <div className="hidden md:flex items-center gap-2">
                            <button
                                onClick={() => scroll("left")}
                                className="h-12 w-12 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all duration-300"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => scroll("right")}
                                className="h-12 w-12 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all duration-300"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Scrollable Carousel */}
                <div
                    ref={scrollRef}
                    className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-6 px-6 snap-x snap-mandatory"
                    style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                    }}
                >
                    <AnimatePresence>
                        {posts.map((post, index) => (
                            <motion.div
                                key={post._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.08 }}
                                className="flex-shrink-0 w-[320px] snap-start"
                            >
                                <div className="rounded-2xl overflow-hidden border border-zinc-100 bg-white shadow-sm hover:shadow-lg transition-shadow duration-500 group">
                                    <div className="w-full h-[420px]">
                                        <iframe
                                            src={`https://www.instagram.com/p/${post.shortcode}/embed`}
                                            className="w-full h-full border-0"
                                            loading="lazy"
                                            allowTransparency
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Instagram CTA */}
                <div className="text-center mt-12">
                    <a
                        href="https://www.instagram.com/providenceauto"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-zinc-200 text-sm font-medium text-zinc-700 hover:bg-black hover:text-white hover:border-black transition-all duration-300"
                    >
                        <Instagram className="h-4 w-4" />
                        Follow @providenceauto
                    </a>
                </div>
            </div>
        </section>
    );
}
