/**
 * Library of common queries for managing Accounts
 * (i.e. those from NextAuth)
 */

import prisma from "@/lib/prisma";
import { Account, User } from "@prisma/client";
import { Account as AuthAccount } from "next-auth";

/**
 * Get a listing of NextAuth Accounts by their provider account id
 */
export async function getAccountByProviderId({
  provider,
  providerAccountId,
}: {
  provider: Account["provider"];
  providerAccountId: Account["providerAccountId"];
}) {
  return prisma.account.findMany({
    where: { provider, providerAccountId },
  });
}

/**
 * Get a listing of NextAuth Accounts the desired user
 */
export async function getAccountsByUserId({
  userId,
}: {
  userId?: Account["userId"];
}) {
  if (!userId) return [];
  return prisma.account.findMany({
    where: { userId },
  });
}

/**
 * Create a new NextAuth Account, linking it to a User by its `userId`
 */
export async function createAccount({
  userId,
  account,
  provider_profile,
}: {
  userId: User["id"];
  account: AuthAccount;
  /** `profile` data returned by the provider upon successful authentication */
  provider_profile?: object;
}) {
  // todo: save the external profile `data` returned from the external authentication provider
  return prisma.account.create({
    data: {
      ...account,
      // force override the account user connection
      userId,
      provider_profile,
    },
  });
}
