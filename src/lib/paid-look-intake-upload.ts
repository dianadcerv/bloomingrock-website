export const PAID_LOOK_MAX_FILES = 3;
export const PAID_LOOK_MAX_FILE_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export type PaidLookUploadedFile = {
  url: string;
  /** Store pathname (with random suffix when enabled); used for authenticated download in Command Center. */
  pathname?: string;
  name: string;
  contentType: string;
  size: number;
};

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
    if (!ALLOWED_MIME.has(type)) {
      return {
        ok: false,
        error: "Upload PDFs or images only (no ITAR/CUI files).",
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
