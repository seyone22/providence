import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { GENERAL_WHATSAPP_NUMBER, whatsappLink } from "@/config/contact";
import { BlogSuggestionsSection, type EmailBlogPost } from "./blog-suggestions";
import { EmailAvatar, EmailBrandHeader } from "./brand";

interface ContactScheduledEmailProps {
  userName: string;
  make: string;
  model: string;
  requestId: string;
  agent: {
    name: string;
    email: string;
    image: string;
    whatsappNumber?: string;
  };
  contactMethods: string[];
  contactDays: string[];
  contactTimeWindow: string;
  contactTimezoneLabel: string;
  /** Guides picked for this lead's destination country. Optional — omit to hide. */
  suggestedPosts?: EmailBlogPost[];
  /** Where the car is going — used to frame the suggested reading. */
  destinationCountry?: string;
}

export const ContactScheduledEmail = ({
  userName,
  make,
  model,
  requestId,
  agent,
  contactMethods,
  contactDays,
  contactTimeWindow,
  contactTimezoneLabel,
  suggestedPosts = [],
  destinationCountry,
}: ContactScheduledEmailProps) => {
  const trackingUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/track/${requestId}`;
  const firstName = userName?.split(" ")[0] || "there";
  const daysLabel =
    Array.isArray(contactDays) && contactDays.length
      ? contactDays.join(", ")
      : "your preferred day";
  const methodsLabel =
    Array.isArray(contactMethods) && contactMethods.length
      ? contactMethods.join(" & ")
      : "—";

  // Route the chat to the rep's own WhatsApp when they have one on their
  // profile; otherwise fall back to the general enquiries line so the button
  // is never dropped.
  const hasAgentWhatsapp = Boolean(agent.whatsappNumber?.trim());
  const whatsappUrl = whatsappLink(
    hasAgentWhatsapp
      ? `Hi ${agent.name.split(" ")[0]}, I'm following up on my inquiry for the ${make} ${model}.`
      : `Hi Providence Auto, I'm following up on my inquiry for the ${make} ${model}.`,
    hasAgentWhatsapp
      ? (agent.whatsappNumber as string)
      : GENERAL_WHATSAPP_NUMBER,
  );
  const whatsappLabel = hasAgentWhatsapp
    ? "Talk to me on WhatsApp"
    : "Message us on WhatsApp";
  // Rep's personal Providence inbox — comes straight to them.
  const emailUrl = `mailto:${agent.email}?subject=${encodeURIComponent(`My ${make} ${model} inquiry`)}`;

  return (
    <Html>
      <Head />
      <Preview>{`${agent.name} will reach out via ${methodsLabel} — here's the plan for your ${make} ${model}.`}</Preview>
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          <EmailBrandHeader />

          {/* Agent header — their profile photo, or the Providence mark if
              they haven't uploaded one. */}
          <Section style={{ marginBottom: "8px" }}>
            <Row>
              <Column style={{ width: "64px", verticalAlign: "middle" }}>
                <EmailAvatar src={agent.image} alt={agent.name} size={56} />
              </Column>
              <Column style={{ verticalAlign: "middle", paddingLeft: "12px" }}>
                <Text style={agentNameStyle}>{agent.name}</Text>
                <Text style={agentRoleStyle}>
                  Your dedicated sourcing specialist
                </Text>
              </Column>
            </Row>
          </Section>

          <Text style={textStyle}>Hi {firstName},</Text>
          <Text style={textStyle}>
            Thanks for sharing your details — your inquiry for the{" "}
            <strong>
              {make} {model}
            </strong>{" "}
            is with me now, and I'll personally take care of it from here.
          </Text>
          <Text style={textStyle}>Here's how and when I'll be in touch:</Text>

          {/* Contact plan overview */}
          <Section style={planCardStyle}>
            <Row>
              <Column style={planLabelCol}>
                <Text style={planLabel}>How</Text>
              </Column>
              <Column>
                <Text style={planValue}>{methodsLabel}</Text>
              </Column>
            </Row>
            <Row>
              <Column style={planLabelCol}>
                <Text style={planLabel}>When</Text>
              </Column>
              <Column>
                <Text style={planValue}>
                  {contactTimeWindow} · {daysLabel}
                </Text>
              </Column>
            </Row>
            <Row>
              <Column style={planLabelCol}>
                <Text style={planLabel}>Timezone</Text>
              </Column>
              <Column>
                <Text style={planValue}>{contactTimezoneLabel}</Text>
              </Column>
            </Row>
          </Section>

          <Text style={textStyle}>
            If anything changes or you'd prefer a different time, just reply to
            this email — it comes straight to me.
          </Text>

          <Section style={{ margin: "28px 0" }}>
            {whatsappUrl && (
              <Row>
                <Column style={btnCol}>
                  <Link href={whatsappUrl} style={whatsappButtonStyle}>
                    {whatsappLabel}
                  </Link>
                </Column>
              </Row>
            )}
            <Row>
              <Column style={btnCol}>
                <Link href={emailUrl} style={emailButtonStyle}>
                  Email me
                </Link>
              </Column>
            </Row>
            <Row>
              <Column style={btnCol}>
                <Link href={trackingUrl} style={buttonStyle}>
                  Track My Inquiry
                </Link>
              </Column>
            </Row>
          </Section>

          <Text style={signatureStyle}>
            Talk soon,
            <br />
            <strong>{agent.name}</strong>
            <br />
            Providence Auto
          </Text>

          <BlogSuggestionsSection
            posts={suggestedPosts}
            heading="While you wait — worth reading"
            intro={
              destinationCountry
                ? `Before we speak, these guides cover most of what comes up when importing into ${destinationCountry} — costs, taxes and the paperwork that actually matters.`
                : "Before we speak, these guides cover most of what comes up when importing — costs, taxes and the paperwork that actually matters."
            }
          />

          <Hr style={hrStyle} />
          <Text style={footerTextStyle}>
            General enquiries on WhatsApp:{" "}
            <Link
              href={whatsappLink(
                "Hi Providence Auto, I'd like to ask about importing a car.",
              )}
              style={footerLinkStyle}
            >
              {GENERAL_WHATSAPP_NUMBER}
            </Link>
            <br />© {new Date().getFullYear()} Providence Auto. 468 Church Lane,
            Kingsbury, London, NW9 8UA.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ContactScheduledEmail;

// --- STYLES ---
const mainStyle = {
  backgroundColor: "#f8fafc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  padding: "20px",
};
const containerStyle = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "32px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  maxWidth: "600px",
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
};
const agentNameStyle = {
  fontSize: "16px",
  fontWeight: "700",
  color: "#0f172a",
  margin: "0",
};
const agentRoleStyle = {
  fontSize: "13px",
  color: "#64748b",
  margin: "2px 0 0 0",
};
const textStyle = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#334155",
  marginBottom: "16px",
};
const planCardStyle = {
  backgroundColor: "#f0f9ff",
  border: "1px solid #bae6fd",
  borderRadius: "10px",
  padding: "16px 20px",
  margin: "8px 0 20px 0",
};
const planLabelCol = { width: "92px", verticalAlign: "top" as const };
const planLabel = {
  fontSize: "12px",
  fontWeight: "700",
  color: "#0369a1",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "6px 0",
};
const planValue = {
  fontSize: "15px",
  color: "#0f172a",
  fontWeight: "600",
  margin: "6px 0",
};
const btnCol = {
  textAlign: "center" as const,
  verticalAlign: "middle" as const,
  padding: "5px 0",
};
const baseButtonStyle = {
  color: "#ffffff",
  padding: "13px 32px",
  borderRadius: "10px",
  fontSize: "15px",
  fontWeight: "bold",
  textDecoration: "none",
  display: "inline-block",
  textAlign: "center" as const,
  minWidth: "220px",
};
const buttonStyle = { ...baseButtonStyle, backgroundColor: "#4da8da" };
const whatsappButtonStyle = { ...baseButtonStyle, backgroundColor: "#25D366" };
const emailButtonStyle = { ...baseButtonStyle, backgroundColor: "#334155" };
const signatureStyle = {
  fontSize: "15px",
  lineHeight: "22px",
  color: "#334155",
  marginTop: "8px",
};
const hrStyle = {
  borderColor: "#e2e8f0",
  margin: "28px 0 16px 0",
  borderTop: "1px solid #e2e8f0",
};
const footerTextStyle = {
  fontSize: "12px",
  color: "#94a3b8",
  lineHeight: "1.6",
};
const footerLinkStyle = {
  color: "#64748b",
  fontWeight: "600",
  textDecoration: "none",
};
