"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [checkingAdmin, setCheckingAdmin] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkAdmin() {
      try {
        const res = await fetch("/api/health")
        const data = await res.json()

        if (data.admin !== "initialized") {
          router.push("/setup")
        }
      } catch (error) {
        console.error("Failed to check admin status:", error)
        router.push("/setup")
      } finally {
        setCheckingAdmin(false)
      }
    }

    checkAdmin()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid credentials")
      } else {
        const session = await getSession()
        if (session?.user?.role === "ADMIN" || session?.user?.role === "MODERATOR") {
          router.push("/admin")
        } else {
          setError("Access denied")
        }
      }
    } catch (error) {
      setError("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (checkingAdmin) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#f97316]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Back to home */}
        <Link href="/" className="flex items-center text-zinc-400 hover:text-[#f97316] transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <Card className="glass-card border-zinc-800 rounded-2xl">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="w-16 h-16 bg-[#f97316] rounded-2xl flex items-center justify-center mx-auto">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-white">Welcome Back</CardTitle>
              <p className="text-zinc-400 mt-2">Sign in to access the admin panel</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="h-12 bg-zinc-900 border-zinc-700 text-white rounded-xl focus:border-[#f97316] focus:ring-[#f97316]/20"
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="h-12 bg-zinc-900 border-zinc-700 text-white rounded-xl focus:border-[#f97316] focus:ring-[#f97316]/20"
                  placeholder="Enter your password"
                />
              </div>
              {error && (
                <Alert className="bg-red-500/10 border-red-500/20 rounded-xl">
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                className="w-full h-12 bg-[#f97316] hover:bg-[#f97316]/90 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 orange-glow"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
