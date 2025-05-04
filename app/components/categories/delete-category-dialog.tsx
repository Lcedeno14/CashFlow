"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface Category {
  id: string
  name: string
  type: "INCOME" | "EXPENSE"
  color?: string | null
  userId: string
}

interface DeleteCategoryDialogProps {
  category: Category
  children: React.ReactNode
}

export function DeleteCategoryDialog({ category, children }: DeleteCategoryDialogProps) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const isDefaultCategory = category.name === "Other Income" || category.name === "Other Expenses"

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/categories/${category.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete category")
      }

      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error deleting category:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className={`contents ${isDefaultCategory ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-muted/50'}`}>
          {children}
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription>
            {isDefaultCategory ? (
              "Default categories cannot be deleted."
            ) : (
              "Are you sure you want to delete this category? All transactions in this category will be moved to the default category."
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="font-medium">{category.name}</p>
          <p className="text-sm text-muted-foreground">
            Type: {category.type}
          </p>
          {category.color && (
            <div className="mt-2 flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: category.color }}
              />
              <span className="text-sm text-muted-foreground">Category Color</span>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            {isDefaultCategory ? "Close" : "Cancel"}
          </Button>
          {!isDefaultCategory && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                "Deleting..."
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 