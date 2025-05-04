"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateTransaction } from "@/app/actions/transactions"
import { Trash2 } from "lucide-react"

interface Category {
  id: string
  name: string
  type: "INCOME" | "EXPENSE"
  color?: string
  icon?: string
}

interface Transaction {
  id: string
  amount: number
  type: "INCOME" | "EXPENSE"
  description: string
  date: Date
  category: Category
}

export function EditTransactionDialog({ transaction, categories, onTransactionUpdated, children }: {
  transaction: Transaction,
  categories: Category[],
  onTransactionUpdated: () => void,
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState({
    amount: transaction.amount.toString(),
    type: transaction.type,
    description: transaction.description,
    categoryId: transaction.category.id,
    date: new Date(transaction.date).toISOString().split("T")[0],
  })

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    try {
      await updateTransaction(transaction.id, {
        amount: parseFloat(formData.amount),
        type: formData.type,
        description: formData.description,
        categoryId: formData.categoryId,
        date: new Date(formData.date),
      })
      onTransactionUpdated()
      setOpen(false)
    } catch (error) {
      console.error("Failed to update transaction:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function onDelete() {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/transactions/${transaction.id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete transaction")
      onTransactionUpdated()
      setOpen(false)
    } catch (error) {
      console.error("Error deleting transaction:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredCategories = categories.filter((c) => c.type === formData.type)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="contents">{children}</div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>
              Edit the details of this transaction or delete it.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "INCOME" | "EXPENSE") => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INCOME">Income</SelectItem>
                  <SelectItem value="EXPENSE">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                type="text"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" required value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter className="flex flex-row gap-2 justify-between">
            <Button type="button" variant="destructive" onClick={onDelete} disabled={isDeleting}>
              {isDeleting ? (
                "Deleting..."
              ) : (
                <><Trash2 className="mr-2 h-4 w-4" />Delete</>
              )}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 