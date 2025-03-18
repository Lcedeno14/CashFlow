"use client"

import { ActionButtons } from "./action-buttons"
import { Category } from "@prisma/client"

interface ActionButtonsWrapperProps {
  categories: Category[]
}

export function ActionButtonsWrapper({ categories }: ActionButtonsWrapperProps) {
  const handleCategoryAdded = () => {
    // Refresh the page to show new category
    window.location.reload()
  }

  const handleTransactionAdded = () => {
    // Refresh the page to show new transaction
    window.location.reload()
  }

  return (
    <ActionButtons
      categories={categories}
      onCategoryAdded={handleCategoryAdded}
      onTransactionAdded={handleTransactionAdded}
    />
  )
} 