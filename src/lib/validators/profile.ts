import { z } from "zod";
import { USERNAME_MAX_LEN, USERNAME_MIN_LEN } from "@/lib/const/profile";

export const usernameSchema = z
  .string()
  .refine(
    (val) => val.length <= USERNAME_MAX_LEN,
    `Username can be max of ${USERNAME_MAX_LEN} characters`,
  )
  .refine(
    (val) => val.length >= USERNAME_MIN_LEN,
    `Usernames <${USERNAME_MIN_LEN} characters are reserved`,
  );
