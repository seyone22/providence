import * as React from 'react';
import { Text, Section } from '@react-email/components';
import EmailLayout from './layout';

interface AccountAlertEmailProps {
    type: 'ban' | 'unban' | 'warning';
    reason?: string;
}

export const AccountAlertEmail = ({ type, reason }: AccountAlertEmailProps) => {
    const isBan = type === 'ban';
    const heading = isBan ? 'Account Suspended' : 'Account Restored';

    return (
        <EmailLayout preview={heading} heading={heading}>
            <Text style={textStyle}>
                {isBan
                    ? "Your account has been suspended due to a violation of our community guidelines."
                    : "Your account suspension has been lifted. You may now log in again."}
            </Text>

            {reason && isBan && (
                <Section style={warningBoxStyle}>
                    <Text style={warningTextStyle}>
                        Reason provided: "{reason}"
                    </Text>
                </Section>
            )}

            <Text style={subTextStyle}>
                If you believe this is an error, please reply directly to this email.
            </Text>
        </EmailLayout>
    );
};

export default AccountAlertEmail;

// --- STYLES ---

const textStyle = {
    fontSize: '16px',
    lineHeight: '24px',
    color: '#52525b',
    marginBottom: '16px',
};

const warningBoxStyle = {
    backgroundColor: '#fef2f2',
    border: '1px solid #fee2e2',
    padding: '12px',
    borderRadius: '4px',
    marginTop: '16px',
    marginBottom: '16px',
};

const warningTextStyle = {
    color: '#991b1b',
    fontSize: '14px',
    fontWeight: '500',
    margin: '0',
};

const subTextStyle = {
    fontSize: '14px',
    color: '#71717a',
    marginTop: '20px',
};