import { Profile } from "@prisma/client";

/**
 * API input from a `PATCH` request to the `/api/settings` endpoint
 */
export type ApiSettingsPatchInput = Partial<{
  username: string;
}>;

/**
 * API input from a `PATCH` request to the `/api/profile` endpoint
 */
export type ApiProfilePatchInput = Partial<Profile>;
