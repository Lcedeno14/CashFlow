import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { prisma } from "@/lib/prisma"

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Delete all user's transactions
    await prisma.transaction.deleteMany({
      where: {
        userId: session.user.id
      }
    })

    // Delete all user's categories
    await prisma.category.deleteMany({
      where: {
        userId: session.user.id
      }
    })

    // Delete the user
    await prisma.user.delete({
      where: {
        id: session.user.id
      }
    })

    return new NextResponse("Account deleted successfully", { status: 200 })
  } catch (error) {
    console.error("[DELETE_ACCOUNT]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 