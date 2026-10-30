"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { DemoJob } from "@/lib/portal/demo-data";
import {
  getSignOffInvite,
  markRequirementsReadyAndSendSignOff,
  SIGN_OFF_UPDATED_EVENT,
} from "@/lib/portal/sign-off-store";

export function RequirementsReadyAction({
  job,
  who,
}: {
  job: DemoJob;
  who: string;
}) {
  const [invite, setInvite] = useState(() =>
    typeof window === "undefined" ? null : getSignOffInvite(job.id),
  );
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const refresh = () => setInvite(getSignOffInvite(job.id));
    refresh();
    window.addEventListener(SIGN_OFF_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(SIGN_OFF_UPDATED_EVENT, refresh);
  }, [job.id]);

  if (job.controlledHold) return null;
  if (job.status !== "ready-for-signoff" && job.status !== "gathering") return null;

  const onMarkReady = () => {
    setBusy(true);
    const sent = markRequirementsReadyAndSendSignOff(job.id, who);
    setInvite(sent);
    setBusy(false);
  };

  if (invite) {
    return (
      <div className="portal-requirements-ready">
        <p className="portal-requirements-ready__done">
          Requirements marked ready — sign-off code sent automatically to {invite.contact} at{" "}
          {invite.sentAt}.
        </p>
        <p>
          <Link href={`/jobs/${job.id}/sign-off`}>View email preview & sign-off page →</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="portal-requirements-ready">
      <p className="look-field__hint">
        When engineering is satisfied with the checklist, mark requirements ready. The app will
        automatically email the customer a one-time code and sign-off link (no Send button).
      </p>
      <button
        type="button"
        className="btn btn--primary"
        disabled={busy}
        onClick={onMarkReady}
      >
        Mark requirements ready (demo)
      </button>
    </div>
  );
}
