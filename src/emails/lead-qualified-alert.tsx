// @/emails/lead-qualified-alert.tsx
import * as React from 'react';
import { Text, Link, Section } from '@react-email/components';
import EmailLayout from './layout';

interface LeadQualifiedEmailProps {
    data: {
        name: string;
        make: string;
        vehicle_model: string;
        email: string;
        phone: string;
        countryCode: string;
    };
    requestId: string;
}

export const LeadQualifiedAlertEmail = ({ data, requestId }: LeadQualifiedEmailProps) => {
    const adminUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/admin`;

    return (
        <EmailLayout preview={`Lead Qualified: ${data.name} is interested in ${data.make} ${data.vehicle_model}`} heading="Lead Qualified ✅">
            <Text style={textStyle}>
                Great news! A client has actively engaged with their assigned agent (via Email or WhatsApp) directly from the tracking dashboard. Their lead status has automatically been updated to <strong>Qualified</strong>.
            </Text>

            <Section style={containerStyle}>
                <Text style={labelStyle}>Client Details</Text>
                <Text style={valueStyle}>{data.name}</Text>
                <Text style={valueStyle}>{data.email}</Text>
                <Text style={valueStyle}>{data.countryCode} {data.phone}</Text>

                <div style={{ margin: '20px 0', borderBottom: '1px solid #e4e4e7' }} />

                <Text style={labelStyle}>Vehicle of Interest</Text>
                <Text style={valueStyle}>{data.make} {data.vehicle_model}</Text>
            </Section>

            <Section style={{ textAlign: 'center', marginTop: '32px' }}>
                <Link href={adminUrl} style={buttonStyle}>
                    Open Command Center
                </Link>
            </Section>
        </EmailLayout>
    );
};

export default LeadQualifiedAlertEmail;

// --- STYLES ---
const textStyle = { fontSize: '16px', lineHeight: '24px', color: '#52525b', marginBottom: '16px' };
const containerStyle = { backgroundColor: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '8px', padding: '20px', margin: '24px 0' };
const labelStyle = { fontSize: '12px', fontWeight: 'bold', color: '#a1a1aa', textTransform: 'uppercase' as const, letterSpacing: '0.05em', margin: '0 0 4px 0' };
const valueStyle = { fontSize: '14px', color: '#18181b', margin: '0 0 4px 0' };
const buttonStyle = { backgroundColor: '#000000', color: '#ffffff', padding: '14px 28px', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block' };