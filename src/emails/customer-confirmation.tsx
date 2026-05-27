import * as React from 'react';
import { Text, Link, Section, Row, Column, Img, Container, Hr } from '@react-email/components';
import EmailLayout from './layout';

interface CustomerConfirmationEmailProps {
    userName: string;
    make: string;
    model: string;
    requestId: string;
    staffName: string;
}

export const CustomerConfirmationEmail = ({ userName, make, model, requestId, staffName }: CustomerConfirmationEmailProps) => {
    // Tracking URL still uses the requestId, but the text is different
    const trackingUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/track/${requestId}`;

    return (
        <EmailLayout
            preview={`We've received your inquiry for the ${make} ${model}.`} // Updated preview
            heading="We've Received Your Inquiry!" // Updated heading to match image
        >
            <Container style={mainBodyStyle}>
                <Text style={textStyle}>
                    Hello {userName},
                </Text>
                <Text style={textStyle}>
                    Thank you for reaching out to Providence Auto.
                </Text>
                <Text style={textStyle}>
                    We've received your inquiry for the {make} {model} and wanted to let you know; it hasn't just gone into a queue. It's already been assigned to {staffName}, who'll be your dedicated point of contact from here.
                </Text>

                <Section style={mainSectionStyle}>
                    <Row>
                        <Column style={imageColumnStyle}>
                            {/* Placeholder image matching the car from the image */}
                            <Img
                                src="https://www.providenceauto.co.uk/email.png"
                                alt="Black Coupe Rear"
                                width="280"
                                height="180"
                                style={imageStyle}
                            />
                        </Column>
                        <Column style={textColumnStyle}>
                            <Text style={mainSectionHeadingStyle}>
                                Before {staffName} gets in touch, we just need one quick step from you:
                            </Text>
                            <Text style={mainSectionTextStyle}>
                                Tapping the button below confirms your interest and moves things forward on our end. Once authenticated, {staffName} will be in touch shortly with the details you need, pricing, availability, shipping timelines, and anything else on your mind.
                            </Text>
                        </Column>
                    </Row>
                </Section>

                <Section style={buttonContainerStyle}>
                    <Link href={trackingUrl} style={buttonStyle}>
                        Authenticate and Track My Inquiry
                    </Link>
                </Section>

                <Text style={textStyle}>
                    If you have any questions in the meantime, you're welcome to reply directly to this email.
                </Text>
                <Text style={textStyle}>
                    We look forward to working with you.
                </Text>
                <Text style={signatureStyle}>
                    Warm regards,<br />
                    The Providence Auto Team
                </Text>
            </Container>

            {/* Added entire footer section to match the detailed footer in the image */}
            <Section style={footerSectionStyle}>
                <Container>
                    <Text style={footerLinkTextStyle}>
                        <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/view/${requestId}`} style={footerLinkStyle}>View email in browser</Link>
                    </Text>
                    <Text style={footerLinkTextStyle}>
                        <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe`} style={footerLinkStyle}>Update your preferences or unsubscribe</Link>
                    </Text>
                    <Hr style={footerDividerStyle} />
                    <Text style={footerDetailTextStyle}>
                        468 Church Lane, Kingsbury; London, NW9 8UA
                    </Text>
                    <Text style={footerDetailTextStyle}>
                        Company Number: +44 208 004 3000
                    </Text>
                    <Text style={footerCopyrightTextStyle}>
                        © Providence Auto.
                    </Text>
                </Container>
            </Section>
        </EmailLayout>
    );
};

export default CustomerConfirmationEmail;

// --- STYLES ---

// Base text styles
const textStyle = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: '16px',
    lineHeight: '24px',
    color: '#111827', // Darker text color like in the image
    marginBottom: '16px',
    fontWeight: '400',
};

const mainBodyStyle = {
    padding: '40px 0',
};

// Styles for the black box section
const mainSectionStyle = {
    backgroundColor: '#000000',
    padding: '32px 24px',
    marginTop: '24px',
    marginBottom: '32px',
};

const imageColumnStyle = {
    verticalAlign: 'middle',
    width: '40%',
};

const textColumnStyle = {
    verticalAlign: 'middle',
    paddingLeft: '24px',
    width: '60%',
};

const imageStyle = {
    display: 'block',
    margin: '0 auto',
};

const mainSectionHeadingStyle = {
    ...textStyle,
    color: '#ffffff',
    fontSize: '22px',
    lineHeight: '28px',
    fontWeight: 'bold',
    marginBottom: '12px',
};

const mainSectionTextStyle = {
    ...textStyle,
    color: '#ffffff',
    fontSize: '14px',
    lineHeight: '20px',
    marginBottom: '0',
};

// Styles for the blue button
const buttonContainerStyle = {
    textAlign: 'center' as const,
    marginBottom: '32px',
};

const buttonStyle = {
    backgroundColor: '#709dcd', // Blue button color
    color: '#ffffff',
    padding: '12px 28px',
    borderRadius: '12px', // Rounded button
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    display: 'inline-block',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const signatureStyle = {
    ...textStyle,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: '24px',
};

// Styles for the detailed footer
const footerSectionStyle = {
    backgroundColor: '#f3f4f6', // Grey footer background
    padding: '40px 0',
    marginTop: '48px',
};

const footerDividerStyle = {
    borderColor: '#e5e7eb',
    borderStyle: 'solid',
    borderWidth: '1px 0 0',
    margin: '24px 0',
};

const footerLinkTextStyle = {
    ...textStyle,
    textAlign: 'center' as const,
    fontSize: '12px',
    lineHeight: '18px',
    marginBottom: '8px',
    color: '#6b7280',
};

const footerLinkStyle = {
    color: '#6b7280',
    textDecoration: 'underline',
};

const footerDetailTextStyle = {
    ...textStyle,
    textAlign: 'center' as const,
    fontSize: '12px',
    lineHeight: '18px',
    color: '#9ca3af', // Brighter grey
    marginBottom: '8px',
};

const footerCopyrightTextStyle = {
    ...textStyle,
    textAlign: 'center' as const,
    fontSize: '12px',
    lineHeight: '18px',
    color: '#9ca3af',
    marginBottom: '0',
};