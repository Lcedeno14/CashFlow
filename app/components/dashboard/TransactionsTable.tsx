"use client"
import { useState } from "react"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TransactionRow } from "@/app/components/dashboard/TransactionRow"

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

export function TransactionsTable({ transactions: initialTransactions, categories }: { transactions: Transaction[], categories: Category[] }) {
  const transactions = initialTransactions

  // Simple reload: just reload the page for now (could be improved to refetch data client-side)
  const handleTransactionUpdated = () => {
    window.location.reload()
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction: Transaction) => (
          <TableRow
            key={transaction.id}
            className="cursor-pointer hover:bg-muted/50"
          >
            <TransactionRow transaction={transaction} categories={categories} onTransactionUpdated={handleTransactionUpdated} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 