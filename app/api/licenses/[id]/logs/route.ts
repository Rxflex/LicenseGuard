import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { withDatabase } from "@/lib/db-middleware"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return withDatabase(async () => {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
      const logs = await prisma.licenseLog.findMany({
        where: { licenseId: params.id },
        orderBy: { createdAt: "desc" },
        take: 50,
      })

      return NextResponse.json(logs)
    } catch (error) {
      console.error("Error fetching license logs:", error)
      return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 })
    }
  })
}
