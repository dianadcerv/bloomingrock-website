export type InboundSource = "website-look" | "website-checklist";

function commandCenterUrl() {
  return (
    process.env.COMMAND_CENTER_URL?.trim() ||
    "https://starship-bridge-26.vercel.app"
  );
}

export async function submitInboundIntake(payload: {
  name: string;
  email: string;
  business: string;
  details: string;
  heardAbout?: string;
  source: InboundSource;
}): Promise<boolean> {
  const secret = process.env.INTAKE_INBOUND_SECRET?.trim();
  if (!secret) return false;

  try {
    const response = await fetch(`${commandCenterUrl()}/api/intake/inbound`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch {
    return false;
  }
}
