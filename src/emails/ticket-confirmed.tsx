import * as React from 'react';
import { Text, Link, Section, Row, Column } from '@react-email/components';
import EmailLayout from './layout';

interface TicketConfirmedEmailProps {
    userName: string;
    eventTitle: string;
    ticketId: string;
    eventDate: string;
}

export const TicketConfirmedEmail = ({ userName, eventTitle, ticketId, eventDate }: TicketConfirmedEmailProps) => {
    return (
        <EmailLayout preview={`Your ticket for ${eventTitle}`} heading="Ticket Confirmed ✅">
            <Text style={textStyle}>
                Hi {userName}, you're going to <strong>{eventTitle}</strong>!
            </Text>

            <Section style={ticketContainerStyle}>
                <Row>
                    <Column>
                        <Text style={labelStyle}>Event</Text>
                        <Text style={valueStyle}>{eventTitle}</Text>

                        <Text style={{ ...labelStyle, marginTop: '12px' }}>Date</Text>
                        <Text style={valueStyle}>{eventDate}</Text>
                    </Column>
                    <Column align="right" style={{ verticalAlign: 'top' }}>
                        <div style={idBoxStyle}>
                            <Text style={idLabelStyle}>Ticket ID</Text>
                            <Text style={idValueStyle}>{ticketId.substring(0,6).toUpperCase()}</Text>
                        </div>
                    </Column>
                </Row>
            </Section>

            <Section style={{ textAlign: 'center', marginTop: '24px' }}>
                <Link
                    href={`${process.env.NEXT_PUBLIC_BASE_URL}/profile`}
                    style={ctaLinkStyle}
                >
                    View Full Ticket & QR Code &rarr;
                </Link>
            </Section>
        </EmailLayout>
    );
};

export default TicketConfirmedEmail;

// --- STYLES ---

const textStyle = {
    fontSize: '16px',
    lineHeight: '24px',
    color: '#52525b',
    marginBottom: '16px',
};

const ticketContainerStyle = {
    backgroundColor: '#fafafa',
    border: '1px solid #e4e4e7',
    borderRadius: '6px',
    padding: '16px',
    margin: '24px 0',
};

const labelStyle = {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#a1a1aa',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    margin: '0 0 4px 0',
};

const valueStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#18181b',
    margin: '0',
};

const idBoxStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e4e4e7',
    padding: '8px',
    borderRadius: '4px',
    textAlign: 'center' as const,
    minWidth: '100px',
};

const idLabelStyle = {
    fontSize: '10px',
    color: '#a1a1aa',
    margin: '0 0 4px 0',
    textTransform: 'uppercase' as const,
};

const idValueStyle = {
    fontSize: '18px',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    margin: '0',
    letterSpacing: '2px',
};

const ctaLinkStyle = {
    color: '#4f46e5',
    fontSize: '16px',
    fontWeight: '500',
    textDecoration: 'none',
};