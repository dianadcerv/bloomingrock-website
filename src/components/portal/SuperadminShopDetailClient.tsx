"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShopLifecycleHeader } from "@/components/portal/ShopLifecycleHeader";
import { StatusPill } from "@/components/portal/PortalUi";
import type { DemoShopRecord, ShopLifecyclePhase } from "@/lib/portal/admin-demo-data";
import {
  ADMIN_SHOPS_UPDATED_EVENT,
  getMergedShop,
  getMergedShops,
  writeStoredShops,
} from "@/lib/portal/admin-shops-store";

export function SuperadminShopDetailClient({
  shopId,
  initialShop,
}: {
  shopId: string;
  initialShop: DemoShopRecord | null;
}) {
  const [shop, setShop] = useState<DemoShopRecord | null>(initialShop);

  useEffect(() => {
    const refresh = () => setShop(getMergedShop(shopId));
    refresh();
    window.addEventListener(ADMIN_SHOPS_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(ADMIN_SHOPS_UPDATED_EVENT, refresh);
  }, [shopId]);

  const updatePhase = (phase: ShopLifecyclePhase) => {
    if (!shop) return;
    const next = getMergedShops().map((s) => (s.id === shop.id ? { ...s, phase } : s));
    writeStoredShops(next);
    setShop({ ...shop, phase });
  };

  if (!shop) {
    return (
      <p className="portal-muted">
        Shop not found in demo data.{" "}
        <Link href="/admin/shops">Return to customer list</Link>.
      </p>
    );
  }

  return (
    <>
      <ShopLifecycleHeader shop={shop} onPhaseChange={updatePhase} />

      <section className="portal-section">
        <h2>Onboarding setup checklist</h2>
        <p className="look-field__hint">
          Shop getting started: first customer, first project, first product. After onboarding the
          shop admin owns day-to-day configuration.
        </p>
        <ul className="portal-list">
          {shop.onboarding.map((step) => (
            <li key={step.id} className="portal-list__item">
              <div>
                <h3>{step.label}</h3>
                <p>{step.detail}</p>
              </div>
              <StatusPill tone={step.done ? "ok" : "draft"}>{step.done ? "Done" : "Open"}</StatusPill>
            </li>
          ))}
        </ul>
      </section>

      {shop.id === "northridge" ? (
        <p>
          <Link className="btn btn--primary" href="/admin">
            Open Northridge shop admin →
          </Link>
        </p>
      ) : null}
      <p>
        <Link href="/admin/shops">← All customers</Link>
      </p>
    </>
  );
}
