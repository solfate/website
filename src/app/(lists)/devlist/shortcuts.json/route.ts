/**
 * Wallet shortcuts for the DevList collection
 */

import { SITE, TWITTER } from "@/lib/const/general";
import { WalletShortcutSchema } from "@/types/shortcuts";

const devlistUrl = new URL(`https://${SITE.domain}/devlist`);

export const GET = () => {
  return Response.json({
    version: 1,
    shortcuts: [
      {
        icon: "view",
        label: `Learn more about DevList`,
        uri: devlistUrl.toString(),
        prefersExternalTarget: true,
      },
      {
        icon: "twitter",
        label: `Follow ${TWITTER.handle} on Twitter`,
        uri: TWITTER.url,
        prefersExternalTarget: true,
      },
    ],
  } as WalletShortcutSchema);
};
