import { BrandLogo } from "@/components/BrandLogo";

export function BrandWatermark() {
  return (
    <div className="bigmark" aria-hidden="true">
      <BrandLogo />
    </div>
  );
}
