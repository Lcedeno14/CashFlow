"use client"

import { useRouter } from "next/navigation"
import { AddCategoryDialog } from "@/app/components/categories/add-category-dialog"
import { AddTransactionDialog } from "@/app/components/transactions/add-transaction-dialog"

type Category = {
  id: string
  name: string
  type: "INCOME" | "EXPENSE"
  color?: string | null
  userId: string
}

export function ActionButtons({ categories }: { categories: Category[] }) {
  const router = useRouter()

  const handleChange = () => {
    router.refresh()
  }

  return (
    <div className="flex gap-4">
      <AddCategoryDialog onCategoryAdded={handleChange} />
      <AddTransactionDialog
        categories={categories}
        onTransactionAdded={handleChange}
      />
    </div>
  )
} 