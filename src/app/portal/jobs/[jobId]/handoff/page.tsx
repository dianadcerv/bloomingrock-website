import type { Metadata } from "next";
import Link from "next/link";
import { JobHeader } from "@/components/portal/JobHeader";
import { JobCommercialExportNote } from "@/components/portal/JobCommercialExportNote";
import { DraftNotice, StatusPill } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireJobForShop } from "@/lib/portal/auth";
import {
  checkStatusLabel,
  getSource,
  type CheckStatus,
} from "@/lib/portal/demo-data";
import { jobDocumentItems } from "@/lib/portal/job-documents";
import { isShopStaff } from "@/lib/portal/roles";

export const metadata: Metadata = { title: "Ready for handoff" };

function checkTone(status: CheckStatus) {
  if (status === "conflict") return "conflict" as const;
  if (status === "missing") return "missing" as const;
  if (status === "assumed") return "assumed" as const;
  return "ok" as const;
}

export default async function JobHandoffPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const { session, job } = await requireJobForShop(jobId);

  if (!job.cpqHandoff) {
    return (
      <PortalShell session={session} current="/documents">
        <JobHeader job={job} current={`/jobs/${job.id}/handoff`} role={session.role} />
        <p className="look-field__hint">
          CPQ handoff preview is only set up for the heater demo job in this prototype.
        </p>
      </PortalShell>
    );
  }

  const blockers = job.handoffBlockers ?? [];
  const openConflicts = job.checklist.filter((c) => c.status === "conflict");
  const correspondence = job.questions.filter((q) => q.sent);
  const docs = jobDocumentItems(job, { includeControlled: true });

  return (
    <PortalShell session={session} current="/documents">
      <JobHeader job={job} current={`/jobs/${job.id}/handoff`} role={session.role} />
      <DraftNotice>FAKE DATA, DEMO ONLY — nothing is sent to Infor CPQ or your CRM.</DraftNotice>
      <JobCommercialExportNote job={job} />

      <section className="portal-section">
        <h2>Ready for handoff</h2>
        <p>
          This app does not replace Infor CPQ, your CRM, or your ERP. It turns a messy inbound RFQ
          into a confirmed packet a person is willing to hand off to Infor CPQ.
        </p>
        {blockers.length ? (
          <div className="portal-conflict" role="alert">
            <p className="portal-conflict__title">Sign-off blocked (demo)</p>
            <p className="look-field__hint">
              Clear or explicitly defer: {blockers.join(", ")}.
            </p>
          </div>
        ) : null}
      </section>

      <section className="portal-section">
        <h3>Confirmed fields (preview)</h3>
        <ul className="portal-plain">
          {job.checklist.map((item) => (
            <li key={item.id} className="portal-check">
              <StatusPill tone={checkTone(item.status)}>{checkStatusLabel(item.status)}</StatusPill>
              <div>
                <strong>{item.label}</strong>
                {item.value ? <p>{item.value}</p> : null}
                {item.note ? <p className="look-field__hint">{item.note}</p> : null}
                {item.sourceIds.length ? (
                  <p className="look-field__hint">
                    Sources:{" "}
                    {item.sourceIds.map((id) => getSource(job, id)?.title ?? id).join(", ")}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="portal-section">
        <h3>Open conflicts</h3>
        {openConflicts.length ? (
          <ul>
            {openConflicts.map((c) => (
              <li key={c.id}>
                {c.label}: {c.value ?? "—"}
              </li>
            ))}
          </ul>
        ) : (
          <p>None</p>
        )}
      </section>

      <section className="portal-section">
        <h3>Files on the packet</h3>
        <ul className="portal-plain">
          {job.sources.map((source) => (
            <li key={source.id}>
              {source.title}
              {source.assetPath && isShopStaff(session.role) ? (
                <>
                  {" "}
                  <Link href={`/jobs/${job.id}/sources/${source.id}/preview`}>(preview)</Link>
                </>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="portal-section">
        <h3>Correspondence</h3>
        {correspondence.length ? (
          <ul>
            {correspondence.map((q) => (
              <li key={q.id}>{q.prompt}</li>
            ))}
          </ul>
        ) : (
          <p>No customer questions sent yet (drafts on Missing info).</p>
        )}
      </section>

      <section className="portal-section">
        <h3>BOM (no prices)</h3>
        <p>
          <Link href={`/jobs/${job.id}/bom`}>Open BOM tab</Link> — {job.bom.length} lines, options
          only.
        </p>
      </section>

      <section className="portal-section">
        <h3>Other job documents</h3>
        <ul className="portal-plain">
          {docs.map((d) => (
            <li key={d.href}>
              <Link href={d.href}>{d.title}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="portal-section portal-handoff-actions">
        <button className="btn btn--primary" type="button" disabled aria-disabled="true">
          Send packet to Infor CPQ (demo disabled)
        </button>
        <p className="look-field__hint">
          Customer record stays in your CRM; nothing is duplicated.
        </p>
        <p className="look-field__hint">
          After confirm, a workflow tool could update customer master or notify applications
          engineering (demo note only).
        </p>
      </section>
    </PortalShell>
  );
}