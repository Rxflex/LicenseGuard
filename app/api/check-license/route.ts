import { type NextRequest, NextResponse } from "next/server"
import { checkLicense } from "@/lib/license-checker"
import { withDatabase } from "@/lib/db-middleware"
import { rateLimit } from "@/lib/rate-limit"

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")
  const cfConnectingIP = request.headers.get("cf-connecting-ip")

  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }

  if (realIP) {
    return realIP
  }

  if (cfConnectingIP) {
    return cfConnectingIP
  }

  return request.ip || "unknown"
}

export async function GET(request: NextRequest) {
  const clientIP = getClientIP(request)

  // Применяем рейт-лимит
  const rateLimitResult = await rateLimit(clientIP)

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        status: "rate_limited",
        message: "Too many requests. Please try again later.",
        retryAfter: rateLimitResult.retryAfter,
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": rateLimitResult.limit.toString(),
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": rateLimitResult.reset.toString(),
          "Retry-After": rateLimitResult.retryAfter.toString(),
        },
      },
    )
  }

  return withDatabase(async () => {
    const searchParams = request.nextUrl.searchParams
    const key = searchParams.get("key")

    if (!key) {
      return NextResponse.json(
        {
          status: "invalid",
          message: "License key is required",
        },
        { status: 400 },
      )
    }

    const userAgent = request.headers.get("user-agent") || undefined
    const result = await checkLicense(key, clientIP, userAgent)

    return NextResponse.json(result, {
      headers: {
        "X-RateLimit-Limit": rateLimitResult.limit.toString(),
        "X-RateLimit-Remaining": (rateLimitResult.remaining - 1).toString(),
        "X-RateLimit-Reset": rateLimitResult.reset.toString(),
      },
    })
  })
}
