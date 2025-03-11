'use server'

import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import type { PrismaClient } from "@prisma/client"

const DEFAULT_CATEGORIES = [
  // Income categories
  { name: "Salary", type: "INCOME", color: "#22c55e" },
  { name: "Freelance", type: "INCOME", color: "#3b82f6" },
  { name: "Investments", type: "INCOME", color: "#6366f1" },
  { name: "Other Income", type: "INCOME", color: "#8b5cf6" },
  
  // Expense categories
  { name: "Housing", type: "EXPENSE", color: "#ef4444" },
  { name: "Transportation", type: "EXPENSE", color: "#f97316" },
  { name: "Food", type: "EXPENSE", color: "#eab308" },
  { name: "Utilities", type: "EXPENSE", color: "#84cc16" },
  { name: "Healthcare", type: "EXPENSE", color: "#06b6d4" },
  { name: "Entertainment", type: "EXPENSE", color: "#ec4899" },
  { name: "Shopping", type: "EXPENSE", color: "#f43f5e" },
  { name: "Other Expenses", type: "EXPENSE", color: "#64748b" },
]

export async function registerUser(data: {
  name: string
  email: string
  password: string
}) {
  try {
    const hashedPassword = await hash(data.password, 10)

    // Create user with a transaction to ensure both user and categories are created
    const user = await prisma.$transaction(async (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>) => {
      // Create the user
      const newUser = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
        },
      })

      // Create default categories for the user
      await Promise.all(
        DEFAULT_CATEGORIES.map((category) =>
          tx.category.create({
            data: {
              ...category,
              userId: newUser.id,
            },
          })
        )
      )

      return newUser
    })

    return { success: true, data: user }
  } catch (error) {
    console.error("Registration error:", error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "Failed to create user" }
  }
} 