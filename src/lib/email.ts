import { Resend } from 'resend';
import { ReactElement } from 'react';
import CustomerConfirmationEmail from "@/emails/customer-confirmation";
import StaffAlertEmail from "@/emails/staff-alert";
import AuthActionEmail from "@/emails/auth-action";

const resend = new Resend(process.env.RESEND_API_KEY);

// IMPORTANT: Ensure this domain is verified in your Resend dashboard
const FROM_EMAIL = "Providence Auto <hello@your-domain.com>";

async function sendEmail({ to, subject, component }: { to: string, subject: string, component: ReactElement }) {
    if (!process.env.RESEND_API_KEY) {
        console.warn(`[EMAIL MOCK] To: ${to} | Subject: ${subject}`);
        return;
    }

    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject,
            react: component,
        });

        if (error) {
            console.error("Resend Error:", error);
            throw new Error("Email delivery failed");
        }
        return data;
    } catch (e) {
        console.error("Email System Exception:", e);
    }
}

export const emailService = {
    /**
     * Send Verification or Password Reset emails
     */
    sendAuthEmail: async (to: string, type: 'verification' | 'reset', url: string) => {
        await sendEmail({
            to,
            subject: type === 'reset' ? 'Reset Password' : 'Verify Email',
            component: AuthActionEmail({ type, url }) // Using the component as a function or JSX
        });
    },

    sendCustomerConfirmation: async (to: string, data: { userName: string, make: string, model: string, requestId: string }) => {
        await sendEmail({
            to,
            subject: `Inquiry Received: ${data.make} ${data.model}`,
            component: CustomerConfirmationEmail(data)
        });
    },

    sendStaffAlert: async (to: string, data: any, requestId: string) => {
        await sendEmail({
            to,
            subject: `🚨 New Lead: ${data.make} ${data.vehicle_model} (${data.name})`,
            component: StaffAlertEmail({ data, requestId })
        });
    }
};