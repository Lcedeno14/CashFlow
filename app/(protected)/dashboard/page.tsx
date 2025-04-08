import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { Header } from "@/app/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ActionButtonsWrapper } from "@/app/components/dashboard/action-buttons-wrapper"
import { getCategories, getFinancialSummary, getTransactions } from "../../actions/transactions"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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

export const metadata: Metadata = {
  title: "Dashboard - Cash Flow",
  description: "Manage your finances",
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const [summary, transactions, categories] = await Promise.all([
    getFinancialSummary(),
    getTransactions(),
    getCategories(),
  ])

  return (
    <div>
      <Header userName={session.user?.name} />
      <div className="container mx-auto py-10">
        <div className="flex justify-end mb-8">
          <ActionButtonsWrapper categories={categories} />
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                ${summary.totalBalance.toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Income</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                ${summary.totalIncome.toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">
                ${summary.totalExpenses.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-[2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
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
                    <TableRow key={transaction.id}>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Income Categories</h3>
                  <div className="space-y-2">
                    {categories
                      .filter((c: Category) => c.type === "INCOME")
                      .map((category: Category) => (
                        <div
                          key={category.id}
                          className="flex items-center justify-between p-2 rounded-lg border"
                          style={{
                            borderColor: category.color || "#e2e8f0",
                          }}
                        >
                          <span>{category.name}</span>
                        </div>
                      ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Expense Categories</h3>
                  <div className="space-y-2">
                    {categories
                      .filter((c: Category) => c.type === "EXPENSE")
                      .map((category: Category) => (
                        <div
                          key={category.id}
                          className="flex items-center justify-between p-2 rounded-lg border"
                          style={{
                            borderColor: category.color || "#e2e8f0",
                          }}
                        >
                          <span>{category.name}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 