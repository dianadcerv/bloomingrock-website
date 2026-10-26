export const HEARD_ABOUT_OPTIONS = [
  "LinkedIn",
  "Instagram",
  "Referral",
  "Search",
  "Event",
  "Other",
] as const;

export type HeardAboutOption = (typeof HEARD_ABOUT_OPTIONS)[number];
