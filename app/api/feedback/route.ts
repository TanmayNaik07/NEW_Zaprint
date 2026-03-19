import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// GET: Fetch featured feedback for landing page (public)
export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("feedback")
    .select("id, user_name, user_role, rating, message, created_at")
    .eq("is_featured", true)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(6)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

// POST: Submit new feedback (authenticated users)
export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { rating, message, user_role } = body

  if (!rating || !message) {
    return NextResponse.json(
      { error: "Rating and message are required" },
      { status: 400 }
    )
  }

  if (message.length < 10) {
    return NextResponse.json(
      { error: "Message must be at least 10 characters" },
      { status: 400 }
    )
  }

  // Get user name from profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single()

  const userName = profile?.full_name || user.email?.split("@")[0] || "User"

  const { data, error } = await supabase
    .from("feedback")
    .insert({
      user_id: user.id,
      user_name: userName,
      user_role: user_role || "",
      rating: Math.min(5, Math.max(1, rating)),
      message,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 201 })
}
