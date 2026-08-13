import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import type * as React from "react";
import { EmailAvatar, EmailBrandHeader } from "./brand";

interface EmailLayoutProps {
  preview: string;
  heading?: string;
  /**
   * When set, the email leads with this person's profile picture and name
   * instead of a bare brand lockup. Falls back to the Providence Auto logo if
   * they have no photo on their profile.
   */
  profile?: {
    name: string;
    image?: string | null;
    role?: string;
  };
  children: React.ReactNode;
}

export const EmailLayout = ({
  preview,
  heading,
  profile,
  children,
}: EmailLayoutProps) => {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          <EmailBrandHeader marginBottom={profile ? "20px" : "24px"} />

          {profile && (
            <Section style={{ marginBottom: "20px" }}>
              <Row>
                <Column style={{ width: "64px", verticalAlign: "middle" }}>
                  <EmailAvatar
                    src={profile.image}
                    alt={profile.name}
                    size={56}
                  />
                </Column>
                <Column
                  style={{ verticalAlign: "middle", paddingLeft: "12px" }}
                >
                  <Text style={profileNameStyle}>{profile.name}</Text>
                  <Text style={profileRoleStyle}>
                    {profile.role || "Your dedicated sourcing specialist"}
                  </Text>
                </Column>
              </Row>
            </Section>
          )}

          {heading && (
            <Heading as="h2" style={subHeadingStyle}>
              {heading}
            </Heading>
          )}

          {children}

          <Hr style={hrStyle} />
          <Text style={footerTextStyle}>
            © {new Date().getFullYear()} Providence Auto. All rights reserved.
            <br />
            This is an automated system message. Please do not reply directly.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default EmailLayout;

// --- STYLES ---

const mainStyle = {
  backgroundColor: "#f8fafc", // Light slate-white background
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
  padding: "20px",
};

const containerStyle = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "32px",
  borderRadius: "12px", // Slightly rounder, modern edges
  border: "1px solid #e2e8f0",
  maxWidth: "600px",
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)", // Subtle drop-shadow for premium feel
};

const profileNameStyle = {
  fontSize: "16px",
  fontWeight: "700",
  color: "#0f172a",
  margin: "0",
};

const profileRoleStyle = {
  fontSize: "13px",
  color: "#64748b",
  margin: "2px 0 0 0",
};

const subHeadingStyle = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#1e293b",
  marginBottom: "16px",
  marginTop: "0",
};

const hrStyle = {
  borderColor: "#e2e8f0",
  margin: "32px 0 24px 0",
  borderTop: "1px solid #e2e8f0",
};

const footerTextStyle = {
  fontSize: "12px",
  color: "#64748b", // Slate muted text
  lineHeight: "1.6",
};
