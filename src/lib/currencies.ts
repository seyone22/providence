/**
 * Currencies for the inquiry form's budget field.
 *
 * Two things live here: the list a customer can pick from, and the map that
 * chooses one for them from the destination country they already selected.
 * Defaulting the currency matters more than it looks — a budget of "45,000"
 * with no unit attached is not a budget a sales agent can act on, and asking
 * someone importing to Ireland to also tell us they think in euro is a
 * question we can answer for them.
 *
 * The country keys mirror the `COUNTRIES` list in `requestForm.tsx` exactly;
 * `src/lib/__tests__/currencies.test.ts` fails if the two ever drift apart.
 */

export type Currency = {
  code: string;
  name: string;
  /** Shown before the amount when it's a symbol people recognise. */
  symbol?: string;
};

/** Every currency reachable from the destination list. */
export const CURRENCIES: Currency[] = [
  { code: "AED", name: "UAE Dirham" },
  { code: "AFN", name: "Afghan Afghani" },
  { code: "ALL", name: "Albanian Lek" },
  { code: "AMD", name: "Armenian Dram" },
  { code: "ANG", name: "Netherlands Antillean Guilder" },
  { code: "AOA", name: "Angolan Kwanza" },
  { code: "ARS", name: "Argentine Peso" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "AWG", name: "Aruban Florin" },
  { code: "AZN", name: "Azerbaijani Manat" },
  { code: "BAM", name: "Bosnia-Herzegovina Convertible Mark" },
  { code: "BBD", name: "Barbadian Dollar" },
  { code: "BDT", name: "Bangladeshi Taka" },
  { code: "BGN", name: "Bulgarian Lev" },
  { code: "BHD", name: "Bahraini Dinar" },
  { code: "BIF", name: "Burundian Franc" },
  { code: "BMD", name: "Bermudian Dollar" },
  { code: "BND", name: "Brunei Dollar" },
  { code: "BOB", name: "Bolivian Boliviano" },
  { code: "BRL", name: "Brazilian Real" },
  { code: "BSD", name: "Bahamian Dollar" },
  { code: "BTN", name: "Bhutanese Ngultrum" },
  { code: "BWP", name: "Botswanan Pula" },
  { code: "BYN", name: "Belarusian Ruble" },
  { code: "BZD", name: "Belize Dollar" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "CDF", name: "Congolese Franc" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "CLP", name: "Chilean Peso" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "COP", name: "Colombian Peso" },
  { code: "CRC", name: "Costa Rican Colon" },
  { code: "CUP", name: "Cuban Peso" },
  { code: "CVE", name: "Cape Verdean Escudo" },
  { code: "CZK", name: "Czech Koruna" },
  { code: "DJF", name: "Djiboutian Franc" },
  { code: "DKK", name: "Danish Krone" },
  { code: "DOP", name: "Dominican Peso" },
  { code: "DZD", name: "Algerian Dinar" },
  { code: "EGP", name: "Egyptian Pound" },
  { code: "ERN", name: "Eritrean Nakfa" },
  { code: "ETB", name: "Ethiopian Birr" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "FJD", name: "Fijian Dollar" },
  { code: "FKP", name: "Falkland Islands Pound" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "GEL", name: "Georgian Lari" },
  { code: "GHS", name: "Ghanaian Cedi" },
  { code: "GIP", name: "Gibraltar Pound" },
  { code: "GMD", name: "Gambian Dalasi" },
  { code: "GNF", name: "Guinean Franc" },
  { code: "GTQ", name: "Guatemalan Quetzal" },
  { code: "GYD", name: "Guyanaese Dollar" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "HNL", name: "Honduran Lempira" },
  { code: "HTG", name: "Haitian Gourde" },
  { code: "HUF", name: "Hungarian Forint" },
  { code: "IDR", name: "Indonesian Rupiah" },
  { code: "ILS", name: "Israeli New Shekel" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "IQD", name: "Iraqi Dinar" },
  { code: "IRR", name: "Iranian Rial" },
  { code: "ISK", name: "Icelandic Krona" },
  { code: "JMD", name: "Jamaican Dollar" },
  { code: "JOD", name: "Jordanian Dinar" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "KES", name: "Kenyan Shilling" },
  { code: "KGS", name: "Kyrgystani Som" },
  { code: "KHR", name: "Cambodian Riel" },
  { code: "KMF", name: "Comorian Franc" },
  { code: "KPW", name: "North Korean Won" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "KWD", name: "Kuwaiti Dinar" },
  { code: "KYD", name: "Cayman Islands Dollar" },
  { code: "KZT", name: "Kazakhstani Tenge" },
  { code: "LAK", name: "Laotian Kip" },
  { code: "LBP", name: "Lebanese Pound" },
  { code: "LKR", name: "Sri Lankan Rupee" },
  { code: "LRD", name: "Liberian Dollar" },
  { code: "LSL", name: "Lesotho Loti" },
  { code: "LYD", name: "Libyan Dinar" },
  { code: "MAD", name: "Moroccan Dirham" },
  { code: "MDL", name: "Moldovan Leu" },
  { code: "MGA", name: "Malagasy Ariary" },
  { code: "MKD", name: "Macedonian Denar" },
  { code: "MMK", name: "Myanmar Kyat" },
  { code: "MNT", name: "Mongolian Tugrik" },
  { code: "MOP", name: "Macanese Pataca" },
  { code: "MRU", name: "Mauritanian Ouguiya" },
  { code: "MUR", name: "Mauritian Rupee" },
  { code: "MVR", name: "Maldivian Rufiyaa" },
  { code: "MWK", name: "Malawian Kwacha" },
  { code: "MXN", name: "Mexican Peso" },
  { code: "MYR", name: "Malaysian Ringgit" },
  { code: "MZN", name: "Mozambican Metical" },
  { code: "NAD", name: "Namibian Dollar" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "NIO", name: "Nicaraguan Cordoba" },
  { code: "NOK", name: "Norwegian Krone" },
  { code: "NPR", name: "Nepalese Rupee" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
  { code: "OMR", name: "Omani Rial" },
  { code: "PAB", name: "Panamanian Balboa" },
  { code: "PEN", name: "Peruvian Sol" },
  { code: "PGK", name: "Papua New Guinean Kina" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱" },
  { code: "PKR", name: "Pakistani Rupee" },
  { code: "PLN", name: "Polish Zloty" },
  { code: "PYG", name: "Paraguayan Guarani" },
  { code: "QAR", name: "Qatari Riyal" },
  { code: "RON", name: "Romanian Leu" },
  { code: "RSD", name: "Serbian Dinar" },
  { code: "RUB", name: "Russian Ruble" },
  { code: "RWF", name: "Rwandan Franc" },
  { code: "SAR", name: "Saudi Riyal" },
  { code: "SBD", name: "Solomon Islands Dollar" },
  { code: "SCR", name: "Seychellois Rupee" },
  { code: "SDG", name: "Sudanese Pound" },
  { code: "SEK", name: "Swedish Krona" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "SHP", name: "Saint Helena Pound" },
  { code: "SLE", name: "Sierra Leonean Leone" },
  { code: "SOS", name: "Somali Shilling" },
  { code: "SRD", name: "Surinamese Dollar" },
  { code: "SSP", name: "South Sudanese Pound" },
  { code: "STN", name: "Sao Tome and Principe Dobra" },
  { code: "SYP", name: "Syrian Pound" },
  { code: "SZL", name: "Swazi Lilangeni" },
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "TJS", name: "Tajikistani Somoni" },
  { code: "TMT", name: "Turkmenistani Manat" },
  { code: "TND", name: "Tunisian Dinar" },
  { code: "TOP", name: "Tongan Pa'anga" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "TTD", name: "Trinidad & Tobago Dollar" },
  { code: "TWD", name: "New Taiwan Dollar", symbol: "NT$" },
  { code: "TZS", name: "Tanzanian Shilling" },
  { code: "UAH", name: "Ukrainian Hryvnia" },
  { code: "UGX", name: "Ugandan Shilling" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "UYU", name: "Uruguayan Peso" },
  { code: "UZS", name: "Uzbekistani Som" },
  { code: "VES", name: "Venezuelan Bolivar" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫" },
  { code: "VUV", name: "Vanuatu Vatu" },
  { code: "WST", name: "Samoan Tala" },
  { code: "XAF", name: "Central African CFA Franc" },
  { code: "XCD", name: "East Caribbean Dollar" },
  { code: "XOF", name: "West African CFA Franc" },
  { code: "XPF", name: "CFP Franc" },
  { code: "YER", name: "Yemeni Rial" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "ZMW", name: "Zambian Kwacha" },
  { code: "ZWG", name: "Zimbabwe Gold" },
];

const BY_CODE = new Map(CURRENCIES.map((c) => [c.code, c]));

/**
 * Destination country to the currency a buyer there budgets in.
 *
 * Keys are the country names offered by the inquiry form, so a lookup is a
 * plain map read with no normalisation.
 */
export const COUNTRY_CURRENCY: Record<string, string> = {
  Afghanistan: "AFN",
  Albania: "ALL",
  Algeria: "DZD",
  "American Samoa": "USD",
  Andorra: "EUR",
  Angola: "AOA",
  Anguilla: "XCD",
  Antarctica: "USD",
  "Antigua and Barbuda": "XCD",
  Argentina: "ARS",
  Armenia: "AMD",
  Aruba: "AWG",
  Australia: "AUD",
  Austria: "EUR",
  Azerbaijan: "AZN",
  Bahamas: "BSD",
  Bahrain: "BHD",
  Bangladesh: "BDT",
  Barbados: "BBD",
  Belarus: "BYN",
  Belgium: "EUR",
  Belize: "BZD",
  Benin: "XOF",
  Bermuda: "BMD",
  Bhutan: "BTN",
  Bolivia: "BOB",
  "Bosnia and Herzegovina": "BAM",
  Botswana: "BWP",
  Brazil: "BRL",
  "British Indian Ocean Territory": "USD",
  "British Virgin Islands": "USD",
  Brunei: "BND",
  Bulgaria: "BGN",
  "Burkina Faso": "XOF",
  Burundi: "BIF",
  Cambodia: "KHR",
  Cameroon: "XAF",
  Canada: "CAD",
  "Cape Verde": "CVE",
  "Cayman Islands": "KYD",
  "Central African Republic": "XAF",
  Chad: "XAF",
  Chile: "CLP",
  China: "CNY",
  "Christmas Island": "AUD",
  "Cocos (Keeling) Islands": "AUD",
  Colombia: "COP",
  Comoros: "KMF",
  "Cook Islands": "NZD",
  "Costa Rica": "CRC",
  Croatia: "EUR",
  Cuba: "CUP",
  Curacao: "ANG",
  Cyprus: "EUR",
  "Czech Republic": "CZK",
  "Democratic Republic of the Congo": "CDF",
  Denmark: "DKK",
  Djibouti: "DJF",
  Dominica: "XCD",
  "Dominican Republic": "DOP",
  "East Timor (Timor-Leste)": "USD",
  Ecuador: "USD",
  Egypt: "EGP",
  "El Salvador": "USD",
  "Equatorial Guinea": "XAF",
  Eritrea: "ERN",
  Estonia: "EUR",
  "Eswatini (Swaziland)": "SZL",
  Ethiopia: "ETB",
  "Falkland Islands": "FKP",
  "Faroe Islands": "DKK",
  Fiji: "FJD",
  Finland: "EUR",
  France: "EUR",
  "French Polynesia": "XPF",
  Gabon: "XAF",
  Gambia: "GMD",
  Georgia: "GEL",
  Germany: "EUR",
  Ghana: "GHS",
  Gibraltar: "GIP",
  Greece: "EUR",
  Greenland: "DKK",
  Grenada: "XCD",
  Guam: "USD",
  Guatemala: "GTQ",
  Guernsey: "GBP",
  Guinea: "GNF",
  "Guinea-Bissau": "XOF",
  Guyana: "GYD",
  Haiti: "HTG",
  Honduras: "HNL",
  "Hong Kong": "HKD",
  Hungary: "HUF",
  Iceland: "ISK",
  India: "INR",
  Indonesia: "IDR",
  Iran: "IRR",
  Iraq: "IQD",
  Ireland: "EUR",
  "Isle of Man": "GBP",
  Israel: "ILS",
  Italy: "EUR",
  "Ivory Coast": "XOF",
  Jamaica: "JMD",
  Japan: "JPY",
  Jersey: "GBP",
  Jordan: "JOD",
  Kazakhstan: "KZT",
  Kenya: "KES",
  Kiribati: "AUD",
  Kosovo: "EUR",
  Kuwait: "KWD",
  Kyrgyzstan: "KGS",
  Laos: "LAK",
  Latvia: "EUR",
  Lebanon: "LBP",
  Lesotho: "LSL",
  Liberia: "LRD",
  Libya: "LYD",
  Liechtenstein: "CHF",
  Lithuania: "EUR",
  Luxembourg: "EUR",
  Macau: "MOP",
  Macedonia: "MKD",
  Madagascar: "MGA",
  Malawi: "MWK",
  Malaysia: "MYR",
  Maldives: "MVR",
  Mali: "XOF",
  Malta: "EUR",
  "Marshall Islands": "USD",
  Mauritania: "MRU",
  Mauritius: "MUR",
  Mayotte: "EUR",
  Mexico: "MXN",
  Micronesia: "USD",
  Moldova: "MDL",
  Monaco: "EUR",
  Mongolia: "MNT",
  Montenegro: "EUR",
  Montserrat: "XCD",
  Morocco: "MAD",
  Mozambique: "MZN",
  Myanmar: "MMK",
  Namibia: "NAD",
  Nauru: "AUD",
  Nepal: "NPR",
  Netherlands: "EUR",
  "Netherlands Antilles": "ANG",
  "New Caledonia": "XPF",
  "New Zealand": "NZD",
  Nicaragua: "NIO",
  Niger: "XOF",
  Nigeria: "NGN",
  Niue: "NZD",
  "Norfolk Island": "AUD",
  "North Korea": "KPW",
  "Northern Ireland": "GBP",
  "Northern Mariana Islands": "USD",
  Norway: "NOK",
  Oman: "OMR",
  Pakistan: "PKR",
  Palau: "USD",
  Palestine: "ILS",
  Panama: "PAB",
  "Papua New Guinea": "PGK",
  Paraguay: "PYG",
  Peru: "PEN",
  Philippines: "PHP",
  "Pitcairn Islands": "NZD",
  Poland: "PLN",
  Portugal: "EUR",
  "Puerto Rico": "USD",
  Qatar: "QAR",
  "Republic of the Congo": "XAF",
  Reunion: "EUR",
  Romania: "RON",
  Russia: "RUB",
  Rwanda: "RWF",
  "Saint Barthelemy": "EUR",
  "Saint Helena": "SHP",
  "Saint Kitts and Nevis": "XCD",
  "Saint Lucia": "XCD",
  "Saint Martin": "EUR",
  "Saint Pierre and Miquelon": "EUR",
  "Saint Vincent and the Grenadines": "XCD",
  Samoa: "WST",
  "San Marino": "EUR",
  "Sao Tome and Principe": "STN",
  "Saudi Arabia": "SAR",
  Senegal: "XOF",
  Serbia: "RSD",
  Seychelles: "SCR",
  "Sierra Leone": "SLE",
  Singapore: "SGD",
  "Sint Maarten": "ANG",
  Slovakia: "EUR",
  Slovenia: "EUR",
  "Solomon Islands": "SBD",
  Somalia: "SOS",
  "South Africa": "ZAR",
  "South Korea": "KRW",
  "South Sudan": "SSP",
  Spain: "EUR",
  "Sri Lanka": "LKR",
  Sudan: "SDG",
  Suriname: "SRD",
  "Svalbard and Jan Mayen": "NOK",
  Sweden: "SEK",
  Switzerland: "CHF",
  Syria: "SYP",
  Taiwan: "TWD",
  Tajikistan: "TJS",
  Tanzania: "TZS",
  Thailand: "THB",
  Togo: "XOF",
  Tokelau: "NZD",
  Tonga: "TOP",
  "Trinidad and Tobago": "TTD",
  Tunisia: "TND",
  Turkey: "TRY",
  Turkmenistan: "TMT",
  "Turks and Caicos Islands": "USD",
  Tuvalu: "AUD",
  "U.S. Virgin Islands": "USD",
  Uganda: "UGX",
  Ukraine: "UAH",
  "United Arab Emirates": "AED",
  "United Kingdom": "GBP",
  "United States": "USD",
  Uruguay: "UYU",
  Uzbekistan: "UZS",
  Vanuatu: "VUV",
  Vatican: "EUR",
  Venezuela: "VES",
  Vietnam: "VND",
  "Wallis and Futuna": "XPF",
  "Western Sahara": "MAD",
  Yemen: "YER",
  Zambia: "ZMW",
  Zimbabwe: "ZWG",
};

/** The currency to default to for a destination, or "" if we don't know it. */
export function currencyForCountry(country?: string): string {
  if (!country) return "";
  return COUNTRY_CURRENCY[country.trim()] || "";
}

/** Look up one currency by code. */
export function getCurrency(code?: string): Currency | undefined {
  if (!code) return undefined;
  return BY_CODE.get(code.trim().toUpperCase());
}

/**
 * Dropdown label. Carries the code, the name and the symbol so a customer can
 * type any of the three and still find their currency.
 */
export function currencyLabel(code: string): string {
  const c = getCurrency(code);
  if (!c) return code;
  return c.symbol
    ? `${c.code} — ${c.name} (${c.symbol})`
    : `${c.code} — ${c.name}`;
}

/**
 * The currencies our buyers actually use, floated to the top of the picker so
 * the common case is one click rather than a scroll through 160 entries. The
 * destination's own currency goes above even these.
 */
const MAJORS = ["GBP", "EUR", "USD", "AED", "AUD", "NZD", "JPY", "ZAR"];

/** Options for the budget currency picker: destination first, majors, then A–Z. */
export function currencyOptions(
  preferred?: string,
): { label: string; value: string }[] {
  const top: string[] = [];
  for (const code of [preferred, ...MAJORS]) {
    if (code && BY_CODE.has(code) && !top.includes(code)) top.push(code);
  }
  const rest = CURRENCIES.map((c) => c.code)
    .filter((code) => !top.includes(code))
    .sort();
  return [...top, ...rest].map((code) => ({
    label: currencyLabel(code),
    value: code,
  }));
}

/**
 * Render a budget the way a sales agent reads it: "£45,000", "AED 250,000".
 *
 * Only currencies whose symbol is unambiguous on its own get the symbol
 * treatment; everything else keeps its code, because a bare "$" or "Rs" in a
 * lead is a question rather than an answer.
 */
export function formatBudget(amount?: number | null, code?: string): string {
  if (amount === null || amount === undefined || !Number.isFinite(amount))
    return "";
  const rounded = Math.round(amount).toLocaleString("en-US");
  const c = getCurrency(code);
  if (!c) return code ? `${code} ${rounded}` : rounded;
  return c.symbol ? `${c.symbol}${rounded}` : `${c.code} ${rounded}`;
}

/**
 * What a keystroke in the budget field is worth keeping.
 *
 * Digits only: a budget is a single whole number, and letting through commas,
 * spaces or a stray "k" would mean guessing later what the customer meant. The
 * cap is twelve digits, which is past the point of a real car budget in even
 * the weakest currency on the list and short of anything that loses precision.
 */
export function budgetDigits(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 12);
}

/**
 * The same digits, grouped for display. Kept apart from the stored value so
 * state holds a clean number string and only the field shows separators.
 */
export function budgetDisplayValue(digits: string): string {
  return digits ? Number(digits).toLocaleString("en-US") : "";
}
