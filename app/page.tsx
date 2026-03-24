import type { Metadata } from "next";
import SubmissionLandingPage from "@/components/submission/submission-landing-page";

/** Shorter segment; root layout template adds " · MurphsLife Foundation". */
const PAGE_TITLE =
  "The Regenerative Homestead Sovereignty Summit · Casa Conejo · Interest form";

const PAGE_DESCRIPTION =
  "A hands-on gathering at Casa Conejo's 46-acre regenerative farm in El Salvador. Food sovereignty, practical skills, resilient systems, and aligned community. Coming 2026. Join the interest list.";

const SOCIAL_TITLE =
  "The Regenerative Homestead Sovereignty Summit at Casa Conejo · MurphsLife Foundation";

/** Used for Open Graph, Twitter/X, and other link previews (`public/og-image.png`). */
const SHARE_IMAGE = "/og-image.png";

const SHARE_IMAGE_ALT =
  "MurphsLife Foundation — farm landscape at sunrise with foundation wordmark";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "MurphsLife",
    "food sovereignty",
    "regenerative agriculture",
    "regenerative farming",
    "farm conference",
    "El Salvador",
    "holistic grazing",
    "soil health",
  ],
  openGraph: {
    title: SOCIAL_TITLE,
    description: PAGE_DESCRIPTION,
    type: "website",
    siteName: "MurphsLife Foundation",
    images: [
      {
        url: SHARE_IMAGE,
        alt: SHARE_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SOCIAL_TITLE,
    description: PAGE_DESCRIPTION,
    images: [SHARE_IMAGE],
  },
};

export default function Home() {
  return <SubmissionLandingPage />;
}
