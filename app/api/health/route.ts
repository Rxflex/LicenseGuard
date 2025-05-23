import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { initializeAdmin } from "@/lib/init-admin"

export async function GET() {
  try {
    // Проверяем подключение к базе данных
    await prisma.$connect()

    // Получаем статистику
    const [userCount, licenseCount, adminExists] = await Promise.all([
      prisma.user.count(),
      prisma.license.count(),
      prisma.user.findFirst({ where: { role: "ADMIN" } }),
    ])

    // Если администратора нет, пытаемся создать
    let adminInitialized = !!adminExists
    if (!adminExists) {
      const initResult = await initializeAdmin()
      adminInitialized = initResult.success
    }

    return NextResponse.json({
      status: "healthy",
      database: "connected",
      admin: adminInitialized ? "initialized" : "missing",
      stats: {
        users: userCount,
        licenses: licenseCount,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Health check failed:", error)

    return NextResponse.json(
      {
        status: "unhealthy",
        database: "disconnected",
        admin: "unknown",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
