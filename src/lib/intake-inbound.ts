import type { PaidLookInboundPayload } from "@/lib/intake/paid-look-sections";

export type InboundSource =
  | "website-look"
  | "website-checklist"
  | "website-paid-look";

export type StandardInboundPayload = {
  name: string;
  email: string;
  business: string;
  details: string;
  heardAbout?: string;
  inboundExtras?: {
    painTopics?: string[];
  };
  source: Exclude<InboundSource, "website-paid-look">;
};

export type InboundPayload = StandardInboundPayload | PaidLookInboundPayload;

const DEV_COMMAND_CENTER_FALLBACK = "http://localhost:3001";

/**
 * Base URL for Command Center (no trailing slash, no /api path).
 * Production must set COMMAND_CENTER_URL; dev may omit to use localhost.
 */
export function resolveCommandCenterBaseUrl(): string | null {
  const raw = process.env.COMMAND_CENTER_URL?.trim();
  if (raw) {
    return raw.replace(/\/+$/, "") || null;
  }

  if (process.env.NODE_ENV === "production") {
    console.error(
      "[intake-inbound] COMMAND_CENTER_URL is not set in production. Skipping Command Center POST. Set COMMAND_CENTER_URL to the portal base URL (for example https://your-command-center.example.com).",
    );
    return null;
  }

  return DEV_COMMAND_CENTER_FALLBACK;
}

export async function submitInboundIntake(payload: InboundPayload): Promise<boolean> {
  const secret = process.env.INTAKE_INBOUND_SECRET?.trim();
  if (!secret) return false;

  const baseUrl = resolveCommandCenterBaseUrl();
  if (!baseUrl) return false;

  try {
    const response = await fetch(`${baseUrl}/api/intake/inbound`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      console.error("[intake-inbound] Command Center returned", response.status);
    }
    return response.ok;
  } catch (error) {
    console.error(
      "[intake-inbound] Command Center request failed",
      error instanceof Error ? error.message : "unknown",
    );
    return false;
  }
}
