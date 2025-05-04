"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import CashFlowTrend from "./CashFlowTrend"
import CategoryDonut from "./CategoryDonut"
import MonthlyBars from "./MonthlyBars"
import IncomeCategoryDonut from "./IncomeCategoryDonut"

const GRAPH_OPTIONS = [
  { key: "cashflow", label: "Cash-Flow Trend" },
  { key: "category", label: "Category Split" },
  { key: "monthly", label: "Monthly Overview" },
]

interface DashboardGraphSwitcherProps {
  expenseCategoryData: { name: string; value: number }[]
  incomeCategoryData: { name: string; value: number }[]
  cashFlowData: { date: string; income: number; expense: number }[]
  monthlyData: { month: string; income: number; expense: number }[]
}

export default function DashboardGraphSwitcher({ expenseCategoryData, incomeCategoryData, cashFlowData, monthlyData }: DashboardGraphSwitcherProps) {
  const [selected, setSelected] = useState("cashflow")

  let GraphComponent
  if (selected === "cashflow") GraphComponent = <CashFlowTrend data={cashFlowData} />
  else if (selected === "category") GraphComponent = (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <div className="flex-1 flex flex-col items-center">
        <CardTitle className="mb-2">Expenses</CardTitle>
        <CategoryDonut data={expenseCategoryData} />
      </div>
      <div className="flex-1 flex flex-col items-center">
        <CardTitle className="mb-2">Income</CardTitle>
        <IncomeCategoryDonut data={incomeCategoryData} />
      </div>
    </div>
  )
  else GraphComponent = <MonthlyBars data={monthlyData} />

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Dashboard Graphs</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="inline-flex items-center gap-2">
              {GRAPH_OPTIONS.find(opt => opt.key === selected)?.label}
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {GRAPH_OPTIONS.map(opt => (
              <DropdownMenuItem key={opt.key} onClick={() => setSelected(opt.key)}>
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="h-64">
        {GraphComponent}
      </CardContent>
    </Card>
  )
} 