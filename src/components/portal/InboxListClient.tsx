"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/portal/PortalUi";
import type { InboxItem } from "@/lib/portal/demo-data";
import { DEMO_CUSTOMERS } from "@/lib/portal/demo-data";
import { getExtraInboxItems, INTAKE_UPDATED_EVENT } from "@/lib/portal/intake-store";
import type { ExtendedInboxItem } from "@/lib/portal/intake-types";

function kindLabel(kind: ExtendedInboxItem["kind"]) {
  if (kind === "customer-upload") return "Customer upload";
  if (kind === "website-quote") return "Website form";
  if (kind === "phone-call") return "Phone intake";
  return "Email";
}

function kindTone(kind: ExtendedInboxItem["kind"]) {
  if (kind === "customer-upload") return "success" as const;
  if (kind === "website-quote") return "info" as const;
  if (kind === "phone-call") return "neutral" as const;
  return "neutral" as const;
}

export function InboxListClient({ seedItems }: { seedItems: InboxItem[] }) {
  const [extra, setExtra] = useState<ExtendedInboxItem[]>([]);

  useEffect(() => {
    const refresh = () => setExtra(getExtraInboxItems());
    refresh();
    window.addEventListener(INTAKE_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(INTAKE_UPDATED_EVENT, refresh);
  }, []);

  const groups = useMemo(() => {
    const all = [...extra, ...seedItems];
    const map = new Map<string, ExtendedInboxItem[]>();
    for (const item of all) {
      const id = item.suggested.customerId;
      const list = map.get(id) ?? [];
      list.push(item);
      map.set(id, list);
    }
    return DEMO_CUSTOMERS.map((customer) => ({
      customer,
      items: map.get(customer.id) ?? [],
    })).filter((g) => g.items.length > 0);
  }, [extra, seedItems]);

  return (
    <>
      {groups.map(({ customer, items }) => (
        <section key={customer.id} className="portal-inbox-group">
          <h2>{customer.name}</h2>
          <ul className="portal-list portal-list--clickable">
            {items.map((item) => (
              <li key={item.id}>
                <Link href={`/inbox/${item.id}`} className="portal-list__item portal-list__item--link">
                  <div className="portal-list__item-main">
                    <p className="portal-list__kicker">{item.from}</p>
                    <h3>{item.subject}</h3>
                    <p>{item.snippet}</p>
                    <p className="portal-list__meta">
                      Suggested: {item.suggested.project} → {item.suggested.jobs.join(" + ")}
                    </p>
                  </div>
                  <Badge tone={kindTone(item.kind)}>
                    {item.kind === "customer-upload" ? "New files" : kindLabel(item.kind)}
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
