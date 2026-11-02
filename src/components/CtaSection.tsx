import Link from "next/link";
import { BrandWatermark } from "@/components/BrandWatermark";
import { LOOK_PATH } from "@/lib/contact";

type CtaSectionProps = {
  label?: string;
  title: string;
  children?: React.ReactNode;
  href?: string;
  buttonLabel?: string;
};

export function CtaSection({
  label = "Next step",
  title,
  children,
  href = LOOK_PATH,
  buttonLabel = "Book a look",
}: CtaSectionProps) {
  return (
    <section className="moss r-section cta">
      <BrandWatermark />
      <div className="wrap">
        <p className="label">{label}</p>
        <h2>{title}</h2>
        {children}
        <Link className="btn" href={href}>
          {buttonLabel}
        </Link>
      </div>
    </section>
  );
}
