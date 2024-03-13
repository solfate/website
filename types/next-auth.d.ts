import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      email?: string;
      name: string;
      picture?: string;
      username: string;
    };
  }
  /**
   * Additional fields of the next-auth `User`
   */
  interface User {
    username: string;
    picture?: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  /**
   * Additional fields of the next-auth `JWT`
   */
  interface JWT {
    username: string;
  }
}
