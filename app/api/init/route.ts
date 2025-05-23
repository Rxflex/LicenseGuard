import { NextResponse } from "next/server"
import { initializeAdmin } from "@/lib/init-admin"

export async function POST() {
  try {
    const result = await initializeAdmin()

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          message: result.message,
          admin: result.admin ? { email: result.admin.email, name: result.admin.name } : undefined,
        },
        { status: 200 },
      )
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Admin initialization failed:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
