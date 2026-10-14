import type { PortalRole } from "@/lib/portal/session";

export function isShopStaff(role: PortalRole) {
  return role === "shop" || role === "shop-admin" || role === "superadmin";
}

export function isShopAdmin(role: PortalRole) {
  return role === "shop-admin" || role === "superadmin";
}

export function isSuperAdmin(role: PortalRole) {
  return role === "superadmin";
}

export function roleDisplayLabel(role: PortalRole) {
  if (role === "superadmin") return "BloomingRock superadmin";
  if (role === "shop-admin") return "Shop admin";
  if (role === "shop") return "Shop user";
  return "Customer";
}
