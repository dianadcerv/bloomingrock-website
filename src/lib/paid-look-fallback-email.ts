import { escapeHtml } from "@/lib/form-server";
import type { PaidLookAnswers } from "@/lib/paid-look-intake";

/**
 * HTML block for Paid Look owner notification when Command Center handoff failed.
 * Does not include blob URLs or other links to uploads.
 */
export function buildPaidLookFallbackUploadsHtml(
  uploadCount: number,
  fileNames: string[],
  itarCui: PaidLookAnswers["itar"],
): string {
  if (uploadCount <= 0) return "";

  const controlled = itarCui === "yes" || itarCui === "not sure";

  if (controlled) {
    return `<p style="margin:16px 0 0"><strong>Uploads:</strong> This is a controlled submission (ITAR, CUI, or export-related) held for review. ${uploadCount} file(s) were stored privately. File names are omitted here. They will reach the portal once the handoff is retried, or Diana can pull them from storage.</p>`;
  }

  const list = fileNames.map((name) => escapeHtml(name)).join(", ");
  return `<p style="margin:16px 0 0"><strong>Uploads:</strong> ${uploadCount} file(s): ${list}. They are stored privately. They will reach the portal once the handoff is retried, or Diana can pull them from storage.</p>`;
}
