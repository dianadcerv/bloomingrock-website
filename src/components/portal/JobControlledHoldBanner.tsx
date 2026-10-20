import { OpenQuestion } from "@/components/portal/PortalUi";
import type { DemoJob } from "@/lib/portal/demo-data";
import { PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";

export function JobControlledHoldBanner({ job }: { job: DemoJob }) {
  if (!job.controlledHold) return null;

  return (
    <div className="portal-controlled-banner" role="alert">
      <p className="portal-controlled-banner__title">
        Possible controlled job. Not processed. Handle outside the app for now.
      </p>
      <p className="portal-controlled-banner__body">
        Intake referenced ITAR, export-controlled, or CUI markings. The app did not extract values or
        suggest checklist lines for this job.
      </p>
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.controlledJobDetection}</OpenQuestion>
    </div>
  );
}
