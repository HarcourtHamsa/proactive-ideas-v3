import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  callback: {
    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        console.log('User signed in:', user.name);
        return true
      },
      async redirect({ url, baseUrl }) {
        return baseUrl
      },
      async session({ session, user, token }) {
        return session
      },
      async jwt({ token, user, account, profile, isNewUser }) {
        return token
      }
    },
  },
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET as string,
    }),
    // ...add more providers here
  ],
}
export default NextAuth(authOptions)