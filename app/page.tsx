import type { Metadata } from "next";
import SubmissionLandingPage from "@/components/submission/submission-landing-page";

/** Shorter segment; root layout template adds " · MurphsLife Foundation". */
const PAGE_TITLE =
  "The Regenerative Homestead Sovereignty Summit · Casa Conejo · Interest form";

const PAGE_DESCRIPTION =
  "A hands-on gathering at Casa Conejo's 46-acre regenerative farm in El Salvador. Food sovereignty, practical skills, resilient systems, and aligned community. Coming 2026. Join the interest list.";

const SOCIAL_TITLE =
  "The Regenerative Homestead Sovereignty Summit at Casa Conejo · MurphsLife Foundation";

/** Served from `public/og-image.png` — must match real file dimensions for OG parsers. */
const SHARE_IMAGE = "/og-image.png";

/** Measured from `public/og-image.png` (standard 1.91:1 OG size — works across WhatsApp, FB, iMessage, etc.). */
const SHARE_IMAGE_WIDTH = 1200;
const SHARE_IMAGE_HEIGHT = 630;

const SHARE_IMAGE_ALT =
  "MurphsLife Foundation — farm landscape at sunrise with foundation wordmark";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
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
    type: "website",
    locale: "en_US",
    url: "/",
    title: SOCIAL_TITLE,
    description: PAGE_DESCRIPTION,
    siteName: "MurphsLife Foundation",
    images: [
      {
        url: SHARE_IMAGE,
        width: SHARE_IMAGE_WIDTH,
        height: SHARE_IMAGE_HEIGHT,
        alt: SHARE_IMAGE_ALT,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SOCIAL_TITLE,
    description: PAGE_DESCRIPTION,
    images: [
      {
        url: SHARE_IMAGE,
        width: SHARE_IMAGE_WIDTH,
        height: SHARE_IMAGE_HEIGHT,
        alt: SHARE_IMAGE_ALT,
      },
    ],
  },
};

export default function Home() {
  return <SubmissionLandingPage />;
}
