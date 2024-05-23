import { z } from "zod";
import {
  USERNAME_BLACKLIST,
  USERNAME_BLACKLIST_PREFIX,
  USERNAME_MAX_LEN,
  USERNAME_MIN_LEN,
  USERNAME_REGEX,
} from "@/lib/const/profile";

export const usernameSchema = z
  .string()
  .refine(
    (val) => val.length <= USERNAME_MAX_LEN,
    `Username can be max of ${USERNAME_MAX_LEN} characters`,
  )
  .refine(
    (val) => val.length >= USERNAME_MIN_LEN,
    `Usernames <${USERNAME_MIN_LEN} characters are reserved`,
  )
  .refine(
    (val) => USERNAME_REGEX.test(val),
    `Invalid characters in the username`,
  )
  .refine((val) => !USERNAME_BLACKLIST.includes(val), `Username not allowed`)
  .refine((val) => {
    for (let prefix of USERNAME_BLACKLIST_PREFIX) {
      if (val.startsWith(prefix)) return false;
    }
    return true;
  }, `Username prefix not allowed`);
