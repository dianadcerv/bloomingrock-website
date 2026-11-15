/** In-memory sliding window limiter (per serverless isolate / edge worker). */
export class SlidingWindowLimiter {
  private readonly windowMs: number;
  private readonly max: number;
  private readonly store: Map<string, number[]>;

  constructor(windowMs: number, max: number, store = new Map<string, number[]>()) {
    this.windowMs = windowMs;
    this.max = max;
    this.store = store;
  }

  consume(key: string, now = Date.now()): boolean {
    const recent = (this.store.get(key) ?? []).filter((ts) => now - ts < this.windowMs);
    if (recent.length >= this.max) {
      this.store.set(key, recent);
      return false;
    }
    recent.push(now);
    this.store.set(key, recent);
    return true;
  }
}