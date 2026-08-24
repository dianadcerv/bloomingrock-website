import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BloomingRock Solutions | AI that actually gets used",
  description:
    "Find one or two places where AI can save real time in your business — then get it set up so it actually gets used.",
  metadataBase: new URL("https://www.bloomingrocksolutions.com"),
  openGraph: {
    title: "BloomingRock Solutions",
    description:
      "AI readiness audits and quick-win setup for small business owners.",
    url: "https://www.bloomingrocksolutions.com",
    siteName: "BloomingRock Solutions",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable} h-full`}>
      <body className="min-h-full antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
