import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"
import {
  getClientIp,
  hitRateLimit,
  LOGIN_RATE_LIMIT,
  loginEmailKey,
  loginIpKey,
} from "@/lib/rate-limit"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email.trim().toLowerCase()
        const ip = await getClientIp()

        const ipLimit = await hitRateLimit(
          loginIpKey(ip),
          LOGIN_RATE_LIMIT.maxAttempts,
          LOGIN_RATE_LIMIT.windowMs
        )
        if (!ipLimit.ok) {
          throw new Error("TOO_MANY_REQUESTS")
        }

        const emailLimit = await hitRateLimit(
          loginEmailKey(email),
          LOGIN_RATE_LIMIT.maxAttempts,
          LOGIN_RATE_LIMIT.windowMs
        )
        if (!emailLimit.ok) {
          throw new Error("TOO_MANY_REQUESTS")
        }

        const user = await prisma.user.findFirst({
          where: {
            email: { equals: email, mode: "insensitive" },
          },
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      }
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      }
    },
    jwt: ({ token, user }) => {
      if (user) {
        return {
          ...token,
          id: user.id,
        }
      }
      return token
    },
  },
}
