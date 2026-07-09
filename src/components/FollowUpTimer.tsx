"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  clearFollowUpTimer,
  expireFollowUpTimer,
  setFollowUpTimer,
} from "@/actions/admin-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FollowUpTimerProps {
  requestId: string;
  followUpAt?: string | Date | null;
  followUpSetAt?: string | Date | null;
  onExpired?: () => void;
}

const PRESETS = [
  { label: "1 day", days: 1 },
  { label: "3 days", days: 3 },
  { label: "1 week", days: 7 },
  { label: "2 weeks", days: 14 },
  { label: "1 month", days: 30 },
  { label: "3 months", days: 90 },
];

function addDays(d: Date, days: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r;
}

function formatDateInput(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function getTimerState(followUpAt: Date, followUpSetAt: Date) {
  const now = Date.now();
  const end = followUpAt.getTime();
  const start = followUpSetAt.getTime();
  const total = end - start;
  const remaining = end - now;
  const ratio = total > 0 ? Math.max(0, remaining / total) : 0;
  return { ratio, remaining, total, expired: remaining <= 0 };
}

function TimerRing({ ratio }: { ratio: number }) {
  const r = 9;
  const cx = 12;
  const cy = 12;
  const circumference = 2 * Math.PI * r;
  const dashoffset = circumference * (1 - ratio);

  const color =
    ratio > 0.75
      ? "#22c55e"
      : ratio > 0.25
        ? "#f59e0b"
        : ratio > 0
          ? "#ef4444"
          : "#d1d5db";

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Track */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        stroke="#e5e7eb"
        strokeWidth="2.5"
        fill="none"
      />
      {/* Progress arc */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        stroke={color}
        strokeWidth="2.5"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={dashoffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s ease" }}
      />
      {/* Center dot */}
      <circle cx={cx} cy={cy} r="1.5" fill={color} />
      {/* Clock hand */}
      <line
        x1={cx}
        y1={cy}
        x2={cx}
        y2={cy - 5}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        transform={`rotate(${(1 - ratio) * 360} ${cx} ${cy})`}
      />
    </svg>
  );
}

export default function FollowUpTimer({
  requestId,
  followUpAt,
  followUpSetAt,
  onExpired,
}: FollowUpTimerProps) {
  const [open, setOpen] = useState(false);
  const [ratio, setRatio] = useState<number | null>(null);
  const [_expired, setExpired] = useState(false);
  const [saving, setSaving] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [customDate, setCustomDate] = useState(
    formatDateInput(addDays(new Date(), 7)),
  );
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const expiredRef = useRef(false);

  const followUpAtDate = followUpAt ? new Date(followUpAt) : null;
  const followUpSetAtDate = followUpSetAt ? new Date(followUpSetAt) : null;
  const hasTimer = !!(followUpAtDate && followUpSetAtDate);

  const handleExpiry = useCallback(async () => {
    if (expiredRef.current) return;
    expiredRef.current = true;
    setExpired(true);
    await expireFollowUpTimer(requestId);
    onExpired?.();
  }, [requestId, onExpired]);

  useEffect(() => {
    if (!hasTimer || !followUpAtDate || !followUpSetAtDate) {
      setRatio(null);
      setExpired(false);
      expiredRef.current = false;
      return;
    }

    const tick = () => {
      const state = getTimerState(followUpAtDate, followUpSetAtDate);
      setRatio(state.ratio);
      if (state.expired && !expiredRef.current) {
        handleExpiry();
      }
    };

    tick();
    const iv = setInterval(tick, 60_000); // update every minute
    return () => clearInterval(iv);
  }, [hasTimer, handleExpiry, followUpAtDate, followUpSetAtDate]);

  const handlePreset = (days: number, idx: number) => {
    setSelectedPreset(idx);
    setCustomDate(formatDateInput(addDays(new Date(), days)));
  };

  const handleSave = async () => {
    if (!customDate) return;
    setSaving(true);
    try {
      const targetDate = new Date(customDate);
      targetDate.setHours(23, 59, 59, 999);
      await setFollowUpTimer(requestId, targetDate.toISOString());
      setOpen(false);
      setSelectedPreset(null);
    } finally {
      setSaving(false);
    }
  };

  const handleClear = async () => {
    setClearing(true);
    try {
      await clearFollowUpTimer(requestId);
      setRatio(null);
      setExpired(false);
      expiredRef.current = false;
      setOpen(false);
    } finally {
      setClearing(false);
    }
  };

  const minDate = formatDateInput(addDays(new Date(), 1));

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title={
          hasTimer && followUpAtDate
            ? `Follow-up set for ${followUpAtDate.toLocaleDateString()}`
            : "Set follow-up reminder"
        }
        className={`inline-flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-lg border text-[11px] font-semibold transition-colors focus:outline-none group ${
          hasTimer
            ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
            : "bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
        }`}
      >
        {hasTimer && ratio !== null ? (
          <TimerRing ratio={ratio} />
        ) : (
          // Inactive clock icon
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeDasharray="3 2"
            />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <line
              x1="12"
              y1="12"
              x2="12"
              y2="7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        )}
        <span className="hidden sm:inline">
          {hasTimer && followUpAtDate
            ? followUpAtDate.toLocaleDateString()
            : "Reminder"}
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm bg-white border-black/5 rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-black">
              Set Follow-up Reminder
            </DialogTitle>
            <p className="text-xs text-zinc-500 mt-0.5">
              When the timer expires, the sales status will reset to{" "}
              <strong>Action Required</strong> automatically.
            </p>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Presets */}
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">
                Quick Select
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {PRESETS.map((p, i) => (
                  <button
                    key={p.label}
                    onClick={() => handlePreset(p.days, i)}
                    className={`text-xs px-2 py-1.5 rounded-lg border font-medium transition-colors ${
                      selectedPreset === i
                        ? "bg-black text-white border-black"
                        : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom date */}
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">
                Or pick a date
              </p>
              <input
                type="date"
                min={minDate}
                value={customDate}
                onChange={(e) => {
                  setCustomDate(e.target.value);
                  setSelectedPreset(null);
                }}
                className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10 bg-zinc-50"
              />
            </div>

            {/* Preview */}
            {customDate && (
              <div className="bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-2 text-xs text-zinc-600">
                Follow-up due:{" "}
                <strong className="text-black">
                  {new Date(customDate).toLocaleDateString("en-GB", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </strong>
              </div>
            )}

            {/* Current timer status */}
            {hasTimer && followUpAtDate && (
              <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-xs text-amber-800 flex items-center justify-between">
                <span>
                  Active timer →{" "}
                  {followUpAtDate.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <button
                  onClick={handleClear}
                  disabled={clearing}
                  className="text-red-500 hover:text-red-700 font-semibold ml-3 transition-colors disabled:opacity-50"
                >
                  {clearing ? "Clearing…" : "Clear"}
                </button>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              className="rounded-lg text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !customDate}
              className="bg-black text-white hover:bg-black/80 rounded-lg text-sm"
            >
              {saving ? "Saving…" : "Set Timer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
