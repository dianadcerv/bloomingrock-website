import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { LOOK_PATH } from "@/lib/contact";

export function SiteFooter() {
  return (
    <footer className="site-footer-r">
      <div className="wrap">
        <Link href="/" className="brand" aria-label="BloomingRock home">
          <BrandLogo />
          <span>BloomingRock</span>
        </Link>
        <div className="flinks">
          <Link href="/capabilities">Capabilities</Link>
          <Link href="/product">Product</Link>
          <Link href="/quotes-stall">Why quotes stall</Link>
          <Link href="/chicago-shops">Chicagoland shops</Link>
          <Link href="/pre-quote-checklist">Pre-quote checklist</Link>
          <Link href="/about">About</Link>
          <Link href={LOOK_PATH}>Contact</Link>
        </div>
        <p>
          © {new Date().getFullYear()} BloomingRock Solutions LLC
          <br />
          Built by Humans Using AI to Further Human Achievements
        </p>
      </div>
    </footer>
  );
}
