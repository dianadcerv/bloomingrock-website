export const PAID_LOOK_MAX_FILES = 3;
export const PAID_LOOK_MAX_FILE_BYTES = 5 * 1024 * 1024;
/** Combined cap across all files in one submission. */
export const PAID_LOOK_MAX_TOTAL_BYTES = PAID_LOOK_MAX_FILE_BYTES * PAID_LOOK_MAX_FILES;

export const PAID_LOOK_ALLOWED_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
