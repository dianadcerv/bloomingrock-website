import {
  PAID_LOOK_ALLOWED_MIME,
  PAID_LOOK_MAX_FILE_BYTES,
  PAID_LOOK_MAX_FILES,
} from "@/lib/paid-look-upload-limits";

export { PAID_LOOK_MAX_FILES, PAID_LOOK_MAX_FILE_BYTES } from "@/lib/paid-look-upload-limits";

export type PaidLookUploadedFile = {
  url: string;
  /** Store pathname (with random suffix when enabled); used for authenticated download in Command Center. */
  pathname?: string;
  name: string;
  contentType: string;
  size: number;
};

function bytesMatch(head: Uint8Array, pattern: number[], offset = 0) {
  return pattern.every((byte, i) => head[offset + i] === byte);
}

/** Sniff allowed types from magic bytes (do not trust client `File.type` alone). */
export async function sniffPaidLookMime(file: File): Promise<string | null> {
  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  if (head.length >= 4 && bytesMatch(head, [0x25, 0x50, 0x44, 0x46])) {
    return "application/pdf";
  }
  if (head.length >= 3 && bytesMatch(head, [0xff, 0xd8, 0xff])) {
    return "image/jpeg";
  }
  if (
    head.length >= 8 &&
    bytesMatch(head, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  ) {
    return "image/png";
  }
  if (
    head.length >= 6 &&
    head[0] === 0x47 &&
    head[1] === 0x49 &&
    head[2] === 0x46 &&
    head[3] === 0x38 &&
    (head[4] === 0x37 || head[4] === 0x39) &&
    head[5] === 0x61
  ) {
    return "image/gif";
  }
  if (
    head.length >= 12 &&
    head[0] === 0x52 &&
    head[1] === 0x49 &&
    head[2] === 0x46 &&
    head[3] === 0x46 &&
    head[8] === 0x57 &&
    head[9] === 0x45 &&
    head[10] === 0x42 &&
    head[11] === 0x50
  ) {
    return "image/webp";
  }
  return null;
}

export function validatePaidLookUploads(files: File[]): { ok: true } | { ok: false; error: string } {
  if (files.length === 0) return { ok: true };
  if (files.length > PAID_LOOK_MAX_FILES) {
    return { ok: false, error: "Please upload no more than three files." };
  }

  for (const file of files) {
    if (file.size <= 0) {
      return { ok: false, error: "One of the uploads looks empty." };
    }
    if (file.size > PAID_LOOK_MAX_FILE_BYTES) {
      return { ok: false, error: "Each file must be 5 MB or smaller." };
    }
    const type = file.type || "application/octet-stream";
    if (!PAID_LOOK_ALLOWED_MIME.has(type)) {
      return {
        ok: false,
        error: "Upload PDFs or images only (no ITAR/CUI files).",
      };
    }
  }

  return { ok: true };
}

export async function verifyPaidLookUploadContents(
  files: File[],
): Promise<{ ok: true } | { ok: false; error: string }> {
  for (const file of files) {
    const sniffed = await sniffPaidLookMime(file);
    if (!sniffed || !PAID_LOOK_ALLOWED_MIME.has(sniffed)) {
      return {
        ok: false,
        error: "Upload PDFs or images only (no ITAR/CUI files).",
      };
    }
    const claimed = file.type || "application/octet-stream";
    if (claimed !== sniffed && !(claimed === "image/jpg" && sniffed === "image/jpeg")) {
      return {
        ok: false,
        error: "That file type does not match its contents. Try a different file.",
      };
    }
  }
  return { ok: true };
}

export async function uploadPaidLookFiles(
  files: File[],
): Promise<PaidLookUploadedFile[]> {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token || files.length === 0) return [];

  const { put } = await import("@vercel/blob");

  const uploaded: PaidLookUploadedFile[] = [];
  for (const file of files) {
    const safeName = file.name.replace(/[^\w.\-()+ ]+/g, "_").slice(0, 120);
    const pathname = `paid-look-intake/${Date.now()}-${safeName}`;
    const blob = await put(pathname, file, {
      access: "private",
      token,
      addRandomSuffix: true,
      contentType: file.type || undefined,
    });
    uploaded.push({
      url: blob.url,
      pathname: blob.pathname,
      name: file.name,
      contentType: file.type || "application/octet-stream",
      size: file.size,
    });
  }

  return uploaded;
}
