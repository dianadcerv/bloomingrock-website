import type { Metadata } from "next";
import { JobHeader } from "@/components/portal/JobHeader";
import { DraftNotice, OpenQuestion } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireJobForShop } from "@/lib/portal/auth";
import { DEMO_TRANSCRIPT } from "@/lib/portal/demo-data";
import { PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";

export const metadata: Metadata = { title: "Transcript upload" };

export default async function TranscriptPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const { session, job } = await requireJobForShop(jobId);

  return (
    <PortalShell session={session} current="/jobs">
      <JobHeader job={job} current={`/jobs/${job.id}/transcript`} />
      <DraftNotice>FAKE DATA, DEMO ONLY — uploads are not saved.</DraftNotice>
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.transcriptIntegration}</OpenQuestion>
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.transcriptionService}</OpenQuestion>
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.liveRecording}</OpenQuestion>
      <section className="portal-section">
        <h2>Illinois / recording consent</h2>
        <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.consentCheckbox}</OpenQuestion>
        <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.consentIfUnchecked}</OpenQuestion>
        <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.illinoisConsent}</OpenQuestion>
        <p className="look-field__hint">Not legal advice. No checkbox behavior is implemented.</p>
      </section>
      <form className="portal-form" action="#">
        <label className="look-field">
          <span className="look-field__label">Customer</span>
          <input className="look-field__input" readOnly defaultValue="Meridian Food Plants" />
        </label>
        <label className="look-field">
          <span className="look-field__label">Job</span>
          <input className="look-field__input" readOnly defaultValue={job.name} />
        </label>
        <label className="look-field">
          <span className="look-field__label">Call date</span>
          <input className="look-field__input" type="date" defaultValue="2026-10-09" name="date" />
        </label>
        <label className="look-field">
          <span className="look-field__label">Source tool</span>
          <input
            className="look-field__input"
            placeholder="Open question — which tool?"
            name="tool"
            readOnly
          />
        </label>
        <label className="look-field">
          <span className="look-field__label">Paste transcript or upload audio/video</span>
          <textarea
            className="look-field__input look-field__input--area"
            name="text"
            rows={6}
            readOnly
            defaultValue={DEMO_TRANSCRIPT.text}
          />
        </label>
        <label className="look-field">
          <span className="look-field__label">Or upload file (demo)</span>
          <input className="look-field__input" type="file" accept=".m4a,.mp3,.wav,.mp4,.txt,.vtt,.srt" />
        </label>
        <button className="btn btn--primary" type="button" disabled>
          Transcribe (demo — disabled)
        </button>
      </form>
      <section className="portal-section">
        <h2>Demo transcription result</h2>
        <p className="portal-draft">{DEMO_TRANSCRIPT.demoTranscriptionLabel}</p>
        <p className="look-field__hint">From file: {DEMO_TRANSCRIPT.fileName}</p>
        <pre>{DEMO_TRANSCRIPT.text}</pre>
        <p>
          Extracted values land on the checklist with a source label; inferred values get{" "}
          <strong>Interpretation, needs review</strong>.
        </p>
      </section>
    </PortalShell>
  );
}
