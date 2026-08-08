<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/imgbb-node-dark.png">
    <source media="(prefers-color-scheme: light)" srcset="assets/imgbb-node-light.png">
    <img alt="imgbb-node" src="assets/imgbb-node-dark.png">
  </picture>
</p>

![NPM Version](https://img.shields.io/npm/v/imgbb-node)
![NPM Downloads](https://img.shields.io/npm/dw/imgbb-node)
[![CI](https://github.com/rgbpx/imgbb-node/actions/workflows/ci.yml/badge.svg)](https://github.com/rgbpx/imgbb-node/actions/workflows/ci.yml)
[![CodeQL](https://github.com/rgbpx/imgbb-node/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/rgbpx/imgbb-node/actions/workflows/github-code-scanning/codeql)
[![Dependabot Updates](https://github.com/rgbpx/imgbb-node/actions/workflows/dependabot/dependabot-updates/badge.svg)](https://github.com/rgbpx/imgbb-node/actions/workflows/dependabot/dependabot-updates)

# imgbb-node

Lightweight ImgBB client for Node.js (and Bun) written in TypeScript with zero dependencies

## Requirements

- Node.js version: `>= 20` (Apr 17, 2023)
- Bun version: `>= 1.0.36` (Mar 29, 2024)

## Installation

Install the package via `npm`:

```sh
npm install imgbb-node
```

Install the package via `bun`:

```sh
bun add imgbb-node
```

## Documentation

- [API Key](#api-key)
- [File Upload](#file-upload)
- [Types](#types)
- [Development](#development)

---

### API key

To upload files to ImgBB, you need to obtain an API key:

1. Create a free account at [ImgBB Sign Up](https://imgbb.com/signup) page.
2. Go to the [ImgBB API](https://api.imgbb.com/) page.
3. Generate API key by clicking `Add API key` button.

### File Upload

Uploads a file to ImgBB from a `File`.

Throws for invalid inputs or upload failures and error responses.

```js
import { uploadFile } from "imgbb-node";

const data = await readFile("/path/to/image.jpeg");
const file = new File([data], "image.jpeg", { type: "image/jpeg" });
const controller = new AbortController();
setTimeout(() => controller.abort(), 5_000); // abort after 5 seconds

const {
  data: { url },
} = await uploadFile(file, {
  key: "MY_IMGBB_API_KEY",
  name: "my_file_image",
  expiration: 60,
  signal: controller.signal,
});
```

### Types

`imgbb-node/types` - sub-module with exported types.

```js
import type {
  ImgBBUploadOptions,
  ImgBBParams,
  ImgBBImage,
  ImgBBResult,
  ImgBBError,
} from "imgbb-node/types";
```

### Development

To run integration tests locally, you need to set the `IMGBB_API_KEY` environment variable to your [ImgBB API key](#api-key) in `.env.test.local` file.
