import type { ImgBBResult, ImgBBUploadOptions } from "./types.js";
import { API_ENDPOINT, USER_AGENT } from "../constants.js";
import { parseErrorResponse, parseSuccessResponse } from "../parser.js";
import {
  createUploadPayload,
  assertFile,
  appendFile,
  assertBase64,
  appendBase64,
} from "../payload.js";

const upload = async (payload: FormData, options: ImgBBUploadOptions): Promise<ImgBBResult> => {
  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: { "User-Agent": USER_AGENT },
    body: payload,
    signal: options.signal ?? null,
  });

  if (!response.ok) {
    const {
      status_code,
      status_txt,
      error: { code, message },
    } = await parseErrorResponse(response);

    throw new Error(`HTTP ${status_code} ${status_txt} ImgBB ${code} ${message}`);
  }

  const result = await parseSuccessResponse(response);

  return result;
};

/**
 * Uploads a file to ImgBB from a `File`.
 *
 * Allowed mime types: `image/*`, `application/pdf`, `application/postscript`.
 *
 * But some image mime types are not allowed, some are broken and some get converted to other
 * formats (mostly JPEG).
 *
 * Provide ImgBB API `key` in `options`.
 *
 * Use `signal` for the timeout/retries logic.
 *
 * @example
 *   const data = await readFile("/path/to/image.jpeg");
 *   const file = new File([data], "image.jpeg", { type: "image/jpeg" });
 *   const controller = new AbortController();
 *   setTimeout(() => controller.abort(), 5_000); // abort after 5 seconds
 *
 *   const {
 *     data: { url },
 *   } = await uploadFile(file, {
 *     key: "MY_IMGBB_API_KEY",
 *     name: "my_file_image",
 *     expiration: 60,
 *     signal: controller.signal,
 *   });
 *
 * @param file `File` to upload. Max size is `32 MB`.
 * @param options Options for the upload. See {@link ImgBBUploadOptions} for more details.
 *
 * @returns ImgBB upload result. See {@link ImgBBResult} for more details.
 * @throws For invalid inputs or upload failures and error responses.
 */
export const uploadFile = async (file: File, options: ImgBBUploadOptions): Promise<ImgBBResult> => {
  const payload = createUploadPayload(options);

  assertFile(file);
  appendFile(payload, file);

  const result = await upload(payload, options);

  return result;
};

/**
 * Uploads file to ImgBB from a base64 `string`.
 *
 * Make sure to provide a valid base64 string without URI (e.g. without `data:image/jpeg;base64,`
 * metadata prefix).
 *
 * Allowed mime types: `image/*`, `application/pdf`, `application/postscript`.
 *
 * But some image mime types are not allowed, some are broken and some get converted to other
 * formats (mostly JPEG).
 *
 * Provide ImgBB API `key` in `options`.
 *
 * Use `signal` for the timeout/retries logic.
 *
 * @example
 *   const base64 =
 *     "Qk1EAAAAAAAAAD4AAAAoAAAAAQAAAAEAAAABAAEAAAAAAAYAAAASCwAAEgsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
 *   const controller = new AbortController();
 *   setTimeout(() => controller.abort(), 5_000); // abort after 5 seconds
 *
 *   const {
 *     data: { url },
 *   } = await uploadBase64(base64, {
 *     key: "MY_IMGBB_API_KEY",
 *     name: "my_base64_image",
 *     expiration: 60,
 *     signal: controller.signal,
 *   });
 *
 * @param base64 Base64 `string` to upload. Max size is `32 MB`.
 * @param options Options for the upload. See {@link ImgBBUploadOptions} for more details.
 *
 * @returns ImgBB upload result. See {@link ImgBBResult} for more details.
 * @throws For invalid inputs or upload failures and error responses.
 */
export const uploadBase64 = async (
  base64: string,
  options: ImgBBUploadOptions
): Promise<ImgBBResult> => {
  const payload = createUploadPayload(options);

  const base64Trimmed = base64.trim();
  assertBase64(base64Trimmed);
  appendBase64(payload, base64Trimmed);

  const result = await upload(payload, options);

  return result;
};
