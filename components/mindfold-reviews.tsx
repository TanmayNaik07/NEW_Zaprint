"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"

// Fallback static reviews (shown while loading or if no featured feedback exists yet)
const fallbackReviews = [
  {
    id: "fallback-1",
    user_name: "Rahul S.",
    user_role: "College Student",
    rating: 5,
    message:
      "Zaprint has completely changed how I print assignments. Upload, pay, and pick up — it's that simple. No more waiting in long queues at the print shop!",
  },
  {
    id: "fallback-2",
    user_name: "Priya M.",
    user_role: "Startup Founder",
    rating: 5,
    message:
      "The real-time estimation feature is incredible. I know exactly when to go pick up my prints. Saved me so much time during busy workdays.",
  },
  {
    id: "fallback-3",
    user_name: "Dr. Anil K.",
    user_role: "Research Professor",
    rating: 5,
    message:
      "As someone who prints a lot of research papers, the multiple format support and quality is outstanding. The secure payment gives me peace of mind.",
  },
  {
    id: "fallback-4",
    user_name: "Sneha T.",
    user_role: "Graphic Designer",
    rating: 4,
    message:
      "The color printing quality exceeded my expectations. Being able to choose exact specifications online saved me from so many miscommunication issues.",
  },
  {
    id: "fallback-5",
    user_name: "Vikram J.",
    user_role: "MBA Student",
    rating: 5,
    message:
      "The notification when prints are ready is a game-changer. I used to waste 20 minutes waiting at the shop. Now I just walk in and grab my documents.",
  },
  {
    id: "fallback-6",
    user_name: "Ananya R.",
    user_role: "Office Manager",
    rating: 5,
    message:
      "Managing bulk prints for our entire team is so easy now. The business plan and team management features are exactly what we needed.",
  },
]

interface Review {
  id: string
  user_name: string
  user_role: string
  rating: number
  message: string
}

export function MindfoldReviews() {
  const [reviews, setReviews] = useState<Review[]>(fallbackReviews)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch("/api/feedback")
        if (!res.ok) throw new Error("Failed")
        const data = await res.json()
        if (data.data && data.data.length > 0) {
          setReviews(data.data)
        }
        // If no featured reviews exist, keep the fallback
      } catch {
        // Keep fallback on error
      } finally {
        setIsLoaded(true)
      }
    }
    fetchFeatured()
  }, [])

  return (
    <section id="reviews" className="bg-[#f7f6f4] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0a1128] tracking-tight uppercase">
            Loved by <span className="text-[#0a1128]/40">THOUSANDS</span>
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-[#5b637a] font-medium max-w-2xl mx-auto leading-relaxed">
            See what our users have to say about their Zaprint experience.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full"
            >
              {/* Star Rating */}
              <div>
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= review.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-[#0a1128] font-medium leading-relaxed mb-8 text-lg">
                  &ldquo;{review.message}&rdquo;
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-[#0a1128] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  {review.user_name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-[#0a1128]">
                    {review.user_name}
                  </div>
                  {review.user_role && (
                    <div className="text-sm font-medium text-[#5b637a]">
                      {review.user_role}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
