import SubmissionFormSection from "./submission-form-section";
import { ScrollProgressBar } from "@/components/ui/scroll-progress-bar";

export default function SubmissionLandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollProgressBar />
      <SubmissionFormSection />
    </div>
  );
}
