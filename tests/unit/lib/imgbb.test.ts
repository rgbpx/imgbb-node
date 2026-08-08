import { randomUUID } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ImgBBError, ImgBBResult } from "@src/lib/types.js";
import {
  ALLOWED_MIME_TYPES,
  API_KEY_LENGTH,
  MAX_EXPIRATION_SECONDS,
  MAX_FILE_BYTES,
  MAX_FILE_NAME_LENGTH,
  MIN_EXPIRATION_SECONDS,
  UNSUPPORTED_MIME_TYPES,
} from "@src/constants.js";
import { uploadFile } from "@src/lib/imgbb.js";

describe("ImgBB Unit", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("uploadFile", () => {
    it.concurrent("should return success response", async () => {
      const mockKey = randomUUID().replaceAll("-", "");
      const file = new File(["content"], "imageFilename.png", { type: "image/png" });
      const mockResult: ImgBBResult = {
        data: {
          id: "Bl4h6LaH",
          title: "imageFilename",
          url_viewer: "https://ibb.co/Bl4h6LaH",
          url: "https://i.ibb.co/6lAHbl4h/imageFilename.png",
          display_url: "https://i.ibb.co/614hBlah/imageFilename.png",
          width: 2343,
          height: 3237,
          size: file.size,
          time: file.lastModified,
          expiration: 0,
          image: {
            filename: "imageFilename.png",
            name: "imageFilename",
            mime: "image/png",
            extension: "png",
            url: "https://i.ibb.co/6lAHbl4h/imageFilename.png",
          },
          thumb: {
            filename: "imageFilename.png",
            name: "imageFilename",
            mime: "image/png",
            extension: "png",
            url: "https://i.ibb.co/Bl4h6LaH/imageFilename.png",
          },
          medium: {
            filename: "imageFilename.png",
            name: "imageFilename",
            mime: "image/png",
            extension: "png",
            url: "https://i.ibb.co/614hBlah/imageFilename.png",
          },
          delete_url: `https://ibb.co/Bl4h6LaH/${randomUUID().replaceAll("-", "")}`,
        },
        success: true,
        status: 200,
      };
      const mockResultJson = JSON.stringify(mockResult);
      const mockResultLength = mockResultJson.length;
      const mockResponse = new Response(mockResultJson, {
        headers: {
          "Content-Type": "application/json",
          "Content-Length": mockResultLength.toString(),
        },
      });
      const fetchSpy = vi.spyOn(globalThis, "fetch");
      fetchSpy.mockResolvedValueOnce(mockResponse);

      const resultPromise = uploadFile(file, { key: mockKey });

      await expect(resultPromise).resolves.toStrictEqual(mockResult);
    });

    it.concurrent("should throw ImgBB error", async () => {
      const mockKey = randomUUID().replaceAll("-", "");
      const file = new File(["content"], "image.gif", { type: "image/gif" });
      const mockStatusCode = 400;
      const mockStatusText = "Bad Request";
      const mockErrorCode = 103;
      const mockErrorMessage = "You have been forbidden to use this website.";
      const mockError: ImgBBError = {
        status_code: mockStatusCode,
        error: {
          message: mockErrorMessage,
          code: mockErrorCode,
        },
        status_txt: mockStatusText,
      };
      const mockErrorJson = JSON.stringify(mockError);
      const mockErrorLength = mockErrorJson.length;
      const mockResponse = new Response(mockErrorJson, {
        status: mockStatusCode,
        statusText: mockStatusText,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": mockErrorLength.toString(),
        },
      });
      const fetchSpy = vi.spyOn(globalThis, "fetch");
      fetchSpy.mockResolvedValueOnce(mockResponse);

      const resultPromise = uploadFile(file, { key: mockKey });

      await expect(resultPromise).rejects.toThrow(
        `HTTP ${mockStatusCode} ${mockStatusText} ImgBB ${mockErrorCode} ${mockErrorMessage}`
      );
    });

    it.concurrent("should throw if key length is zero", async () => {
      const file = new File(["content"], "image.gif", { type: "image/gif" });
      const mockKey = "";

      const resultPromise = uploadFile(file, { key: mockKey });

      await expect(resultPromise).rejects.toThrow(
        `api key length (${mockKey.length}) must be equal to ${API_KEY_LENGTH}.`
      );
    });

    it.concurrent("should throw if key length is over the max limit", async () => {
      const file = new File(["content"], "image.gif", { type: "image/gif" });
      const mockKey = Array(API_KEY_LENGTH + 1)
        .fill("a")
        .join("");

      const resultPromise = uploadFile(file, { key: mockKey });

      await expect(resultPromise).rejects.toThrow(
        `api key length (${mockKey.length}) must be equal to ${API_KEY_LENGTH}.`
      );
    });

    it.concurrent("should throw if key is not alphanumeric", async () => {
      const file = new File(["content"], "image.gif", { type: "image/gif" });
      const mockKey = Array(API_KEY_LENGTH).fill("@").join("");

      const resultPromise = uploadFile(file, { key: mockKey });

      await expect(resultPromise).rejects.toThrow(
        `api key ("${mockKey}") must contain only lowercase letters and numbers (a-z, 0-9).`
      );
    });

    it.concurrent("should throw if name length is over the max limit", async () => {
      const file = new File(["content"], "image.gif", { type: "image/gif" });
      const mockKey = randomUUID().replaceAll("-", "");
      const mockName = Array(MAX_FILE_NAME_LENGTH + 1)
        .fill("a")
        .join("");

      const resultPromise = uploadFile(file, { key: mockKey, name: mockName });

      await expect(resultPromise).rejects.toThrow(
        `name length (${mockName.length}) must be less than or equal to ${MAX_FILE_NAME_LENGTH}.`
      );
    });

    it.concurrent("should throw if expiration is lower than the min limit", async () => {
      const file = new File(["content"], "image.gif", { type: "image/gif" });
      const mockKey = randomUUID().replaceAll("-", "");
      const mockExpiration = MIN_EXPIRATION_SECONDS - 1;

      const resultPromise = uploadFile(file, { key: mockKey, expiration: mockExpiration });

      await expect(resultPromise).rejects.toThrow(
        `expiration (${mockExpiration}) must be greater than or equal to ${MIN_EXPIRATION_SECONDS}.`
      );
    });

    it.concurrent("should throw if expiration is over the max limit", async () => {
      const file = new File(["content"], "image.gif", { type: "image/gif" });
      const mockKey = randomUUID().replaceAll("-", "");
      const mockExpiration = MAX_EXPIRATION_SECONDS + 1;

      const resultPromise = uploadFile(file, { key: mockKey, expiration: mockExpiration });

      await expect(resultPromise).rejects.toThrow(
        `expiration (${mockExpiration}) must be less than or equal to ${MAX_EXPIRATION_SECONDS}.`
      );
    });

    it.concurrent("should throw if file size is zero", async () => {
      const file = new File([""], "image.gif", { type: "image/gif" });
      const mockKey = randomUUID().replaceAll("-", "");

      const resultPromise = uploadFile(file, { key: mockKey });

      await expect(resultPromise).rejects.toThrow(
        `file size (${file.size}) must be greater than 0.`
      );
    });

    it.concurrent("should throw if file size is over the max limit", async () => {
      const data = new Uint8Array(MAX_FILE_BYTES + 1);
      const file = new File([data], "image.gif", { type: "image/gif" });
      const mockKey = randomUUID().replaceAll("-", "");

      const resultPromise = uploadFile(file, { key: mockKey });

      await expect(resultPromise).rejects.toThrow(
        `file size (${file.size}) must be less than or equal to ${MAX_FILE_BYTES}.`
      );
    });

    it.concurrent("should throw if file mime type is not allowed", async () => {
      const file = new File(["content"], "video.webm", { type: "video/webm" });
      const mockKey = randomUUID().replaceAll("-", "");

      const resultPromise = uploadFile(file, { key: mockKey });

      await expect(resultPromise).rejects.toThrow(
        `file mime type ("${file.type}") must match one of: ${ALLOWED_MIME_TYPES.join(", ")}.`
      );
    });

    it.concurrent("should throw if file mime type is allowed but not supported", async () => {
      const file = new File(["content"], "image.avif", { type: "image/avif" });
      const mockKey = randomUUID().replaceAll("-", "");

      const resultPromise = uploadFile(file, { key: mockKey });

      await expect(resultPromise).rejects.toThrow(
        `file mime type ("${file.type}") must not match any of: ${UNSUPPORTED_MIME_TYPES.join(", ")}.`
      );
    });

    it.concurrent("should throw if operation was aborted", async () => {
      const file = new File(["content"], "image.gif", { type: "image/gif" });
      const mockKey = randomUUID().replaceAll("-", "");

      const controller = new AbortController();

      const resultPromise = uploadFile(file, { key: mockKey, signal: controller.signal });
      controller.abort();

      await expect(resultPromise).rejects.toThrow("This operation was aborted");
    });
  });
});
