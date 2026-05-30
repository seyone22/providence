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

// --- Time zones ------------------------------------------------------------
// One entry per distinct time zone (same UTC offset AND DST behaviour), rather
// than one per country. Countries that share a zone are grouped and listed in
// `places`, and `abbr` carries the common abbreviation(s) — both are baked into
// the option label so the dropdown's text search matches on a country name
// ("India"), an abbreviation ("IST", "GMT", "EST"), or the offset ("+5:30").
// `tz` is the canonical IANA zone used for the actual reminder computation.
interface TzZone { tz: string; abbr: string; places: string; }

const TZ_ZONES: TzZone[] = [
    { tz: "Etc/GMT+12",                      abbr: "AoE",         places: "Baker Island, Howland Island" },
    { tz: "Pacific/Pago_Pago",               abbr: "SST",         places: "American Samoa, Niue, Midway" },
    { tz: "Pacific/Honolulu",                abbr: "HST",         places: "Hawaii (USA), Tahiti, Cook Islands" },
    { tz: "Pacific/Marquesas",               abbr: "MART",        places: "Marquesas Islands" },
    { tz: "America/Anchorage",               abbr: "AKST/AKDT",   places: "Alaska (USA)" },
    { tz: "America/Los_Angeles",             abbr: "PST/PDT",     places: "US Pacific, Canada (Vancouver), Mexico (Tijuana)" },
    { tz: "America/Denver",                  abbr: "MST/MDT",     places: "US Mountain, Canada (Edmonton)" },
    { tz: "America/Phoenix",                 abbr: "MST",         places: "Arizona (USA), Mexico (Hermosillo)" },
    { tz: "America/Chicago",                 abbr: "CST/CDT",     places: "US Central, Canada (Winnipeg)" },
    { tz: "America/Mexico_City",             abbr: "CST",         places: "Mexico, Guatemala, Costa Rica, El Salvador, Honduras" },
    { tz: "America/New_York",                abbr: "EST/EDT",     places: "US Eastern, Canada (Toronto), Cuba, Bahamas" },
    { tz: "America/Bogota",                  abbr: "COT/PET",     places: "Colombia, Peru, Ecuador, Panama, Jamaica" },
    { tz: "America/Halifax",                 abbr: "AST/ADT",     places: "Canada (Halifax), Bermuda" },
    { tz: "America/Santo_Domingo",           abbr: "AST",         places: "Dominican Rep., Puerto Rico, Venezuela, Bolivia, Guyana" },
    { tz: "America/Santiago",                abbr: "CLT/CLST",    places: "Chile" },
    { tz: "America/St_Johns",                abbr: "NST/NDT",     places: "Newfoundland (Canada)" },
    { tz: "America/Sao_Paulo",               abbr: "BRT",         places: "Brazil (São Paulo, Brasília)" },
    { tz: "America/Argentina/Buenos_Aires",  abbr: "ART",         places: "Argentina, Uruguay, French Guiana" },
    { tz: "Atlantic/South_Georgia",          abbr: "GST",         places: "South Georgia, Fernando de Noronha" },
    { tz: "Atlantic/Azores",                 abbr: "AZOT/AZOST",  places: "Azores (Portugal)" },
    { tz: "Atlantic/Cape_Verde",             abbr: "CVT",         places: "Cape Verde" },
    { tz: "Europe/London",                   abbr: "GMT/BST",     places: "United Kingdom, Ireland, Portugal" },
    { tz: "Africa/Accra",                    abbr: "GMT",         places: "Ghana, Senegal, Ivory Coast, Iceland, Mali" },
    { tz: "Europe/Paris",                    abbr: "CET/CEST",    places: "Germany, France, Spain, Italy, Netherlands, Belgium, Switzerland, Austria, Poland, Sweden, Norway, Denmark, Malta" },
    { tz: "Africa/Lagos",                    abbr: "WAT",         places: "Nigeria, Cameroon, Angola, DR Congo (Kinshasa)" },
    { tz: "Europe/Helsinki",                 abbr: "EET/EEST",    places: "Finland, Greece, Romania, Ukraine, Cyprus, Bulgaria" },
    { tz: "Africa/Cairo",                    abbr: "EET",         places: "Egypt, Libya" },
    { tz: "Africa/Johannesburg",             abbr: "SAST",        places: "South Africa, Zambia, Zimbabwe, Botswana" },
    { tz: "Asia/Jerusalem",                  abbr: "IST/IDT",     places: "Israel, Palestine" },
    { tz: "Asia/Riyadh",                     abbr: "AST",         places: "Saudi Arabia, Kuwait, Qatar, Bahrain, Iraq, Yemen" },
    { tz: "Africa/Nairobi",                  abbr: "EAT",         places: "Kenya, Ethiopia, Tanzania, Uganda, Somalia" },
    { tz: "Europe/Moscow",                   abbr: "MSK",         places: "Russia (Moscow), Belarus" },
    { tz: "Europe/Istanbul",                 abbr: "TRT",         places: "Turkey" },
    { tz: "Asia/Tehran",                     abbr: "IRST",        places: "Iran" },
    { tz: "Asia/Dubai",                      abbr: "GST",         places: "UAE, Oman, Azerbaijan, Armenia, Georgia, Mauritius" },
    { tz: "Asia/Kabul",                      abbr: "AFT",         places: "Afghanistan" },
    { tz: "Asia/Karachi",                    abbr: "PKT",         places: "Pakistan, Uzbekistan, Turkmenistan, Maldives, Tajikistan" },
    { tz: "Asia/Kolkata",                    abbr: "IST",         places: "India, Sri Lanka" },
    { tz: "Asia/Kathmandu",                  abbr: "NPT",         places: "Nepal" },
    { tz: "Asia/Dhaka",                      abbr: "BDT",         places: "Bangladesh, Bhutan, Kazakhstan (Almaty)" },
    { tz: "Asia/Yangon",                     abbr: "MMT",         places: "Myanmar, Cocos Islands" },
    { tz: "Asia/Bangkok",                    abbr: "ICT",         places: "Thailand, Vietnam, Cambodia, Laos, Indonesia (Jakarta)" },
    { tz: "Asia/Singapore",                  abbr: "SGT/CST/HKT", places: "Singapore, China, Hong Kong, Taiwan, Malaysia, Philippines, Australia (Perth)" },
    { tz: "Asia/Tokyo",                      abbr: "JST/KST",     places: "Japan, South Korea, North Korea" },
    { tz: "Australia/Darwin",                abbr: "ACST",        places: "Australia – Northern Territory" },
    { tz: "Australia/Adelaide",              abbr: "ACST/ACDT",   places: "Australia – South Australia" },
    { tz: "Australia/Brisbane",              abbr: "AEST",        places: "Australia – Queensland, Papua New Guinea" },
    { tz: "Australia/Sydney",                abbr: "AEST/AEDT",   places: "Australia – NSW, Victoria, Canberra, Tasmania" },
    { tz: "Pacific/Guadalcanal",             abbr: "SBT",         places: "Solomon Islands, New Caledonia, Vanuatu" },
    { tz: "Pacific/Auckland",                abbr: "NZST/NZDT",   places: "New Zealand" },
    { tz: "Pacific/Tarawa",                  abbr: "GILT",        places: "Kiribati (Gilbert), Marshall Islands, Tuvalu, Nauru, Fiji" },
    { tz: "Pacific/Tongatapu",               abbr: "TOT",         places: "Tonga, Samoa" },
    { tz: "Pacific/Kiritimati",              abbr: "LINT",        places: "Kiribati (Line Islands)" },
];

/** Current GMT offset for a zone, e.g. "GMT+5:30" / "GMT-8". */
function formatGmtOffset(tz: string): string {
    // Offsets are whole minutes; round away sub-second drift from Date.now().
    const totalMinutes = Math.round(tzOffsetMs(tz, new Date()) / 60_000);
    const sign = totalMinutes < 0 ? "-" : "+";
    const abs = Math.abs(totalMinutes);
    const h = Math.floor(abs / 60);
    const m = abs % 60;
    return `GMT${sign}${h}${m ? ":" + String(m).padStart(2, "0") : ""}`;
}

// Full dropdown list. Label = "(GMT±off) ABBR — Countries" so it's searchable
// by offset, abbreviation, or country name.
export const TIMEZONE_OPTIONS: { tz: string; label: string }[] = TZ_ZONES.map((z) => ({
    tz: z.tz,
    label: `(${formatGmtOffset(z.tz)}) ${z.abbr} — ${z.places}`,
}));

// Map the form's import-country names → the canonical zone above, so the
// timezone can be pre-selected from the chosen destination.
const COUNTRY_TO_TZ: Record<string, string> = {
    "Ireland": "Europe/London",
    "United Kingdom": "Europe/London",
    "Northern Ireland": "Europe/London",
    "Portugal": "Europe/London",
    "United States": "America/New_York",
    "Canada": "America/New_York",
    "Australia": "Australia/Sydney",
    "New Zealand": "Pacific/Auckland",
    "Germany": "Europe/Paris", "France": "Europe/Paris", "Spain": "Europe/Paris",
    "Italy": "Europe/Paris", "Netherlands": "Europe/Paris", "Belgium": "Europe/Paris",
    "Sweden": "Europe/Paris", "Norway": "Europe/Paris", "Denmark": "Europe/Paris",
    "Switzerland": "Europe/Paris", "Austria": "Europe/Paris", "Malta": "Europe/Paris",
    "Finland": "Europe/Helsinki", "Cyprus": "Europe/Helsinki", "Greece": "Europe/Helsinki",
    "Japan": "Asia/Tokyo", "South Korea": "Asia/Tokyo",
    "Singapore": "Asia/Singapore", "Hong Kong": "Asia/Singapore", "China": "Asia/Singapore",
    "Malaysia": "Asia/Singapore", "Philippines": "Asia/Singapore", "Taiwan": "Asia/Singapore",
    "United Arab Emirates": "Asia/Dubai", "Oman": "Asia/Dubai",
    "Saudi Arabia": "Asia/Riyadh", "Qatar": "Asia/Riyadh", "Kuwait": "Asia/Riyadh", "Bahrain": "Asia/Riyadh",
    "South Africa": "Africa/Johannesburg",
    "Nigeria": "Africa/Lagos",
    "Kenya": "Africa/Nairobi",
    "Ghana": "Africa/Accra",
    "India": "Asia/Kolkata", "Sri Lanka": "Asia/Kolkata",
    "Pakistan": "Asia/Karachi",
    "Egypt": "Africa/Cairo",
    "Turkey": "Europe/Istanbul",
    "Brazil": "America/Sao_Paulo",
};

const DEFAULT_TZ = "Europe/London";

export function timezoneForCountry(country?: string): { tz: string; label: string } {
    const tz = (country && COUNTRY_TO_TZ[country]) || DEFAULT_TZ;
    const opt = TIMEZONE_OPTIONS.find((o) => o.tz === tz) || TIMEZONE_OPTIONS.find((o) => o.tz === DEFAULT_TZ)!;
    return { tz: opt.tz, label: opt.label };
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
