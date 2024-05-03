/**
 * API handlers for the "/api/profile" endpoint
 */

import { withUserAuth } from "@/lib/auth";
import { ASSETS_DOMAIN } from "@/lib/const/general";
import prisma from "@/lib/prisma";
import { ApiProfilePatchInput } from "@/types/api/social";
import { Prisma } from "@prisma/client";

export const PATCH = withUserAuth(async ({ req, session }) => {
  try {
    const input: ApiProfilePatchInput = await req.json();
    if (!input) throw "Invalid input";

    const validatedProfileData: Prisma.ProfileUpdateInput = {};

    // todo: validate each input

    if (!!input.name) {
      validatedProfileData.name = input.name.trim();
    }

    if (!!input.image) {
      try {
        const url = new URL(input.image);

        switch (url.hostname.toLowerCase()) {
          case ASSETS_DOMAIN: {
            // valid and accepted
            break;
          }
          case "storage.googleapis.com": {
            // valid and accepted
            if (url.pathname.startsWith("/" + ASSETS_DOMAIN)) break;
          }
          default:
            throw "Invalid image";
        }

        if (!url.pathname.startsWith(`/profile/${session.user.id}`)) {
          throw "Invalid profile image url";
        }

        validatedProfileData.image = url.toString();
        validatedProfileData.user = {
          update: {
            image: validatedProfileData.image,
          },
        };
      } catch (err) {
        if (typeof err == "string") throw err;
        throw "Invalid image";
      }
    }

    if (!!input.oneLiner) {
      validatedProfileData.oneLiner = input.oneLiner.trim();
    }

    if (!!input.bio) {
      validatedProfileData.bio = input.bio.trim();
    }

    if (!!input.website) {
      try {
        validatedProfileData.website = new URL(
          input.website.replace(/^(https?:\/\/)?/gi, "https://"),
        )
          .toString()
          .trim();
      } catch (err) {
        throw "Invalid website";
      }
    }

    if (!!input.twitter) {
      try {
        const twitterRegex = new RegExp(
          /^(https?:\/\/(twitter|x)\.com\/)?@?([a-zA-Z0-9_]+)\/?/g,
        );
        const twitter = twitterRegex.exec(input.twitter) || [];
        validatedProfileData.twitter = twitter[twitter.length - 1];
      } catch (err) {
        throw "Invalid twitter";
      }
    }

    if (!!input.github) {
      validatedProfileData.github = input.github;
      try {
        const githubRegex = new RegExp(
          /^(https?:\/\/(github)\.com\/)?@?(^[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,38})\/?/g,
        );
        const github = githubRegex.exec(input.github) || [];
        validatedProfileData.github = github[github.length - 1];
      } catch (err) {
        throw "Invalid twitter";
      }
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
    console.warn("[API error]", err);

    let message = "An unknown error occurred";

    if (typeof err == "string") message = err;
    else if (err instanceof Error) message = err.message;

    return new Response(message, {
      status: 400,
    });
  }
});
