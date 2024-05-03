import { z } from "zod";
import { USERNAME_MAX_LEN, USERNAME_MIN_LEN } from "@/lib/const/profile";
import { ASSETS_DOMAIN } from "../const/general";

export const secureUrl = z
  .string()
  .trim()
  .url("A valid url is required")
  .refine((val) => val.startsWith("https://"), "A secure url is required");

export const twitterUrlToUsername = secureUrl
  .refine(
    (val) => val.match(/^(?:https:\/\/(?:twitter|x).com)\/(.*)\/?/i),
    "A full twitter url is required",
  )
  .transform(
    (val) => val.match(/^(?:https:\/\/(?:twitter|x).com)\/(.*)\/?/i)?.[1],
  );

export const githubUrlToUsername = secureUrl
  .refine(
    (val) => val.match(/^(?:https:\/\/github.com)\/(.*)\/?/i),
    "A full twitter url is required",
  )
  .transform((val) => val.match(/^(?:https:\/\/github.com)\/(.*)\/?/i)?.[1]);

export const isValidLocalAssetImage = (val: string) => {
  try {
    const url = new URL(val);
    switch (url.hostname.toLowerCase()) {
      case ASSETS_DOMAIN:
        return true;
      case "storage.googleapis.com": {
        if (url.pathname.startsWith("/" + ASSETS_DOMAIN)) return true;
      }
      default:
        throw "Invalid image";
    }
  } catch (err) {
    return false;
  }
};
