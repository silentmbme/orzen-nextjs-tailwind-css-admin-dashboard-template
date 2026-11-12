import type { Metadata } from "next";

export const SITE_TITLE = "Orzen Next.js Tailwind CSS Admin Dashboard Template";

export const siteMetadata: Metadata = {
  applicationName: "Orzen",
  title: SITE_TITLE,
  description:
    "Orzen brings dashboards, customer relationships, commerce, subscriptions, and AI-assisted work into one connected workspace.",
  keywords: [
    "Orzen",
    "admin dashboard",
    "business workspace",
    "CRM",
    "eCommerce",
    "SaaS",
    "AI operations",
  ],
  authors: [{ name: "Orzen" }],
  creator: "Orzen",
  publisher: "Orzen",
  robots: { index: true, follow: true },
  icons: { icon: "/icon.svg" },
  openGraph: {
    type: "website",
    siteName: "Orzen",
    title: SITE_TITLE,
    description:
      "A connected workspace for dashboards, customer relationships, commerce, subscriptions, and AI-assisted work.",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description:
      "A connected workspace for dashboards, customer relationships, commerce, subscriptions, and AI-assisted work.",
  },
};
