import type { ImgBBError, ImgBBResult } from "./lib/types.js";
import { isErrorResponse, isSuccessResponse } from "./predicates.js";

export const parseErrorResponse = async (response: Response): Promise<ImgBBError> => {
  try {
    const data = await response.json();

    if (!isErrorResponse(data)) {
      throw new Error("Unexpected error response");
    }

    return data;
  } catch (err) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`, {
      cause: err,
    });
  }
};

export const parseSuccessResponse = async (response: Response): Promise<ImgBBResult> => {
  const data = await response.json();

  if (!isSuccessResponse(data)) {
    throw new Error("Unexpected success response");
  }

  return data;
};
