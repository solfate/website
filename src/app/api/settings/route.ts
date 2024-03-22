/**
 * API handlers for the "/api/settings" endpoint
 */

import { withUserAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ApiSettingsPatchInput } from "@/types/api/social";

export const PATCH = withUserAuth(async ({ req, session }) => {
  try {
    const input: ApiSettingsPatchInput = await req.json();
    if (!input) throw "Invalid input";

    if (typeof input.username != "undefined") {
      input.username = input.username.trim();

      if (input.username == session.user.username)
        return new Response("Your username was unchanged");

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

      // success! yay :)
      return new Response("Your username was updated");
    }

    // catch all error for unhandled requests
    throw "Unknown settings update request";
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
