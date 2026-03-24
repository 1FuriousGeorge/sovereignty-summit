import type { Metadata } from "next";
import SubmissionLandingPage from "@/components/submission/submission-landing-page";

/** Shorter segment; root layout template adds " · MurphsLife Foundation". */
const PAGE_TITLE = "Regenerative farming conference · Interest form";

const PAGE_DESCRIPTION =
  "Expression of interest for a food-sovereignty convening on the farm: pasture walks, soil and grazing field schools, faculty, sponsors, and updates as regenerative agriculture plans take shape. Share how you would attend, teach, or partner.";

const SOCIAL_TITLE =
  "Regenerative farming conference · Expression of interest · MurphsLife Foundation";

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
  },
  twitter: {
    card: "summary_large_image",
    title: SOCIAL_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

export default function Home() {
  return <SubmissionLandingPage />;
}
