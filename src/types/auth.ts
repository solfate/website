import { Account } from "@prisma/client";
import { Session } from "next-auth";

export type BaseSessionHandlerArgs = {
  req: Request;
  params?: Record<string, string>;
  searchParams?: Record<string, string>;
  session: Session;
};

/**
 * Request handler with a user's session and other desired checks
 */
export type WithAuthHandler = {
  ({
    req,
    params,
    searchParams,
    session,
  }: BaseSessionHandlerArgs & {}): Promise<Response>;
};

/**
 * Request handler with a user' session
 */
export type WithSessionHandler = {
  ({
    req,
    params,
    searchParams,
    session,
  }: BaseSessionHandlerArgs): Promise<Response>;
};

/**
 * Accounts grouped by their NextAuth `provider` (e.g. twitter, github, etc)
 */
export type AccountsGroupByProvider = Record<
  "twitter" | "github" | "solana",
  Account[] | undefined
> & {
  [key: string]: Account[] | undefined;
};

/**
 * Simplified NextAuth account type for stripping sensitive data
 *
 * todo: make this omit type to the values of the `AccountSanitizeKeys` below
 */
export type SimpleAccount = Omit<
  Account,
  "access_token" | "refresh_token" | "id_token"
>;

/**
 *
 */
export const AccountSanitizeKeys: Array<keyof Account> = [
  "access_token",
  "refresh_token",
  "id_token",
];
