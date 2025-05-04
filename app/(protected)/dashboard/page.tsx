import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { Header } from "@/app/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCategories, getFinancialSummary, getTransactions } from "../../actions/transactions"
import { TransactionsTable } from "@/app/components/dashboard/TransactionsTable"
import DashboardGraphSwitcher from "@/components/dashboard/DashboardGraphSwitcher"
import { getTotalsByCategory, getCashFlowByDate, getMonthlyIncomeExpense } from "@/lib/data"
import { CategoriesCardHeader } from "@/app/components/dashboard/CategoriesCardHeader"
import { TransactionsCardHeader } from "@/app/components/dashboard/TransactionsCardHeader"
import { DeleteCategoryDialog } from "@/app/components/categories/delete-category-dialog"

type Category = {
  id: string
  name: string
  type: "INCOME" | "EXPENSE"
  color?: string | null
  userId: string
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

  const from = new Date('2000-01-01');
  const to = new Date();
  const year = new Date().getFullYear();
  const [summary, transactions, categories, expenseCategoryData, incomeCategoryData, cashFlowData, monthlyData] = await Promise.all([
    getFinancialSummary(),
    getTransactions(),
    getCategories(),
    getTotalsByCategory({ userId: session.user.id, range: { from, to }, type: "EXPENSE" }),
    getTotalsByCategory({ userId: session.user.id, range: { from, to }, type: "INCOME" }),
    getCashFlowByDate(session.user.id, from, to),
    getMonthlyIncomeExpense(session.user.id, year),
  ])

  return (
    <div>
      <Header userName={session.user?.name} />
      <div className="container mx-auto py-10">
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
              <TransactionsCardHeader categories={categories} />
            </CardHeader>
            <CardContent>
              <TransactionsTable transactions={transactions} categories={categories} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CategoriesCardHeader />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Income Categories</h3>
                  <div className="flex flex-col gap-2">
                    {categories
                      .filter((c: Category) => c.type === "INCOME")
                      .map((category: Category) => (
                        <DeleteCategoryDialog key={category.id} category={category}>
                          <div
                            className="flex items-center justify-between p-2 rounded-lg border cursor-pointer hover:bg-muted/50"
                            style={{
                              borderColor: category.color || "#e2e8f0",
                            }}
                          >
                            <span>{category.name}</span>
                          </div>
                        </DeleteCategoryDialog>
                      ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Expense Categories</h3>
                  <div className="flex flex-col gap-2">
                    {categories
                      .filter((c: Category) => c.type === "EXPENSE")
                      .map((category: Category) => (
                        <DeleteCategoryDialog key={category.id} category={category}>
                          <div
                            className="flex items-center justify-between p-2 rounded-lg border cursor-pointer hover:bg-muted/50"
                            style={{
                              borderColor: category.color || "#e2e8f0",
                            }}
                          >
                            <span>{category.name}</span>
                          </div>
                        </DeleteCategoryDialog>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DashboardGraphSwitcher expenseCategoryData={expenseCategoryData} incomeCategoryData={incomeCategoryData} cashFlowData={cashFlowData} monthlyData={monthlyData} />
      </div>
    </div>
  )
} 