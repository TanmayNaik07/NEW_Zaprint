import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/login'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Ensure profile exists (in case trigger was removed/failed)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const metadata = user.user_metadata
        // Best effort to create profile
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: user.id,
          email: user.email,
          full_name: metadata.name || metadata.full_name,
          address: metadata.address,
          phone_number: metadata.phone_number || metadata.phone, // Handle both keys
          avatar_url: metadata.avatar_url,
          updated_at: new Date().toISOString()
        })
        
        if (profileError) {
          console.error("Profile creation in callback failed:", profileError)
        }
      }

      // Redirect to dashboard if verified, or login
      return NextResponse.redirect(new URL(`/dashboard?verified=true`, requestUrl.origin))
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(new URL('/login?error=verification_failed', requestUrl.origin))
}
