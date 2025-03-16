import { NextAuthOptions } from "next-auth";
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
      async authorize(credentials: Record<"email" | "password", string> | undefined) {
        if (!credentials) {
          throw new Error("Credentials are required");
        }
      
        await dbConnect();
      
        try {
          const user = await userModel.findOne({ email: credentials.email }).lean(); // Convert to plain object
      
          if (!user) {
            throw new Error("No such user exists :(");
          }
      
          if (!user.isVerified) {
            throw new Error("Please verify your account before logging in...");
          }
      
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
      
          if (!isPasswordCorrect) {
            throw new Error("Wrong password mate!");
          }
      
          return user; // Since it's now a plain object, NextAuth won't complain
        } catch (error: any) {
          throw new Error(error.message || "An error occurred during authentication");
        }
      }
      
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
      } else {
        throw new Error("middleware :: session :: Error :unauthorized");
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
