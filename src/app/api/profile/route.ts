/**
 * API handlers for the "/api/profile" endpoint
 */

import { withUserAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ApiProfilePatchInput } from "@/types/api/social";
import { Profile } from "@prisma/client";

export const PATCH = withUserAuth(async ({ req, session }) => {
  try {
    const input: ApiProfilePatchInput = await req.json();
    if (!input) throw "Invalid input";

    const validatedProfileData: Partial<Profile> = {};

    // todo: validate each input

    if (typeof input.name != "undefined") {
      validatedProfileData.name = input.name.trim();
    }

    if (typeof input.oneLiner != "undefined") {
      validatedProfileData.oneLiner = input.oneLiner.trim();
    }

    if (typeof input.bio != "undefined") {
      validatedProfileData.bio = input.bio.trim();
    }

    if (typeof input.website != "undefined") {
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

    if (typeof input.twitter != "undefined") {
      try {
        const twitterRegex = new RegExp(
          /^(https?:\/\/(twitter|x)\.com\/)?@?([a-zA-Z0-9_]+)\/?/g,
        );
        const twitter = twitterRegex.exec(input.twitter);
        validatedProfileData.twitter = twitter[twitter.length - 1];
      } catch (err) {
        throw "Invalid twitter";
      }
    }

    if (typeof input.github != "undefined") {
      validatedProfileData.github = input.github;
      try {
        const githubRegex = new RegExp(
          /^(https?:\/\/(github)\.com\/)?@?(^[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,38})\/?/g,
        );
        const github = githubRegex.exec(input.github);
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

    console.log("updatedProfile:", updatedProfile);

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
