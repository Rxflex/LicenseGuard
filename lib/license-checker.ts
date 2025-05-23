import { prisma } from "./prisma"
import { LicenseStatus, LogResult } from "@prisma/client"

export interface LicenseCheckResult {
  status: "valid" | "expired" | "blocked" | "invalid" | "ip_blocked"
  message?: string
}

export async function checkLicense(key: string, ip: string, userAgent?: string): Promise<LicenseCheckResult> {
  try {
    const license = await prisma.license.findUnique({
      where: { key },
    })

    let result: LogResult
    let response: LicenseCheckResult

    if (!license) {
      result = LogResult.INVALID
      response = { status: "invalid", message: "License not found" }
    } else if (license.status === LicenseStatus.DELETED) {
      result = LogResult.INVALID
      response = { status: "invalid", message: "License not found" }
    } else if (license.status === LicenseStatus.BLOCKED) {
      result = LogResult.BLOCKED
      response = { status: "blocked", message: "License is blocked" }
    } else if (license.status === LicenseStatus.EXPIRED || license.expiresAt < new Date()) {
      result = LogResult.EXPIRED
      response = { status: "expired", message: "License has expired" }
    } else {
      // Check IP restrictions
      const allowedIps = (license.allowedIps as string[]) || ["*"]
      const isIpAllowed = allowedIps.includes("*") || allowedIps.includes(ip)

      if (!isIpAllowed) {
        result = LogResult.IP_BLOCKED
        response = { status: "ip_blocked", message: "IP address not allowed" }
      } else {
        result = LogResult.VALID
        response = { status: "valid", message: "License is valid" }
      }
    }

    // Log the check
    if (license) {
      await prisma.licenseLog.create({
        data: {
          licenseId: license.id,
          ip,
          userAgent: userAgent || "",
          result,
        },
      })
    }

    return response
  } catch (error) {
    console.error("License check error:", error)
    return { status: "invalid", message: "Internal error" }
  }
}
