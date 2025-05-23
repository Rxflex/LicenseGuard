import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { LicenseList } from "@/components/license-list"
import { CreateLicenseDialog } from "@/components/create-license-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

async function getLicenses() {
  return await prisma.license.findMany({
    where: { status: { not: "DELETED" } },
    include: {
      creator: { select: { name: true, email: true } },
      _count: { select: { logs: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export default async function LicensesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
    redirect("/login")
  }

  const licenses = await getLicenses()

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">License Management</h1>
          <p className="text-muted-foreground">Manage and monitor all licenses</p>
        </div>
        <CreateLicenseDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create License
          </Button>
        </CreateLicenseDialog>
      </div>

      <LicenseList licenses={licenses} />
    </div>
  )
}
