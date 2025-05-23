import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { name, description, expiresAt, allowedIps } = await request.json()

    const license = await prisma.license.create({
      data: {
        key: uuidv4(),
        name,
        description,
        expiresAt: new Date(expiresAt),
        allowedIps,
        createdBy: session.user.id,
      },
    })

    return NextResponse.json(license)
  } catch (error) {
    console.error("Failed to create license:", error)
    return NextResponse.json({ error: "Failed to create license" }, { status: 500 })
  }
}
