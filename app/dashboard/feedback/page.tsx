"use client"

import { useState, useEffect } from "react"
import { FeedbackForm } from "@/components/dashboard/feedback-form"
import { createClient } from "@/lib/supabase/client"
import { Star, MessageSquareText } from "lucide-react"

interface UserFeedback {
  id: string
  rating: number
  message: string
  user_role: string
  is_approved: boolean
  is_featured: boolean
  created_at: string
}

export default function FeedbackPage() {
  const [myFeedback, setMyFeedback] = useState<UserFeedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchMyFeedback() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setIsLoading(false)
        return
      }

      const { data } = await supabase
        .from("feedback")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      setMyFeedback(data || [])
      setIsLoading(false)
    }
    fetchMyFeedback()
  }, [])

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="relative">
        <h1 className="font-rubik-dirt text-[#1a1408] text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight">
          Feedback & Reviews
        </h1>
        <p className="text-[#6b5d45] text-sm md:text-base mt-2 tracking-wide">
          Share your experience with Zaprint. Your review may be featured on our
          landing page!
        </p>
        <div className="mt-6 border-t-[3px] border-dashed border-[#1a1408]/70 w-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Feedback Form */}
        <div>
          <FeedbackForm />
        </div>

        {/* My Previous Reviews */}
        <div>
          <h2 className="text-lg font-bold text-[#0a1128] mb-4">
            Your Reviews
          </h2>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-[120px] rounded-[2rem] bg-white animate-pulse border border-black/5"
                />
              ))}
            </div>
          ) : myFeedback.length === 0 ? (
            <div className="rounded-[2rem] bg-white border border-black/5 p-8 text-center shadow-sm">
              <MessageSquareText className="h-10 w-10 text-[#5b637a]/30 mx-auto mb-3" />
              <p className="text-[#5b637a] text-sm">
                You haven&apos;t submitted any reviews yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myFeedback.map((fb) => (
                <div
                  key={fb.id}
                  className={`rounded-[2rem] bg-white border p-6 shadow-sm ${
                    fb.is_featured
                      ? "border-amber-300"
                      : fb.is_approved
                        ? "border-green-200"
                        : "border-black/5"
                  }`}
                >
                  {/* Rating */}
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= fb.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-[#0a1128] text-sm leading-relaxed mb-3">
                    &ldquo;{fb.message}&rdquo;
                  </p>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[#5b637a] text-xs">
                      {new Date(fb.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    {fb.is_featured && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                        ★ Featured on landing page
                      </span>
                    )}
                    {fb.is_approved && !fb.is_featured && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200">
                        Approved
                      </span>
                    )}
                    {!fb.is_approved && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-50 text-gray-400 border border-gray-200">
                        Pending review
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
