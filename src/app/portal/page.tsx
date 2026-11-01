import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/portal/auth";

export const metadata: Metadata = {
  title: "BloomingRock",
  robots: { index: false, follow: false },
};

export default async function PortalIndexPage() {
  const session = await getSession();
  redirect(session ? "/dashboard" : "/login");
}
