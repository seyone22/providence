import type { Metadata } from "next";

// Partner account creation. Deliberately NOT indexed: it is a bare form with no
// content of its own, it duplicates /auth/sign-up, and Search Console had
// already picked up the staging copy under "Duplicate without user-selected
// canonical". `follow: true` so the links out of it still pass equity.
export const metadata: Metadata = {
  title: { absolute: "Partner Sign Up | Providence Auto" },
  description:
    "Create a Providence Auto partner account to obtain your embed widget.",
  alternates: { canonical: "/signup" },
  robots: { index: false, follow: true },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
