import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { LOOK_PATH } from "@/lib/contact";
import { getPublicLoginHref } from "@/lib/portal/hosts";

export function SiteHeader({
  onDark = false,
  current,
}: {
  onDark?: boolean;
  current?: "home" | "capabilities" | "about" | "look";
}) {
  const loginHref = getPublicLoginHref();

  return (
    <header className={`site-header${onDark ? " site-header--on-dark" : ""}`}>
      <Link href="/" className="site-header__brand" aria-label="BloomingRock home">
        <BrandMark onDark={onDark} />
      </Link>
      <nav className="site-header__nav" aria-label="Primary">
        <Link
          href="/capabilities"
          className={`site-header__link${current === "capabilities" ? " is-active" : ""}`}
        >
          Capabilities
        </Link>
        <Link
          href="/about"
          className={`site-header__link${current === "about" ? " is-active" : ""}`}
        >
          About
        </Link>
        <Link href={loginHref} className="site-header__link">
          Login
        </Link>
        <Link
          className={`btn ${onDark ? "btn--ghost" : "btn--solid-light"}`}
          href={LOOK_PATH}
        >
          Book a look
        </Link>
      </nav>
    </header>
  );
}
