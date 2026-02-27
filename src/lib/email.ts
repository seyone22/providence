import { Resend } from 'resend';
import { ReactElement } from 'react';
import AccountAlertEmail from "@/emails/account-alerts";
import TicketConfirmedEmail from "@/emails/ticket-confirmed";
import AuthActionEmail from "@/emails/auth-action";


const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = "Anime.lk Events <events@partnerprogram.anime.lk>"; // Ensure you have verified this domain on Resend

// Generic Send Wrapper
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
        // Don't crash the app if email fails, just log it
    }
}

// --- EXPORTED ACTIONS ---

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

    /**
     * Send Ticket Confirmation
     */
    sendTicketReceipt: async (to: string, data: { userName: string, eventTitle: string, ticketId: string, eventDate: string }) => {
        await sendEmail({
            to,
            subject: `You're going to ${data.eventTitle}!`,
            component: TicketConfirmedEmail(data)
        });
    },

    /**
     * Send Ban/Unban notices
     */
    sendAccountStatus: async (to: string, type: 'ban' | 'unban', reason?: string) => {
        await sendEmail({
            to,
            subject: type === 'ban' ? 'Important: Account Suspended' : 'Account Access Restored',
            component: AccountAlertEmail({ type, reason })
        });
    }
};