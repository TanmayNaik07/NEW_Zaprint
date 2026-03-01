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
      rotation: "-2deg",
      bgGradient: "from-[#f5e6c8] via-[#ede0c8] to-[#e8d5b0]",
    },
    {
      title: "Completed Prints",
      value: data.completedMonth.toString(),
      description: "Total completed",
      icon: CheckCircle,
      rotation: "1deg",
      bgGradient: "from-[#f0ddb8] via-[#ede0c8] to-[#f5e6c8]",
    },
    {
      title: "Avg Print Time",
      value: data.avgTime,
      description: "Per document",
      icon: Clock,
      rotation: "-1deg",
      bgGradient: "from-[#f5e6c8] via-[#f0ddb8] to-[#ede0c8]",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 30, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: stat.rotation }}
          transition={{ duration: 0.5, delay: index * 0.15, type: "spring", stiffness: 120 }}
          className="group"
        >
          {/* Sticky Note Card */}
          <div
            className={`relative bg-gradient-to-br ${stat.bgGradient} rounded-sm p-6 md:p-7 shadow-[4px_4px_12px_rgba(0,0,0,0.15)] transition-all duration-300 group-hover:shadow-[6px_6px_20px_rgba(0,0,0,0.2)] group-hover:scale-[1.03]`}
            style={{
              backgroundImage: `url('/images/paper-texture.png')`,
              backgroundSize: 'cover',
              backgroundBlendMode: 'multiply',
            }}
          >
            {/* Tape effect at top */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#d4c5a0]/60 rounded-sm shadow-sm" />

            {/* Folded corner effect */}
            <div className="absolute bottom-0 right-0 w-8 h-8">
              <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[32px] border-l-transparent border-b-[32px] border-b-[#c9b896] opacity-60" />
            </div>

            {/* Card content */}
            <div className="relative z-10 mt-2">
              <div className="flex items-center gap-3 mb-4">
                <stat.icon className="w-6 h-6 text-[#3a3120] opacity-70" strokeWidth={2.5} />
              </div>
              <p className="font-rubik-dirt text-[#3a3120] text-sm tracking-wide uppercase mb-2 opacity-80">
                {stat.title}
              </p>
              <p className="font-rubik-dirt text-[#1a1408] text-4xl md:text-5xl tracking-tight leading-none mb-3">
                {stat.value}
              </p>
              <p className="text-[#6b5d45] text-xs font-medium tracking-wider uppercase">
                {stat.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
