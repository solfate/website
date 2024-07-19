/**
 * API handlers for the "/api/settings/tips" endpoint
 */

import { withUserAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ApiErrorResponse } from "@/lib/api";
import {
  ApiSettingsTipPatchInput,
  ApiSettingsTipPatchInputSchema,
} from "@/lib/schemas/settings";
import { SolanaProviderId } from "@/lib/auth/const";
import { getUserProfile } from "@/lib/queries/users";

export const PATCH = withUserAuth(async ({ req, session }) => {
  try {
    const input: ApiSettingsTipPatchInput =
      ApiSettingsTipPatchInputSchema.parse(await req.json());

    const profile = await getUserProfile();

    if (!profile) throw "Unable to locate your profile. Do you have one setup?";

    if (profile.walletAddress !== input.wallet) {
      if (input.wallet == "none") throw "Please select a wallet address";

      const wallets = (
        await prisma.account.findMany({
          where: { userId: session.user.id, provider: SolanaProviderId },
          select: { providerAccountId: true },
        })
      ).map((item) => item.providerAccountId);

      if (wallets.findIndex((address) => address === input.wallet) < 0) {
        throw "Unable to locate this wallet. Have you connected it already?";
      }
    }

    const updatedProfile = await prisma.profile.update({
      where: {
        username: profile.username,
      },
      data: {
        walletAddress: input.wallet,
      },
    });

    if (!updatedProfile) throw "Unable to update your settings";

    return new Response("Your changed have been saved!");
  } catch (err) {
    return ApiErrorResponse(err);
  }
});
