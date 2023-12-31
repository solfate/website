import { Account } from "@prisma/client";

/**
 * API input from a `DELETE` request to the `/api/auth/disconnect` endpoint
 * (aka delete an Account record)
 */
export type ApiAuthDisconnectDeleteInput = {
  provider: Account["provider"];
  providerAccountId: Account["providerAccountId"];
};
