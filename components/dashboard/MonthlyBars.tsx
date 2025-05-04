"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

interface MonthlyBarsProps {
  data: { month: string; income: number; expense: number }[]
}

const mockData = [
  { month: "Jan 2024", income: 6200, expense: 4800 },
  { month: "Feb 2024", income: 5900, expense: 5100 },
  { month: "Mar 2024", income: 7000, expense: 5300 },
  { month: "Apr 2024", income: 6400, expense: 4900 },
  { month: "May 2024", income: 6600, expense: 5200 },
  { month: "Jun 2024", income: 6800, expense: 5400 },
  { month: "Jul 2024", income: 7100, expense: 5600 },
  { month: "Aug 2024", income: 7300, expense: 5800 },
  { month: "Sep 2024", income: 7500, expense: 6000 },
  { month: "Oct 2024", income: 7700, expense: 6200 },
  { month: "Nov 2024", income: 7900, expense: 6400 },
  { month: "Dec 2024", income: 8100, expense: 6600 },
  { month: "Jan 2025", income: 8300, expense: 6800 },
  { month: "Feb 2025", income: 8500, expense: 7000 },
  { month: "Mar 2025", income: 8700, expense: 7200 },
  { month: "Apr 2025", income: 8900, expense: 7400 },
  { month: "May 2025", income: 9100, expense: 7600 },
  { month: "Jun 2025", income: 9300, expense: 7800 },
  { month: "Jul 2025", income: 9500, expense: 8000 },
  { month: "Aug 2025", income: 9700, expense: 8200 },
  { month: "Sep 2025", income: 9900, expense: 8400 },
  { month: "Oct 2025", income: 10100, expense: 8600 },
  { month: "Nov 2025", income: 10300, expense: 8800 },
  { month: "Dec 2025", income: 10500, expense: 9000 },
]

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