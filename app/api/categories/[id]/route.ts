import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { prisma } from "@/lib/prisma"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(request: Request, context: any) {
  const { id } = context.params;
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const category = await prisma.category.findUnique({
      where: {
        id: id,
      },
    })

    if (!category) {
      return new NextResponse("Category not found", { status: 404 })
    }

    if (category.userId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Prevent deletion of default categories
    if (category.name === "Other Income" || category.name === "Other Expenses") {
      return new NextResponse("Default categories cannot be deleted", { status: 400 })
    }

    // Find or create default category based on type
    const defaultCategoryName = category.type === "INCOME" ? "Other Income" : "Other Expenses"
    
    const defaultCategory = await prisma.category.findFirst({
      where: {
        userId: session.user.id,
        type: category.type,
        name: defaultCategoryName,
      },
    }) || await prisma.category.create({
      data: {
        name: defaultCategoryName,
        type: category.type,
        userId: session.user.id,
      },
    })

    // Update all transactions in this category to use the default category
    await prisma.transaction.updateMany({
      where: {
        categoryId: category.id,
      },
      data: {
        categoryId: defaultCategory.id,
      },
    })

    // Delete the category
    await prisma.category.delete({
      where: {
        id: id,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[CATEGORY_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 