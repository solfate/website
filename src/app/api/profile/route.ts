/**
 * API handlers for the "/api/profile" endpoint
 */

import { ApiErrorResponse } from "@/lib/api";
import { withUserAuth } from "@/lib/auth";
import { ASSETS_DOMAIN } from "@/lib/const/general";
import prisma from "@/lib/prisma";
import {
  secureUrl,
  isValidLocalAssetImage,
  twitterUrlToUsername,
  githubUrlToUsername,
} from "@/lib/validators";
import { Prisma } from "@prisma/client";
import { z } from "zod";

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

export const PATCH = withUserAuth(async ({ req, session }) => {
  try {
    const input: ApiProfilePatchInput = ApiProfilePatchInputSchema.parse(
      await req.json(),
    );

    // init the with the data that requires no additional validation
    const validatedProfileData: Prisma.ProfileUpdateInput = {
      name: input.name,
      oneLiner: input.oneLiner,
      bio: input.bio,
      website: input.website,
      twitter: input.twitter,
      github: input.github,
    };

    if (!!input.image) {
      const url = new URL(input.image);

      // only allow the user to use images that they uploaded
      if (!url.pathname.startsWith(`/profile/${session.user.id}`)) {
        throw "Invalid profile image url";
      }

      // we have to update the image in both locations
      // todo: make it so we don't have to update in two places
      validatedProfileData.image = url.toString();
      validatedProfileData.user = {
        update: {
          image: validatedProfileData.image,
        },
      };
    }

    const updatedProfile = await prisma.profile.update({
      where: {
        username: session.user.username,
      },
      data: validatedProfileData,
    });

    if (!updatedProfile) throw "Unable to update profile";

    // success! yay :)
    return new Response("Your profile was updated");
  } catch (err) {
    return ApiErrorResponse(err);
  }
});
