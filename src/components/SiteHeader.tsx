import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { LOOK_PATH } from "@/lib/contact";

export type NavPage =
  | "capabilities"
  | "product"
  | "make-ai-stick"
  | "about"
  | "look";

export function SiteHeader({
  tone = "on-moss",
  current,
}: {
  tone?: "on-moss" | "on-stone";
  current?: NavPage;
}) {
  const link = (page: NavPage, href: string, label: string) => (
    <Link
      href={href}
      className={current === page ? "is-active" : undefined}
      aria-current={current === page ? "page" : undefined}
    >
      {label}
    </Link>
  );

  return (
    <header className={`nav ${tone}`}>
      <div className="wrap">
        <Link href="/" className="brand" aria-label="BloomingRock home">
          <BrandLogo />
          <span>BloomingRock</span>
        </Link>
        <nav aria-label="Primary">
          {link("capabilities", "/capabilities", "Capabilities")}
          {link("product", "/product", "Product")}
          {link("make-ai-stick", "/make-ai-stick", "How I work")}
          {link("about", "/about", "About")}
          <Link className="navcta" href={LOOK_PATH}>
            Book a look
          </Link>
        </nav>
      </div>
    </header>
  );
}
