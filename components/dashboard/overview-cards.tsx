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
      rotation: "-1.5deg",
    },
    {
      title: "Completed Prints",
      value: data.completedMonth.toString(),
      description: "Total completed",
      icon: CheckCircle,
      rotation: "0.8deg",
    },
    {
      title: "Avg Print Time",
      value: data.avgTime,
      description: "Per document",
      icon: Clock,
      rotation: "-0.5deg",
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
          {/* Clean Paper Card with Tape */}
          <div
            className="relative rounded-[2px] p-6 md:p-7 transition-all duration-300 group-hover:scale-[1.03] overflow-visible"
            style={{
              backgroundImage: `url('/images/new-paper.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: '2px 3px 10px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)',
              minHeight: '180px',
            }}
          >
            {/* Masking tape at top center */}
            <img
              src="/images/tape.svg"
              alt=""
              className="absolute top-0 left-1/2 w-14 h-14 object-contain opacity-90 drop-shadow-sm pointer-events-none z-20"
              style={{ transform: 'translateX(-50%) translateY(-40%)' }}
            />

            {/* Card content */}
            <div className="relative z-10 mt-3">
              <div className="flex items-center gap-3 mb-4">
                <stat.icon className="w-6 h-6 text-[#3a3120] opacity-60" strokeWidth={2} />
              </div>
              <p className="font-rubik-dirt text-[#3a3120] text-sm tracking-wide uppercase mb-2 opacity-70">
                {stat.title}
              </p>
              <p className="font-rubik-dirt text-[#1a1408] text-4xl md:text-5xl tracking-tight leading-none mb-3">
                {stat.value}
              </p>
              <p className="text-[#6b5d45] text-xs font-medium tracking-wider uppercase opacity-80">
                {stat.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
