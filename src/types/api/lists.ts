/**
 * Structure of the `data` field on applications
 */
export type DevListApplicationExtraData = {
  github: {
    id: string;
    username: string;
  };
  twitter: {
    id: string;
    username: string;
  };
  /** track the minting unix timestamp */
  mintTimestamp?: number;
  /** track the previously attempted assetIds */
  attemptedAssets?: string[];
};
