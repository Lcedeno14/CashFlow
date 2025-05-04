"use client"
import { CardTitle } from "@/components/ui/card"
import { AddCategoryDialog } from "@/app/components/categories/add-category-dialog"

export function CategoriesCardHeader() {
  return (
    <div className="flex flex-row items-center justify-between">
      <CardTitle>Categories</CardTitle>
      <AddCategoryDialog onCategoryAdded={() => window.location.reload()} />
    </div>
  )
} 