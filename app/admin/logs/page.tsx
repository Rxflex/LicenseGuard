import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { LogsList } from "@/components/logs-list"

async function getLogs() {
  return await prisma.licenseLog.findMany({
    include: {
      license: {
        select: {
          key: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100, // Последние 100 записей
  })
}

export default async function LogsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
    redirect("/login")
  }

  const logs = await getLogs()

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">License Check Logs</h1>
        <p className="text-muted-foreground">Monitor all license verification attempts</p>
      </div>

      <LogsList logs={logs} />
    </div>
  )
}
