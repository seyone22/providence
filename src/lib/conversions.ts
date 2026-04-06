import crypto from 'crypto';

// Normalizes and hashes PII data per Meta/Google guidelines
export function hashData(data: string): string {
    if (!data) return '';
    const normalized = data.trim().toLowerCase();
    return crypto.createHash('sha256').update(normalized).digest('hex');
}

export function hashPhone(phone: string): string {
    if (!phone) return '';
    const normalized = phone.replace(/\D/g, ''); // Strip non-digits
    return crypto.createHash('sha256').update(normalized).digest('hex');
}

export async function sendMetaConversion(lead: any, eventName: string = 'QualifiedLead') {
    const PIXEL_ID = process.env.META_PIXEL_ID;
    const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

    if (!PIXEL_ID || !ACCESS_TOKEN) return;

    const payload = {
        data: [
            {
                event_name: eventName,
                event_time: Math.floor(Date.now() / 1000), // Unix timestamp
                action_source: "system_generated",
                event_id: lead._id.toString(), // Deduplication ID
                user_data: {
                    em: [hashData(lead.email)],
                    ph: [hashPhone(`${lead.countryCode}${lead.phone}`)],
                    fbc: lead.fbc || undefined,
                    fbp: lead.fbp || undefined,
                },
                custom_data: {
                    lead_type: lead.condition // Example: "New" or "Used"
                }
            }
        ]
        // Add "test_event_code: 'YOUR_TEST_CODE'" here for debugging
    };

    try {
        await fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (error) {
        console.error('Meta CAPI Error:', error);
    }
}

export async function sendGoogleConversion(lead: any) {
    const CUSTOMER_ID = process.env.GOOGLE_ADS_CUSTOMER_ID;
    const DEV_TOKEN = process.env.GOOGLE_DEV_TOKEN;
    const OAUTH_TOKEN = process.env.GOOGLE_OAUTH_TOKEN; // Handled via OAuth strategy
    const CONVERSION_ACTION_ID = process.env.GOOGLE_CONVERSION_ACTION_ID;

    if (!CUSTOMER_ID || !DEV_TOKEN || !lead.gclid) return;

    const payload = {
        conversions: [
            {
                conversionAction: `customers/${CUSTOMER_ID}/conversionActions/${CONVERSION_ACTION_ID}`,
                gclid: lead.gclid,
                conversionDateTime: new Date().toISOString().replace('T', ' ').substring(0, 19) + '-00:00',
                userIdentifiers: [
                    { hashedEmail: hashData(lead.email) },
                    { hashedPhoneNumber: hashPhone(`${lead.countryCode}${lead.phone}`) }
                ]
            }
        ],
        partialFailure: true
    };

    try {
        await fetch(`https://googleads.googleapis.com/v17/customers/${CUSTOMER_ID}:uploadClickConversions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'developer-token': DEV_TOKEN,
                'Authorization': `Bearer ${OAUTH_TOKEN}`
            },
            body: JSON.stringify(payload)
        });
    } catch (error) {
        console.error('Google Ads API Error:', error);
    }
}