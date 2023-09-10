import NextAuth from "next-auth/next";
import { NextApiRequest, NextApiResponse } from "next";
import GoogleProvider from "next-auth/providers/google";
import { getUserByEmail, handleSetCookie, register } from "@/helper";


export const authOptions: any = {
  callbacks: {
    async session({ session, user, token }) {
      const existingUser = await getUserByEmail({ email: session.user.email })

      if (!existingUser?.data) {
        await register({
          body: {
            email: session.user.email,
            first_name: session.user.name.split(" ")[0],
            last_name: session.user.name.split(" ")[1],
            password: 'proactiveideas' + session.user.email
          }
        })
      }

      session.user.role = existingUser?.data?.role || 'user'
      return session
    }
  },
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET as string,
    }),
  ],
};

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, authOptions);
