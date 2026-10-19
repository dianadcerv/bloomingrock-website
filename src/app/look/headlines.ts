// HEADLINE PENDING: Diana choosing A/B/C
// Swap active headline: set ACTIVE_LOOK_HEADLINE_INDEX to 0 (A), 1 (B), or 2 (C).

export const LOOK_HEADLINE_OPTIONS = [
  {
    headline: "Get the quote out before the details get lost.",
    subhead:
      "I help small shops pull emails, uploads, and phone notes into one place, flag what's missing, and leave the final call to you.",
  },
  {
    headline: "Stop passing on jobs you could have won.",
    subhead:
      "When nobody has time to chase the missing details, the work goes somewhere else. I'll set up a simple intake your team can run and own.",
  },
  {
    headline: "Your best estimator shouldn't be your only system.",
    subhead:
      "I help get quoting know-how out of one person's head and into a setup the whole team can use. A person still says yes before anything goes out.",
  },
] as const;

export const ACTIVE_LOOK_HEADLINE_INDEX = 0;

export function activeLookHeadline() {
  return LOOK_HEADLINE_OPTIONS[ACTIVE_LOOK_HEADLINE_INDEX];
}
