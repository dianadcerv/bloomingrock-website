import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { AuthChrome } from "@/components/portal/AuthChrome";
import { getAppOrigin } from "@/lib/portal/hosts";
import { safePortalNextPath } from "@/lib/portal/login-redirect";
import { createMagicToken, findDemoUser } from "@/lib/portal/session";

export const metadata: Metadata = {
  title: "Check your email",
  robots: { index: false, follow: false },
};

async function requestOrigin() {
  const envOrigin = getAppOrigin();
  if (envOrigin) return envOrigin;
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const proto = headerList.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export default async function LoginSentPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; next?: string }>;
}) {
  const { email = "", next: nextRaw } = await searchParams;
  const next = safePortalNextPath(nextRaw);
  const user = findDemoUser(email);
  const origin = await requestOrigin();
  const magicParams = new URLSearchParams({
    token: user ? createMagicToken(user.email) : "",
  });
  if (next) magicParams.set("next", next);
  const magicHref = user ? `${origin}/auth/verify?${magicParams.toString()}` : "";

  return (
    <AuthChrome title="Check your email">
      <p className="portal-auth__lead">
        If we have an account for that address, the link is on its way. This
        prototype does not send real mail.
      </p>
      {user ? (
        <div className="portal-magic">
          <p className="portal-magic__label">Demo magic link for {user.email}</p>
          <Link className="btn btn--primary" href={magicHref}>
            Open demo link
          </Link>
          <p className="look-field__hint">
            {user.role === "superadmin"
              ? "Opens BloomingRock superadmin (all shops)."
              : user.role === "shop-admin"
                ? "Opens job intake home; use Admin in the header for shop settings."
                : user.role === "shop"
                  ? "Opens the shop job intake home."
                  : "Opens the customer dashboard."}
          </p>
        </div>
      ) : (
        <p className="look-field__hint">
          Use a demo account from the sign-in page to open a dashboard.
        </p>
      )}
      <p>
        <Link href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"}>
          Use a different email
        </Link>
      </p>
    </AuthChrome>
  );
}
