import { createClient } from "@/lib/supabase/server"
import { isAdminEmail } from "@/lib/admin"
import { NextRequest, NextResponse } from "next/server"
import {
  applyIPRateLimit,
  applyUserRateLimit,
  ADMIN_LIMIT,
} from "@/lib/security/rate-limit"
import {
  safeParseJSON,
  validateBody,
  validateUUID,
  validateBoolean,
  validationErrorResponse,
} from "@/lib/security/validation"

// GET: Fetch all feedback for admin
export async function GET(request: NextRequest) {
  // SECURITY: Rate limit by IP first
  const ipLimited = applyIPRateLimit(request, ADMIN_LIMIT)
  if (ipLimited) return ipLimited

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

// PATCH: Update feedback (approve/feature/unfeatured)
export async function PATCH(request: NextRequest) {
  // SECURITY: Rate limit by IP
  const ipLimited = applyIPRateLimit(request, ADMIN_LIMIT)
  if (ipLimited) return ipLimited

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // SECURITY: Rate limit admin actions per user
  const userLimited = applyUserRateLimit(user.id, ADMIN_LIMIT)
  if (userLimited) return userLimited

  // SECURITY: Safe JSON parsing
  const parseResult = await safeParseJSON(request)
  if (!parseResult.success) {
    return validationErrorResponse(parseResult.error)
  }

  // SECURITY: Schema-based validation with UUID check
  const validationResult = validateBody(parseResult.data, {
    id: (v) => validateUUID(v, "Feedback ID"),
    is_approved: (v) => validateBoolean(v, "is_approved", { required: false }),
    is_featured: (v) => validateBoolean(v, "is_featured", { required: false }),
  })

  if (!validationResult.success) {
    return validationErrorResponse(validationResult.error)
  }

  const { id, is_approved, is_featured } = validationResult.data

  const updates: Record<string, any> = { updated_at: new Date().toISOString() }
  if (typeof is_approved === "boolean") updates.is_approved = is_approved
  if (typeof is_featured === "boolean") updates.is_featured = is_featured

  const { data, error } = await supabase
    .from("feedback")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

// DELETE: Delete feedback
export async function DELETE(request: NextRequest) {
  // SECURITY: Rate limit by IP
  const ipLimited = applyIPRateLimit(request, ADMIN_LIMIT)
  if (ipLimited) return ipLimited

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // SECURITY: Rate limit admin actions per user
  const userLimited = applyUserRateLimit(user.id, ADMIN_LIMIT)
  if (userLimited) return userLimited

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  // SECURITY: Validate the feedback ID is a proper UUID
  if (!id) {
    return validationErrorResponse("Feedback ID is required")
  }

  const uuidCheck = validateUUID(id, "Feedback ID")
  if (!uuidCheck.success) {
    return validationErrorResponse(uuidCheck.error)
  }

  const { error } = await supabase.from("feedback").delete().eq("id", uuidCheck.data)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
