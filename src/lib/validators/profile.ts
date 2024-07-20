import { z } from "zod";
import {
  profileConfig,
  USERNAME_BLACKLIST,
  USERNAME_BLACKLIST_PREFIX,
  USERNAME_MAX_LEN,
  USERNAME_MIN_LEN,
  USERNAME_REGEX,
} from "@/lib/const/profile";

export const usernameSchema = z
  .string()
  .trim()
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

export const bioSchema = z
  .string()
  .trim()
  .refine(
    (val) => val.length <= profileConfig.bio.max,
    `Bio can be max of ${profileConfig.bio.max} characters`,
  )
  // remove multi line spaces (but still allow a single line break spacer)
  .transform((val) => val.replace(/^\s*$(?:\r\n?|\n)/gm, "\n").trim());
