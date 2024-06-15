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
import { SolanaProviderId } from "@/lib/auth/SolanaProvider";

export const PATCH = withUserAuth(async ({ req, session }) => {
  try {
    const input: ApiSettingsPatchInput = ApiSettingsPatchInputSchema.parse(
      await req.json(),
    );

    const currentUser = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        profile: {
          select: {
            walletAddress: true,
          },
        },
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

    // verify the user has verified the wallet address and attached it to their profile
    if (currentUser.profile?.walletAddress !== input.wallet) {
      const wallets = await prisma.account.findMany({
        where: {
          userId: currentUser.id,
          provider: SolanaProviderId,
        },
        select: { providerAccountId: true },
      });

      if (
        wallets.findIndex(
          ({ providerAccountId }) => providerAccountId === input.wallet,
        ) < 0
      ) {
        throw "You have not connected this wallet address";
      }
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        username: input.username,
        profile: {
          upsert: {
            create: {
              walletAddress: input.wallet,
            },
            update: {
              walletAddress: input.wallet,
            },
          },
        },
      },
    });

    if (!updatedUser) throw "Unable to update your username";

    return new Response("Your account settings were updated");
  } catch (err) {
    return ApiErrorResponse(err);
  }
});
