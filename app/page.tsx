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

// Images: `app/opengraph-image.png` + `app/twitter-image.png` (Next.js file convention).
// Ensures og:image and twitter:image are emitted the way crawlers expect.

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
  },

  // ── Twitter / X  (summary_large_image = big hero card in feed)
  twitter: {
    card: "summary_large_image",
    site: "@MurphsLife",          // Twitter @handle — enables attribution
    creator: "@MurphsLife",
    title: SOCIAL_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

export default function Home() {
  return <SubmissionLandingPage />;
}
