"use server"

import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { validatePassword } from "@/lib/password"
import {
  getClientIp,
  hitRateLimit,
  isRateLimited,
  LOGIN_RATE_LIMIT,
  loginEmailKey,
  loginIpKey,
  REGISTER_RATE_LIMIT,
  registerIpKey,
} from "@/lib/rate-limit"

export async function registerUser(data: {
  name: string
  email: string
  password: string
}) {
  try {
    const ip = await getClientIp()
    const rateLimit = await hitRateLimit(
      registerIpKey(ip),
      REGISTER_RATE_LIMIT.maxAttempts,
      REGISTER_RATE_LIMIT.windowMs
    )

    if (!rateLimit.ok) {
      return {
        success: false,
        error: rateLimit.error,
      }
    }

    const passwordCheck = validatePassword(data.password)
    if (!passwordCheck.ok) {
      return {
        success: false,
        error: passwordCheck.error,
      }
    }

    const email = data.email.trim().toLowerCase()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return {
        success: false,
        error: "User already exists",
      }
    }

    // Hash password
    const hashedPassword = await hash(data.password, 10)

    // Create user with a transaction to ensure both user and categories are created
    const user = await prisma.$transaction(async (tx) => {
      // Create the user
      const newUser = await tx.user.create({
        data: {
          name: data.name,
          email,
          password: hashedPassword,
        },
      })

      // Create default categories for the user
      const defaultCategories = [
        { name: "Salary", type: "INCOME" as const, color: "#22c55e" },
        { name: "Investments", type: "INCOME" as const, color: "#3b82f6" },
        { name: "Other Income", type: "INCOME" as const, color: "#8b5cf6" },
        { name: "Housing", type: "EXPENSE" as const, color: "#ef4444" },
        { name: "Transportation", type: "EXPENSE" as const, color: "#f97316" },
        { name: "Food", type: "EXPENSE" as const, color: "#eab308" },
        { name: "Utilities", type: "EXPENSE" as const, color: "#14b8a6" },
        { name: "Healthcare", type: "EXPENSE" as const, color: "#f43f5e" },
        { name: "Entertainment", type: "EXPENSE" as const, color: "#a855f7" },
        { name: "Other Expenses", type: "EXPENSE" as const, color: "#64748b" },
      ]

      await tx.category.createMany({
        data: defaultCategories.map((category) => ({
          ...category,
          userId: newUser.id,
        })),
      })

      return newUser
    })

    return {
      success: true,
      user,
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      error: "Failed to create account",
    }
  }
}

/** After a failed NextAuth sign-in, detect whether the failure was rate limiting. */
export async function getLoginFailureMessage(email: string): Promise<string> {
  const ip = await getClientIp()
  const normalizedEmail = email.trim().toLowerCase()

  const [ipStatus, emailStatus] = await Promise.all([
    isRateLimited(loginIpKey(ip), LOGIN_RATE_LIMIT.maxAttempts),
    isRateLimited(loginEmailKey(normalizedEmail), LOGIN_RATE_LIMIT.maxAttempts),
  ])

  if (!ipStatus.ok) return ipStatus.error
  if (!emailStatus.ok) return emailStatus.error

  return "Invalid email or password"
}
