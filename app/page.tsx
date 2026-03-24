import type { Metadata } from "next";
import SubmissionLandingPage from "@/components/submission/submission-landing-page";

// ─── Canonical site URL ───────────────────────────────────────────────────────
const SITE_URL = "https://sovereignty.murphslifefoundation.com";

// ─── Page copy ────────────────────────────────────────────────────────────────
/** Browser tab / <title> */
const PAGE_TITLE =
  "The Regenerative Homestead Sovereignty Summit · Casa Conejo · Interest form";

/** Meta description — shown under the title in Google results and most social previews */
const PAGE_DESCRIPTION =
  "A hands-on gathering at Casa Conejo's 46-acre regenerative farm in El Salvador. Food sovereignty, practical skills, resilient systems, and aligned community. Coming 2026. Join the interest list.";

/**
 * Social card headline — used by Facebook, WhatsApp, LinkedIn, Telegram, Slack,
 * iMessage, and Twitter/X. Kept slightly shorter so it doesn't truncate on mobile.
 */
const SOCIAL_TITLE =
  "The Regenerative Homestead Sovereignty Summit at Casa Conejo";

// ─── OG image ─────────────────────────────────────────────────────────────────
/**
 * Absolute HTTPS URL — required by WhatsApp, iMessage, Telegram, and LinkedIn.
 * Relative paths work for Facebook/Twitter but silently fail on messaging apps.
 */
const SHARE_IMAGE = `${SITE_URL}/og-image.png`;
const SHARE_IMAGE_WIDTH = 1200;
const SHARE_IMAGE_HEIGHT = 630;
const SHARE_IMAGE_ALT =
  "The Regenerative Homestead Sovereignty Summit — Casa Conejo regenerative farm at golden hour, El Salvador";

// ─── Metadata export ──────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,

  // Absolute canonical URL — prevents duplicate-content issues and helps crawlers
  alternates: {
    canonical: SITE_URL,
  },

  keywords: [
    "MurphsLife",
    "Sovereignty Summit",
    "food sovereignty",
    "regenerative agriculture",
    "regenerative farming",
    "farm summit",
    "El Salvador",
    "holistic grazing",
    "soil health",
    "Casa Conejo",
    "homesteading",
    "self-sufficiency",
  ],

  // ── Open Graph (Facebook · WhatsApp · iMessage · LinkedIn · Telegram · Slack)
  // WhatsApp and iMessage require og:image to be an absolute HTTPS URL with
  // explicit width/height. LinkedIn additionally requires og:image:secure_url.
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: SOCIAL_TITLE,
    description: PAGE_DESCRIPTION,
    siteName: "MurphsLife Foundation",
    images: [
      {
        url: SHARE_IMAGE,
        secureUrl: SHARE_IMAGE,   // LinkedIn requires og:image:secure_url
        width: SHARE_IMAGE_WIDTH,
        height: SHARE_IMAGE_HEIGHT,
        alt: SHARE_IMAGE_ALT,
        type: "image/png",
      },
    ],
  },

  // ── Twitter / X  (summary_large_image = big hero card in feed)
  twitter: {
    card: "summary_large_image",
    site: "@MurphsLife",          // Twitter @handle — enables attribution
    creator: "@MurphsLife",
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
