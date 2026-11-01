import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "BloomingRock",
    template: "%s | BloomingRock",
  },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function PortalRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
