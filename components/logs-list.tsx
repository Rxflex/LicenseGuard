"use client"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"

interface Log {
  id: string
  ip: string
  userAgent: string
  result: string
  createdAt: Date
  license: {
    key: string
    name: string | null
  }
}

interface LogsListProps {
  logs: Log[]
}

export function LogsList({ logs }: LogsListProps) {
  const getResultBadge = (result: string) => {
    const variants = {
      VALID: "default",
      EXPIRED: "secondary",
      BLOCKED: "destructive",
      INVALID: "outline",
      IP_BLOCKED: "destructive",
    } as const

    const colors = {
      VALID: "bg-green-600",
      EXPIRED: "bg-yellow-600",
      BLOCKED: "bg-red-600",
      INVALID: "bg-gray-600",
      IP_BLOCKED: "bg-orange-600",
    } as const

    return (
      <Badge
        variant={variants[result as keyof typeof variants] || "outline"}
        className={colors[result as keyof typeof colors]}
      >
        {result.toLowerCase().replace("_", " ")}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent License Checks ({logs.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>License</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>User Agent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <div className="text-sm">{format(new Date(log.createdAt), "MMM dd, yyyy")}</div>
                  <div className="text-xs text-muted-foreground">{format(new Date(log.createdAt), "HH:mm:ss")}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{log.license.name || "Unnamed License"}</div>
                  <code className="text-xs bg-muted px-2 py-1 rounded">{log.license.key.substring(0, 8)}...</code>
                </TableCell>
                <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                <TableCell>{getResultBadge(log.result)}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                  {log.userAgent || "Unknown"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
