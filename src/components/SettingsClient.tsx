// app/settings/SettingsClient.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, Save, ShieldCheck, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfileSettings, updatePasswordServer } from "@/actions/settings-actions";
import {uploadProfileImage} from "@/lib/file-actions";

type UserProps = {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    whatsappNumber?: string | null | undefined;
};

export default function SettingsClient({ user }: { user: UserProps }) {
    const router = useRouter();

    // Profile State
    const [name, setName] = useState(user.name || "");
    const [whatsapp, setWhatsapp] = useState(user.whatsappNumber || "");
    const [imagePreview, setImagePreview] = useState(user.image || "");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isProfilePending, setIsProfilePending] = useState(false);

    // Password State
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPasswordPending, setIsPasswordPending] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Profile Handlers ---
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file)); // Show local preview instantly
        }
    };

    const handleSaveProfile = async () => {
        setIsProfilePending(true);
        let finalImageUrl = user.image;

        // 1. Upload new image if selected
        if (selectedFile) {
            const formData = new FormData();
            formData.append("file", selectedFile);
            const uploadRes = await uploadProfileImage(formData);

            if (uploadRes.success && uploadRes.url) {
                finalImageUrl = uploadRes.url;
            } else {
                alert("Failed to upload image.");
                setIsProfilePending(false);
                return;
            }
        }

        // 2. Update database
        const res = await updateProfileSettings({
            name,
            whatsappNumber: whatsapp,
            image: finalImageUrl || undefined
        });

        if (res.success) {
            alert("Profile updated successfully!");
            router.refresh();
        } else {
            alert(res.message);
        }

        setIsProfilePending(false);
    };

    // --- Password Handlers ---
    const handleUpdatePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            return alert("Please fill in all password fields.");
        }
        if (newPassword !== confirmPassword) {
            return alert("New passwords do not match.");
        }

        setIsPasswordPending(true);
        const res = await updatePasswordServer(currentPassword, newPassword);

        if (res.success) {
            alert("Password updated successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } else {
            alert(res.message);
        }
        setIsPasswordPending(false);
    };

    return (
        <div className="space-y-8">
            {/* --- PROFILE SECTION --- */}
            <div className="bg-white border border-zinc-200/60 shadow-sm rounded-[2rem] p-6 lg:p-8">
                <div className="flex items-center gap-3 border-b border-zinc-100 pb-4 mb-6">
                    <div className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-100">
                        <UserIcon className="text-zinc-600" size={20} />
                    </div>
                    <h2 className="text-lg font-semibold text-zinc-900">Public Profile</h2>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center space-y-4 shrink-0">
                        <div className="relative group">
                            <div className="size-32 rounded-full border-4 border-white shadow-md bg-zinc-100 overflow-hidden flex items-center justify-center">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <UserIcon size={48} className="text-zinc-300" />
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 p-2.5 bg-zinc-900 text-white rounded-full hover:bg-zinc-800 transition-colors shadow-sm"
                            >
                                <Camera size={16} />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                        <p className="text-xs text-zinc-500">JPG, GIF or PNG. Max 2MB.</p>
                    </div>

                    {/* Form Fields */}
                    <div className="flex-1 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700">Full Name</label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="rounded-xl h-11 border-zinc-200/60"
                                    placeholder="Jane Doe"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700">Email Address <span className="text-zinc-400 font-normal">(Read-only)</span></label>
                                <Input
                                    value={user.email}
                                    disabled
                                    className="rounded-xl h-11 bg-zinc-50 border-zinc-200/60 text-zinc-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700">WhatsApp Number</label>
                                <Input
                                    value={whatsapp}
                                    onChange={(e) => setWhatsapp(e.target.value)}
                                    className="rounded-xl h-11 border-zinc-200/60"
                                    placeholder="+44 7700 900077"
                                />
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                            <Button
                                onClick={handleSaveProfile}
                                disabled={isProfilePending}
                                className="rounded-xl h-11 px-6 gap-2"
                            >
                                {isProfilePending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- SECURITY SECTION --- */}
            <div className="bg-white border border-zinc-200/60 shadow-sm rounded-[2rem] p-6 lg:p-8">
                <div className="flex items-center gap-3 border-b border-zinc-100 pb-4 mb-6">
                    <div className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-100">
                        <ShieldCheck className="text-zinc-600" size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-zinc-900">Security & Password</h2>
                        <p className="text-sm text-zinc-500">Ensure your account is using a long, random password to stay secure.</p>
                    </div>
                </div>

                <div className="max-w-xl space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">Current Password</label>
                        <Input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="rounded-xl h-11 border-zinc-200/60"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">New Password</label>
                        <Input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="rounded-xl h-11 border-zinc-200/60"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">Confirm New Password</label>
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="rounded-xl h-11 border-zinc-200/60"
                        />
                    </div>

                    <div className="pt-2">
                        <Button
                            onClick={handleUpdatePassword}
                            disabled={isPasswordPending}
                            variant="secondary"
                            className="rounded-xl h-11 px-6 border border-zinc-200/60 shadow-sm hover:bg-zinc-100"
                        >
                            {isPasswordPending ? <Loader2 className="animate-spin" size={18} /> : "Update Password"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}