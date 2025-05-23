"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye } from "lucide-react"
import { format } from "date-fns"

interface License {
  id: string
  key: string
  name: string | null
  status: string
  expiresAt: Date
  allowedIps: any
  createdAt: Date
}

interface LicenseDetailsDialogProps {
  license: License
  children?: React.ReactNode
}

export function LicenseDetailsDialog({ license, children }: LicenseDetailsDialogProps) {
  const [open, setOpen] = useState(false)
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      fetchLogs()
    }
  }, [open])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/licenses/${license.id}/logs`)
      if (response.ok) {
        const data = await response.json()
        setLogs(data)
      }
    } catch (error) {
      console.error("Error fetching logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      ACTIVE: "default",
      EXPIRED: "secondary",
      BLOCKED: "destructive",
      DELETED: "outline",
    } as const

    return <Badge variant={variants[status as keyof typeof variants] || "outline"}>{status.toLowerCase()}</Badge>
  }

  const getResultBadge = (result: string) => {
    const colors = {
      VALID: "bg-green-600",
      EXPIRED: "bg-yellow-600",
      BLOCKED: "bg-red-600",
      INVALID: "bg-gray-600",
      IP_BLOCKED: "bg-orange-600",
    } as const

    return (
      <Badge className={colors[result as keyof typeof colors] || "bg-gray-600"}>
        {result.toLowerCase().replace("_", " ")}
      </Badge>
    )
  }

  const formatIps = (ips: any) => {
    if (!ips || !Array.isArray(ips)) return "Any IP"
    if (ips.includes("*")) return "Any IP"
    return ips.join(", ")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>License Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>License Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-sm">{license.name || "Unnamed License"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">{getStatusBadge(license.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">License Key</label>
                  <code className="text-xs bg-muted px-2 py-1 rounded block mt-1">{license.key}</code>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Expires At</label>
                  <p className="text-sm">{format(new Date(license.expiresAt), "MMM dd, yyyy HH:mm")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created At</label>
                  <p className="text-sm">{format(new Date(license.createdAt), "MMM dd, yyyy HH:mm")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Allowed IPs</label>
                  <p className="text-sm">{formatIps(license.allowedIps)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading logs...</p>
              ) : logs.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Result</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.slice(0, 10).map((log: any) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm">{format(new Date(log.createdAt), "MMM dd, HH:mm:ss")}</TableCell>
                        <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                        <TableCell>{getResultBadge(log.result)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No activity recorded</p>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
