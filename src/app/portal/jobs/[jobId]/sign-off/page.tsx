import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobHeader } from "@/components/portal/JobHeader";
import { DraftNotice } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireSession } from "@/lib/portal/auth";
import { DEMO_CUSTOMER, DEMO_SHOP, getJob } from "@/lib/portal/demo-data";

export const metadata: Metadata = { title: "Sign-off" };

export default async function SignOffPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const session = await requireSession();
  const { jobId } = await params;
  const job = getJob(jobId);
  if (!job) notFound();
  const buyer = session.role === "buyer";

  return (
    <PortalShell session={session} current="/documents">
      <JobHeader job={job} current={`/jobs/${job.id}/sign-off`} role={session.role} />
      {buyer ? (
        <>
          <p className="portal-auth__lead">
            Review what {DEMO_SHOP.name} captured, then sign with the one-time
            code from your email. Code email is still an open call (BLO-21).
          </p>
          <div className="portal-letter">
            <p className="look-field__hint">Demo code (not emailed)</p>
            <p className="portal-code">482917</p>
            <label className="look-field">
              <span className="look-field__label">One-time code</span>
              <input className="look-field__input" defaultValue="482917" readOnly />
            </label>
            <button className="btn btn--primary" type="button" disabled>
              Sign (demo)
            </button>
          </div>
        </>
      ) : (
        <>
          <DraftNotice>
            Internal view. The customer sees a shorter page. Link + code are
            not sent in this prototype.
          </DraftNotice>
          <div className="portal-letter">
            <h2>Job Requirements Sign-off</h2>
            <p>
              Customer: {DEMO_CUSTOMER.name}. Engineer: Maya Chen. Both must
              sign. Width still conflicts, so this should not go out yet.
            </p>
            <p>
              Sign-off link (placeholder): app.bloomingrocksolutions.com/jobs/
              {job.id}/sign-off
            </p>
            <button className="btn btn--primary" type="button" disabled>
              Prepare code email (demo)
            </button>
          </div>
        </>
      )}
    </PortalShell>
  );
}
