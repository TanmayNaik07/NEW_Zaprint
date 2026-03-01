"use client"

import { motion } from "framer-motion"

export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div>
        <div className="h-8 w-64 bg-black/5 rounded-lg mb-2" />
        <div className="h-5 w-96 bg-black/5 rounded-lg" />
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-6 rounded-2xl border border-black/5 bg-white/50 h-32"
          >
            <div className="h-4 w-20 bg-black/5 rounded mb-3" />
            <div className="h-8 w-16 bg-black/5 rounded mb-2" />
            <div className="h-3 w-24 bg-black/5 rounded" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-2xl border border-black/5 bg-white/50 p-6">
        <div className="h-5 w-32 bg-black/5 rounded mb-6" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 py-4 border-b border-black/5 last:border-0">
            <div className="w-10 h-10 rounded-lg bg-black/5" />
            <div className="flex-1">
              <div className="h-4 w-40 bg-black/5 rounded mb-2" />
              <div className="h-3 w-24 bg-black/5 rounded" />
            </div>
            <div className="h-6 w-16 bg-black/5 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
