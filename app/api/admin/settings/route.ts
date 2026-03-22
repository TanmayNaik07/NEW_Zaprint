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
  validateString,
  validationErrorResponse,
} from "@/lib/security/validation"

// Allowed site setting keys — OWASP: whitelist approach prevents arbitrary key injection
const ALLOWED_SETTING_KEYS = [
  "contact",
  "hero_title",
  "hero_subtitle",
  "announcement",
  "maintenance_mode",
  "bw_rate",
  "color_rate",
  "max_file_size",
  "allowed_file_types",
] as const

// GET: Fetch all site settings for admin
export async function GET(request: NextRequest) {
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

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Convert to a key-value object for easier consumption in the admin UI
  const settings = data.reduce((acc: any, item: any) => {
    acc[item.key] = item.value
    return acc
  }, {})

  return NextResponse.json({ settings })
}

// POST: Update or create a site setting
export async function POST(request: NextRequest) {
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

  // SECURITY: Schema-based validation
  const validationResult = validateBody(parseResult.data, {
    key: (v) => validateString(v, "Key", { minLength: 1, maxLength: 100 }),
    value: (v) => {
      // Value can be any type (string, object, etc.) — just check it exists
      if (v === undefined) {
        return { success: false, error: "Value is required" }
      }
      return { success: true, data: v }
    },
  })

  if (!validationResult.success) {
    return validationErrorResponse(validationResult.error)
  }

  const { key, value } = validationResult.data

  // SECURITY: Validate the setting key against the whitelist
  // This prevents arbitrary database key injection
  if (!ALLOWED_SETTING_KEYS.includes(key as any)) {
    return validationErrorResponse(
      `Invalid setting key. Allowed keys: ${ALLOWED_SETTING_KEYS.join(", ")}`
    )
  }

  const { data, error } = await supabase
    .from("site_settings")
    .upsert(
      { 
        key, 
        value, 
        updated_at: new Date().toISOString() 
      }, 
      { onConflict: 'key' }
    )
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
