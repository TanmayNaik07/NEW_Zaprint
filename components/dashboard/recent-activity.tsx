"use client"

import { motion } from "framer-motion"
import { FileText, Clock, CheckCircle, Loader2 } from "lucide-react"

type PrintJob = {
  id: string
  fileName: string
  pages: number
  copies: number
  status: "processing" | "ready" | "completed"
  time: string
}

const mockPrintJobs: PrintJob[] = [
  {
    id: "1",
    fileName: "Project_Report_Final.pdf",
    pages: 24,
    copies: 2,
    status: "processing",
    time: "Est. 5 min",
  },
  {
    id: "2",
    fileName: "Invoice_January.pdf",
    pages: 3,
    copies: 1,
    status: "ready",
    time: "Ready for pickup",
  },
  {
    id: "3",
    fileName: "Presentation_Slides.pptx",
    pages: 15,
    copies: 5,
    status: "completed",
    time: "Completed 2h ago",
  },
  {
    id: "4",
    fileName: "Contract_Draft_v2.docx",
    pages: 8,
    copies: 1,
    status: "completed",
    time: "Completed yesterday",
  },
  {
    id: "5",
    fileName: "Meeting_Notes.pdf",
    pages: 4,
    copies: 3,
    status: "processing",
    time: "Est. 3 min",
  },
]

const statusConfig = {
  processing: {
    label: "Processing",
    icon: Loader2,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    iconClass: "animate-spin",
  },
  ready: {
    label: "Ready",
    icon: Clock,
    color: "text-primary",
    bgColor: "bg-primary/10",
    iconClass: "",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    iconClass: "",
  },
}

export function RecentActivity() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-foreground text-xl font-semibold">Recent Activity</h2>
        <a href="/dashboard/print" className="text-primary text-sm font-medium hover:underline">
          View all
        </a>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-muted-foreground text-xs font-medium uppercase tracking-wider px-6 py-4">
                  Document
                </th>
                <th className="text-left text-muted-foreground text-xs font-medium uppercase tracking-wider px-6 py-4 hidden sm:table-cell">
                  Details
                </th>
                <th className="text-left text-muted-foreground text-xs font-medium uppercase tracking-wider px-6 py-4">
                  Status
                </th>
                <th className="text-right text-muted-foreground text-xs font-medium uppercase tracking-wider px-6 py-4 hidden md:table-cell">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {mockPrintJobs.map((job, index) => {
                const status = statusConfig[job.status]
                return (
                  <motion.tr
                    key={job.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <span className="text-foreground text-sm font-medium truncate max-w-[180px]">
                          {job.fileName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-muted-foreground text-sm">
                        {job.pages} pages • {job.copies} {job.copies === 1 ? "copy" : "copies"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${status.bgColor}`}>
                        <status.icon className={`w-3.5 h-3.5 ${status.color} ${status.iconClass}`} />
                        <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right hidden md:table-cell">
                      <span className="text-muted-foreground text-sm">{job.time}</span>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
