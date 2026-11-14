import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthChrome } from "@/components/portal/AuthChrome";
import { LoginForm } from "@/components/portal/LoginForm";
import { getSession } from "@/lib/portal/auth";
import { safePortalNextPath } from "@/lib/portal/login-redirect";
import { roleDisplayLabel } from "@/lib/portal/roles";
import { DEMO_USERS } from "@/lib/portal/session";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next: nextRaw } = await searchParams;
  const next = safePortalNextPath(nextRaw);
  const session = await getSession();
  if (session) redirect(next ?? "/dashboard");

  return (
    <AuthChrome title="Sign in">
      <p className="portal-auth__lead">
        Enter your work email. We&apos;ll send a link. No password.
      </p>
      {error === "expired" ? (
        <p className="look-form__error" role="alert">
          That link expired or was invalid. Request a new one.
        </p>
      ) : null}
      <LoginForm next={next ?? undefined} />
      <aside className="portal-demo-accounts">
        <p className="portal-demo-accounts__label">Demo accounts</p>
        <ul>
          {DEMO_USERS.map((user) => (
            <li key={user.email}>
              <strong>{roleDisplayLabel(user.role)}</strong>
              <span>
                {user.name}, {user.title} · {user.email}
              </span>
            </li>
          ))}
        </ul>
      </aside>
    </AuthChrome>
  );
}
