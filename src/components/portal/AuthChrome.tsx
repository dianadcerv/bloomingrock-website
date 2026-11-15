import { BrandMark } from "@/components/BrandMark";
import { DEMO_BANNER } from "@/lib/portal/demo-data";

export function DemoBanner() {
  return (
    <p className="portal-banner" role="status">
      {DEMO_BANNER}
    </p>
  );
}

export function AuthChrome({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="portal portal--auth">
      <DemoBanner />
      <div className="portal-auth">
        <BrandMark />
        {title ? <h1 className="portal-auth__title">{title}</h1> : null}
        {children}
      </div>
    </div>
  );
}
