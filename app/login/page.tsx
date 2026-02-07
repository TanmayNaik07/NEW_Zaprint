"use client"

import { LoginForm } from "@/components/auth/login-form"
import { Printer, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function LoginContent() {
  const searchParams = useSearchParams()
  const verified = searchParams.get('verified')
  const error = searchParams.get('error')

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Printer className="w-6 h-6 text-primary" />
        </div>
        <span className="text-foreground text-2xl font-semibold">ZaPrint</span>
      </Link>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
          {/* Verification Messages */}
          {verified === 'true' && (
            <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-green-500 font-semibold text-sm">Email verified!</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Your account has been verified. Please log in to continue.
                </p>
              </div>
            </div>
          )}
          
          {error === 'verification_failed' && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-500 font-semibold text-sm">Verification failed</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  The verification link is invalid or has expired. Please try signing up again.
                </p>
              </div>
            </div>
          )}

          <div className="text-center mb-8">
            <h1 className="text-foreground text-2xl font-semibold mb-2">Welcome back</h1>
            <p className="text-muted-foreground text-sm">Sign in to your account to continue</p>
          </div>

          <LoginForm />

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center animate-pulse">
          <Printer className="w-6 h-6 text-primary" />
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
