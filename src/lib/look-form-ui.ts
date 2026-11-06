export const WEEK_FIELD_MAX_LENGTH = 800;
export const WEEK_NEAR_LIMIT_CHARS = 50;

export function charCounterAriaLive(
  length: number,
  maxLength: number,
  nearThreshold = WEEK_NEAR_LIMIT_CHARS,
): "polite" | undefined {
  return length >= maxLength - nearThreshold ? "polite" : undefined;
}

export function formatCharCounter(length: number, maxLength: number): string {
  return `${length} / ${maxLength}`;
}
