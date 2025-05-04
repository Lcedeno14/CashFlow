"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

interface MonthlyBarsProps {
  data: { month: string; income: number; expense: number }[]
}

const config = {
  income: { label: "Income", color: "var(--chart-1)" },
  expense: { label: "Expense", color: "var(--chart-2)" },
}

export default function MonthlyBars({ data }: MonthlyBarsProps) {
  return (
    <ChartContainer title="Monthly Income vs Expense" config={config}>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis tickFormatter={v => `$${v}`} />
            <Tooltip formatter={v => `$${v}`} />
            <Legend />
            <Bar dataKey="income" fill="var(--chart-1)" />
            <Bar dataKey="expense" fill="var(--chart-2)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  )
} 