import { NextResponse } from "next/server"
import { prisma } from "./prisma"

export async function withDatabase<T>(operation: () => Promise<T>): Promise<T | NextResponse> {
  try {
    // Проверяем подключение к базе данных
    await prisma.$connect()
    return await operation()
  } catch (error) {
    console.error("Database operation failed:", error)

    if (error instanceof Error) {
      if (error.message.includes("Can't reach database server")) {
        return NextResponse.json({ error: "Database connection failed" }, { status: 503 })
      }

      if (error.message.includes("Unknown database")) {
        return NextResponse.json({ error: "Database not found" }, { status: 503 })
      }
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
