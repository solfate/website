import {
  isValidLocalAssetImage,
  secureUrl,
  usernameSchema,
} from "@/lib/validators";
import { z } from "zod";

export enum ONBOARDING_STEPS {
  SET_USERNAME = 1,
  UPLOAD_AVATAR = 2,
  BASIC_PROFILE = 3,
  LENGTH_SIZE = 3,
}

export const schema = z.object({
  step: z.string(),
  // .refine(
  //   (val) => val < 0 && val > ONBOARDING_STEPS.LENGTH_SIZE,
  //   "Invalid onboarding step",
  // ),
  username: usernameSchema,
  name: z.union([z.string().trim().nullish(), z.literal("")]),
  bio: z.union([z.string().trim().nullish(), z.literal("")]),
  oneLiner: z.union([z.string().trim().nullish(), z.literal("")]),
  image: z.union([
    secureUrl.refine(isValidLocalAssetImage).nullish(),
    z.literal(""),
  ]),
});
