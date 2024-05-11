/**
 * API handlers for the "/api/settings" endpoint
 */

import { withUserAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ApiErrorResponse } from "@/lib/api";
import {
  ApiSettingsPatchInput,
  ApiSettingsPatchInputSchema,
} from "@/lib/schemas/settings";

export const PATCH = withUserAuth(async ({ req, session }) => {
  try {
    const input: ApiSettingsPatchInput = ApiSettingsPatchInputSchema.parse(
      await req.json(),
    );

    if (
      !!input.username &&
      input.username.toLowerCase() == session.user.username.toLowerCase()
    ) {
      return new Response("Your username was unchanged");
    }

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
