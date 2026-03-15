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
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 bg-[#0a1128]/5 border border-[#0a1128]/10 text-[#0a1128] px-3 py-1 rounded-full text-[10px] tracking-widest font-bold uppercase w-fit mb-2">
            <span className="w-1.5 h-1.5 bg-[#0a1128] rounded-full animate-pulse" />
            Social Proof
          </div>
          <h1 className="text-4xl font-black text-[#0a1128] tracking-tight uppercase leading-none">
            FEEDBACK <span className="text-[#0a1128]/40">MANAGEMENT</span>
          </h1>
          <p className="text-[#5b637a] font-medium text-lg">Loading feedback...</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-[150px] rounded-[2.5rem] bg-white/50 animate-pulse border border-black/5 shadow-sm"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 bg-[#0a1128]/5 border border-[#0a1128]/10 text-[#0a1128] px-3 py-1 rounded-full text-[10px] tracking-widest font-bold uppercase w-fit mb-2">
            <span className="w-1.5 h-1.5 bg-[#0a1128] rounded-full" />
            Social Proof
          </div>
          <h1 className="text-4xl font-black text-[#0a1128] tracking-tight uppercase leading-none">
            FEEDBACK <span className="text-[#0a1128]/40">MANAGEMENT</span>
          </h1>
          <p className="text-[#5b637a] font-medium text-lg">
            {feedback.length} total submissions · <span className="text-amber-600">{featuredCount} featured</span>
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Search */}
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0a1128]/30 group-focus-within:text-[#0a1128] transition-colors" />
          <input
            type="text"
            placeholder="Search feedback by user or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-black/5 text-[#0a1128] font-bold placeholder:text-[#0a1128]/20 focus:outline-none focus:border-[#0a1128]/20 focus:bg-white transition-all shadow-sm"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap p-1 bg-white/50 backdrop-blur-sm rounded-2xl border border-black/5">
          {(["all", "pending", "approved", "featured"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === f
                  ? "bg-[#0a1128] text-white shadow-lg"
                  : "text-[#0a1128]/40 hover:text-[#0a1128] hover:bg-black/5"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback List */}
      {filtered.length === 0 ? (
        <div className="rounded-[3rem] border-2 border-dashed border-black/5 bg-black/5 p-20 text-center">
          <MessageSquareText className="h-16 w-16 text-[#0a1128]/10 mx-auto mb-4" />
          <p className="text-[#0a1128] font-black uppercase tracking-tight text-xl">No feedback found</p>
          <p className="text-[#5b637a] font-medium mt-1">Try changing your filters or searching for something else</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((fb) => (
            <div
              key={fb.id}
              className={`rounded-[2.5rem] border p-8 transition-all hover:translate-y-[-2px] hover:shadow-2xl shadow-xl shadow-black/[0.02] bg-white/80 backdrop-blur-sm relative overflow-hidden group ${
                fb.is_featured ? "border-amber-500/20" : "border-black/5"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                <div className="flex-1">
                  {/* User Info */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#0a1128] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#0a1128]/20">
                      {fb.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[#0a1128] font-black uppercase tracking-tight text-xl leading-none">
                        {fb.user_name}
                      </p>
                      <p className="text-[#5b637a] text-[10px] font-bold mt-1 uppercase tracking-widest">
                        {fb.user_role || "Customer"} · {new Date(fb.created_at).toLocaleDateString("en-IN", { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1.5 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= fb.rating
                            ? "text-amber-500 fill-amber-500"
                            : "text-[#0a1128]/10"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Message */}
                  <div className="relative">
                    <p className="text-[#0a1128] text-lg font-bold leading-relaxed pr-8 italic opacity-90">
                      &ldquo;{fb.message}&rdquo;
                    </p>
                  </div>

                  {/* Status Badges */}
                  <div className="flex gap-2 mt-8">
                    {fb.is_approved && (
                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        Approved
                      </span>
                    )}
                    {fb.is_featured && (
                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                        ★ Featured
                      </span>
                    )}
                    {!fb.is_approved && (
                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-black/5 text-[#0a1128]/30 border border-black/5">
                        Pending Review
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-3 shrink-0">
                  <button
                    onClick={() => toggleApproval(fb.id, fb.is_approved)}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      fb.is_approved
                        ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                        : "bg-[#0a1128]/5 text-[#0a1128] hover:bg-[#0a1128]/10"
                    }`}
                  >
                    <Check className="h-4 w-4" />
                    {fb.is_approved ? "Approved" : "Approve"}
                  </button>

                  <button
                    onClick={() => toggleFeatured(fb.id, fb.is_featured)}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      fb.is_featured
                        ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                        : "bg-[#0a1128]/5 text-[#0a1128] hover:bg-[#0a1128]/10"
                    }`}
                  >
                    {fb.is_featured ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {fb.is_featured ? "Unfeature" : "Feature"}
                  </button>

                  <button
                    onClick={() => deleteFeedback(fb.id)}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-red-500/5 text-red-500 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
              
              {/* Feature highlight bar */}
              {fb.is_featured && <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
