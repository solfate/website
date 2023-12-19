/**
 * Library of common queries for managing Users and Profiles
 */

import prisma from "@/lib/prisma";
import { Profile, Prisma, User, Account } from "@prisma/client";

/**
 * Get a single User's master account from the database
 */
export async function getUser({
  id,
  username,
}: {
  id?: User["id"];
  username?: User["username"];
}) {
  if (!id && !username) return null;

  // smartly determine the methodology to locate the user
  // if (!!providerAccountId)

  return prisma.user.findMany({
    where: {
      id,
      username,
    },
    // include: {
    //   profile: {
    //     select: {
    //       username: true,
    //       image: true,
    //     },
    //   },
    // },
  });
}

/**
 * Lookup the User owner of an Account by its `providerAccountId`
 */
export async function getUserByProviderAccountId({
  providerAccountId,
}: {
  providerAccountId: Account["providerAccountId"];
}) {
  return prisma.user
    .findMany({
      where: {
        accounts: {
          every: {
            providerAccountId,
          },
        },
      },
    })
    .then((data) => data[0]);
}

/**
 * Get a single User's profile from the database
 *
 * note: this should be used when getting public information for a user
 */
export async function getUserProfile({
  username,
}: {
  username: Profile["username"];
  // status?: Profile["status"];
}) {
  const profile = await prisma.profile.findUnique({
    where: { username },
    // include: {
    //   user: {
    //     select: {
    //       name: true,
    //       username: true,
    //       image: true,
    //     },
    //   },
    // },
  });

  return profile;
}

/**
 * Update a single Profile in the database
 */
export async function updateProfile({
  username,
  data,
}: {
  username: Profile["username"];
  // status?: Profile["status"];
  data: Prisma.ProfileUpdateInput;
}) {
  const profile = await prisma.profile.update({
    where: {
      username,
    },
    data,
  });

  return profile;
}
