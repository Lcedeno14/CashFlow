"use client"
import { CardTitle } from "@/components/ui/card"
import { AddTransactionDialog } from "@/app/components/transactions/add-transaction-dialog"
import { Category } from "@prisma/client"

export function TransactionsCardHeader({ categories }: { categories: Category[] }) {
  // Fix icon type for AddTransactionDialog
  const dialogCategories = categories.map(cat => ({
    ...cat,
    icon: cat.icon || undefined,
  }));

  return (
    <div className="flex flex-row items-center justify-between">
      <CardTitle>Recent Transactions</CardTitle>
      <AddTransactionDialog
        categories={dialogCategories}
        onTransactionAdded={() => window.location.reload()}
      />
    </div>
  )
} 