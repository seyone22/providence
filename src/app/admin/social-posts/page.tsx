"use client";

import { useEffect, useState, useCallback } from "react";
import {
    Plus, Trash2, Replace, GripVertical, ArrowUp, ArrowDown,
    Instagram, ExternalLink, Loader2, X, Check, Pencil
} from "lucide-react";

const PAGES = [
    { id: "home", label: "Homepage" },
    { id: "b2c", label: "Direct Buyers (B2C)" },
    { id: "b2b", label: "Dealerships (B2B)" },
];

interface SocialPost {
    _id: string;
    url: string;
    shortcode: string;
    page: string;
    order: number;
    createdAt: string;
}

export default function SocialPostsAdmin() {
    const [posts, setPosts] = useState<SocialPost[]>([]);
    const [activePage, setActivePage] = useState("home");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Add form
    const [newUrl, setNewUrl] = useState("");
    const [addingTo, setAddingTo] = useState<string | null>(null);
    const [addError, setAddError] = useState("");

    // Edit state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editUrl, setEditUrl] = useState("");
    const [editError, setEditError] = useState("");

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/v1/social-posts");
            const data = await res.json();
            setPosts(data);
        } catch (e) {
            console.error("Failed to fetch posts", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const filteredPosts = posts
        .filter((p) => p.page === activePage)
        .sort((a, b) => a.order - b.order);

    // ── ADD ──
    const handleAdd = async () => {
        if (!newUrl.trim()) return;
        setAddError("");
        setSaving(true);

        try {
            const res = await fetch("/api/v1/social-posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: newUrl.trim(), page: addingTo || activePage }),
            });
            const data = await res.json();
            if (!res.ok) {
                setAddError(data.error || "Failed to add post");
            } else {
                setNewUrl("");
                setAddingTo(null);
                await fetchPosts();
            }
        } catch {
            setAddError("Network error");
        } finally {
            setSaving(false);
        }
    };

    // ── DELETE ──
    const handleDelete = async (id: string) => {
        if (!confirm("Remove this post from the carousel?")) return;
        try {
            await fetch(`/api/v1/social-posts/${id}`, { method: "DELETE" });
            await fetchPosts();
        } catch (e) {
            console.error("Delete failed", e);
        }
    };

    // ── REPLACE / EDIT ──
    const startEdit = (post: SocialPost) => {
        setEditingId(post._id);
        setEditUrl(post.url);
        setEditError("");
    };

    const handleEdit = async () => {
        if (!editUrl.trim() || !editingId) return;
        setEditError("");
        setSaving(true);

        try {
            const res = await fetch(`/api/v1/social-posts/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: editUrl.trim() }),
            });
            const data = await res.json();
            if (!res.ok) {
                setEditError(data.error || "Failed to update post");
            } else {
                setEditingId(null);
                setEditUrl("");
                await fetchPosts();
            }
        } catch {
            setEditError("Network error");
        } finally {
            setSaving(false);
        }
    };

    // ── REORDER ──
    const handleMove = async (index: number, direction: "up" | "down") => {
        const newList = [...filteredPosts];
        const swapIndex = direction === "up" ? index - 1 : index + 1;
        if (swapIndex < 0 || swapIndex >= newList.length) return;

        [newList[index], newList[swapIndex]] = [newList[swapIndex], newList[index]];
        const orderedIds = newList.map((p) => p._id);

        // Optimistic update
        const updatedPosts = posts.map((p) => {
            const newIndex = orderedIds.indexOf(p._id);
            if (newIndex !== -1) return { ...p, order: newIndex };
            return p;
        });
        setPosts(updatedPosts);

        try {
            await fetch("/api/v1/social-posts/reorder", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderedIds }),
            });
        } catch (e) {
            console.error("Reorder failed", e);
            await fetchPosts(); // rollback
        }
    };

    // ── MOVE TO DIFFERENT PAGE ──
    const handleMovePage = async (id: string, newPage: string) => {
        try {
            await fetch(`/api/v1/social-posts/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ page: newPage }),
            });
            await fetchPosts();
        } catch (e) {
            console.error("Move failed", e);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50">
            <div className="max-w-6xl mx-auto px-6 py-12">

                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold tracking-tight text-black mb-2">
                        Social Media Publications
                    </h1>
                    <p className="text-zinc-500 text-lg font-light">
                        Manage Instagram posts displayed on your landing pages.
                    </p>
                </div>

                {/* Page Tabs */}
                <div className="flex gap-2 mb-8">
                    {PAGES.map((page) => {
                        const count = posts.filter((p) => p.page === page.id).length;
                        return (
                            <button
                                key={page.id}
                                onClick={() => setActivePage(page.id)}
                                className={`
                                    px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                                    ${activePage === page.id
                                    ? "bg-black text-white shadow-md"
                                    : "bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                                }
                                `}
                            >
                                {page.label}
                                <span className={`ml-2 text-xs ${activePage === page.id ? "text-zinc-400" : "text-zinc-400"}`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Add New Post */}
                <div className="bg-white rounded-2xl border border-zinc-200 p-6 mb-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-9 w-9 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-xl flex items-center justify-center">
                            <Instagram className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-lg font-semibold text-black">Add Instagram Post</h2>
                    </div>

                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={newUrl}
                            onChange={(e) => { setNewUrl(e.target.value); setAddError(""); }}
                            placeholder="Paste Instagram post or reel URL..."
                            className="flex-1 px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-zinc-400 transition-all placeholder:text-zinc-400"
                            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                        />

                        {/* Page selector for add */}
                        <select
                            value={addingTo || activePage}
                            onChange={(e) => setAddingTo(e.target.value)}
                            className="px-4 py-3 rounded-xl border border-zinc-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10 text-zinc-700"
                        >
                            {PAGES.map((p) => (
                                <option key={p.id} value={p.id}>{p.label}</option>
                            ))}
                        </select>

                        <button
                            onClick={handleAdd}
                            disabled={saving || !newUrl.trim()}
                            className="px-6 py-3 bg-black text-white text-sm font-medium rounded-xl hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                        >
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                            Add
                        </button>
                    </div>

                    {addError && (
                        <p className="text-red-500 text-sm mt-3 flex items-center gap-1.5">
                            <X className="h-3.5 w-3.5" /> {addError}
                        </p>
                    )}
                </div>

                {/* Posts Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="text-center py-20">
                        <Instagram className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
                        <p className="text-zinc-400 text-lg font-light">
                            No posts added to {PAGES.find(p => p.id === activePage)?.label} yet.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredPosts.map((post, index) => (
                            <div
                                key={post._id}
                                className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                            >
                                <div className="flex items-stretch">
                                    {/* Reorder Handle */}
                                    <div className="flex flex-col items-center justify-center px-3 bg-zinc-50 border-r border-zinc-100 gap-1">
                                        <button
                                            onClick={() => handleMove(index, "up")}
                                            disabled={index === 0}
                                            className="p-1.5 rounded-lg hover:bg-zinc-200 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ArrowUp className="h-4 w-4 text-zinc-600" />
                                        </button>
                                        <GripVertical className="h-4 w-4 text-zinc-300" />
                                        <button
                                            onClick={() => handleMove(index, "down")}
                                            disabled={index === filteredPosts.length - 1}
                                            className="p-1.5 rounded-lg hover:bg-zinc-200 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ArrowDown className="h-4 w-4 text-zinc-600" />
                                        </button>
                                    </div>

                                    {/* Instagram Embed Preview */}
                                    <div className="w-[320px] h-[420px] flex-shrink-0 bg-zinc-50 border-r border-zinc-100">
                                        <iframe
                                            src={`https://www.instagram.com/p/${post.shortcode}/embed`}
                                            className="w-full h-full border-0"
                                            loading="lazy"
                                            allowTransparency
                                        />
                                    </div>

                                    {/* Post Info & Actions */}
                                    <div className="flex-1 p-6 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
                                                    Position {index + 1}
                                                </span>
                                                <a
                                                    href={post.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-zinc-400 hover:text-black flex items-center gap-1 transition-colors"
                                                >
                                                    View on Instagram <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </div>

                                            {editingId === post._id ? (
                                                <div className="space-y-3">
                                                    <input
                                                        type="text"
                                                        value={editUrl}
                                                        onChange={(e) => { setEditUrl(e.target.value); setEditError(""); }}
                                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                                                        placeholder="New Instagram URL..."
                                                        autoFocus
                                                    />
                                                    {editError && (
                                                        <p className="text-red-500 text-xs flex items-center gap-1">
                                                            <X className="h-3 w-3" /> {editError}
                                                        </p>
                                                    )}
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={handleEdit}
                                                            disabled={saving}
                                                            className="px-4 py-2 bg-black text-white text-sm rounded-xl hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
                                                        >
                                                            <Check className="h-3.5 w-3.5" /> Save
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingId(null)}
                                                            className="px-4 py-2 text-sm text-zinc-500 hover:text-black transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <p className="text-sm text-zinc-600 font-mono break-all mb-1">{post.url}</p>
                                                    <p className="text-xs text-zinc-400">
                                                        Added {new Date(post.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        {editingId !== post._id && (
                                            <div className="flex items-center gap-2 mt-6 pt-4 border-t border-zinc-100">
                                                <button
                                                    onClick={() => startEdit(post)}
                                                    className="flex items-center gap-1.5 px-4 py-2 text-sm text-zinc-600 rounded-xl hover:bg-zinc-100 transition-colors"
                                                >
                                                    <Replace className="h-4 w-4" /> Replace
                                                </button>

                                                {/* Move to page dropdown */}
                                                <select
                                                    value={post.page}
                                                    onChange={(e) => handleMovePage(post._id, e.target.value)}
                                                    className="px-3 py-2 text-sm rounded-xl border border-zinc-200 bg-white text-zinc-600 focus:outline-none"
                                                >
                                                    {PAGES.map((p) => (
                                                        <option key={p.id} value={p.id}>
                                                            {p.id === post.page ? `📍 ${p.label}` : `Move to ${p.label}`}
                                                        </option>
                                                    ))}
                                                </select>

                                                <div className="flex-1" />

                                                <button
                                                    onClick={() => handleDelete(post._id)}
                                                    className="flex items-center gap-1.5 px-4 py-2 text-sm text-red-500 rounded-xl hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" /> Remove
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
