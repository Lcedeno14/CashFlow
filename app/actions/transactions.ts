"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"

export async function createTransaction(data: {
  amount: number
  type: "INCOME" | "EXPENSE"
  description: string
  categoryId: string
  date: Date
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Not authenticated")
  }

  return prisma.transaction.create({
    data: {
      ...data,
      userId: session.user.id,
    },
    include: {
      category: true,
    },
  })
}

export async function getTransactions() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Not authenticated")
  }

  return prisma.transaction.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      category: true,
    },
    orderBy: {
      date: "desc",
    },
  })
}

export async function createCategory(data: {
  name: string
  type: "INCOME" | "EXPENSE"
  color?: string
  icon?: string
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Not authenticated")
  }

  return prisma.category.create({
    data: {
      ...data,
      userId: session.user.id,
    },
  })
}

export async function getCategories() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Not authenticated")
  }

  return prisma.category.findMany({
    where: {
      userId: session.user.id,
    },
  })
}

export async function getFinancialSummary() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Not authenticated")
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
    },
  })

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0)

  return {
    totalIncome,
    totalExpenses,
    totalBalance: totalIncome - totalExpenses,
  }
}

export async function updateTransaction(id: string, data: {
  amount: number
  type: "INCOME" | "EXPENSE"
  description: string
  categoryId: string
  date: Date
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Not authenticated")
  }

  // Ensure the transaction belongs to the user
  const transaction = await prisma.transaction.findUnique({
    where: { id },
    include: { category: true },
  })
  if (!transaction || transaction.userId !== session.user.id) {
    throw new Error("Unauthorized")
  }

  return prisma.transaction.update({
    where: { id },
    data: {
      ...data,
    },
    include: {
      category: true,
    },
  })
} 