import type { PortalSession } from "./session";
import {
  DEMO_SHOP_HEATER,
  DEMO_SHOP_NORTHRIDGE,
  HEATER_DEMO_SHOP_DISPLAY_NAME,
  type DemoShopId,
} from "./demo-shop-constants";

export {
  DEMO_SHOP_HEATER,
  DEMO_SHOP_NORTHRIDGE,
  HEATER_DEMO_SHOP_DISPLAY_NAME,
  type DemoShopBranding,
  type DemoShopId,
} from "./demo-shop-constants";

export function shopIdForSession(session: PortalSession): DemoShopId | null {
  if (session.role === "superadmin") return null;
  if (session.org === HEATER_DEMO_SHOP_DISPLAY_NAME) return "heaterco";
  if (session.org === "Northridge Steel") return "northridge";
  return null;
}

export function getDemoShopBranding(session: PortalSession) {
  const shopId = shopIdForSession(session);
  if (shopId === "heaterco") return DEMO_SHOP_HEATER;
  return DEMO_SHOP_NORTHRIDGE;
}

export function getDemoShopBrandingById(shopId: DemoShopId) {
  return shopId === "heaterco" ? DEMO_SHOP_HEATER : DEMO_SHOP_NORTHRIDGE;
}

export function jobBelongsToShop(jobShopId: string | undefined, sessionShopId: DemoShopId | null) {
  const resolved = jobShopId ?? "northridge";
  if (!sessionShopId) return true;
  return resolved === sessionShopId;
}