import { type NextRequest, NextResponse } from "next/server"
import { checkLicense } from "@/lib/license-checker"
import { withDatabase } from "@/lib/db-middleware"

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

    const clientIP = getClientIP(request)
    const userAgent = request.headers.get("user-agent") || undefined
    const result = await checkLicense(key, clientIP, userAgent)

    return NextResponse.json(result)
  })
}
