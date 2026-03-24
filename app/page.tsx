import type { Metadata } from "next";
import SubmissionLandingPage from "@/components/submission/submission-landing-page";
import { getSiteUrl } from "@/lib/site-url";

// ─── Canonical site URL ───────────────────────────────────────────────────────
const siteUrl = getSiteUrl();

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

/** Served from `public/og.jpg` — absolute HTTPS URL for WhatsApp, X, iMessage, LinkedIn. */
const SHARE_IMAGE = `${siteUrl}/og.jpg`;
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
    canonical: siteUrl,
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: SOCIAL_TITLE,
    description: PAGE_DESCRIPTION,
    siteName: "MurphsLife Foundation",
    images: [
      {
        url: SHARE_IMAGE,
        secureUrl: SHARE_IMAGE,
        width: SHARE_IMAGE_WIDTH,
        height: SHARE_IMAGE_HEIGHT,
        alt: SHARE_IMAGE_ALT,
        type: "image/jpeg",
      },
    ],
  },

  // ── Twitter / X  (summary_large_image = big hero card in feed)
  twitter: {
    card: "summary_large_image",
    site: "@MurphsLife",
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
