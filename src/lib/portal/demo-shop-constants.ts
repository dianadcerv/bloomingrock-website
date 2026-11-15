/** Fictional heater maker display name (demo). Change here only. */
export const HEATER_DEMO_SHOP_DISPLAY_NAME = "Heater Co. (demo)";

export type DemoShopId = "northridge" | "heaterco";

export type DemoShopBranding = {
  id: DemoShopId;
  name: string;
  legal: string;
  location: string;
  brandColor: string;
};

export const DEMO_SHOP_NORTHRIDGE: DemoShopBranding = {
  id: "northridge",
  name: "Northridge Steel",
  legal: "Northridge Steel Fabrication LLC",
  location: "Rockford, IL",
  brandColor: "#2f4a3c",
};

export const DEMO_SHOP_HEATER: DemoShopBranding = {
  id: "heaterco",
  name: HEATER_DEMO_SHOP_DISPLAY_NAME,
  legal: "Heater Co. Industrial Heating LLC (demo)",
  location: "Waukegan, IL",
  brandColor: "#6b3a2e",
};