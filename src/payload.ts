import type { ImgBBParams } from "./lib/types.js";
import {
  assertDoesNotMatchAnyOf,
  assertDoesNotStartWith,
  assertEqualTo,
  assertGreaterThan,
  assertGreaterThanOrEqual,
  assertIncludes,
  assertIsAlphanumeric,
  assertLessThanOrEqual,
  assertMatchesOneOf,
} from "./assertions.js";
import {
  ALLOWED_MIME_TYPES,
  API_KEY_LENGTH,
  MAX_EXPIRATION_SECONDS,
  MAX_FILE_BYTES,
  MAX_FILE_NAME_LENGTH,
  MIN_EXPIRATION_SECONDS,
  UNSUPPORTED_MIME_TYPES,
} from "./constants.js";
import { parseUrl } from "./parser.js";

const assertKey = (key: string): void => {
  assertEqualTo(key.length, API_KEY_LENGTH, "api key length");
  assertIsAlphanumeric(key, "api key");
};

const assertName = (name: string): void => {
  assertLessThanOrEqual(name.length, MAX_FILE_NAME_LENGTH, "name length");
};

const assertExpiration = (expiration: number): void => {
  assertGreaterThanOrEqual(expiration, MIN_EXPIRATION_SECONDS, "expiration");
  assertLessThanOrEqual(expiration, MAX_EXPIRATION_SECONDS, "expiration");
};

export const assertFile = (file: File): void => {
  assertGreaterThan(file.size, 0, "file size");
  assertLessThanOrEqual(file.size, MAX_FILE_BYTES, "file size");
  assertMatchesOneOf(
    file.type,
    ALLOWED_MIME_TYPES,
    (mime, prefix) => mime.startsWith(prefix),
    "file mime type"
  );
  assertDoesNotMatchAnyOf(
    file.type,
    UNSUPPORTED_MIME_TYPES,
    (mime, prefix) => mime.startsWith(prefix),
    "file mime type"
  );
};

export const assertBase64 = (base64: string): void => {
  assertGreaterThan(base64.length, 0, "base64 image length");
  assertDoesNotStartWith(base64, "data:", "base64 image");
};

export const assertUrl = (url: string): void => {
  assertGreaterThan(url.length, 0, "image url length");

  const parsedUrl = parseUrl(url, "image url");
  assertIncludes(parsedUrl.hostname, ".", "image url hostname");
  assertMatchesOneOf(
    parsedUrl.protocol,
    ["http", "https"],
    (proto, allowedProto) => proto.startsWith(allowedProto),
    "image url protocol"
  );
};

const appendKey = (payload: FormData, key: string): void => payload.append("key", key);
const appendName = (payload: FormData, name: string): void => payload.append("name", name);
const appendExpiration = (payload: FormData, expiration: number): void =>
  payload.append("expiration", expiration);

export const appendUrl = (payload: FormData, url: string): void => payload.append("image", url);
export const appendFile = (payload: FormData, file: File): void => payload.append("image", file);
export const appendBase64 = (payload: FormData, base64: string): void =>
  payload.append("image", base64);

export const createUploadPayload = ({ key, name, expiration }: ImgBBParams): FormData => {
  const payload = new FormData();

  const keyPrepared = key.trim().toLowerCase();
  assertKey(keyPrepared);
  appendKey(payload, keyPrepared);

  if (name) {
    const nameTrimmed = name.trim();
    assertName(nameTrimmed);
    appendName(payload, nameTrimmed);
  }

  if (expiration) {
    assertExpiration(expiration);
    appendExpiration(payload, expiration);
  }

  return payload;
};
