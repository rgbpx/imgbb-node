import type { ImgBBError, ImgBBImage, ImgBBResult } from "./lib/types.js";

const isString = (value: unknown): value is string => typeof value === "string";
const isNumber = (value: unknown): value is number => typeof value === "number";
const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";
const isObject = (value: unknown): value is object => typeof value === "object" && value !== null;

const isImage = (value: unknown): value is ImgBBImage => {
  if (
    isObject(value) &&
    "filename" in value &&
    isString(value.filename) &&
    "name" in value &&
    isString(value.name) &&
    "mime" in value &&
    isString(value.mime) &&
    "extension" in value &&
    isString(value.extension) &&
    "url" in value &&
    isString(value.url)
  ) {
    return true;
  }

  return false;
};

export const isErrorResponse = (value: unknown): value is ImgBBError => {
  if (
    isObject(value) &&
    "status_code" in value &&
    isNumber(value.status_code) &&
    "status_txt" in value &&
    isString(value.status_txt) &&
    "error" in value &&
    isObject(value.error) &&
    "message" in value.error &&
    isString(value.error.message) &&
    "code" in value.error &&
    isNumber(value.error.code)
  ) {
    return true;
  }

  return false;
};

export const isSuccessResponse = (value: unknown): value is ImgBBResult => {
  if (
    isObject(value) &&
    "success" in value &&
    isBoolean(value.success) &&
    "status" in value &&
    isNumber(value.status) &&
    "data" in value &&
    isObject(value.data) &&
    "id" in value.data &&
    isString(value.data.id) &&
    "title" in value.data &&
    isString(value.data.title) &&
    "url_viewer" in value.data &&
    isString(value.data.url_viewer) &&
    "url" in value.data &&
    isString(value.data.url) &&
    "display_url" in value.data &&
    isString(value.data.display_url) &&
    "width" in value.data &&
    isNumber(value.data.width) &&
    "height" in value.data &&
    isNumber(value.data.height) &&
    "size" in value.data &&
    isNumber(value.data.size) &&
    "time" in value.data &&
    isNumber(value.data.time) &&
    "expiration" in value.data &&
    isNumber(value.data.expiration) &&
    "image" in value.data &&
    isImage(value.data.image) &&
    "thumb" in value.data &&
    isImage(value.data.thumb) &&
    "delete_url" in value.data &&
    isString(value.data.delete_url)
  ) {
    return true;
  }

  return false;
};
