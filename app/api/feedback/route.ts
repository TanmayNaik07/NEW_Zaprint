import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import {
  applyIPRateLimit,
  applyUserRateLimit,
  PUBLIC_READ_LIMIT,
  PUBLIC_WRITE_LIMIT,
} from "@/lib/security/rate-limit"
import {
  safeParseJSON,
  validateBody,
  validateInteger,
  validateString,
  validateEnum,
  validationErrorResponse,
} from "@/lib/security/validation"

// GET: Fetch featured feedback for landing page (public)
export async function GET(request: NextRequest) {
  // SECURITY: Rate limit public reads by IP
  const limited = applyIPRateLimit(request, PUBLIC_READ_LIMIT)
  if (limited) return limited

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
  // SECURITY: Rate limit public writes by IP (before auth, to block brute-force)
  const ipLimited = applyIPRateLimit(request, PUBLIC_WRITE_LIMIT)
  if (ipLimited) return ipLimited

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // SECURITY: Rate limit by user to prevent spamming (5 feedback per minute)
  const userLimited = applyUserRateLimit(user.id, {
    maxRequests: 5,
    windowMs: 60_000,
    identifier: "feedback_submit",
  })
  if (userLimited) return userLimited

  // SECURITY: Parse and validate JSON body safely
  const parseResult = await safeParseJSON(request)
  if (!parseResult.success) {
    return validationErrorResponse(parseResult.error)
  }

  // SECURITY: Schema-based validation — reject unexpected fields
  const validationResult = validateBody(parseResult.data, {
    rating: (v) => validateInteger(v, "Rating", { min: 1, max: 5 }),
    message: (v) =>
      validateString(v, "Message", { minLength: 10, maxLength: 2000 }),
    user_role: (v) =>
      validateString(v, "User role", {
        required: false,
        maxLength: 100,
      }),
  })

  if (!validationResult.success) {
    return validationErrorResponse(validationResult.error)
  }

  const { rating, message, user_role } = validationResult.data

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
      rating,
      message,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 201 })
}
