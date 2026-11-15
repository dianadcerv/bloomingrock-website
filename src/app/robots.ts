import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const PORTAL_PATH_PREFIXES = [
  "/portal",
  "/login",
  "/dashboard",
  "/inbox",
  "/jobs",
  "/workflows",
  "/documents",
  "/requests",
  "/auth",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/paid-look-intake", ...PORTAL_PATH_PREFIXES],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}