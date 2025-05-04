"use client"
import { TableCell } from "@/components/ui/table"
import { EditTransactionDialog } from "@/app/components/transactions/edit-transaction-dialog"

type Category = {
  id: string
  name: string
  type: "INCOME" | "EXPENSE"
  color?: string | null
  userId: string
}

type Transaction = {
  id: string
  amount: number
  type: "INCOME" | "EXPENSE"
  description: string
  date: Date
  category: Category
}

export function TransactionRow({ transaction, categories, onTransactionUpdated }: { transaction: Transaction, categories: Category[], onTransactionUpdated: () => void }) {
  // Ensure color is always string | undefined
  const safeCategories = categories.map(c => ({ ...c, color: c.color || undefined }));
  // Ensure transaction.category.color is string | undefined
  const safeTransaction = {
    ...transaction,
    category: {
      ...transaction.category,
      color: transaction.category.color || undefined,
    },
  };
  return (
    <>
      <TableCell>
        {new Date(transaction.date).toLocaleDateString()}
      </TableCell>
      <TableCell>{transaction.description}</TableCell>
      <TableCell>{transaction.category.name}</TableCell>
      <TableCell>{transaction.type}</TableCell>
      <TableCell className={`text-right ${
        transaction.type === "INCOME" ? "text-green-600" : "text-red-600"
      }`}>
        ${transaction.amount.toFixed(2)}
      </TableCell>
      <TableCell className="text-right">
        <EditTransactionDialog transaction={safeTransaction} categories={safeCategories} onTransactionUpdated={onTransactionUpdated}>
          <button className="text-blue-600 hover:text-blue-800">Edit</button>
        </EditTransactionDialog>
      </TableCell>
    </>
  )
} 