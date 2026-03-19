"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { IndianRupee, Clock, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"

interface ShopFeeSummary {
  shop_id: string
  shop_name: string
  is_blocked: boolean
  total_fees: number
  unpaid_fees: number
  paid_fees: number
  unpaid_count: number
  oldest_unpaid_date: string | null
  days_overdue: number | null
}

export default function AdminFeesPage() {
  const [summaries, setSummaries] = useState<ShopFeeSummary[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchFees() {
      try {
        const { data, error } = await supabase
          .from("shop_fee_summary")
          .select("*")
          .order("unpaid_fees", { ascending: false })

        if (error) throw error
        setSummaries(data || [])
      } catch (error) {
        console.error("Error fetching fee summaries:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFees()
  }, [supabase])

  const totalUnpaid = summaries.reduce((sum, s) => sum + Number(s.unpaid_fees), 0)
  const totalPaid = summaries.reduce((sum, s) => sum + Number(s.paid_fees), 0)
  const shopsWithUnpaid = summaries.filter((s) => s.unpaid_fees > 0).length
  const blockedShopsCount = summaries.filter((s) => s.is_blocked).length

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#0a1128]">
          Platform Fees
        </h1>
        <p className="text-[#5b637a] mt-1">
          Monitor platform fees owed by shops and manage their payment status.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Unpaid */}
        <Card className="border-black/5 shadow-sm bg-white overflow-hidden relative">
          <div className="absolute inset-0 bg-red-500 opacity-[0.03]" />
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-[#5b637a] uppercase tracking-wider">
              Total Unpaid Fees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-red-600">
                ₹{totalUnpaid.toFixed(2)}
              </span>
              <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center">
                <IndianRupee className="h-5 w-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Paid */}
        <Card className="border-black/5 shadow-sm bg-white overflow-hidden relative">
          <div className="absolute inset-0 bg-emerald-500 opacity-[0.03]" />
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-[#5b637a] uppercase tracking-wider">
              Total Paid Fees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-emerald-600">
                ₹{totalPaid.toFixed(2)}
              </span>
              <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shops owing */}
        <Card className="border-black/5 shadow-sm bg-white overflow-hidden relative">
          <div className="absolute inset-0 bg-amber-500 opacity-[0.03]" />
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-[#5b637a] uppercase tracking-wider">
              Shops with Dues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-amber-600">
                {shopsWithUnpaid}
              </span>
              <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blocked Shops */}
        <Card className="border-black/5 shadow-sm bg-white overflow-hidden relative">
          <div className="absolute inset-0 bg-red-900 opacity-[0.03]" />
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-[#5b637a] uppercase tracking-wider">
              Blocked Shops
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-red-900">
                {blockedShopsCount}
              </span>
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <ShieldAlert className="h-5 w-5 text-red-900" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card className="border-black/5 shadow-sm bg-white">
        <CardHeader className="border-b border-black/5">
          <CardTitle>Shop Fee Summaries</CardTitle>
          <CardDescription>
            Overview of platform fees owed by each shop
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-black/5">
                <TableHead className="font-bold pl-6">Shop Name</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="font-bold text-right">Unpaid Fees</TableHead>
                <TableHead className="font-bold text-right">Pending Entries</TableHead>
                <TableHead className="font-bold text-right">Days Overdue</TableHead>
                <TableHead className="font-bold text-right pr-6">Total Paid</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summaries.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-12 text-[#5b637a]"
                  >
                    No shops found.
                  </TableCell>
                </TableRow>
              ) : (
                summaries.map((summary) => (
                  <TableRow
                    key={summary.shop_id}
                    className="hover:bg-black/[0.02] border-black/5 transition-colors"
                  >
                    <TableCell className="font-medium pl-6">
                      <div className="flex items-center gap-2">
                        {summary.shop_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      {summary.is_blocked ? (
                        <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                          Blocked
                        </Badge>
                      ) : summary.days_overdue && summary.days_overdue >= 7 ? (
                        <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">
                          Critical
                        </Badge>
                      ) : summary.days_overdue && summary.days_overdue >= 5 ? (
                        <Badge variant="outline" className="text-amber-500 border-amber-200 bg-amber-50">
                          Warning
                        </Badge>
                      ) : summary.unpaid_fees > 0 ? (
                        <Badge variant="outline" className="text-blue-500 border-blue-200 bg-blue-50">
                          Owes
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-emerald-500 border-emerald-200 bg-emerald-50">
                          Clear
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-bold text-orange-600">
                      ₹{Number(summary.unpaid_fees).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right text-[#5b637a]">
                      {summary.unpaid_count}
                    </TableCell>
                    <TableCell className="text-right text-[#5b637a]">
                      {summary.days_overdue !== null ? (
                        <span className={cn(
                          "flex items-center justify-end gap-1.5",
                          summary.days_overdue >= 7 && "text-red-600 font-bold",
                          summary.days_overdue >= 5 && summary.days_overdue < 7 && "text-amber-600 font-bold"
                        )}>
                          <Clock className="h-3.5 w-3.5" />
                          {summary.days_overdue}d
                        </span>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-6 font-medium text-emerald-600">
                      ₹{Number(summary.paid_fees).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
