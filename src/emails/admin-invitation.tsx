import * as React from 'react';
import { Text, Link, Section } from '@react-email/components';
import EmailLayout from './layout';

interface AdminInvitationEmailProps {
    name: string;
    role: string;
    email: string;
    password?: string; // Optional if you decide to send the password or just a reset link
}

export const AdminInvitationEmail = ({ name, role, email, password }: AdminInvitationEmailProps) => {
    const adminUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/admin`;

    return (
        <EmailLayout preview="You've been added to Providence Auto" heading="Welcome to the Team!">
            <Text style={textStyle}>
                Hi {name}, you have been added as an **{role}** on the Providence Auto platform.
            </Text>

            <Section style={containerStyle}>
                <Text style={labelStyle}>Your Login Credentials</Text>
                <Text style={valueStyle}><strong>Email:</strong> {email}</Text>
                {password && (
                    <Text style={valueStyle}><strong>Temporary Password:</strong> <code style={codeStyle}>{password}</code></Text>
                )}

                <div style={{ margin: '20px 0', borderBottom: '1px solid #e4e4e7' }} />

                <Text style={{ ...valueStyle, fontStyle: 'italic', color: '#71717a' }}>
                    For security reasons, please log in and change your password immediately.
                </Text>
            </Section>

            <Section style={{ textAlign: 'center', marginTop: '32px' }}>
                <Link href={adminUrl} style={buttonStyle}>
                    Log In to Command Center
                </Link>
            </Section>
        </EmailLayout>
    );
};

export default AdminInvitationEmail;

// --- STYLES ---
const textStyle = { fontSize: '16px', lineHeight: '24px', color: '#52525b', marginBottom: '16px' };
const containerStyle = { backgroundColor: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '8px', padding: '20px', margin: '24px 0' };
const labelStyle = { fontSize: '12px', fontWeight: 'bold', color: '#a1a1aa', textTransform: 'uppercase' as const, letterSpacing: '0.05em', margin: '0 0 4px 0' };
const valueStyle = { fontSize: '14px', color: '#18181b', margin: '0 0 4px 0' };
const buttonStyle = { backgroundColor: '#000000', color: '#ffffff', padding: '14px 28px', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block' };
const codeStyle = { backgroundColor: '#f1f5f9', padding: '3px 6px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '14px', color: '#dc2626' };