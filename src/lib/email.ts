import {Resend} from 'resend';
import {ReactElement} from 'react';
import CustomerConfirmationEmail from "@/emails/customer-confirmation";
import StaffAlertEmail from "@/emails/staff-alert";
import AuthActionEmail from "@/emails/auth-action";
import AdminInvitationEmail from "@/emails/admin-invitation";
import LeadQualifiedAlertEmail from "@/emails/lead-qualified-alert";

const resend = new Resend(process.env.RESEND_API_KEY);

// IMPORTANT: Ensure this domain is verified in your Resend dashboard
const FROM_EMAIL = "Providence Auto <hello@inquiry.providenceauto.co.uk>";

async function sendEmail({to, subject, component}: { to: string, subject: string, component: ReactElement }) {
    if (!process.env.RESEND_API_KEY) {
        console.warn(`[EMAIL MOCK] To: ${to} | Subject: ${subject}`);
        return;
    }

    try {
        const {data, error} = await resend.emails.send({
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
            component: AuthActionEmail({type, url}) // Using the component as a function or JSX
        });
    },

    sendCustomerConfirmation: async (to: string, data: {
        userName: string,
        make: string,
        model: string,
        requestId: string
    }) => {
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
            component: StaffAlertEmail({data, requestId})
        });
    },

    /**
     * Send Admin/Staff Welcome Invitation
     */
    sendAdminInvitation: async (to: string, data: { name: string; role: string; password?: string }) => {
        await sendEmail({
            to,
            subject: "Welcome to Providence Auto - Admin Access",
            component: AdminInvitationEmail(
                {
                    email: to,
                    name: data.name,
                    role: data.role,
                    password: data.password
                }
            )
        });
    },

    sendLeadQualifiedAlert: async (data: any, requestId: string) => {
        const targetEmail = "info@providenceauto.uk.com"; // Hardcoded as requested
        await sendEmail({
            to: targetEmail,
            subject: `✅ Lead Qualified: ${data.name} - ${data.make} ${data.vehicle_model}`,
            component: LeadQualifiedAlertEmail({ data, requestId })
        });
    }
};