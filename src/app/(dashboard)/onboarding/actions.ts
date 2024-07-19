"use server";

import prisma from "@/lib/prisma";
import type { ActionFormState } from "@/types";
import { Prisma } from "@prisma/client";
import { getUserSession } from "@/lib/auth";
import { ONBOARDING_STEPS, schema } from "./const";
import { z } from "zod";

export async function onboardingFlow(
  _prevState: ActionFormState<typeof schema>,
  formData: FormData,
): Promise<ActionFormState<typeof schema>> {
  const session = await getUserSession();

  if (!session || !session.user.id) {
    return {
      message: "Login required",
    };
  }

  const input = schema.safeParse({
    step: formData.get("step"),
    username: formData.get("username"),
    bio: formData.get("bio"),
    name: formData.get("name"),
    oneLiner: formData.get("oneLiner"),
    image: formData.get("image"),
  });

  console.log("input::");
  console.log(input);

  if (!input.success) {
    return {
      message: "Invalid input",
      errors: input.error.flatten().fieldErrors,
      data: input.data,
    };
  }

  let currentStep = 0;

  try {
    currentStep = parseInt(input.data.step || "1");
    if (currentStep < 0) throw "Invalid step number";
    if (currentStep > ONBOARDING_STEPS.LENGTH_SIZE) throw "Invalid step number";
    input.data.step = currentStep.toString();
  } catch (err) {
    return {
      message: "Invalid step number",
      data: input.data,
    };
  }

  // incrementally validate the user input
  // if (input.data.step <= ONBOARDING_STEPS.UPLOAD_AVATAR) {
  //   if (!input.data.image) throw "An image is required";
  // }

  // if (input.data.step <= ONBOARDING_STEPS.BASIC_PROFILE) {
  //   if (!input.data.bio) throw "Invalid profile info";
  //   if (!input.data.name) throw "Invalid profile info";
  //   if (!input.data.oneLiner) throw "Invalid profile info";
  // }

  // only complete the full processing when actually on the final step
  input.data.step = (currentStep + 1).toString();
  if (currentStep < ONBOARDING_STEPS.LENGTH_SIZE) {
    return {
      success: true,
      data: input.data,
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: input.data.username,
      },
    });

    // todo: what is the difference between when a user does AND does NOT have
    // a profile db record?

    if (!!user) throw "Username already exists";

    // create or update the profile
    const updatedUserWithProfile = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        username: input.data.username,
        image: input.data.image,
        profile: {
          upsert: {
            create: {
              bio: input.data.bio?.replace(/^\s*$(?:\r\n?|\n)/gm, ""),
              name: input.data.name,
              image: input.data.image,
              oneLiner: input.data.oneLiner,
            },
            update: {
              bio: input.data.bio?.replace(/^\s*$(?:\r\n?|\n)/gm, ""),
              name: input.data.name,
              image: input.data.image,
              oneLiner: input.data.oneLiner,
            },
          },
        },
      },
    });

    console.log("updatedUserWithProfile:");
    console.log(updatedUserWithProfile);

    if (!updatedUserWithProfile) throw "Unable to create profile";

    input.data.step = (currentStep + 1).toString();

    return {
      data: input.data,
      success: true,
    };
  } catch (err) {
    console.warn("error:");
    console.warn(err);

    let message = "An unknown error occurred";

    if (typeof err == "string") message = err;
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // handle unique key constraint: `email`
      if (err.code === "P2002") {
        /**
         * todo: we should handle the case of a person already existed in the database, but is in a non active state
         *
         */

        // return a success to not allow people to enumerate the email list
        return {
          success: true,
          data: input.data,
        };
      }
    }

    return {
      message,
      data: input.data,
    };
  }
}
