import { z } from "zod";
import {
  secureUrl,
  isValidLocalAssetImage,
  twitterUrlToUsername,
  githubUrlToUsername,
} from "@/lib/validators";

export const ApiProfilePatchInputSchema = z.object({
  name: z.union([z.string().trim().nullish(), z.literal("")]),
  bio: z.union([z.string().trim().nullish(), z.literal("")]),
  oneLiner: z.union([z.string().trim().nullish(), z.literal("")]),
  image: z.union([
    secureUrl.refine(isValidLocalAssetImage).nullish(),
    z.literal(""),
  ]),
  website: z.union([secureUrl.nullish(), z.literal("")]),
  twitter: z.union([twitterUrlToUsername.nullish(), z.literal("")]),
  github: z.union([githubUrlToUsername.nullish(), z.literal("")]),
});

export type ApiProfilePatchInput = z.infer<typeof ApiProfilePatchInputSchema>;
