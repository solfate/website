import { z } from "zod";
import {
  bioSchema,
  githubUrlToUsername,
  isValidLocalAssetImage,
  secureUrl,
  twitterUrlToUsername,
} from "../validators";
import { profileConfig } from "../const/profile";

export const profileSchema = z.object({
  bio: z.union([bioSchema.nullish(), z.literal("")]),
  name: z.union([
    z
      .string()
      .trim()
      .refine(
        (val) => val.length <= profileConfig.headline.max,
        `Headline must be less than ${profileConfig.headline.max} characters`,
      )
      .nullish(),
    z.literal(""),
  ]),
  oneLiner: z.union([
    z
      .string()
      .trim()
      .refine(
        (val) => val.length <= profileConfig.headline.max,
        `Headline must be less than ${profileConfig.headline.max} characters`,
      )
      .nullish(),
    z.literal(""),
  ]),
  image: z.union([
    secureUrl.refine(isValidLocalAssetImage).nullish(),
    z.literal(""),
  ]),

  website: z.union([secureUrl.nullish(), z.literal("")]),
  twitter: z.union([twitterUrlToUsername.nullish(), z.literal("")]),
  github: z.union([githubUrlToUsername.nullish(), z.literal("")]),
});

export type ApiProfilePatchInput = z.infer<typeof profileSchema>;
