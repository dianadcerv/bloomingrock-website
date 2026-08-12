import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <Link href="/" aria-label="BloomingRock home">
          <BrandMark onDark />
        </Link>
        <nav className="site-footer__nav" aria-label="Footer">
          <Link href="/capabilities">Capabilities</Link>
          <Link href="/about">About</Link>
          <a href="mailto:diana@bloomingrocksolutions.com">Contact</a>
        </nav>
        <p>© {new Date().getFullYear()} BloomingRock Solutions LLC</p>
      </div>
      <p className="site-footer__credo">
        Built by Humans Using AI to Further Human Achievements
      </p>
    </footer>
  );
}
