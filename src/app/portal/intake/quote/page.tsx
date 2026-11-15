import type { Metadata } from "next";
import { WebsiteQuoteForm } from "@/components/portal/WebsiteQuoteForm";

export const metadata: Metadata = {
  title: "Quote request",
  robots: { index: false, follow: false },
};

export default function PublicQuoteIntakePage() {
  return <WebsiteQuoteForm embedded />;
}
