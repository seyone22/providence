import {Resend} from 'resend';
import {ReactElement} from 'react';
import CustomerConfirmationEmail from "@/emails/customer-confirmation";
import StaffAlertEmail from "@/emails/staff-alert";
import AuthActionEmail from "@/emails/auth-action";
import AdminInvitationEmail from "@/emails/admin-invitation";
import LeadQualifiedAlertEmail from "@/emails/lead-qualified-alert";
import ContactScheduledEmail from "@/emails/contact-scheduled";

const resend = new Resend(process.env.RESEND_API_KEY);

// IMPORTANT: Ensure this domain is verified in your Resend dashboard
const FROM_EMAIL = "Providence Auto <hello@inquiry.providenceauto.co.uk>";
const FROM_DOMAIN = "hello@inquiry.providenceauto.co.uk";

/** Build a "{Agent} via Providence Auto <verified-domain>" From header. */
function agentFrom(agentName?: string): string {
    if (!agentName) return FROM_EMAIL;
    // Strip characters that would break the display-name portion of the header.
    const safeName = agentName.replace(/[<>"\n\r]/g, "").trim();
    return `${safeName} via Providence Auto <${FROM_DOMAIN}>`;
}

async function sendEmail({to, subject, component, from, replyTo}: { to: string, subject: string, component: ReactElement, from?: string, replyTo?: string }) {
    if (!process.env.RESEND_API_KEY) {
        console.warn(`[EMAIL MOCK] To: ${to} | Subject: ${subject}`);
        return;
    }

    try {
        const {data, error} = await resend.emails.send({
            from: from || FROM_EMAIL,
            to,
            subject,
            react: component,
            ...(replyTo ? {replyTo} : {}),
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
        requestId: string,
        staffName: string,
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

    /**
     * Sent after the customer submits their contact preferences. Styled to
     * read as if it comes from the assigned sales agent (From + reply-to), and
     * includes an overview of how/when we'll reach out.
     */
    sendContactScheduledConfirmation: async (to: string, data: {
        userName: string,
        make: string,
        model: string,
        requestId: string,
        agent: { name: string; email: string; image: string },
        contactMethods: string[],
        contactDays: string[],
        contactTimeWindow: string,
        contactTimezoneLabel: string,
    }) => {
        await sendEmail({
            to,
            subject: `You're all set, ${data.userName.split(" ")[0]} — here's how we'll be in touch`,
            from: agentFrom(data.agent?.name),
            replyTo: data.agent?.email,
            component: ContactScheduledEmail(data),
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