import * as React from 'react';
import { Text, Link, Section, Row, Column } from '@react-email/components';
import EmailLayout from './layout';

interface CustomerConfirmationEmailProps {
    userName: string;
    make: string;
    model: string;
    requestId: string;
}

export const CustomerConfirmationEmail = ({ userName, make, model, requestId }: CustomerConfirmationEmailProps) => {
    const trackingUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/track/${requestId}`;

    return (
        <EmailLayout preview={`Your request for the ${make} ${model} has been received.`} heading="Inquiry Received">
            <Text style={textStyle}>
                Hi {userName},
            </Text>
            <Text style={textStyle}>
                We have successfully received your sourcing request for the <strong>{make} {model}</strong>. Our global concierge team is currently reviewing your specifications and will begin scanning our network for the best options.
            </Text>

            <Section style={containerStyle}>
                <Row>
                    <Column>
                        <Text style={labelStyle}>Requested Vehicle</Text>
                        <Text style={valueStyle}>{make} {model}</Text>
                    </Column>
                    <Column align="right" style={{ verticalAlign: 'top' }}>
                        <div style={idBoxStyle}>
                            <Text style={idLabelStyle}>Request ID</Text>
                            <Text style={idValueStyle}>{requestId.substring(0, 6).toUpperCase()}</Text>
                        </div>
                    </Column>
                </Row>
            </Section>

            <Section style={{ textAlign: 'center', marginTop: '32px' }}>
                <Link href={trackingUrl} style={buttonStyle}>
                    View Live Tracker
                </Link>
                <Text style={{ ...labelStyle, marginTop: '16px' }}>
                    You can use this link at any time to check the live status of your vehicle.
                </Text>
            </Section>
        </EmailLayout>
    );
};

export default CustomerConfirmationEmail;

// --- STYLES ---
const textStyle = { fontSize: '16px', lineHeight: '24px', color: '#52525b', marginBottom: '16px' };
const containerStyle = { backgroundColor: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '8px', padding: '20px', margin: '24px 0' };
const labelStyle = { fontSize: '12px', fontWeight: 'bold', color: '#a1a1aa', textTransform: 'uppercase' as const, letterSpacing: '0.05em', margin: '0 0 4px 0' };
const valueStyle = { fontSize: '16px', fontWeight: '600', color: '#18181b', margin: '0' };
const idBoxStyle = { backgroundColor: '#ffffff', border: '1px solid #e4e4e7', padding: '8px 12px', borderRadius: '6px', textAlign: 'center' as const, minWidth: '100px' };
const idLabelStyle = { fontSize: '10px', color: '#a1a1aa', margin: '0 0 4px 0', textTransform: 'uppercase' as const };
const idValueStyle = { fontSize: '16px', fontFamily: 'monospace', fontWeight: 'bold', margin: '0', letterSpacing: '1px' };
const buttonStyle = { backgroundColor: '#000000', color: '#ffffff', padding: '14px 28px', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block' };