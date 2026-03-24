import * as React from 'react';
import { Html, Head, Body, Container, Heading, Hr, Text, Preview } from '@react-email/components';

interface EmailLayoutProps {
    preview: string;
    heading?: string;
    children: React.ReactNode;
}

export const EmailLayout = ({ preview, heading, children }: EmailLayoutProps) => {
    return (
        <Html>
            <Head />
            <Preview>{preview}</Preview>
            <Body style={mainStyle}>
                <Container style={containerStyle}>
                    <Heading style={brandStyle}>
                        Providence <span style={{ color: '#0ea5e9' }}>Auto</span>
                    </Heading>

                    {heading && (
                        <Heading as="h2" style={subHeadingStyle}>
                            {heading}
                        </Heading>
                    )}

                    {children}

                    <Hr style={hrStyle} />
                    <Text style={footerTextStyle}>
                        © {new Date().getFullYear()} Providence Auto. All rights reserved.<br />
                        This is an automated system message. Please do not reply directly.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default EmailLayout;

// --- STYLES ---

const mainStyle = {
    backgroundColor: '#f8fafc', // Light slate-white background
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
    padding: '20px',
};

const containerStyle = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '32px',
    borderRadius: '12px', // Slightly rounder, modern edges
    border: '1px solid #e2e8f0',
    maxWidth: '600px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)', // Subtle drop-shadow for premium feel
};

const brandStyle = {
    fontSize: '24px',
    fontWeight: '800', // Bolder profile
    color: '#0f172a', // Deep navy/slate for typography contrast
    marginBottom: '24px',
    marginTop: '0',
    letterSpacing: '-0.025em',
};

const subHeadingStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '16px',
    marginTop: '0',
};

const hrStyle = {
    borderColor: '#e2e8f0',
    margin: '32px 0 24px 0',
    borderTop: '1px solid #e2e8f0',
};

const footerTextStyle = {
    fontSize: '12px',
    color: '#64748b', // Slate muted text
    lineHeight: '1.6',
};