import * as React from 'react';
import { Text, Link, Section } from '@react-email/components';
import EmailLayout from './layout';

interface AuthActionEmailProps {
    type: 'verification' | 'reset';
    url: string;
}

export const AuthActionEmail = ({ type, url }: AuthActionEmailProps) => {
    const isReset = type === 'reset';
    const title = isReset ? 'Reset Your Password' : 'Verify Your Email';
    const actionText = isReset ? 'Reset Password' : 'Verify Account';
    const content = isReset
        ? "We received a request to reset your password. If you didn't ask for this, you can ignore this email."
        : "Welcome to Anime.lk! Please verify your email address to activate your account.";

    return (
        <EmailLayout preview={title} heading={title}>
            <Text style={textStyle}>
                {content}
            </Text>

            <Section style={btnContainerStyle}>
                <Link href={url} style={buttonStyle}>
                    {actionText}
                </Link>
            </Section>

            <Text style={subTextStyle}>
                Or copy this link: <Link href={url} style={linkStyle}>{url}</Link>
            </Text>
        </EmailLayout>
    );
};

export default AuthActionEmail;

// --- STYLES ---

const textStyle = {
    fontSize: '16px',
    lineHeight: '24px',
    color: '#52525b',
    marginBottom: '24px',
};

const btnContainerStyle = {
    textAlign: 'center' as const,
    margin: '24px 0',
};

const buttonStyle = {
    backgroundColor: '#18181b',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    textDecoration: 'none',
    display: 'inline-block',
};

const subTextStyle = {
    fontSize: '14px',
    color: '#71717a',
    marginTop: '16px',
};

const linkStyle = {
    color: '#2563eb',
    textDecoration: 'underline',
};