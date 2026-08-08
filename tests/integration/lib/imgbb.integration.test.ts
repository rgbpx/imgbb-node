import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { uploadFile, uploadBase64, uploadUrl } from "@src/lib/imgbb.js";

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

  describe("uploadBase64", () => {
    it.concurrent("should return result", async () => {
      const expiration = 60;
      const name = "rgbpx";
      const extension = "png";
      const filename = `${name}.${extension}`;
      const mime = `image/${extension}`;
      const width = 4;
      const height = 4;
      const size = 90;
      const base64 =
        "iVBORw0KGgoAAAANSUhEUgAAAAQAAAAEAgMAAADUn3btAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAlQTFRF/wAAAP8AAAD/LUrNigAAAAxJREFUeJxjFGMEQwABfABdo2H+CQAAAABJRU5ErkJggg==";

      const result = await uploadBase64(base64, { key, name, expiration });

      expect(result.data.title).toContain(name);
      expect(result.data.url).toContain(filename);
      expect(result.data.display_url).toContain(filename);
      expect(result.data.width).toBe(width);
      expect(result.data.height).toBe(height);
      expect(result.data.size).toBe(size);
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

    it.concurrent("should throw invalid base64 error", async () => {
      const base64 = "bad base64";
      const mockStatusCode = 400;
      const mockStatusText = "Bad Request";
      const mockErrorCode = 120;
      const mockErrorMessage = "Invalid base64 string.";

      const resultPromise = uploadBase64(base64, { key });

      await expect(resultPromise).rejects.toThrow(
        `HTTP ${mockStatusCode} ${mockStatusText} ImgBB ${mockErrorCode} ${mockErrorMessage}`
      );
    });
  });

  describe("uploadUrl", () => {
    it.concurrent("should return result", async () => {
      const expiration = 60;
      const name = "imgbb";
      const extension = "png";
      const filename = `${name}.${extension}`;
      const mime = `image/${extension}`;
      const url = "https://simgbb.com/images/favicon.png";

      const result = await uploadUrl(url, { key, name, expiration });

      expect(result.data.title).toContain(name);
      expect(result.data.url).toContain(filename);
      expect(result.data.display_url).toContain(filename);
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

    it.concurrent("should throw invalid file type error", async () => {
      const url = "https://google.com/favicon.ico";
      const mockStatusCode = 400;
      const mockStatusText = "Bad Request";
      const mockErrorCode = 105;
      const mockErrorMessage = "Invalid file type";

      const resultPromise = uploadUrl(url, { key });

      await expect(resultPromise).rejects.toThrow(
        `HTTP ${mockStatusCode} ${mockStatusText} ImgBB ${mockErrorCode} ${mockErrorMessage}`
      );
    });

    it.concurrent("should throw network error", async () => {
      const url = "https://example.com/file.jpeg";
      const mockStatusCode = 400;
      const mockStatusText = "Bad Request";
      const mockErrorCode = 105;
      const mockErrorMessage = "Can't download remote image [ 404 ]";

      const resultPromise = uploadUrl(url, { key });

      await expect(resultPromise).rejects.toThrow(
        `HTTP ${mockStatusCode} ${mockStatusText} ImgBB ${mockErrorCode} ${mockErrorMessage}`
      );
    });
  });
});
