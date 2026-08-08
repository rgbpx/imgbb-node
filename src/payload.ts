import type { ImgBBParams } from "./lib/types.js";
import {
  assertDoesNotMatchAnyOf,
  assertEqualTo,
  assertGreaterThan,
  assertGreaterThanOrEqual,
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

const appendKey = (payload: FormData, key: string): void => payload.append("key", key);
const appendName = (payload: FormData, name: string): void => payload.append("name", name);
const appendExpiration = (payload: FormData, expiration: number): void =>
  payload.append("expiration", expiration);

export const appendFile = (payload: FormData, file: File): void => payload.append("image", file);

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
