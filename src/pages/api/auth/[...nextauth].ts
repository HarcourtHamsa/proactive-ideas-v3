// @ts-nocheck
import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import CredentialsProvider from 'next-auth/providers/credentials'
import http from "@/lib/http";

var customObj;


export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_ID,
            clientSecret: process.env.FACEBOOK_SECRET,
        }),
        CredentialsProvider({
            name: "Credentials",
            async authorize(credentials, req) {
                const { emailAddress, password } = req.body


                console.log(emailAddress, password);

                const apiResponse = await http.post("/auth/login", { emailAddress, password })
                const data = apiResponse.data.data

                console.log("DATA", data);


                customObj = {
                    role: data.user[0].role,
                    access_token: data.access_token
                }

                console.log("CUSTOM OBJ", customObj);


                if (data) {
                    return {
                        name: data.user[0].firstName + " " + data.user[0].lastName,
                        email: data.user[0].emailAddress,
                        image: '',
                        role: data.user[0].role
                    }

                } else {
                    return null
                }
            },
        }),
    ],
    secret: "LlKq6ZtYbr+hTC073mAmAh9/h2HwMfsFo4hrfCx9mLg=",
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {   
            
        },
        async redirect({ url, baseUrl }) {
            return baseUrl
        },
        session: async (session: Session, user: any, options) => {
            return session
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            return token
        }
    }
}

export default NextAuth(authOptions)