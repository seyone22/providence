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
                        Anime.lk
                    </Heading>

                    {heading && (
                        <Heading as="h2" style={subHeadingStyle}>
                            {heading}
                        </Heading>
                    )}

                    {children}

                    <Hr style={hrStyle} />
                    <Text style={footerTextStyle}>
                        © {new Date().getFullYear()} Anime.lk Community. <br />
                        This is an automated system message.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default EmailLayout;

// --- STYLES ---

const mainStyle = {
    backgroundColor: '#f4f4f5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
    padding: '20px',
};

const containerStyle = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '32px',
    borderRadius: '8px',
    border: '1px solid #e4e4e7',
    maxWidth: '600px',
};

const brandStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#18181b',
    marginBottom: '16px',
    marginTop: '0',
};

const subHeadingStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#27272a',
    marginBottom: '16px',
    marginTop: '0',
};

const hrStyle = {
    borderColor: '#e4e4e7',
    margin: '24px 0',
    borderTop: '1px solid #e4e4e7', // Hr needs explicit border style in some clients
};

const footerTextStyle = {
    fontSize: '12px',
    color: '#71717a',
    lineHeight: '1.5',
};