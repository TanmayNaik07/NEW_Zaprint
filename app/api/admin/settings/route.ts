import { createClient } from "@/lib/supabase/server"
import { isAdminEmail } from "@/lib/admin"
import { NextRequest, NextResponse } from "next/server"

// GET: Fetch all site settings for admin
export async function GET() {
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
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json()
  const { key, value } = body

  if (!key) {
    return NextResponse.json({ error: "Key is required" }, { status: 400 })
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
