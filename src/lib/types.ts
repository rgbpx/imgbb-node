/**
 * ImgBB upload parameters.
 */
export interface ImgBBParams {
  /**
   * ImgBB API key. Must be alphanumeric string with exact length of `32` characters.
   */
  key: string;
  /**
   * Image name to be displayed in the URL and title. Max length is `100` characters.
   */
  name?: string;
  /**
   * Image expiration time in seconds between `60` (1 minutes) and `15552000` (180 days)
   */
  expiration?: number;
}

/**
 * ImgBB upload options.
 */
export interface ImgBBUploadOptions extends ImgBBParams {
  /**
   * Abort signal to cancel the upload.
   */
  signal?: AbortSignal;
}

export interface ImgBBImage {
  /**
   * Image name with file extension.
   */
  filename: string;
  /**
   * Image name without file extension.
   */
  name: string;
  /**
   * Image MIME type.
   */
  mime: string;
  /**
   * Image file extension without the leading dot.
   */
  extension: string;
  /**
   * Image URL.
   */
  url: string;
}

export interface ImgBBResult {
  /**
   * Uploaded image data.
   */
  data: {
    /**
     * ImgBB image ID.
     */
    id: string;
    /**
     * Image title will use the `name` parameter if provided otherwise randomly generated.
     */
    title: string;
    /**
     * ImgBB web viewer URL.
     */
    url_viewer: string;
    /**
     * Image URL in full resolution.
     */
    url: string;
    /**
     * Image display URL in lower resolution same as medium.
     */
    display_url: string;
    /**
     * Image width in pixels.
     */
    width: number;
    /**
     * Image height in pixels.
     */
    height: number;
    /**
     * Image size in bytes.
     */
    size: number;
    /**
     * Image upload time in seconds since epoch.
     */
    time: number;
    /**
     * Image expiration time in seconds if provided.
     */
    expiration: number;
    /**
     * Image data.
     */
    image: ImgBBImage;
    /**
     * Thumbnail image data cropped to a square to display in the ImgBB web interfaces.
     */
    thumb: ImgBBImage;
    /**
     * Image data in lower resolution generated only when a large image is uplaoded.
     */
    medium?: ImgBBImage;
    /**
     * ImgBB web interface URL to delete the image.
     */
    delete_url: string;
  };
  /**
   * Boolean indicating whether the upload was successful.
   */
  success: boolean;
  /**
   * HTTP status code.
   */
  status: number;
}

/**
 * ImgBB error response.
 */
export interface ImgBBError {
  /**
   * HTTP status code.
   */
  status_code: number;
  /**
   * ImgBB error.
   */
  error: {
    /**
     * ImgBB error message.
     */
    message: string;
    /**
     * ImgBB error code.
     */
    code: number;
  };
  /**
   * HTTP status text.
   */
  status_txt: string;
}
