import { DefaultSession, User } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    session: {
      user: {
        /** The user's postal address. */
        role: string | undefined | null,
        access_token: string | undefined | null,
      } & DefaultSession["user"]
    }
  }
}