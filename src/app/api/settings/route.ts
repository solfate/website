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

    const currentUser = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!currentUser) throw "Unable to locate your account";

    if (input.username.toLowerCase() !== currentUser.username.toLowerCase()) {
      const isUsernameTaken = await prisma.user.findUnique({
        where: {
          username: input.username,
        },
      });

      if (isUsernameTaken) throw `Username "${input.username}" is taken`;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        username: input.username,
      },
    });

    if (!updatedUser) throw "Unable to update your username";

    return new Response("Your account settings were updated");
  } catch (err) {
    return ApiErrorResponse(err);
  }
});
