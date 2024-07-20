import { z } from "zod";
import { profileSchema } from "@/lib/schemas/profile";
import { usernameSchema } from "@/lib/validators";

export enum ONBOARDING_STEPS {
  SET_USERNAME = 1,
  UPLOAD_AVATAR = 2,
  BASIC_PROFILE = 3,
  LENGTH_SIZE = 3,
}

export const schema = profileSchema.extend({
  step: z
    .string()
    .refine((val) => parseInt(val), "Invalid onboarding step")
    .refine(
      (val) => Object.values(ONBOARDING_STEPS).includes(parseInt(val)),
      "Unknown onboarding step selected",
    ),
  username: usernameSchema,
});
