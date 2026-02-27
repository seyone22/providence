import * as React from 'react';
import { Text, Link, Section } from '@react-email/components';
import EmailLayout from './layout';

interface StaffAlertEmailProps {
    data: any;
    requestId: string;
}

export const StaffAlertEmail = ({ data, requestId }: StaffAlertEmailProps) => {
    const adminUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/admin`;

    return (
        <EmailLayout preview={`New Lead: ${data.make} ${data.vehicle_model} for ${data.name}`} heading="New Vehicle Request">
            <Text style={textStyle}>
                A new sourcing request has been submitted on Providence Auto.
            </Text>

            <Section style={containerStyle}>
                <Text style={labelStyle}>Client Details</Text>
                <Text style={valueStyle}>{data.name}</Text>
                <Text style={valueStyle}>{data.email} | {data.countryCode} {data.phone}</Text>
                <Text style={valueStyle}>Importing to: {data.countryOfImport}</Text>

                <div style={{ margin: '20px 0', borderBottom: '1px solid #e4e4e7' }} />

                <Text style={labelStyle}>Vehicle Specs</Text>
                <Text style={valueStyle}>{data.condition} {data.make} {data.vehicle_model}</Text>
                {data.condition === 'Used' && (
                    <Text style={valueStyle}>Years: {data.yearFrom} - {data.yearTo} | Max Mileage: {data.mileage}</Text>
                )}
                {data.specs && (
                    <Text style={{ ...valueStyle, marginTop: '8px', fontSize: '14px', fontStyle: 'italic', color: '#71717a' }}>
                        "{data.specs}"
                    </Text>
                )}
            </Section>

            <Section style={{ textAlign: 'center', marginTop: '32px' }}>
                <Link href={adminUrl} style={buttonStyle}>
                    Open Command Center
                </Link>
            </Section>
        </EmailLayout>
    );
};

export default StaffAlertEmail;

// --- STYLES ---
const textStyle = { fontSize: '16px', lineHeight: '24px', color: '#52525b', marginBottom: '16px' };
const containerStyle = { backgroundColor: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '8px', padding: '20px', margin: '24px 0' };
const labelStyle = { fontSize: '12px', fontWeight: 'bold', color: '#a1a1aa', textTransform: 'uppercase' as const, letterSpacing: '0.05em', margin: '0 0 4px 0' };
const valueStyle = { fontSize: '14px', color: '#18181b', margin: '0 0 4px 0' };
const buttonStyle = { backgroundColor: '#000000', color: '#ffffff', padding: '14px 28px', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block' };