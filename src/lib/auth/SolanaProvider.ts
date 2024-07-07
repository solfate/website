import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { SolanaAuth } from "solana-auth";
import { debug } from "@/lib/helpers";
import { getUser, getUserByProviderAccountId } from "@/lib//queries/users";
import { NextAuthOptions, User } from "next-auth";
// import { getCsrfToken } from "next-auth/react";
import { SolanaProviderId } from "./const";
import { getUserSession } from ".";

/***/
export type SolanaProviderConfig = {};

/***/
export function SolanaProvider({}: SolanaProviderConfig) {
  return CredentialsProvider({
    type: "credentials",
    id: SolanaProviderId,
    name: "Sign in with Solana",
    credentials: {
      message: {
        label: "Message payload",
        type: "text",
      },
      signedData: {
        label: "Signed data from the wallet",
        type: "text",
      },
    },

    /**
     *
     */
    async authorize(credentials) {
      try {
        debug("Solana login :: authorize");

        // ensure existence of the required input
        if (!credentials || !credentials.message || !credentials.signedData)
          throw new Error("Invalid Solana credentials provided");

        // manually get the CSRF token since `getCsrfToken` seems to not work in NextJS app router?
        const cookieVal = cookies()
          .getAll()
          .find((item) => item.name.includes("next-auth.csrf-token"));
        const csrfToken = decodeURI(cookieVal?.value || "").split("|")[0];

        // parse the signed message provided within the request
        const solanaAuth = new SolanaAuth({
          signedData: credentials.signedData,
          message: credentials.message,
          // manually add in the enforced server data
          overrides: {
            nonce: csrfToken,
            // todo: domain?
          },
        });

        // todo: perform a proper domain check using allowed domains
        // if (solanaAuth.domain !== nextAuthUrl.host) {
        //   debug("domain/host failed");
        //   return null;
        // }

        // todo: perform a proper csrf check
        // if (solanaAuth.message.nonce !== csrfToken) {
        //   throw Error("The message token did not match the server token");
        // }

        // actually validate/check the submitted message for the signature
        if (!solanaAuth.verifyAny())
          throw new Error("Could not validate the signed message");

        const session = await getUserSession();
        if (session) {
          const user = await getUser();
          return user as User;
        }

        // locate the User from the db based on the connected wallet as an Account
        let user = await getUserByProviderAccountId({
          providerAccountId: solanaAuth.message.address,
        });

        // when no user was found, create their new User record
        if (!user) {
          // when desired, prevent new users from being created at all
          // if (!process.env?.NEXT_PUBLIC_ALLOW_NEW_USERS) {
          //   debug("New user self signup is disabled");
          //   return null;
          // }

          // debug("create new user:", solanaAuth.publicKey);

          // manually create the User and Account record for the authenticated wallet
          // (making a valid ownership connection to the wallet address and the User record)
          user = await prisma.user.create({
            data: {
              username: solanaAuth.message.address,
              // todo: maybe set the default `user.name` to be a solana domain?
              // name: solanaAuth.message.address,
              status: "ACTIVE",
              accounts: {
                create: {
                  provider: SolanaProviderId,
                  providerAccountId: solanaAuth.message.address,
                  type: "credentials",
                },
              },
              // profile: {
              //   create: {
              //     status: "ACTIVE",
              //   },
              // },
            },
          });

          // create a new team with this newly created user as the admin
          // const team = await createTeamWithMember({
          //   team: {
          //     label: "Personal",
          //   },
          //   user: user as User,
          // });

          // // ensure the new Team record/relationship was created
          // if (!team) console.warn(`  "createTeamWithMember" failed`);
        }

        debug("db user:", user);

        // prevent locked out users from signing in
        if (
          user.status === "DISABLED" ||
          user.status === "LOCKED" ||
          user.status === "DELETED"
        )
          return null;

        // todo: figure out how to get the prisma type to work correctly here
        return user as User;
      } catch (err) {
        console.warn("SignInWithSolana auth error:", err);
        // always return `null` to signify an unauthorized request
        return null;
      }
    },
  });
}

/**
 * Remove special NextAuth providers from the `providers` listing
 *
 * This is useful for preventing providers that require wallet connections from
 * being displayed on the `/api/auth/signin` web page when accessed directly
 *
 * ---
 * Note: This is usually not needed if you defined a custom
 * `authOptions.pages.signIn` route since NextAuth should prevent
 * directly accessing the default `/api/auth/signIn` web page
 */
export function removeSpecialProviders(
  providers: NextAuthOptions["providers"],
  idList: string[],
) {
  return providers.filter(
    (provider) =>
      idList.findIndex((id) => id == provider.id) < 0 &&
      idList.findIndex((id) => id == provider?.options?.id) < 0,
  );
}
