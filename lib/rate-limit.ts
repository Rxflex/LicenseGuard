// Simple in-memory rate limiter
interface RateLimitEntry {
  count: number
  resetTime: number
}

const store = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
setInterval(
  () => {
    const now = Date.now()
    for (const [key, entry] of store.entries()) {
      if (now > entry.resetTime) {
        store.delete(key)
      }
    }
  },
  5 * 60 * 1000,
)

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
  retryAfter: number
}

export async function rateLimit(
  identifier: string,
  limit = 10,
  windowMs: number = 60 * 1000, // 1 minute
): Promise<RateLimitResult> {
  const now = Date.now()
  const resetTime = now + windowMs

  const entry = store.get(identifier)

  if (!entry || now > entry.resetTime) {
    // First request or window expired
    store.set(identifier, { count: 1, resetTime })
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: Math.ceil(resetTime / 1000),
      retryAfter: 0,
    }
  }

  if (entry.count >= limit) {
    // Rate limit exceeded
    return {
      success: false,
      limit,
      remaining: 0,
      reset: Math.ceil(entry.resetTime / 1000),
      retryAfter: Math.ceil((entry.resetTime - now) / 1000),
    }
  }

  // Increment count
  entry.count++
  store.set(identifier, entry)

  return {
    success: true,
    limit,
    remaining: limit - entry.count,
    reset: Math.ceil(entry.resetTime / 1000),
    retryAfter: 0,
  }
}
