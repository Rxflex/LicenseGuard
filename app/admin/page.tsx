import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Key, Users, Activity, Shield, ArrowRight } from "lucide-react"
import Link from "next/link"

async function getStats() {
  const [totalLicenses, activeLicenses, totalUsers, recentLogs] = await Promise.all([
    prisma.license.count({ where: { status: { not: "DELETED" } } }),
    prisma.license.count({ where: { status: "ACTIVE" } }),
    prisma.user.count(),
    prisma.licenseLog.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    }),
  ])

  return { totalLicenses, activeLicenses, totalUsers, recentLogs }
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
    redirect("/login")
  }

  const stats = await getStats()

  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-5xl font-bold text-white">Dashboard</h1>
            <p className="text-xl text-zinc-400">
              Welcome back, <span className="text-[#f97316] font-medium">{session.user.name}</span>
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass-card border-zinc-800 rounded-2xl hover:scale-105 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-zinc-400">Total Licenses</CardTitle>
                  <div className="w-10 h-10 bg-[#f97316] rounded-xl flex items-center justify-center">
                    <Key className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.totalLicenses}</div>
                <p className="text-xs text-zinc-500 mt-1">All licenses</p>
              </CardContent>
            </Card>

            <Card className="glass-card border-zinc-800 rounded-2xl hover:scale-105 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-zinc-400">Active Licenses</CardTitle>
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.activeLicenses}</div>
                <p className="text-xs text-zinc-500 mt-1">Currently valid</p>
              </CardContent>
            </Card>

            <Card className="glass-card border-zinc-800 rounded-2xl hover:scale-105 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-zinc-400">Users</CardTitle>
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.totalUsers}</div>
                <p className="text-xs text-zinc-500 mt-1">Administrators</p>
              </CardContent>
            </Card>

            <Card className="glass-card border-zinc-800 rounded-2xl hover:scale-105 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-zinc-400">24h Checks</CardTitle>
                  <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.recentLogs}</div>
                <p className="text-xs text-zinc-500 mt-1">Verifications</p>
              </CardContent>
            </Card>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="glass-card border-zinc-800 rounded-2xl hover:scale-105 transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#f97316] rounded-xl flex items-center justify-center">
                    <Key className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-white">License Management</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-zinc-400">
                  Create, edit, and manage all licenses in the system with advanced controls.
                </p>
                <Link href="/admin/licenses">
                  <Button className="w-full bg-[#f97316] hover:bg-[#f97316]/90 text-white font-medium rounded-xl h-12 transition-all duration-300 hover:scale-105">
                    Manage Licenses
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="glass-card border-zinc-800 rounded-2xl hover:scale-105 transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-white">Activity Logs</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-zinc-400">
                  Monitor all license verification attempts and system activity in real-time.
                </p>
                <Link href="/admin/logs">
                  <Button className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-xl h-12 transition-all duration-300 hover:scale-105">
                    View Logs
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {session.user.role === "ADMIN" && (
              <Card className="glass-card border-zinc-800 rounded-2xl hover:scale-105 transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-white">User Management</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-zinc-400">Manage administrators and moderators with role-based permissions.</p>
                  <Link href="/admin/users">
                    <Button className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-xl h-12 transition-all duration-300 hover:scale-105">
                      Manage Users
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
