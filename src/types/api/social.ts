import { Profile } from "@prisma/client";

/**
 * API input from a `PATCH` request to the `/api/profile` endpoint
 */
export type ApiProfilePatchInput = Partial<Profile>;
