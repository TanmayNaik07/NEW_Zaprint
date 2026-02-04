"use client"

import { Printer, CheckCircle, Clock } from "lucide-react"
import { motion } from "framer-motion"

export interface OverviewStats {
  activeJobs: number
  completedMonth: number
  avgTime: string
}

export function OverviewCards({ stats: data }: { stats: OverviewStats }) {
  const stats = [
    {
      title: "Active Print Jobs",
      value: data.activeJobs.toString(),
      description: "Currently processing",
      icon: Printer,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Completed Prints",
      value: data.completedMonth.toString(),
      description: "Total completed",
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Average Print Time",
      value: data.avgTime,
      description: "Per document",
      icon: Clock,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium mb-1">{stat.title}</p>
            <p className="text-foreground text-3xl font-semibold mb-1">{stat.value}</p>
            <p className="text-muted-foreground text-xs">{stat.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
