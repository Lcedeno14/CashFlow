"use client"

import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

interface CashFlowTrendProps {
  data: { date: string; income: number; expense: number }[]
}

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
]

export default function CashFlowTrend({ data }: CashFlowTrendProps) {
  const config = {
    income: { label: "Income", color: COLORS[0] },
    expense: { label: "Expense", color: COLORS[1] },
  }

  return (
    <ChartContainer title="Net Cash Flow" config={config}>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} stackOffset="sign">
            <XAxis dataKey="date" tickLine={false} />
            <YAxis tickFormatter={v => `$${v}`} />
            <Tooltip formatter={v => `$${v}`} />
            <Legend />
            <Area dataKey="income" stackId="1" type="monotone" fill={COLORS[0]} />
            <Area dataKey="expense" stackId="1" type="monotone" fill={COLORS[1]} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  )
} 