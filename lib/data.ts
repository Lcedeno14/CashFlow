import { prisma } from "@/lib/prisma"

// 1. Net Cash-Flow Trend
export async function getCashFlowByDate(userId: string, from: Date, to: Date) {
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: { gte: from, lte: to },
    },
    select: { date: true, amount: true, type: true },
    orderBy: { date: "asc" },
  });

  const grouped: Record<string, { income: number; expense: number }> = {};
  for (const tx of transactions) {
    const date = tx.date.toISOString().slice(0, 10);
    if (!grouped[date]) grouped[date] = { income: 0, expense: 0 };
    if (tx.type === "INCOME") grouped[date].income += tx.amount;
    else grouped[date].expense += tx.amount;
  }

  return Object.entries(grouped).map(([date, { income, expense }]) => ({
    date,
    income,
    expense,
  }));
}

// 2. Category Split
export async function getTotalsByCategory({
  userId,
  range,
  type,
}: {
  userId: string
  range: { from: Date; to: Date }
  type: "INCOME" | "EXPENSE"
}) {
  const results = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: {
      userId,
      type,
      date: {
        gte: range.from,
        lte: range.to,
      },
    },
    _sum: {
      amount: true,
    },
  })

  const categories = await prisma.category.findMany({
    where: {
      userId,
      type,
    },
    select: {
      id: true,
      name: true,
    },
  })

  const categoryMap = Object.fromEntries(categories.map(c => [c.id, c.name]))

  return results.map(r => ({
    name: categoryMap[r.categoryId] || "Unknown",
    value: r._sum.amount || 0,
  }))
}

// 3. Monthly Income vs Expense
export async function getMonthlyIncomeExpense(userId: string, year: number) {
  const from = new Date(`${year}-01-01`);
  const to = new Date(`${year}-12-31`);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: { gte: from, lte: to },
    },
    select: { date: true, amount: true, type: true },
  });

  // Group by month
  const grouped: Record<string, { income: number; expense: number }> = {};
  for (const tx of transactions) {
    const month = tx.date.toLocaleString("default", { month: "short", year: "numeric" });
    if (!grouped[month]) grouped[month] = { income: 0, expense: 0 };
    if (tx.type === "INCOME") grouped[month].income += tx.amount;
    else grouped[month].expense += tx.amount;
  }

  // Return as array sorted by month
  return Object.entries(grouped).map(([month, { income, expense }]) => ({
    month,
    income,
    expense,
  }));
} 