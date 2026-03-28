import SubmissionFormSection from "./submission-form-section";
import { ScrollProgressBar } from "@/components/ui/scroll-progress-bar";
import { MobileCtaFab } from "@/components/ui/mobile-cta-fab";

export default function SubmissionLandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollProgressBar />
      <MobileCtaFab />
      <SubmissionFormSection />
    </div>
  );
}
