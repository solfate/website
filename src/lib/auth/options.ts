import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions, getServerSession } from "next-auth";
import { SITE } from "@/lib/const/general";
import { debug } from "@/lib/helpers";
import { getUser } from "@/lib/queries/users";
import { createAccount, getAccountByProviderId } from "@/lib/queries/accounts";

import { SolanaProvider } from "./SolanaProvider";
import { SolanaProviderId } from "./const";
import CredentialsProvider from "next-auth/providers/credentials";
import Twitter from "next-auth/providers/twitter";
import Github from "next-auth/providers/github";
import { Account, User } from "@prisma/client";

const IS_VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

// define a list of accepted auth providers
export const authOptions: NextAuthOptions = {
  providers: [
    /**
     * warning: this "sign in with solana" option should remain the first provider
     * to enable easily removing it from the list of providers on the default next-auth pages
     */
    SolanaProvider({}),
    Twitter({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      version: "2.0",
    }),
    Github({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    /**
     * this JWT provider is used as a hack to force update a user's session
     * by calling `signIn("jwt")` on the client, it forces the session to
     * refresh the data updated in the token (i.e. updated username)
     */
    CredentialsProvider({
      type: "credentials",
      id: "jwt",
      name: "jwt",
      credentials: {},
      async authorize() {
        try {
          const user = await getUser({});
          if (!user) throw "Unable to locate current user";
          // todo: this will create a db Account record for JWT as a provider. prevent this
          return user as User;
        } catch (err) {
          console.warn("jwt:", err);
          // always return `null` to signify an unauthorized request
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    newUser: "/onboarding", // New users will be directed here on first sign in (leave the property out if not of interest)
    signOut: "/signout",
    // todo: handle the errors (like when a use cancels the auth and returns to the app)
    // error: "/signin", // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: `${IS_VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // When working on localhost, the cookie domain must be omitted entirely (https://stackoverflow.com/a/1188145)
        domain: IS_VERCEL_DEPLOYMENT
          ? process.env.VERCEL_ENV == "production"
            ? `.${SITE.domain}`
            : `.${process.env.VERCEL_BRANCH_URL}`
          : undefined,
        secure: IS_VERCEL_DEPLOYMENT,
      },
    },
  },
  callbacks: {
    /**
     * control if the `user` is actually allowed to signin
     * (i.e. blacklisting, wait-listed, etc)
     */
    signIn: async ({ user, account, credentials, email, profile }) => {
      debug("[/api/auth]", "signIn callback");

      debug("[user]", user);
      debug("[account]", account);
      debug("[profile]", profile);
      debug("[credentials]", credentials);

      // TODO: add ability to blacklist email/wallets
      // const BLACKLISTED_EMAILS = await getBlackListedEmails();
      // if (BLACKLISTED_EMAILS.has(user.email)) {
      // 	return false;
      // }

      // get the user session so we can handle different sign in flows
      // based on already authenticated users (or lack thereof)
      const session = await getServerSession(authOptions);
      debug("session::", session);

      // we only allow creating new accounts using the "solana" provider
      // all other new accounts should fail
      if (account?.provider == SolanaProviderId) {
        // todo: we may want to handle other things here in the future

        // do not allow signing in with a solana wallet if the user already has a session
        if (!!session) {
          debug("Solana wallet-session error");
          throw Error("Solana wallet error");
        }

        return true;
      }

      // when a new sign in request is coming from an authenticated user
      // we shall assume they are attempting to verify/link another provider's account
      // to the already signed in user's account
      if (!!account && session) {
        debug(
          "todo: perform the database operations to add a new verified account to the signed in user",
        );

        // determine if this account has already been added
        const existingAccounts = await getAccountByProviderId({
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        });

        debug("existingAccount:", existingAccounts);

        // todo: prevent linking new accounts if the `account` already exists
        // this prevents multiple accounts from linking to the same external account
        if (existingAccounts.length > 0) {
          debug(`external account already exists:`, account);

          // attempt to locate the existing account connected to the current user
          if (
            existingAccounts.filter(
              (item: Account) => item.userId === session.user.id,
            ).length > 0
          ) {
            // when the user that owns the connected account is renewing their auth token,
            // this should not give an error, but rather update the connection data
            debug("todo: refresh the saved external account data");

            // todo: refresh the saved external account data

            return true;
          }

          // when the Account belongs to a different user, then give an error
          throw Error("External account already exists");
        }

        // manually create the new Account and link it to the User
        // saving any additional info as desired
        try {
          const linkUser = await createAccount({
            userId: session.user.id,
            account: account,
            // save the profile information provided from the external provider
            provider_profile: profile,
          });

          debug("linkUser:", linkUser);
        } catch (err) {
          console.warn("error linking account");
          console.warn(err);
        }

        // we can force override the UI provided `callbackUrl` by returning a new callback url
        // but this is likely not a good idea if we want to have multiple client pages have auth flows
        // return `/settings/connections?${account.provider}`;

        return true;
      }

      /**
       * note: if a user already has a session via the "solana" provider, and
       * attempted to sign in again, their second sign in attempt will fail.
       * this is not a real concern since they should not be able to access
       * the `/signin` page when already authed
       */
      debug(
        "user attempted to create a new account with an unapproved provider",
      );
      return false;
    },
    /**
     * craft payload returned to the client in the session requests (i.e. `getServerSession`)
     */
    jwt: async ({ token, account, user }) => {
      // const BLACKLISTED_EMAILS = await getBlackListedEmails();
      // if (BLACKLISTED_EMAILS.has(token.email)) {
      // 	return {};
      // }

      // debug("[/api/auth]", "jwt");
      // debug("[user]", user);
      // debug("[account]", account);
      // debug("[token]", token);

      // handle unique actions based on the "solana" provider
      // if (account?.provider == SolanaProviderId) {
      //   token.provider = SolanaProviderId;
      //   token.wallet = account.providerAccountId;
      // }

      // add the user specific details into the jwt
      if (user) {
        // note: update the `next-auth.d.ts` add more fields
        token.id = user.id;
        token.picture = user.image;
        token.email = user.email;
        token.name = user.name;
        token.username = user.username;
      }

      // add the specific "provider account" access token
      if (account) {
        token.accessToken = account.access_token;
      }

      return token;
    },
    /**
     * handler for all the session checking actions
     * note: we can return custom data here if desired
     */
    session: async ({ session, token, user }) => {
      debug("[/api/auth]", "fetch session");

      // debug("[session]", session);
      // debug("[token]", token);
      // debug("[user]", user);

      // @ts-expect-error
      session.user = token;

      /**
       * note: add any extra data into the session that is desired here
       * or validate the current session data and update as desired from the db
       */

      // debug("session:", session);
      return session;
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      debug("[api/auth] signIn event");

      // force delete the jwt account since it is used for temporary session refreshes
      if (account?.provider == "jwt") {
        debug("removing temporary jwt account");
        await prisma.account.delete({
          where: {
            provider_providerAccountId: {
              provider: "jwt",
              providerAccountId: account.providerAccountId,
            },
          },
        });
      }

      /**
       * todo: handle creating a new Team and TeamMember relationship for newly created users
       * (e.g. for email sign in)
       */
      // handle a new User record being created
      // if (isNewUser) {
      //   debug("[new user]", user);

      //   // create a new team with this newly created user as the admin
      //   const team = await createTeamWithMember({
      //     team: {
      //       label: "Personal",
      //     },
      //     user: user as User,
      //   });

      // // ensure the new Team record/relationship was created
      //   if (!team) console.warn(`  "createTeamWithMember" failed`);

      //   // TODO: send a welcome email
      //   // const email = message.user.email;
      //   // await Promise.all([
      //   // 	sendMarketingMail({
      //   // 		subject: `✨ Welcome to ${SITE_NAME}`,
      //   // 		to: email,
      //   // 		component: <WelcomeEmail />,
      //   // 	}),
      //   // 	prisma.user.update({
      //   // 		where: { email },
      //   // 		data: { billingCycleStart: new Date().getDate() },
      //   // 	}),
      //   // ]);
      // }
    },
  },
};
