"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { StatusPill } from "@/components/portal/PortalUi";
import type { DemoShopRecord, ShopEngagementType } from "@/lib/portal/admin-demo-data";
import {
  ADMIN_SHOPS_UPDATED_EVENT,
  createShopRecord,
  getMergedShops,
  phaseLabel,
  planLabel,
  writeStoredShops,
} from "@/lib/portal/admin-shops-store";

export function SuperadminShopsClient({ initialShops }: { initialShops: DemoShopRecord[] }) {
  const [shops, setShops] = useState(initialShops);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [plan, setPlan] = useState<ShopEngagementType>("managed-service");

  useEffect(() => {
    const refresh = () => setShops(getMergedShops());
    refresh();
    window.addEventListener(ADMIN_SHOPS_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(ADMIN_SHOPS_UPDATED_EVENT, refresh);
  }, []);

  const addCustomer = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const next = [...getMergedShops(), createShopRecord({ name: trimmed, engagement: plan })];
    writeStoredShops(next);
    setShops(next);
    setName("");
    setPlan("managed-service");
    setShowForm(false);
  };

  return (
    <>
      <p className="portal-inline-actions">
        <button type="button" className="btn btn--primary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cancel" : "Add customer"}
        </button>
      </p>

      {showForm ? (
        <section className="portal-wf-propose portal-add-customer" aria-labelledby="add-customer-heading">
          <h2 id="add-customer-heading">Add customer (demo)</h2>
          <p className="look-field__hint">Saved in this browser session only — not persisted to server.</p>
          <label className="look-field">
            <span className="look-field__label">Shop name</span>
            <input
              className="look-field__input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme Fabrication"
            />
          </label>
          <label className="look-field">
            <span className="look-field__label">Plan</span>
            <select
              className="look-field__input"
              value={plan}
              onChange={(e) => setPlan(e.target.value as ShopEngagementType)}
            >
              <option value="managed-service">Managed</option>
              <option value="project-based">Project-based</option>
            </select>
          </label>
          <p className="look-field__hint">Starting phase defaults to Onboarding.</p>
          <button type="button" className="btn btn--primary" disabled={!name.trim()} onClick={addCustomer}>
            Add to list
          </button>
        </section>
      ) : null}

      <ul className="portal-list">
        {shops.map((shop) => (
          <li key={shop.id} className="portal-list__item">
            <div>
              <p className="portal-list__kicker">{shop.primaryContact}</p>
              <h2>{shop.name}</h2>
              <p>
                Plan: <strong>{planLabel(shop.engagement)}</strong> · Phase:{" "}
                <strong>{phaseLabel(shop.phase)}</strong>
              </p>
              <p className="look-field__hint">
                {shop.onboarding.filter((s) => s.done).length}/{shop.onboarding.length} onboarding
                setup steps complete
              </p>
            </div>
            <div className="portal-list__actions">
              <StatusPill tone={shop.phase === "onboarding" ? "draft" : "ok"}>
                {phaseLabel(shop.phase)}
              </StatusPill>
              <Link className="btn btn--primary" href={`/admin/shops/${shop.id}`}>
                View shop
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
