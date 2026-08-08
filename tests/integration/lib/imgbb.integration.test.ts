import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { uploadFile } from "@src/lib/imgbb.js";

const key = process.env.IMGBB_API_KEY as string;

describe("ImgBB Integration", () => {
  describe("uploadFile", () => {
    it.concurrent("should return result", async () => {
      const expiration = 60;
      const filePath = "./tests/resources/fixtures/rgbpx.png";
      const fileData = await readFile(filePath);
      const filename = path.basename(filePath);
      const name = path.basename(filename, path.extname(filename));
      const extension = path.extname(filename).slice(1);
      const mime = `image/${extension}`;
      const file = new File([fileData], filename, { type: mime });
      const width = 4;
      const height = 4;

      const result = await uploadFile(file, { key, name, expiration });

      expect(result.data.title).toContain(name);
      expect(result.data.url).toContain(filename);
      expect(result.data.display_url).toContain(filename);
      expect(result.data.width).toBe(width);
      expect(result.data.height).toBe(height);
      expect(result.data.expiration).toBe(expiration);
      expect(result.data.image.filename).toBe(filename);
      expect(result.data.image.name).toBe(name);
      expect(result.data.image.mime).toBe(mime);
      expect(result.data.image.extension).toBe(extension);
      expect(result.data.image.url).toContain(filename);
      expect(result.data.image.filename).toBe(filename);
      expect(result.data.thumb.name).toBe(name);
      expect(result.data.thumb.mime).toBe(mime);
      expect(result.data.thumb.extension).toBe(extension);
      expect(result.data.thumb.url).toContain(filename);
      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
    });

    it.concurrent("should throw unsupported file format error", async () => {
      const file = new File(["content"], "filename.png", { type: "image/png" });
      const mockStatusCode = 400;
      const mockStatusText = "Bad Request";
      const mockErrorCode = 415;
      const mockErrorMessage = "Unsupported or unrecognized file format";

      const resultPromise = uploadFile(file, { key });

      await expect(resultPromise).rejects.toThrow(
        `HTTP ${mockStatusCode} ${mockStatusText} ImgBB ${mockErrorCode} ${mockErrorMessage}`
      );
    });

    it.concurrent("should implicitly convert ico to jpg", async () => {
      const expiration = 60;
      const filePath = "./tests/resources/fixtures/favicon.ico";
      const fileData = await readFile(filePath);
      const filename = path.basename(filePath);
      const name = path.basename(filename, path.extname(filename));
      const mime = "image/x-icon";
      const file = new File([fileData], filename, { type: mime });
      const convertedExtension = "jpg";
      const convertedMime = "image/jpeg";
      const convertedFilename = `${name}.${convertedExtension}`;

      const result = await uploadFile(file, { key, name, expiration });

      expect(result.data.title).toContain(name);
      expect(result.data.url).toContain(convertedFilename);
      expect(result.data.display_url).toContain(convertedFilename);
      expect(result.data.expiration).toBe(expiration);
      expect(result.data.image.filename).toBe(convertedFilename);
      expect(result.data.image.name).toBe(name);
      expect(result.data.image.mime).toBe(convertedMime);
      expect(result.data.image.extension).toBe(convertedExtension);
      expect(result.data.image.url).toContain(convertedFilename);
      expect(result.data.image.filename).toBe(convertedFilename);
      expect(result.data.thumb.name).toBe(name);
      expect(result.data.thumb.mime).toBe(convertedMime);
      expect(result.data.thumb.extension).toBe(convertedExtension);
      expect(result.data.thumb.url).toContain(convertedFilename);
      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
    });
  });
});
