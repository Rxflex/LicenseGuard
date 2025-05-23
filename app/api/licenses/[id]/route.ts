import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { withDatabase } from "@/lib/db-middleware"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  return withDatabase(async () => {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
      const { name, status, expiresAt, allowedIps } = await request.json()

      const updatedLicense = await prisma.license.update({
        where: { id: params.id },
        data: {
          name,
          status,
          expiresAt: new Date(expiresAt),
          allowedIps,
        },
      })

      return NextResponse.json(updatedLicense)
    } catch (error) {
      console.error("Error updating license:", error)
      return NextResponse.json({ error: "Failed to update license" }, { status: 500 })
    }
  })
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return withDatabase(async () => {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
      await prisma.license.update({
        where: { id: params.id },
        data: { status: "DELETED" },
      })

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error("Error deleting license:", error)
      return NextResponse.json({ error: "Failed to delete license" }, { status: 500 })
    }
  })
}
