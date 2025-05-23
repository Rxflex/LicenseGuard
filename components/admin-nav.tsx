"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Key, Activity, Users, Home, LogOut, Shield } from "lucide-react"
import { signOut, useSession } from "next-auth/react"

export function AdminNav() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/licenses", label: "Licenses", icon: Key },
    { href: "/admin/logs", label: "Logs", icon: Activity },
    ...(session?.user?.role === "ADMIN" ? [{ href: "/admin/users", label: "Users", icon: Users }] : []),
  ]

  return (
    <nav className="border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/admin" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#f97316] rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">LicenseGuard Admin</span>
            </Link>
            <div className="flex space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`flex items-center space-x-2 rounded-xl transition-all duration-300 ${
                        isActive
                          ? "bg-[#f97316] text-white hover:bg-[#f97316]/90"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="text-white font-medium">{session?.user?.name}</span>
              <span className="ml-2 px-3 py-1 bg-[#f97316] text-white rounded-full text-xs font-medium">
                {session?.user?.role}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-all duration-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
