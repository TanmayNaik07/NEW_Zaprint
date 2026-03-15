"use client"

import { useState } from "react"
import { Star, Send, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { track } from "@vercel/analytics"

export function FeedbackForm() {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [message, setMessage] = useState("")
  const [userRole, setUserRole] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (rating === 0) {
      toast.error("Please select a rating")
      return
    }
    if (message.length < 10) {
      toast.error("Please write at least 10 characters")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, message, user_role: userRole }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to submit")
      }

      // Track analytics event
      track("feedback_submitted", { rating, role: userRole || "not_specified" })

      setIsSubmitted(true)
      toast.success("Thank you for your feedback!")
    } catch (err: any) {
      toast.error(err.message || "Failed to submit feedback")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="rounded-[2rem] bg-white border border-black/5 p-8 text-center shadow-sm">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-[#0a1128] mb-2">
          Thank you for your feedback!
        </h3>
        <p className="text-[#5b637a] text-sm">
          Your review has been submitted and is pending approval. It may appear
          on our landing page once reviewed.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] bg-white border border-black/5 p-8 shadow-sm"
    >
      <h3 className="text-xl font-bold text-[#0a1128] mb-6">
        Share Your Experience
      </h3>

      {/* Star Rating */}
      <div className="mb-6">
        <label className="text-sm font-medium text-[#5b637a] mb-2 block">
          How would you rate Zaprint?
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`h-8 w-8 transition-colors ${
                  star <= (hoverRating || rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-200"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Role (Optional) */}
      <div className="mb-4">
        <label className="text-sm font-medium text-[#5b637a] mb-2 block">
          Your Role (optional)
        </label>
        <input
          type="text"
          placeholder="e.g., College Student, Office Manager..."
          value={userRole}
          onChange={(e) => setUserRole(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-[#0a1128] placeholder:text-[#5b637a]/50 focus:outline-none focus:border-[#0a1128]/30 transition text-sm bg-[#f7f6f4]"
        />
      </div>

      {/* Message */}
      <div className="mb-6">
        <label className="text-sm font-medium text-[#5b637a] mb-2 block">
          Your Review
        </label>
        <textarea
          placeholder="Tell us about your experience with Zaprint..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-black/10 text-[#0a1128] placeholder:text-[#5b637a]/50 focus:outline-none focus:border-[#0a1128]/30 transition text-sm bg-[#f7f6f4] resize-none"
        />
        <p className="text-xs text-[#5b637a]/50 mt-1">
          {message.length}/500 characters (minimum 10)
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || rating === 0 || message.length < 10}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0a1128] text-white font-medium text-sm hover:bg-[#0a1128]/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Submit Review
          </>
        )}
      </button>
    </form>
  )
}
