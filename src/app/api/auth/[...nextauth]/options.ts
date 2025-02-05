
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/Users.model";

export const authOption: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@email.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        dbConnect();

        try {
          const user = await userModel.findOne({
            $or: [
              { email: credentials.identifier },
              { id: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error("No such user already exists :(");
          } else {
            if (!user.isVerified) {
              throw new Error("Please verify your account before you login...");
            } else {
              //means user exists and lets check the password
              const isPasswordCorrect = await bcrypt.compare(
                credentials.password,
                user.password
              );

              if (isPasswordCorrect) {
                //checking password
                return user;
              } else {
                throw new Error("Wrong password mate!");
              }
            }
          }
        } catch (error: any) {
          throw new Error(error.message || "An error occurred during authentication");

        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.username = user.username;
        token.isVerified = user.isVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.username = token.username;
        session.user.isVerified = token.isVerified;
      }
      else{
        throw new Error("middleware :: session :: Error :unauthorized")
      }

      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXT_AUTH_SECRET_KEY,
};
