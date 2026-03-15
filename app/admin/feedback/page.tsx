"use client"

import { useState, useEffect } from "react"
import {
  Star,
  Check,
  X,
  Eye,
  EyeOff,
  Trash2,
  MessageSquareText,
  Search,
  Filter,
} from "lucide-react"
import { toast } from "sonner"

interface Feedback {
  id: string
  user_id: string
  user_name: string
  user_role: string
  rating: number
  message: string
  is_approved: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
}

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "approved" | "pending" | "featured">("all")
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchFeedback()
  }, [])

  async function fetchFeedback() {
    try {
      const res = await fetch("/api/admin/feedback")
      if (!res.ok) throw new Error("Failed to fetch feedback")
      const data = await res.json()
      setFeedback(data.data || [])
    } catch (err) {
      toast.error("Failed to load feedback")
    } finally {
      setIsLoading(false)
    }
  }

  async function toggleApproval(id: string, currentState: boolean) {
    try {
      const res = await fetch("/api/admin/feedback", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_approved: !currentState }),
      })
      if (!res.ok) throw new Error("Failed to update")
      setFeedback((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
                ...f,
                is_approved: !currentState,
                // If unapproving, also unfeature
                is_featured: !currentState ? f.is_featured : false,
              }
            : f
        )
      )
      toast.success(!currentState ? "Feedback approved" : "Feedback unapproved")
    } catch {
      toast.error("Failed to update feedback")
    }
  }

  async function toggleFeatured(id: string, currentState: boolean) {
    try {
      const res = await fetch("/api/admin/feedback", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          is_featured: !currentState,
          // Auto-approve if featuring
          ...(currentState ? {} : { is_approved: true }),
        }),
      })
      if (!res.ok) throw new Error("Failed to update")
      setFeedback((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
                ...f,
                is_featured: !currentState,
                is_approved: !currentState ? true : f.is_approved,
              }
            : f
        )
      )
      toast.success(
        !currentState ? "Feedback featured on landing page" : "Removed from landing page"
      )
    } catch {
      toast.error("Failed to update feedback")
    }
  }

  async function deleteFeedback(id: string) {
    if (!confirm("Are you sure you want to delete this feedback?")) return
    try {
      const res = await fetch(`/api/admin/feedback?id=${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete")
      setFeedback((prev) => prev.filter((f) => f.id !== id))
      toast.success("Feedback deleted")
    } catch {
      toast.error("Failed to delete feedback")
    }
  }

  const filtered = feedback.filter((f) => {
    if (filter === "approved") return f.is_approved
    if (filter === "pending") return !f.is_approved
    if (filter === "featured") return f.is_featured
    return true
  }).filter((f) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      f.user_name.toLowerCase().includes(q) ||
      f.message.toLowerCase().includes(q) ||
      f.user_role.toLowerCase().includes(q)
    )
  })

  const featuredCount = feedback.filter((f) => f.is_featured).length

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Feedback Management
          </h1>
          <p className="text-white/40 mt-2">Loading...</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-[120px] rounded-2xl bg-white/5 animate-pulse border border-white/5"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Feedback Management
          </h1>
          <p className="text-white/40 mt-2">
            {feedback.length} total · {featuredCount} featured on landing page
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            type="text"
            placeholder="Search feedback..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition text-sm"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          {(["all", "pending", "approved", "featured"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                filter === f
                  ? "bg-white/15 text-white border border-white/20"
                  : "bg-white/5 text-white/50 border border-white/5 hover:bg-white/10"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
          <MessageSquareText className="h-12 w-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40 text-lg">No feedback found</p>
          <p className="text-white/20 text-sm mt-1">
            {filter !== "all"
              ? "Try changing the filter"
              : "No users have submitted feedback yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((fb) => (
            <div
              key={fb.id}
              className={`rounded-2xl border p-6 transition-all ${
                fb.is_featured
                  ? "border-amber-500/30 bg-amber-500/5"
                  : fb.is_approved
                    ? "border-green-500/20 bg-white/5"
                    : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  {/* User Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-sm">
                      {fb.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-medium">{fb.user_name}</p>
                      <p className="text-white/40 text-xs">
                        {fb.user_role && `${fb.user_role} · `}
                        {new Date(fb.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= fb.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-white/20"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Message */}
                  <p className="text-white/70 text-sm leading-relaxed">
                    &ldquo;{fb.message}&rdquo;
                  </p>

                  {/* Status Badges */}
                  <div className="flex gap-2 mt-4">
                    {fb.is_approved && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                        Approved
                      </span>
                    )}
                    {fb.is_featured && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        ★ Featured
                      </span>
                    )}
                    {!fb.is_approved && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-white/30 border border-white/10">
                        Pending Review
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex sm:flex-col gap-2">
                  <button
                    onClick={() => toggleApproval(fb.id, fb.is_approved)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition ${
                      fb.is_approved
                        ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                        : "bg-white/5 text-white/50 hover:bg-white/10"
                    }`}
                    title={fb.is_approved ? "Unapprove" : "Approve"}
                  >
                    {fb.is_approved ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    <span className="hidden sm:inline">
                      {fb.is_approved ? "Approved" : "Approve"}
                    </span>
                  </button>

                  <button
                    onClick={() => toggleFeatured(fb.id, fb.is_featured)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition ${
                      fb.is_featured
                        ? "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                        : "bg-white/5 text-white/50 hover:bg-white/10"
                    }`}
                    title={
                      fb.is_featured
                        ? "Remove from landing page"
                        : "Feature on landing page"
                    }
                  >
                    {fb.is_featured ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="hidden sm:inline">
                      {fb.is_featured ? "Unfeature" : "Feature"}
                    </span>
                  </button>

                  <button
                    onClick={() => deleteFeedback(fb.id)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-red-500/5 text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition"
                    title="Delete feedback"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
