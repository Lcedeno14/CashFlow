import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const transaction = await prisma.transaction.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!transaction) {
      return new NextResponse("Transaction not found", { status: 404 })
    }

    // Verify the transaction belongs to the user
    const category = await prisma.category.findUnique({
      where: {
        id: transaction.categoryId,
      },
    })

    if (!category || category.userId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await prisma.transaction.delete({
      where: {
        id: params.id,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[TRANSACTION_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 