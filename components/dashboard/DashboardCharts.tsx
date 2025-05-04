"use client"

import CashFlowTrend from "./CashFlowTrend"
import CategoryDonut from "./CategoryDonut"
import MonthlyBars from "./MonthlyBars"

export default function DashboardCharts() {
  return (
    <section className="grid gap-6 lg:grid-cols-2 mb-8">
      <CashFlowTrend />
      <CategoryDonut />
      <MonthlyBars />
    </section>
  )
} 