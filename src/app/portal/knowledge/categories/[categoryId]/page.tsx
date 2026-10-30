import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategorySuggestionsClient } from "@/components/portal/CategorySuggestionsClient";
import { OpenQuestion, PageIntro } from "@/components/portal/PortalUi";
import { PortalShell } from "@/components/portal/PortalShell";
import { requireShopAdmin } from "@/lib/portal/auth";
import { categorySuggestions } from "@/lib/portal/workflow-changes";
import { PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";

const CATEGORIES: Record<string, string> = {
  "access-platforms": "Access platforms",
  "exterior-stairs": "Exterior stairs",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}): Promise<Metadata> {
  const { categoryId } = await params;
  return { title: CATEGORIES[categoryId] ?? "Category" };
}

export default async function KnowledgeCategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const session = await requireShopAdmin();
  const { categoryId } = await params;
  const label = CATEGORIES[categoryId];
  if (!label) notFound();

  const suggestions = categorySuggestions(categoryId);

  return (
    <PortalShell session={session} current="/knowledge/library">
      <PageIntro eyebrow="Project category" title={label}>
        <p>
          Comments from workflow discussions collect here as <strong>SUGGESTED</strong> adjustments
          to the category default workflow. A person accepts them — never applied automatically.
        </p>
      </PageIntro>
      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.templateVsJobScope}</OpenQuestion>
      <CategorySuggestionsClient suggestions={suggestions} />
      <p>
        <Link href="/knowledge/library">← Knowledge library</Link>
      </p>
    </PortalShell>
  );
}
