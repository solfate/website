/**
 * API handlers for the "/api/settings" endpoint
 */

import { withUserAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { ApiSettingsPatchInput } from "@/types/api/social";
import { usernameSchema } from "@/lib/schema/prisma";
import { ApiErrorResponse } from "@/lib/api";

export const PATCH = withUserAuth(async ({ req, session }) => {
  try {
    const rawInput: ApiSettingsPatchInput = await req.json();
    if (!rawInput) throw "Invalid input";

    if (
      typeof rawInput.username != "undefined" &&
      !!rawInput?.username &&
      rawInput.username.toLowerCase() == session.user.username.toLowerCase()
    ) {
      return new Response("Your username was unchanged");
    }

    const inputSchema = z.object({
      username: usernameSchema,
    });

    const input = inputSchema.parse(rawInput);

    if (!!input.username) {
      const isUsernameTaken = await prisma.user.findUnique({
        where: {
          username: input.username,
        },
      });

      if (isUsernameTaken) throw `Username "${input.username}" is taken`;

      const updatedUser = await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          username: input.username,
          profile: {
            upsert: {
              create: {},
              update: {},
            },
          },
        },
      });

      if (!updatedUser) throw "Unable to update your username";
      return new Response("Your username was updated");
    }

    return new Response("No changes were made");
  } catch (err) {
    return ApiErrorResponse(err);
  }
});
