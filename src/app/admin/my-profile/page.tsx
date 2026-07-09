"use client";

import {
  AlertCircle,
  BarChart3,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Eye,
  ImageOff,
  Loader2,
  Plus,
  Save,
  Trash2,
  TriangleAlert,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getMyProfile,
  getMyStats,
  listGalleryForPicker,
  updateMyProfile,
} from "@/actions/sales-profile-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadProfileImage } from "@/lib/file-actions";
import { formatVehicleTitle } from "@/lib/vehicle";

const EXPERTISE_ICONS = [
  "FileSearch",
  "Handshake",
  "Landmark",
  "Ship",
  "ShieldCheck",
  "Globe",
  "Award",
  "Star",
  "CheckCircle2",
];

const SITE = "https://www.providenceauto.co.uk";

type Profile = any;

export default function MyProfileAdminPage() {
  const [tab, setTab] = useState<"profile" | "stats">("profile");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => {
    (async () => {
      const res = await getMyProfile();
      if (res.success) setProfile(res.data);
      else
        setToast({ ok: false, msg: res.message || "Failed to load profile" });
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const set = (patch: Partial<Profile>) =>
    setProfile((p: Profile) => ({ ...p, ...patch }));

  const save = async () => {
    if (!profile) return;
    setSaving(true);
    const res = await updateMyProfile({
      slug: profile.slug,
      isPublished: profile.isPublished,
      displayName: profile.displayName,
      headline: profile.headline,
      tagline: profile.tagline,
      bio: profile.bio,
      photoUrl: profile.photoUrl,
      coverImageUrl: profile.coverImageUrl,
      yearsExperience: Number(profile.yearsExperience) || 0,
      languages: profile.languages || [],
      expertise: profile.expertise || [],
      sourcingCountries: profile.sourcingCountries || [],
      trackRecord: profile.trackRecord || [],
      testimonials: profile.testimonials || [],
      featuredDossierIds: (profile.featuredDossierIds || []).map((id: any) =>
        String(id),
      ),
      whatsappNumber: profile.whatsappNumber,
    });
    setSaving(false);
    if (res.success) {
      if (res.data) setProfile(res.data);
      setToast({ ok: true, msg: res.message || "Saved" });
    } else {
      setToast({ ok: false, msg: res.message || "Failed to save" });
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-zinc-400" size={40} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-10 max-w-xl mx-auto text-center">
        <AlertCircle className="mx-auto text-zinc-300 mb-4" size={40} />
        <h1 className="text-xl font-bold">No profile available</h1>
        <p className="text-zinc-500 mt-2">
          {toast?.msg || "Only sales members can manage a profile page."}
        </p>
      </div>
    );
  }

  const publicUrl = `${SITE}/team/${profile.slug}`;

  return (
    <div className="p-6 lg:p-10 max-w-[1200px] mx-auto min-h-screen">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-black/5 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <UserRound className="text-zinc-400" size={28} /> My Profile Page
          </h1>
          <p className="text-zinc-500 mt-1">
            Your personal landing page — market yourself and capture leads
            assigned straight to you.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={profile.isPublished ? "default" : "secondary"}>
            {profile.isPublished ? "Published" : "Draft"}
          </Badge>
          <a href={publicUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Eye size={14} /> View my page
            </Button>
          </a>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex bg-zinc-100 p-1 rounded-xl border border-black/5 w-fit mb-8">
        {[
          { id: "profile", label: "My Profile", icon: UserRound },
          { id: "stats", label: "My Stats", icon: BarChart3 },
        ].map((t) => (
          <button
            type="button"
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`px-5 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${
              tab === t.id
                ? "bg-white text-black shadow-sm"
                : "text-zinc-400 hover:text-zinc-900"
            }`}
          >
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {tab === "profile" ? (
        <ProfileEditor
          profile={profile}
          set={set}
          save={save}
          saving={saving}
          publicUrl={publicUrl}
          onToast={setToast}
        />
      ) : (
        <StatsPanel />
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-lg ${
            toast.ok ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {toast.ok ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── PROFILE EDITOR ─────────────────────────── */

function ProfileEditor({
  profile,
  set,
  save,
  saving,
  publicUrl,
  onToast,
}: any) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePhoto = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadProfileImage(fd);
    setUploading(false);
    if (res.success && res.url) set({ photoUrl: res.url });
    else onToast({ ok: false, msg: res.message || "Upload failed" });
  };

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
      <div className="space-y-8">
        {/* Identity */}
        <Card title="Identity & hero">
          <Field label="Display name">
            <Input
              value={profile.displayName || ""}
              onChange={(e) => set({ displayName: e.target.value })}
              placeholder="Abdallah"
            />
          </Field>
          <Field
            label="Headline"
            hint="Shown as the big hero title. Line breaks allowed."
          >
            <Textarea
              rows={2}
              value={profile.headline || ""}
              onChange={(e) => set({ headline: e.target.value })}
              placeholder="Your car, sourced by someone who picks up the phone."
            />
          </Field>
          <Field label="Tagline">
            <Textarea
              rows={2}
              value={profile.tagline || ""}
              onChange={(e) => set({ tagline: e.target.value })}
              placeholder="One-line intro under the headline."
            />
          </Field>
          <Field
            label="WhatsApp number"
            hint="International format — powers the 'Message me' button."
          >
            <Input
              value={profile.whatsappNumber || ""}
              onChange={(e) => set({ whatsappNumber: e.target.value })}
              placeholder="+44 7700 900000"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Years experience">
              <Input
                type="number"
                value={profile.yearsExperience || 0}
                onChange={(e) => set({ yearsExperience: e.target.value })}
              />
            </Field>
            <Field label="Languages" hint="Comma-separated.">
              <Input
                value={(profile.languages || []).join(", ")}
                onChange={(e) =>
                  set({
                    languages: e.target.value
                      .split(",")
                      .map((s: string) => s.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="English, Arabic"
              />
            </Field>
          </div>
        </Card>

        {/* Bio */}
        <Card title="About you" hint="Separate paragraphs with a blank line.">
          <Textarea
            rows={8}
            value={profile.bio || ""}
            onChange={(e) => set({ bio: e.target.value })}
            placeholder="Tell clients who you are…"
          />
        </Card>

        {/* Expertise */}
        <Repeater
          title="Expertise cards"
          items={profile.expertise || []}
          onChange={(v: any) => set({ expertise: v })}
          blank={{ icon: "Star", title: "", desc: "" }}
          render={(item: any, update: any) => (
            <>
              <div className="grid grid-cols-[140px_1fr] gap-3">
                <select
                  className="h-10 rounded-md border border-black/10 px-2 text-sm"
                  value={item.icon}
                  onChange={(e) => update({ icon: e.target.value })}
                >
                  {EXPERTISE_ICONS.map((ic) => (
                    <option key={ic} value={ic}>
                      {ic}
                    </option>
                  ))}
                </select>
                <Input
                  value={item.title}
                  onChange={(e) => update({ title: e.target.value })}
                  placeholder="Card title"
                />
              </div>
              <Textarea
                rows={2}
                value={item.desc}
                onChange={(e) => update({ desc: e.target.value })}
                placeholder="Description"
              />
            </>
          )}
        />

        {/* Sourcing countries */}
        <Repeater
          title="Sourcing countries"
          items={profile.sourcingCountries || []}
          onChange={(v: any) => set({ sourcingCountries: v })}
          blank={{ country: "", flag: "", note: "" }}
          render={(item: any, update: any) => (
            <>
              <div className="grid grid-cols-[1fr_80px] gap-3">
                <Input
                  value={item.country}
                  onChange={(e) => update({ country: e.target.value })}
                  placeholder="Japan"
                />
                <Input
                  value={item.flag}
                  onChange={(e) => update({ flag: e.target.value })}
                  placeholder="🇯🇵"
                />
              </div>
              <Input
                value={item.note}
                onChange={(e) => update({ note: e.target.value })}
                placeholder="Your edge in this market"
              />
            </>
          )}
        />

        {/* Track record */}
        <Repeater
          title="Track record (vanity stats, max 3)"
          hint="Marketing figures you maintain yourself — not live data."
          items={profile.trackRecord || []}
          onChange={(v: any) => set({ trackRecord: v })}
          max={3}
          blank={{ value: "", label: "" }}
          render={(item: any, update: any) => (
            <div className="grid grid-cols-2 gap-3">
              <Input
                value={item.value}
                onChange={(e) => update({ value: e.target.value })}
                placeholder="120+"
              />
              <Input
                value={item.label}
                onChange={(e) => update({ label: e.target.value })}
                placeholder="cars delivered"
              />
            </div>
          )}
        />

        {/* Testimonials */}
        <Repeater
          title="Testimonials"
          items={profile.testimonials || []}
          onChange={(v: any) => set({ testimonials: v })}
          blank={{ name: "", title: "", text: "", rating: 5 }}
          render={(item: any, update: any) => (
            <>
              <div className="grid grid-cols-[1fr_1fr_90px] gap-3">
                <Input
                  value={item.name}
                  onChange={(e) => update({ name: e.target.value })}
                  placeholder="Client name"
                />
                <Input
                  value={item.title}
                  onChange={(e) => update({ title: e.target.value })}
                  placeholder="Headline"
                />
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={item.rating}
                  onChange={(e) => update({ rating: Number(e.target.value) })}
                />
              </div>
              <Textarea
                rows={2}
                value={item.text}
                onChange={(e) => update({ text: e.target.value })}
                placeholder="What they said"
              />
            </>
          )}
        />

        {/* Featured vehicles */}
        <Card
          title="Featured vehicles"
          hint="Cars from the gallery you want to promote."
        >
          <FeaturedVehicles
            profile={profile}
            onOpen={() => setPickerOpen(true)}
            onChange={(ids: any) => set({ featuredDossierIds: ids })}
          />
        </Card>
      </div>

      {/* Sidebar: photo, slug, publish, save */}
      <div className="space-y-6 lg:sticky lg:top-6">
        <Card title="Portrait">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-100 border border-black/[0.07] mb-3 relative">
            {profile.photoUrl ? (
              // biome-ignore lint/performance/noImgElement: R2 preview
              <img
                src={profile.photoUrl}
                alt="Portrait"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-300">
                <UserRound size={48} />
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <Loader2 className="animate-spin" />
              </div>
            )}
          </div>
          <label className="block">
            <span className="sr-only">Upload portrait</span>
            <input
              type="file"
              accept="image/*"
              className="text-xs"
              onChange={(e) =>
                e.target.files?.[0] && handlePhoto(e.target.files[0])
              }
            />
          </label>
        </Card>

        <Card title="Page URL">
          <Field label="Slug" hint="Changing this breaks old links.">
            <div className="flex items-center gap-1 text-sm">
              <span className="text-zinc-400">/team/</span>
              <Input
                value={profile.slug || ""}
                onChange={(e) => set({ slug: e.target.value })}
              />
            </div>
          </Field>
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-1.5"
            onClick={copyLink}
          >
            {copied ? (
              <>
                <Check size={14} /> Copied
              </>
            ) : (
              <>
                <Copy size={14} /> Copy link
              </>
            )}
          </Button>
        </Card>

        <Card title="Visibility">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={!!profile.isPublished}
              onChange={(e) => set({ isPublished: e.target.checked })}
              className="h-4 w-4"
            />
            <div>
              <p className="font-semibold text-sm">Published</p>
              <p className="text-xs text-zinc-500">
                Live at /team/{profile.slug}
              </p>
            </div>
          </label>
          {!profile.isPublished && (
            <p className="mt-3 text-xs text-amber-600 flex items-start gap-1.5">
              <TriangleAlert size={13} className="mt-0.5 shrink-0" /> Needs a
              display name and headline to publish.
            </p>
          )}
        </Card>

        <Button onClick={save} disabled={saving} className="w-full gap-2 h-11">
          {saving ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Save size={16} />
          )}
          {saving ? "Saving…" : "Save changes"}
        </Button>
        <a
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button variant="outline" className="w-full gap-2">
            <ExternalLink size={15} /> Preview page
          </Button>
        </a>
      </div>

      <VehiclePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        selected={(profile.featuredDossierIds || []).map((id: any) =>
          String(id),
        )}
        onSave={(ids: string[]) => {
          set({ featuredDossierIds: ids });
          setPickerOpen(false);
        }}
      />
    </div>
  );
}

/* ─────────────────────────── FEATURED VEHICLES ─────────────────────────── */

function FeaturedVehicles({ profile, onOpen, onChange }: any) {
  const [gallery, setGallery] = useState<any[]>([]);
  useEffect(() => {
    listGalleryForPicker().then((r) => {
      if (r.success) setGallery(r.data || []);
    });
  }, []);

  const selectedIds: string[] = (profile.featuredDossierIds || []).map(
    (id: any) => String(id),
  );
  const selected = selectedIds
    .map((id) => gallery.find((g) => String(g._id) === id))
    .filter(Boolean);

  return (
    <div>
      {selected.length === 0 ? (
        <p className="text-sm text-zinc-400 mb-3">No vehicles picked yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
          {selected.map((car: any) => (
            <div key={car._id} className="relative group">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-zinc-100 border border-black/[0.07]">
                {car.heroImageUrl || car.images?.[0] ? (
                  // biome-ignore lint/performance/noImgElement: R2 preview
                  <img
                    src={car.heroImageUrl || car.images?.[0]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300">
                    <ImageOff size={20} />
                  </div>
                )}
              </div>
              <p className="text-xs font-semibold mt-1 line-clamp-1">
                {formatVehicleTitle(car.make, car.model)}
              </p>
              <button
                type="button"
                onClick={() =>
                  onChange(selectedIds.filter((id) => id !== String(car._id)))
                }
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
      <Button variant="outline" size="sm" className="gap-1.5" onClick={onOpen}>
        <Plus size={14} /> Add from gallery
      </Button>
    </div>
  );
}

function VehiclePicker({ open, onClose, selected, onSave }: any) {
  const [gallery, setGallery] = useState<any[]>([]);
  const [chosen, setChosen] = useState<string[]>(selected);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (open) setChosen(selected);
  }, [open, selected]);
  useEffect(() => {
    if (open)
      listGalleryForPicker().then((r) => {
        if (r.success) setGallery(r.data || []);
      });
  }, [open]);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return gallery.filter((g) =>
      `${g.make} ${g.model} ${g.year}`.toLowerCase().includes(s),
    );
  }, [gallery, q]);

  const toggle = (id: string) =>
    setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Add vehicles from the gallery</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Search make, model, year…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="mb-3"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto flex-1 pr-1">
          {filtered.map((car) => {
            const id = String(car._id);
            const isOn = chosen.includes(id);
            return (
              <button
                type="button"
                key={id}
                onClick={() => toggle(id)}
                className={`text-left rounded-xl border-2 overflow-hidden transition ${isOn ? "border-black" : "border-transparent"}`}
              >
                <div className="aspect-[4/3] bg-zinc-100 relative">
                  {car.heroImageUrl || car.images?.[0] ? (
                    // biome-ignore lint/performance/noImgElement: R2 preview
                    <img
                      src={car.heroImageUrl || car.images?.[0]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-300">
                      <ImageOff size={20} />
                    </div>
                  )}
                  {isOn && (
                    <div className="absolute top-2 right-2 bg-black text-white rounded-full p-1">
                      <Check size={12} />
                    </div>
                  )}
                  <Badge
                    className="absolute bottom-2 left-2"
                    variant="secondary"
                  >
                    {car.status}
                  </Badge>
                </div>
                <p className="text-xs font-semibold p-2 line-clamp-1">
                  {formatVehicleTitle(car.make, car.model)}
                </p>
              </button>
            );
          })}
        </div>
        <div className="flex justify-between items-center pt-3 border-t mt-3">
          <span className="text-sm text-zinc-500">
            {chosen.length} selected
          </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => onSave(chosen)}>Done</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─────────────────────────── STATS PANEL ─────────────────────────── */

function StatsPanel() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyStats().then((r) => {
      if (r.success) setStats(r.data);
      setLoading(false);
    });
  }, []);

  if (loading)
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="animate-spin text-zinc-400" size={32} />
      </div>
    );
  if (!stats) return <p className="text-zinc-500">Couldn't load your stats.</p>;

  const cards = [
    {
      label: "Assigned leads",
      value: stats.assignedLeads,
      sub: `${stats.assignedThisMonth} this month`,
    },
    {
      label: "Action required",
      value: stats.actionRequired,
      sub: "untouched leads",
      accent: stats.actionRequired > 0,
    },
    {
      label: "Follow-ups due",
      value: stats.followUpsDue,
      sub: "due today or overdue",
      accent: stats.followUpsDue > 0,
    },
    { label: "In transit", value: stats.inTransit, sub: "shipped → customs" },
    { label: "Closed / won", value: stats.closedWon, sub: "deals landed" },
    {
      label: "Pipeline value",
      value: `$${(stats.pipelineValue || 0).toLocaleString()}`,
      sub: "agreed across my leads",
    },
  ];

  const maxCount = Math.max(
    1,
    ...stats.inquiriesByLandingPage.map((r: any) => r.count),
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`bg-white border rounded-[2rem] p-6 shadow-sm ${c.accent ? "border-amber-300 ring-1 ring-amber-100" : "border-black/5"}`}
          >
            <p className="text-xs font-bold uppercase text-zinc-400 mb-1">
              {c.label}
            </p>
            <h3 className="text-3xl font-bold font-mono">{c.value}</h3>
            <p className="text-xs text-zinc-500 mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-black/5 rounded-[2.5rem] p-8 shadow-sm">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <BarChart3 size={20} className="text-zinc-400" /> Inquiries by landing
          page
        </h3>
        {stats.inquiriesByLandingPage.length === 0 ? (
          <p className="text-zinc-400 text-sm">No inquiries yet.</p>
        ) : (
          <div className="space-y-4">
            {stats.inquiriesByLandingPage.map((row: any) => (
              <div key={row.label} className="space-y-1">
                <div className="flex justify-between text-sm font-semibold">
                  <span
                    className={
                      row.label === "My Profile Page" ? "text-sky-600" : ""
                    }
                  >
                    {row.label}
                  </span>
                  <span>{row.count}</span>
                </div>
                <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${row.label === "My Profile Page" ? "bg-sky-500" : "bg-zinc-900"}`}
                    style={{ width: `${(row.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── SMALL UI HELPERS ─────────────────────────── */

function Card({ title, hint, children }: any) {
  return (
    <div className="bg-white border border-black/5 rounded-[2rem] p-6 shadow-sm space-y-4">
      <div>
        <h3 className="font-bold text-lg tracking-tight">{title}</h3>
        {hint && <p className="text-xs text-zinc-500 mt-0.5">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, hint, children }: any) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-bold uppercase text-zinc-500">
        {label}
      </Label>
      {children}
      {hint && <p className="text-xs text-zinc-400">{hint}</p>}
    </div>
  );
}

function Repeater({ title, hint, items, onChange, blank, render, max }: any) {
  const add = () => onChange([...(items || []), { ...blank }]);
  const update = (i: number, patch: any) =>
    onChange(
      items.map((it: any, idx: number) =>
        idx === i ? { ...it, ...patch } : it,
      ),
    );
  const remove = (i: number) =>
    onChange(items.filter((_: any, idx: number) => idx !== i));
  const atMax = max && items.length >= max;

  return (
    <Card title={title} hint={hint}>
      <div className="space-y-4">
        {(items || []).map((item: any, i: number) => (
          <div
            key={i}
            className="relative rounded-xl border border-black/[0.07] p-4 space-y-3 bg-zinc-50/50"
          >
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-2 right-2 text-zinc-300 hover:text-red-500"
            >
              <Trash2 size={14} />
            </button>
            {render(item, (patch: any) => update(i, patch))}
          </div>
        ))}
      </div>
      {!atMax && (
        <Button variant="outline" size="sm" className="gap-1.5" onClick={add}>
          <Plus size={14} /> Add
        </Button>
      )}
    </Card>
  );
}
