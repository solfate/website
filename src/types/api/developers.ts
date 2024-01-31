/**
 * API input from a `POST` request to the `/api/lists/developers` endpoint
 * (aka submitting a person's response to the questions)
 */
export type ApiListDevelopersPostInput = {
  why: string;
  who?: string;
};

/**
 * API input from a `PUT` request to the `/api/lists/developers` endpoint
 */
export type ApiListDevelopersPutInput = {
  /** base58 address to use as the token's mint */
  mint: string;
  /** unsigned data */
  message: string;
  /** signed version of the `message` data */
  signedData: string;
  /** fields to support additional metadata */
  metadata?: {
    twitter?: boolean;
    github?: boolean;
  };
};

/**
 * API response from a `PUT` request to the `/api/lists/developers` endpoint
 */
export type ApiListDevelopersPutResponse = {
  /** the asset id (aka mint address) for the token being created */
  assetId: string;
  /** base58 encoded, partially signed transaction */
  serializedTransaction: string;
};
