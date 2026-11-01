import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/portal/AdminShell";
import { OpenQuestion, PageIntro } from "@/components/portal/PortalUi";
import { requireShopAdmin } from "@/lib/portal/auth";
import { NORTHRIDGE_CATEGORIES } from "@/lib/portal/admin-demo-data";
import { PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}): Promise<Metadata> {
  const { categoryId } = await params;
  const cat = NORTHRIDGE_CATEGORIES.find((c) => c.id === categoryId);
  return { title: cat?.label ?? "Category" };
}

export default async function ShopAdminCategoryDetailPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const session = await requireShopAdmin();
  const { categoryId } = await params;
  const cat = NORTHRIDGE_CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) notFound();

  return (
    <AdminShell session={session} current="/admin/categories">
      <PageIntro eyebrow="Product category" title={cat.label}>
        <p>Default workflow and checklist for new jobs in this category (demo copy).</p>
      </PageIntro>
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.templateVsJobScope}</OpenQuestion>
      <section className="portal-section">
        <h2>Default workflow (template)</h2>
        <p>{cat.defaultWorkflowSummary}</p>
      </section>
      <section className="portal-section">
        <h2>Requirements checklist template</h2>
        <p>{cat.checklistSummary}</p>
      </section>
      <section className="portal-section">
        <h2>Suggested workflow adjustments</h2>
        <p>
          Review comments promoted from jobs on the{" "}
          <Link href={cat.knowledgeCategoryHref}>knowledge category page</Link>. Shop admin accepts
          suggestions; editing the live template is Phase 2.
        </p>
        {cat.pendingSuggestedCount ? (
          <Link className="btn btn--primary" href={cat.knowledgeCategoryHref}>
            Review {cat.pendingSuggestedCount} suggested step(s)
          </Link>
        ) : (
          <p className="portal-muted">No pending suggestions in demo.</p>
        )}
      </section>
      <p>
        <Link href="/admin/categories">← Categories</Link>
      </p>
    </AdminShell>
  );
}
