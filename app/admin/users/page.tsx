import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserList } from "@/components/user-list"
import { CreateUserDialog } from "@/components/create-user-dialog"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"

async function getUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      creator: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

export default async function UsersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin")
  }

  const users = await getUsers()

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage administrators and moderators</p>
        </div>
        <CreateUserDialog>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Create User
          </Button>
        </CreateUserDialog>
      </div>

      <UserList users={users} />
    </div>
  )
}
