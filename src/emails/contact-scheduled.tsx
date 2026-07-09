import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

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

  // wa.me requires bare international digits (no +, spaces or dashes).
  const waDigits = (agent.whatsappNumber || "").replace(/\D/g, "");
  const whatsappUrl = waDigits
    ? `https://wa.me/${waDigits}?text=${encodeURIComponent(`Hi ${agent.name.split(" ")[0]}, I'm following up on my inquiry for the ${make} ${model}.`)}`
    : "";
  // Rep's personal Providence inbox — comes straight to them.
  const emailUrl = `mailto:${agent.email}?subject=${encodeURIComponent(`My ${make} ${model} inquiry`)}`;

  return (
    <Html>
      <Head />
      <Preview>{`${agent.name} will reach out via ${methodsLabel} — here's the plan for your ${make} ${model}.`}</Preview>
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          <Heading style={brandStyle}>
            Providence <span style={{ color: "#0ea5e9" }}>Auto</span>
          </Heading>

          {/* Agent header */}
          <Section style={{ marginBottom: "8px" }}>
            <Row>
              <Column style={{ width: "64px", verticalAlign: "middle" }}>
                <Img
                  src={agent.image}
                  alt={agent.name}
                  width="56"
                  height="56"
                  style={{
                    borderRadius: "999px",
                    objectFit: "cover",
                    border: "2px solid #e6f3fa",
                  }}
                />
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
                    Talk to me on WhatsApp
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

          <Hr style={hrStyle} />
          <Text style={footerTextStyle}>
            © {new Date().getFullYear()} Providence Auto. 468 Church Lane,
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
const brandStyle = {
  fontSize: "24px",
  fontWeight: "800",
  color: "#0f172a",
  marginBottom: "24px",
  marginTop: "0",
  letterSpacing: "-0.025em",
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
