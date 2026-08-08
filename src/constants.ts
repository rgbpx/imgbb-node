export const USER_AGENT = "rgbpx/imgbb-node";
export const API_ENDPOINT = "https://api.imgbb.com/1/upload";
export const API_KEY_LENGTH = 32;
export const MIN_EXPIRATION_SECONDS = 60;
export const MAX_EXPIRATION_SECONDS = 15552000; // 180 days / 6 months
export const MAX_FILE_NAME_LENGTH = 100; // anything past 100 trimmed, emojis trimmed, if empty uses "image"
export const MAX_FILE_BYTES = 32 * 1024 * 1024; // 32 MB
export const ALLOWED_MIME_TYPES = ["image/", "application/pdf", "application/postscript"] as const;
export const UNSUPPORTED_MIME_TYPES = [
  "image/avif", // error code: 0; error message: filesize(): stat failed for /dev/shm/chvtempKfW7y7.avif
] as const;
