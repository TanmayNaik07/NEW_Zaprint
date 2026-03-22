/**
 * In-memory rate limiter for Next.js API routes.
 * 
 * OWASP: Protects against brute-force, credential stuffing, and DoS attacks
 * by limiting the number of requests from a single source within a time window.
 * 
 * Uses a sliding-window approach with automatic cleanup to prevent memory leaks.
 * Supports both IP-based (for public endpoints) and user-based (for auth endpoints) limiting.
 */

import { NextRequest, NextResponse } from "next/server"

// --- Types ---

interface RateLimitEntry {
  /** Timestamps of requests within the current window */
  timestamps: number[]
  /** When this entry was last accessed (for cleanup) */
  lastAccessed: number
}

interface RateLimitConfig {
  /** Maximum number of requests allowed within the window */
  maxRequests: number
  /** Time window in milliseconds */
  windowMs: number
  /** Unique identifier prefix for the store (avoids collisions between endpoints) */
  identifier: string
}

// --- Preset configurations for different endpoint types ---

/** Public GET endpoints — generous limits (60 req/min per IP) */
export const PUBLIC_READ_LIMIT: RateLimitConfig = {
  maxRequests: 60,
  windowMs: 60_000,
  identifier: "pub_read",
}

/** Public write endpoints — tighter limits (10 req/min per IP) */
export const PUBLIC_WRITE_LIMIT: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60_000,
  identifier: "pub_write",
}

/** Authenticated user endpoints — moderate limits (30 req/min per user) */
export const AUTH_LIMIT: RateLimitConfig = {
  maxRequests: 30,
  windowMs: 60_000,
  identifier: "auth",
}

/** Admin endpoints — generous for admin use (60 req/min) */
export const ADMIN_LIMIT: RateLimitConfig = {
  maxRequests: 60,
  windowMs: 60_000,
  identifier: "admin",
}

/** Payment endpoints — strict limits to prevent abuse (5 req/min per user) */
export const PAYMENT_LIMIT: RateLimitConfig = {
  maxRequests: 5,
  windowMs: 60_000,
  identifier: "payment",
}

// --- Rate Limit Store ---

/** Global in-memory store: key → entry */
const store = new Map<string, RateLimitEntry>()

/** Cleanup stale entries every 5 minutes to prevent memory bloat */
const CLEANUP_INTERVAL_MS = 5 * 60_000
/** Entries older than 10 minutes are considered stale */
const STALE_THRESHOLD_MS = 10 * 60_000

let cleanupTimer: ReturnType<typeof setInterval> | null = null

function ensureCleanupRunning() {
  if (cleanupTimer) return
  cleanupTimer = setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store) {
      if (now - entry.lastAccessed > STALE_THRESHOLD_MS) {
        store.delete(key)
      }
    }
    // Stop the timer if the store is empty — no need to keep it running
    if (store.size === 0 && cleanupTimer) {
      clearInterval(cleanupTimer)
      cleanupTimer = null
    }
  }, CLEANUP_INTERVAL_MS)
  // Ensure the timer doesn't prevent Node.js from exiting
  if (cleanupTimer && typeof cleanupTimer === "object" && "unref" in cleanupTimer) {
    cleanupTimer.unref()
  }
}

// --- Core rate-limit check ---

/**
 * Check if a request is within the rate limit.
 * Returns the number of remaining requests and the reset time.
 */
function checkRateLimit(
  key: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetMs: number } {
  ensureCleanupRunning()

  const now = Date.now()
  const windowStart = now - config.windowMs

  let entry = store.get(key)
  if (!entry) {
    entry = { timestamps: [], lastAccessed: now }
    store.set(key, entry)
  }

  // Remove timestamps outside the current window (sliding window)
  entry.timestamps = entry.timestamps.filter((ts) => ts > windowStart)
  entry.lastAccessed = now

  if (entry.timestamps.length >= config.maxRequests) {
    // Rate limit exceeded — calculate when the oldest request in the window expires
    const oldestInWindow = entry.timestamps[0]
    const resetMs = oldestInWindow + config.windowMs - now
    return {
      allowed: false,
      remaining: 0,
      resetMs: Math.max(resetMs, 1000), // At least 1 second
    }
  }

  // Request allowed — record it
  entry.timestamps.push(now)
  return {
    allowed: true,
    remaining: config.maxRequests - entry.timestamps.length,
    resetMs: config.windowMs,
  }
}

// --- Public API ---

/**
 * Extract client IP from the request.
 * Works with Vercel, Cloudflare, and direct connections.
 */
export function getClientIP(request: NextRequest): string {
  // OWASP: Use the most reliable header first
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  )
}

/**
 * Apply IP-based rate limiting to a request.
 * Returns null if allowed, or a 429 Response if rate-limited.
 * 
 * Usage:
 *   const limited = applyIPRateLimit(request, PUBLIC_READ_LIMIT)
 *   if (limited) return limited
 */
export function applyIPRateLimit(
  request: NextRequest,
  config: RateLimitConfig
): NextResponse | null {
  const ip = getClientIP(request)
  const key = `${config.identifier}:ip:${ip}`
  const result = checkRateLimit(key, config)

  if (!result.allowed) {
    return NextResponse.json(
      {
        error: "Too many requests. Please try again later.",
        retryAfterMs: result.resetMs,
      },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(result.resetMs / 1000).toString(),
          "X-RateLimit-Limit": config.maxRequests.toString(),
          "X-RateLimit-Remaining": "0",
        },
      }
    )
  }

  return null // Allowed
}

/**
 * Apply user-based rate limiting to a request.
 * Requires the user ID (typically from Supabase auth).
 * Returns null if allowed, or a 429 Response if rate-limited.
 * 
 * Usage:
 *   const limited = applyUserRateLimit(userId, AUTH_LIMIT)
 *   if (limited) return limited
 */
export function applyUserRateLimit(
  userId: string,
  config: RateLimitConfig
): NextResponse | null {
  const key = `${config.identifier}:user:${userId}`
  const result = checkRateLimit(key, config)

  if (!result.allowed) {
    return NextResponse.json(
      {
        error: "Too many requests. Please slow down and try again.",
        retryAfterMs: result.resetMs,
      },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(result.resetMs / 1000).toString(),
          "X-RateLimit-Limit": config.maxRequests.toString(),
          "X-RateLimit-Remaining": "0",
        },
      }
    )
  }

  return null // Allowed
}
