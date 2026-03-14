"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Search, Plus, MoreHorizontal, ShieldAlert, KeyRound, Trash2, Loader2
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/app/components/ui/table";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
    Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter
} from "@/app/components/ui/sheet";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/app/components/ui/select";

// Import your server actions here
import { createAdminUser, deleteAdminUser, sendPasswordResetAdmin } from "@/actions/admin-actions";

type User = {
    id: string;
    name: string;
    email: string;
    role: "Admin" | "Staff" | "User";
    status: "Active" | "Inactive";
};

export default function UserManagementClient({ initialUsers }: { initialUsers: User[] }) {
    const router = useRouter();

    // Core state
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [search, setSearch] = useState("");
    const [isPending, setIsPending] = useState(false);

    // Create User Form State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newRole, setNewRole] = useState("Staff");

    // Action Sheet State
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [actionType, setActionType] = useState<"reset" | "delete" | null>(null);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    const closeActionSheet = () => {
        setSelectedUser(null);
        setActionType(null);
        setIsPending(false);
    };

    // --- SERVER ACTION HANDLERS ---

    const handleCreateUser = async () => {
        if (!newName || !newEmail) return alert("Name and Email are required");
        setIsPending(true);

        const res = await createAdminUser({ name: newName, email: newEmail, role: newRole });

        if (res.success) {
            setIsCreateOpen(false);
            setNewName("");
            setNewEmail("");
            setNewRole("Staff");
            router.refresh(); // Tells Next.js to re-run the server component and fetch fresh data
        } else {
            alert(res.message);
        }
        setIsPending(false);
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        setIsPending(true);

        const res = await deleteAdminUser(selectedUser.id);

        if (res.success) {
            setUsers(prev => prev.filter(u => u.id !== selectedUser.id)); // Optimistic UI update
            closeActionSheet();
            router.refresh();
        } else {
            alert(res.message);
        }
        setIsPending(false);
    };

    const handleResetPassword = async () => {
        if (!selectedUser) return;
        setIsPending(true);

        const res = await sendPasswordResetAdmin(selectedUser.email);

        if (res.success) {
            alert(`Reset link sent to ${selectedUser.email}`);
            closeActionSheet();
        } else {
            alert(res.message);
        }
        setIsPending(false);
    };

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <Input
                        placeholder="Search users by name or email..."
                        className="pl-10 rounded-xl border-zinc-200/60 bg-white"
                        value={search}
                        onChange={(e: any) => setSearch(e.target.value)}
                    />
                </div>
                <Button onClick={() => setIsCreateOpen(true)} className="rounded-xl gap-2">
                    <Plus size={18} />
                    Add New User
                </Button>
            </div>

            {/* Data Table */}
            <div className="bg-white border border-zinc-200/60 shadow-sm rounded-[2rem] overflow-hidden">
                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow className="border-zinc-100 hover:bg-transparent">
                            <TableHead className="px-6 py-4 font-semibold text-zinc-900">Name</TableHead>
                            <TableHead className="py-4 font-semibold text-zinc-900">Role</TableHead>
                            <TableHead className="py-4 font-semibold text-zinc-900">Status</TableHead>
                            <TableHead className="px-6 py-4 text-right font-semibold text-zinc-900">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-32 text-center text-zinc-500">
                                    No users found matching "{search}"
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id} className="border-zinc-100">
                                    <TableCell className="px-6 py-4">
                                        <div className="font-medium text-zinc-900">{user.name}</div>
                                        <div className="text-sm text-zinc-500">{user.email}</div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <Badge variant={user.role === "Admin" ? "default" : "secondary"} className="rounded-lg">
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`size-2 rounded-full ${user.status === "Active" ? "bg-emerald-500" : "bg-zinc-300"}`} />
                                            <span className="text-sm text-zinc-600">{user.status}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="size-8 p-0 rounded-lg">
                                                    <MoreHorizontal size={18} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl w-48">
                                                <DropdownMenuLabel>Manage User</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => { setSelectedUser(user); setActionType("reset"); }} className="gap-2 cursor-pointer">
                                                    <KeyRound size={16} className="text-zinc-500" />
                                                    Reset Password
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => { setSelectedUser(user); setActionType("delete"); }} className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                                                    <Trash2 size={16} />
                                                    Delete Account
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* --- SIDEBARS (SHEETS) --- */}

            {/* 1. Create User Sheet */}
            <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <SheetContent className="sm:max-w-md border-l border-zinc-200">
                    <SheetHeader>
                        <SheetTitle>Add New User</SheetTitle>
                        <SheetDescription>Create a new staff or admin account. They will receive an email to set their password.</SheetDescription>
                    </SheetHeader>
                    <div className="py-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <Input placeholder="John Doe" className="rounded-xl" value={newName} onChange={(e) => setNewName(e.target.value)} disabled={isPending} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <Input type="email" placeholder="john@providenceauto.com" className="rounded-xl" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} disabled={isPending} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">System Role</label>
                            <Select value={newRole} onValueChange={setNewRole} disabled={isPending}>
                                <SelectTrigger className="rounded-xl">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Admin">Admin</SelectItem>
                                    <SelectItem value="Staff">Staff</SelectItem>
                                    <SelectItem value="User">User</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <SheetFooter>
                        <Button className="w-full rounded-xl" onClick={handleCreateUser} disabled={isPending}>
                            {isPending ? <Loader2 className="animate-spin" size={18} /> : "Create Account"}
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* 2. Reset Password & Delete User Sheet (Dynamic) */}
            <Sheet open={!!selectedUser} onOpenChange={(open: any) => !open && closeActionSheet()}>
                <SheetContent className="sm:max-w-md border-l border-zinc-200">
                    <SheetHeader>
                        <SheetTitle>
                            {actionType === "reset" ? "Reset Password" : "Delete Account"}
                        </SheetTitle>
                        <SheetDescription>
                            {actionType === "reset"
                                ? `Generate a secure password reset link for ${selectedUser?.name}.`
                                : `Are you sure you want to permanently delete ${selectedUser?.name}? This action cannot be undone.`}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="py-6">
                        {actionType === "reset" && (
                            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-start gap-3">
                                <ShieldAlert className="text-amber-500 shrink-0 mt-0.5" size={18} />
                                <p className="text-sm text-zinc-600">
                                    This will invalidate their current session immediately. A reset link will be sent to <strong>{selectedUser?.email}</strong>.
                                </p>
                            </div>
                        )}

                        {actionType === "delete" && (
                            <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-red-600 flex items-start gap-3">
                                <Trash2 className="shrink-0 mt-0.5" size={18} />
                                <p className="text-sm">
                                    All data associated with <strong>{selectedUser?.email}</strong> will be wiped. Proceed with extreme caution.
                                </p>
                            </div>
                        )}
                    </div>

                    <SheetFooter>
                        <Button
                            variant={actionType === "delete" ? "destructive" : "default"}
                            className="w-full rounded-xl"
                            onClick={actionType === "delete" ? handleDeleteUser : handleResetPassword}
                            disabled={isPending}
                        >
                            {isPending ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : actionType === "delete" ? (
                                "Confirm Deletion"
                            ) : (
                                "Send Reset Link"
                            )}
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

        </div>
    );
}