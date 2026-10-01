import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { AuthChrome } from "@/components/portal/AuthChrome";
import { getAppOrigin } from "@/lib/portal/hosts";
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
  searchParams: Promise<{ email?: string }>;
}) {
  const { email = "" } = await searchParams;
  const user = findDemoUser(email);
  const origin = await requestOrigin();
  const magicHref = user
    ? `${origin}/auth/verify?token=${encodeURIComponent(createMagicToken(user.email))}`
    : "";

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
            {user.role === "shop"
              ? "Opens the shop-user dashboard (not admin)."
              : "Opens the customer dashboard."}
          </p>
        </div>
      ) : (
        <p className="look-field__hint">
          Use a demo account from the sign-in page to open a dashboard.
        </p>
      )}
      <p>
        <Link href="/login">Use a different email</Link>
      </p>
    </AuthChrome>
  );
}
