"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Shield, CheckCircle, XCircle, AlertCircle, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function CheckLicensePage() {
  const [licenseKey, setLicenseKey] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleCheck = async () => {
    if (!licenseKey.trim()) return

    setLoading(true)
    try {
      // Используем простой API без рейт-лимитов для UI
      const response = await fetch(`/api/check-license-simple?key=${encodeURIComponent(licenseKey)}`)
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ status: "error", message: "Network error occurred" })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="h-16 w-16 text-green-500" />
      case "expired":
      case "blocked":
      case "invalid":
        return <XCircle className="h-16 w-16 text-red-500" />
      case "rate_limited":
        return <AlertCircle className="h-16 w-16 text-yellow-500" />
      default:
        return <AlertCircle className="h-16 w-16 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "valid":
        return "text-green-500"
      case "expired":
      case "blocked":
      case "invalid":
        return "text-red-500"
      case "rate_limited":
        return "text-yellow-500"
      default:
        return "text-yellow-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "valid":
        return "License Valid ✓"
      case "expired":
        return "License Expired"
      case "blocked":
        return "License Blocked"
      case "invalid":
        return "License Invalid"
      case "ip_blocked":
        return "IP Not Allowed"
      case "rate_limited":
        return "Too Many Requests"
      case "error":
        return "Error Occurred"
      default:
        return "Unknown Status"
    }
  }

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Navigation */}
      <nav className="border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#f97316] rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">LicenseGuard</span>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-white leading-tight">
              Check Your
              <span className="block text-[#f97316]">License</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-lg mx-auto">
              Verify your license key instantly with our secure validation system
            </p>
          </div>

          {/* License Input */}
          <div className="space-y-6">
            <div className="relative">
              <Input
                type="text"
                placeholder="Enter your license key..."
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                className="w-full h-16 text-lg bg-zinc-900 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#f97316] focus:ring-[#f97316]/20 rounded-2xl"
                onKeyPress={(e) => e.key === "Enter" && handleCheck()}
              />
            </div>

            <Button
              onClick={handleCheck}
              disabled={loading || !licenseKey.trim()}
              className="w-full h-16 text-lg bg-[#f97316] hover:bg-[#f97316]/90 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5 mr-2" />
                  Verify License
                </>
              )}
            </Button>
          </div>

          {/* Result */}
          {result && (
            <Card className="bg-zinc-900/50 border-zinc-800 p-8 rounded-2xl animate-fade-in backdrop-blur-sm">
              <div className="text-center space-y-6">
                <div className="animate-bounce">{getStatusIcon(result.status)}</div>

                <div className="space-y-2">
                  <h3 className={`text-2xl font-bold ${getStatusColor(result.status)}`}>
                    {getStatusText(result.status)}
                  </h3>

                  {result.message && <p className="text-zinc-400">{result.message}</p>}
                </div>

                {result.license && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-zinc-900/50 p-4 rounded-xl">
                      <div className="text-zinc-400">Expires</div>
                      <div className="text-white font-mono">
                        {new Date(result.license.expiresAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="bg-zinc-900/50 p-4 rounded-xl">
                      <div className="text-zinc-400">Status</div>
                      <div className={`font-semibold ${getStatusColor(result.license.status.toLowerCase())}`}>
                        {result.license.status}
                      </div>
                    </div>
                  </div>
                )}

                {result.retryAfter && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
                    <p className="text-yellow-500 text-sm">
                      Rate limit exceeded. Try again in {result.retryAfter} seconds.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
