import type { Metadata } from "next";
import { CustomerUploadPageClient } from "@/components/portal/CustomerUploadPageClient";

export const metadata: Metadata = {
  title: "Send files",
  robots: { index: false, follow: false },
};

export default async function CustomerUploadPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <CustomerUploadPageClient token={token} />;
}
