"use client"

import { AddCategoryDialog } from '@/app/components/categories/add-category-dialog'
import { AddTransactionDialog } from '@/app/components/transactions/add-transaction-dialog'
import { Category as PrismaCategory } from '@prisma/client'

interface Category {
  id: string
  name: string
  type: "INCOME" | "EXPENSE"
  color?: string
  icon?: string
}

interface ActionButtonsProps {
  categories: PrismaCategory[]
  onCategoryAdded: () => void
  onTransactionAdded: () => void
}

export function ActionButtons({
  categories,
  onCategoryAdded,
  onTransactionAdded,
}: ActionButtonsProps) {
  const handleChange = () => {
    onCategoryAdded()
    onTransactionAdded()
  }

  // Convert Prisma categories to the format expected by the dialog
  const dialogCategories: Category[] = categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    type: cat.type,
    color: cat.color || undefined,
    icon: cat.icon || undefined
  }))

  return (
    <div className="flex gap-2">
      <AddCategoryDialog onCategoryAdded={handleChange} />
      <AddTransactionDialog
        categories={dialogCategories}
        onTransactionAdded={handleChange}
      />
    </div>
  )
} 