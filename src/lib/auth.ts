import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { signInSchema } from "@/features/auth/auth.validation";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { UserRole } from "@/lib/roles";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/sign-in",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const parsed = signInSchema.safeParse({
          email: credentials?.email,
          password: credentials?.password,
        });

        if (!parsed.success) {
          return null;
        }

        const rateLimit = await checkRateLimit(`sign-in:${parsed.data.email}`, {
          limit: 10,
          windowMs: 15 * 60 * 1000,
        });

        if (!rateLimit.allowed) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: parsed.data.email,
          },
        });

        if (!user?.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          parsed.data.password,
          user.password,
        );

        if (!isPasswordValid) {
          return null;
        }

        if (!user.emailVerified) {
          throw new Error("EMAIL_NOT_VERIFIED");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          sessionVersion: user.sessionVersion,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.sessionVersion = user.sessionVersion;
        token.invalid = false;

        return token;
      }

      if (!token.sub) {
        return token;
      }

      const currentUser = await prisma.user.findUnique({
        where: { id: token.sub },
        select: {
          role: true,
          sessionVersion: true,
          emailVerified: true,
        },
      });

      token.invalid =
        !currentUser ||
        !currentUser.emailVerified ||
        token.sessionVersion !== currentUser.sessionVersion;

      if (currentUser && !token.invalid) {
        token.role = currentUser.role;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.invalid ? "" : (token.sub ?? "");
        session.user.role = token.role ?? UserRole.USER;
      }

      return session;
    },
  },
};
