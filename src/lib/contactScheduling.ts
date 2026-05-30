// @/lib/contactScheduling.ts
// Shared (client + server safe) helpers for capturing & interpreting a lead's
// preferred contact window. The sales team works in IST, so all *display*
// helpers convert to Asia/Kolkata, while the customer's own timezone is used
// only to interpret the day/window they picked into a concrete instant.

export const SALES_TIMEZONE = "Asia/Kolkata"; // IST — the sales team's working zone

// --- Contact methods -------------------------------------------------------
export const CONTACT_METHODS = ["WhatsApp", "Call", "WhatsApp Call", "Email"] as const;
export type ContactMethod = (typeof CONTACT_METHODS)[number];

// --- Time windows ----------------------------------------------------------
// startHour is used to compute the concrete reminder instant.
export const TIME_WINDOWS: { label: string; startHour: number; endHour: number }[] = [
    { label: "Morning (9–12)", startHour: 9, endHour: 12 },
    { label: "Afternoon (12–5)", startHour: 12, endHour: 17 },
    { label: "Evening (5–8)", startHour: 17, endHour: 20 },
];

export function getWindow(label?: string) {
    return TIME_WINDOWS.find((w) => w.label === label) || TIME_WINDOWS[0];
}

// --- Day options -----------------------------------------------------------
export const DAY_OPTIONS = [
    "Today",
    "Tomorrow",
    "Weekdays",
    "Weekend",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
] as const;

const WEEKDAY_INDEX: Record<string, number> = {
    Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6,
};

// --- Country → timezone map -----------------------------------------------
// Curated for realistic import destinations. Unknown countries fall back to a
// sensible default and the customer can override via the timezone dropdown.
export const COUNTRY_TIMEZONES: Record<string, { tz: string; label: string }> = {
    "Ireland": { tz: "Europe/Dublin", label: "Ireland (Dublin)" },
    "United Kingdom": { tz: "Europe/London", label: "United Kingdom (London)" },
    "Northern Ireland": { tz: "Europe/London", label: "Northern Ireland (London)" },
    "United States": { tz: "America/New_York", label: "United States (Eastern)" },
    "Canada": { tz: "America/Toronto", label: "Canada (Eastern)" },
    "Australia": { tz: "Australia/Sydney", label: "Australia (Sydney)" },
    "New Zealand": { tz: "Pacific/Auckland", label: "New Zealand (Auckland)" },
    "Germany": { tz: "Europe/Berlin", label: "Germany (Berlin)" },
    "France": { tz: "Europe/Paris", label: "France (Paris)" },
    "Spain": { tz: "Europe/Madrid", label: "Spain (Madrid)" },
    "Italy": { tz: "Europe/Rome", label: "Italy (Rome)" },
    "Netherlands": { tz: "Europe/Amsterdam", label: "Netherlands (Amsterdam)" },
    "Belgium": { tz: "Europe/Brussels", label: "Belgium (Brussels)" },
    "Sweden": { tz: "Europe/Stockholm", label: "Sweden (Stockholm)" },
    "Norway": { tz: "Europe/Oslo", label: "Norway (Oslo)" },
    "Denmark": { tz: "Europe/Copenhagen", label: "Denmark (Copenhagen)" },
    "Finland": { tz: "Europe/Helsinki", label: "Finland (Helsinki)" },
    "Portugal": { tz: "Europe/Lisbon", label: "Portugal (Lisbon)" },
    "Switzerland": { tz: "Europe/Zurich", label: "Switzerland (Zurich)" },
    "Austria": { tz: "Europe/Vienna", label: "Austria (Vienna)" },
    "Malta": { tz: "Europe/Malta", label: "Malta (Valletta)" },
    "Cyprus": { tz: "Asia/Nicosia", label: "Cyprus (Nicosia)" },
    "Japan": { tz: "Asia/Tokyo", label: "Japan (Tokyo)" },
    "Singapore": { tz: "Asia/Singapore", label: "Singapore" },
    "Hong Kong": { tz: "Asia/Hong_Kong", label: "Hong Kong" },
    "China": { tz: "Asia/Shanghai", label: "China (Shanghai)" },
    "United Arab Emirates": { tz: "Asia/Dubai", label: "UAE (Dubai)" },
    "Saudi Arabia": { tz: "Asia/Riyadh", label: "Saudi Arabia (Riyadh)" },
    "Qatar": { tz: "Asia/Qatar", label: "Qatar (Doha)" },
    "South Africa": { tz: "Africa/Johannesburg", label: "South Africa (Johannesburg)" },
    "Nigeria": { tz: "Africa/Lagos", label: "Nigeria (Lagos)" },
    "Kenya": { tz: "Africa/Nairobi", label: "Kenya (Nairobi)" },
    "Ghana": { tz: "Africa/Accra", label: "Ghana (Accra)" },
    "India": { tz: "Asia/Kolkata", label: "India (IST)" },
    "Pakistan": { tz: "Asia/Karachi", label: "Pakistan (Karachi)" },
    "Sri Lanka": { tz: "Asia/Colombo", label: "Sri Lanka (Colombo)" },
};

// Curated dropdown for manual override.
export const TIMEZONE_OPTIONS: { tz: string; label: string }[] = [
    { tz: "Europe/Dublin", label: "Ireland / UK (GMT/IST)" },
    { tz: "Europe/London", label: "United Kingdom (London)" },
    { tz: "Europe/Paris", label: "Central Europe (Paris/Berlin)" },
    { tz: "Europe/Helsinki", label: "Eastern Europe (Helsinki)" },
    { tz: "America/New_York", label: "US Eastern (New York)" },
    { tz: "America/Chicago", label: "US Central (Chicago)" },
    { tz: "America/Denver", label: "US Mountain (Denver)" },
    { tz: "America/Los_Angeles", label: "US Pacific (Los Angeles)" },
    { tz: "America/Toronto", label: "Canada Eastern (Toronto)" },
    { tz: "Asia/Dubai", label: "Gulf (Dubai)" },
    { tz: "Asia/Karachi", label: "Pakistan (Karachi)" },
    { tz: "Asia/Kolkata", label: "India (IST)" },
    { tz: "Asia/Colombo", label: "Sri Lanka (Colombo)" },
    { tz: "Asia/Singapore", label: "Singapore / Hong Kong" },
    { tz: "Asia/Tokyo", label: "Japan (Tokyo)" },
    { tz: "Australia/Sydney", label: "Australia (Sydney)" },
    { tz: "Pacific/Auckland", label: "New Zealand (Auckland)" },
    { tz: "Africa/Johannesburg", label: "South Africa (Johannesburg)" },
    { tz: "Africa/Lagos", label: "West Africa (Lagos)" },
];

export function timezoneForCountry(country?: string): { tz: string; label: string } {
    if (country && COUNTRY_TIMEZONES[country]) return COUNTRY_TIMEZONES[country];
    return { tz: "Europe/Dublin", label: "Ireland / UK (GMT)" };
}

// --- Timezone math (native Intl, DST-correct, no extra deps) ---------------

/** Offset (tz − UTC) in ms at the given instant. */
function tzOffsetMs(tz: string, date: Date): number {
    const dtf = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        hour12: false,
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
    const parts = dtf.formatToParts(date);
    const m: Record<string, string> = {};
    for (const p of parts) m[p.type] = p.value;
    let hour = Number(m.hour);
    if (hour === 24) hour = 0; // some engines emit 24 for midnight
    const asUTC = Date.UTC(Number(m.year), Number(m.month) - 1, Number(m.day), hour, Number(m.minute), Number(m.second));
    return asUTC - date.getTime();
}

/** Convert a wall-clock time in `tz` to the corresponding UTC Date. */
function zonedWallTimeToUtc(year: number, month1: number, day: number, hour: number, tz: string): Date {
    const naiveUtc = Date.UTC(year, month1 - 1, day, hour, 0, 0);
    // First pass: approximate using offset at the naive instant.
    let offset = tzOffsetMs(tz, new Date(naiveUtc));
    let result = new Date(naiveUtc - offset);
    // Second pass refines around DST boundaries.
    offset = tzOffsetMs(tz, result);
    result = new Date(naiveUtc - offset);
    return result;
}

/** Current Y/M/D + weekday as seen in `tz`. */
function nowPartsInTz(tz: string): { year: number; month1: number; day: number; weekday: number; hour: number } {
    const now = new Date();
    const dtf = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        hour12: false,
        weekday: "short",
        year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit",
    });
    const m: Record<string, string> = {};
    for (const p of dtf.formatToParts(now)) m[p.type] = p.value;
    const weekdayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    let hour = Number(m.hour);
    if (hour === 24) hour = 0;
    return {
        year: Number(m.year),
        month1: Number(m.month),
        day: Number(m.day),
        weekday: weekdayMap[m.weekday] ?? 1,
        hour,
    };
}

function isWeekday(wd: number) { return wd >= 1 && wd <= 5; }
function isWeekend(wd: number) { return wd === 0 || wd === 6; }

/**
 * Compute the concrete UTC instant the lead wants to be contacted, from their
 * chosen day(s) + window + timezone. Picks the earliest upcoming match that is
 * still in the future; if the window has already passed today, rolls forward.
 */
export function computePreferredContactAt(
    days: string[] | undefined,
    windowLabel: string | undefined,
    tz: string,
): Date {
    const win = getWindow(windowLabel);
    const start = nowPartsInTz(tz);
    const tokens = days?.length ? days : ["Today"];

    // Walk forward day by day (cap 14 days) and return the first day that
    // matches any selected token AND whose window start is in the future.
    const base = new Date(Date.UTC(start.year, start.month1 - 1, start.day));
    for (let i = 0; i < 14; i++) {
        const d = new Date(base);
        d.setUTCDate(d.getUTCDate() + i);
        const y = d.getUTCFullYear();
        const mo = d.getUTCMonth() + 1;
        const day = d.getUTCDate();
        const wd = d.getUTCDay();

        const matches = tokens.some((t) => {
            if (t === "Today") return i === 0;
            if (t === "Tomorrow") return i === 1;
            if (t === "Weekdays") return isWeekday(wd);
            if (t === "Weekend") return isWeekend(wd);
            const idx = WEEKDAY_INDEX[t];
            return idx !== undefined && idx === wd;
        });
        if (!matches) continue;

        const candidate = zonedWallTimeToUtc(y, mo, day, win.startHour, tz);
        if (candidate.getTime() > Date.now()) return candidate;
    }

    // Fallback: tomorrow at window start.
    const d = new Date(base);
    d.setUTCDate(d.getUTCDate() + 1);
    return zonedWallTimeToUtc(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), win.startHour, tz);
}

// --- Display helpers (always IST for the sales team) -----------------------

/** Format an instant in IST, e.g. "Mon, 2 Jun · 2:30 PM IST". */
export function formatInIST(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    const day = new Intl.DateTimeFormat("en-GB", {
        timeZone: SALES_TIMEZONE, weekday: "short", day: "numeric", month: "short",
    }).format(d);
    const time = new Intl.DateTimeFormat("en-US", {
        timeZone: SALES_TIMEZONE, hour: "numeric", minute: "2-digit", hour12: true,
    }).format(d);
    return `${day} · ${time} IST`;
}

// --- "Contact due" filter buckets (computed in IST) ------------------------
export const CONTACT_DUE_OPTIONS = [
    { value: "overdue", label: "Overdue" },
    { value: "next2h", label: "Next 2 hours" },
    { value: "today", label: "Today" },
    { value: "tomorrow", label: "Tomorrow" },
    { value: "week", label: "This week" },
] as const;
export type ContactDueBucket = (typeof CONTACT_DUE_OPTIONS)[number]["value"];

function istParts(date: Date): { y: number; m: number; day: number; weekday: number } {
    const dtf = new Intl.DateTimeFormat("en-US", {
        timeZone: SALES_TIMEZONE, year: "numeric", month: "2-digit", day: "2-digit", weekday: "short",
    });
    const m: Record<string, string> = {};
    for (const p of dtf.formatToParts(date)) m[p.type] = p.value;
    const wd: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { y: Number(m.year), m: Number(m.month), day: Number(m.day), weekday: wd[m.weekday] ?? 1 };
}

/** Calendar date (IST) of an instant, as a UTC-midnight Date for day arithmetic. */
function istCalendarUTC(date: Date): Date {
    const p = istParts(date);
    return new Date(Date.UTC(p.y, p.m - 1, p.day));
}

/**
 * Does a lead's preferred contact time fall in the given bucket, evaluated in
 * the sales team's timezone (IST)? Used by the dashboard "Contact due" filter.
 */
export function contactDueMatches(preferredContactAt: string | Date | null | undefined, bucket: ContactDueBucket): boolean {
    if (!preferredContactAt) return false;
    const d = new Date(preferredContactAt);
    if (Number.isNaN(d.getTime())) return false;

    const now = new Date();
    const diff = d.getTime() - now.getTime();
    const HOUR = 3_600_000;
    const DAY = 24 * HOUR;

    if (bucket === "overdue") return diff < 0;
    if (bucket === "next2h") return diff >= 0 && diff <= 2 * HOUR;

    const today0 = istCalendarUTC(now).getTime();
    const target0 = istCalendarUTC(d).getTime();
    const dayDiff = Math.round((target0 - today0) / DAY);
    const weekday = istParts(now).weekday; // 0 = Sun

    if (bucket === "today") return dayDiff === 0;
    if (bucket === "tomorrow") return dayDiff === 1;
    if (bucket === "week") {
        const daysLeftInWeek = weekday === 0 ? 0 : 7 - weekday; // up to & including Sunday
        return dayDiff >= 0 && dayDiff <= daysLeftInWeek;
    }
    return false;
}

/** Format an instant in an arbitrary tz, e.g. customer's local time. */
export function formatInTz(date: Date | string, tz: string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    const day = new Intl.DateTimeFormat("en-GB", {
        timeZone: tz, weekday: "short", day: "numeric", month: "short",
    }).format(d);
    const time = new Intl.DateTimeFormat("en-US", {
        timeZone: tz, hour: "numeric", minute: "2-digit", hour12: true,
    }).format(d);
    return `${day} · ${time}`;
}
