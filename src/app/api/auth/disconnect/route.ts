/**
 * API handlers for the "/api/auth/disconnect" endpoint
 *
 * Delete a User's Account record (aka disconnect an external provider)
 */

import prisma from "@/lib/prisma";
import { ApiAuthDisconnectDeleteInput } from "@/types/api/auth";
import { withUserAuth } from "@/lib/auth";

export const DELETE = withUserAuth(async ({ req, session }) => {
  try {
    let input: ApiAuthDisconnectDeleteInput = await req.json();

    input = {
      provider: input.provider?.trim(),
      providerAccountId: input.providerAccountId?.trim(),
    };

    // perform the input validation
    if (!input.provider || !input.providerAccountId) {
      return new Response("Missing account details.", { status: 400 });
    }

    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        provider: input.provider,
        providerAccountId: input.providerAccountId,
      },
    });

    if (!account) {
      return new Response("Unable to locate account", {
        status: 400,
      });
    }

    const deleted = await prisma.account.delete({
      where: {
        userId: session.user.id,
        id: account.id,
      },
    });

    if (!deleted) {
      return new Response(
        "An error occurred while disconnecting your account",
        {
          status: 400,
        },
      );
    }

    return new Response("Account disconnected!");
  } catch (err) {
    return new Response("An unknown error occurred", {
      status: 400,
    });
  }
});
