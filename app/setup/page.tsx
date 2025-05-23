"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, AlertTriangle, ArrowRight } from "lucide-react"
import Link from "next/link"

interface HealthStatus {
  status: string
  database: string
  admin: string
  stats?: {
    users: number
    licenses: number
  }
  error?: string
  timestamp: string
}

export default function SetupPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [initLoading, setInitLoading] = useState(false)
  const [initResult, setInitResult] = useState<{ success: boolean; message: string } | null>(null)

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch("/api/health")
        const data = await res.json()
        setHealth(data)
      } catch (error) {
        console.error("Failed to check health:", error)
      } finally {
        setLoading(false)
      }
    }

    checkHealth()
  }, [])

  const initializeAdmin = async () => {
    setInitLoading(true)
    setInitResult(null)

    try {
      const res = await fetch("/api/init", {
        method: "POST",
      })
      const data = await res.json()
      setInitResult(data)

      // Обновляем статус здоровья
      const healthRes = await fetch("/api/health")
      const healthData = await healthRes.json()
      setHealth(healthData)
    } catch (error) {
      console.error("Failed to initialize admin:", error)
      setInitResult({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred",
      })
    } finally {
      setInitLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    if (status === "healthy" || status === "connected" || status === "initialized") {
      return <Badge className="bg-green-500">OK</Badge>
    } else if (status === "missing") {
      return <Badge variant="outline">Missing</Badge>
    } else {
      return <Badge variant="destructive">Error</Badge>
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">License Server Setup</CardTitle>
          <CardDescription>Check system status and initialize the application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : health ? (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-medium">System Status</span>
                  {getStatusBadge(health.status)}
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-medium">Database Connection</span>
                  {getStatusBadge(health.database)}
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-medium">Administrator Account</span>
                  {getStatusBadge(health.admin)}
                </div>
                {health.stats && (
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="rounded-lg border p-3 text-center">
                      <div className="text-2xl font-bold">{health.stats.users}</div>
                      <div className="text-sm text-gray-500">Users</div>
                    </div>
                    <div className="rounded-lg border p-3 text-center">
                      <div className="text-2xl font-bold">{health.stats.licenses}</div>
                      <div className="text-sm text-gray-500">Licenses</div>
                    </div>
                  </div>
                )}
              </div>

              {health.admin === "missing" && (
                <div className="pt-4">
                  <Alert className={health.status === "healthy" ? "bg-amber-50" : "bg-red-50"}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Administrator account is missing</AlertTitle>
                    <AlertDescription>
                      You need to create an administrator account to use the license server.
                    </AlertDescription>
                  </Alert>

                  <div className="mt-4">
                    <Button
                      onClick={initializeAdmin}
                      disabled={initLoading || health.database !== "connected"}
                      className="w-full"
                    >
                      {initLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Initialize Administrator
                    </Button>
                    <p className="mt-2 text-xs text-gray-500 text-center">
                      This will create an admin account using ADMIN_EMAIL and ADMIN_PASSWORD environment variables.
                    </p>
                  </div>
                </div>
              )}

              {initResult && (
                <Alert
                  className={
                    initResult.success ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200"
                  }
                >
                  {initResult.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  <AlertTitle>{initResult.success ? "Success" : "Error"}</AlertTitle>
                  <AlertDescription>{initResult.message}</AlertDescription>
                </Alert>
              )}
            </>
          ) : (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>System Check Failed</AlertTitle>
              <AlertDescription>
                Could not connect to the server. Please check your configuration and try again.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {health && health.admin === "initialized" ? (
            <Link href="/login" className="w-full">
              <Button className="w-full">
                Continue to Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="w-full"
              disabled={loading || initLoading}
            >
              Refresh Status
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
