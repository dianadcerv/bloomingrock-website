import type { Metadata } from "next";
import { ModuleCard, PageIntro } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireSession } from "@/lib/portal/auth";
import { DEMO_PROJECT, JOBS } from "@/lib/portal/demo-data";

export const metadata: Metadata = {
  title: "Home",
};

export default async function DashboardPage() {
  const session = await requireSession();
  const platform = JOBS[0];
  const guard = JOBS[1];

  const shopModules = [
    {
      href: "/inbox",
      eyebrow: "Inbox",
      title: "3 messages need a match",
      body: "Suggested customer: Meridian Food Plants. Confirm the job before anything is filed.",
    },
    {
      href: "/jobs",
      eyebrow: "Jobs / projects",
      title: `${DEMO_PROJECT.name} · 2 jobs`,
      body: `${platform.name} has a width conflict. ${guard.name} is waiting on an opening size.`,
    },
    {
      href: "/workflows",
      eyebrow: "Workflows",
      title: "Minimum vs ideal vs added steps",
      body: "Access platform still needs conflict resolution and engineering review.",
    },
    {
      href: "/documents",
      eyebrow: "Sign-off / documents",
      title: "Drafts only — nothing sent",
      body: "Sign-off, work order, BOM, and PDF are ready to preview. A person still sends.",
    },
  ];

  const buyerModules = [
    {
      href: "/jobs",
      eyebrow: "Jobs",
      title: `${DEMO_PROJECT.name} at your plant`,
      body: "The access platform has an open question on width. The machine guard is waiting on size.",
    },
    {
      href: "/documents",
      eyebrow: "Documents / sign-off",
      title: "Nothing is waiting on your signature yet",
      body: "When Northridge is ready, you’ll review the requirements here and sign with a one-time code.",
    },
    {
      href: "/requests",
      eyebrow: "Requests",
      title: "2 questions still in draft",
      body: "Northridge has not sent them. You’ll see width, load rating, finish, and anchoring.",
    },
  ];

  const modules = session.role === "shop" ? shopModules : buyerModules;

  return (
    <PortalShell session={session} current="/dashboard">
      <PageIntro eyebrow={session.org} title={`Hello, ${session.name.split(" ")[0]}`}>
        <p>
          {session.role === "shop"
            ? "Shop-user home — not admin. Each window opens a working section."
            : "Customer home. You only see jobs, documents, and requests meant for you."}
        </p>
      </PageIntro>
      <div className="portal-grid">
        {modules.map((mod) => (
          <ModuleCard key={mod.href} {...mod} />
        ))}
      </div>
    </PortalShell>
  );
}
