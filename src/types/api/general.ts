import type { PresignedPost } from "@aws-sdk/s3-presigned-post";

/**
 * API input from a `POST` request to the `/api/upload` endpoint
 */
export type ApiUploadPostInput = {
  type: "profile";
  fileDetails: {
    name: string;
    type: string;
    size: number;
    lastModified: number;
    length: number;
  };
};

/**
 * API response from a `POST` request to the `/api/upload` endpoint
 */
export type ApiUploadPostResponse = {
  fileKey: string;
  assetUrl: string;
  signedUrl: string;
  contentType: string;
};
