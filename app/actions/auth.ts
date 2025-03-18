"use server"

import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function registerUser(data: {
  name: string
  email: string
  password: string
}) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
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
          email: data.email,
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