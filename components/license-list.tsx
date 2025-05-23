"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, Eye, Edit, Trash2, Ban, CheckCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LicenseDetailsDialog } from "./license-details-dialog"
import { EditLicenseDialog } from "./edit-license-dialog"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

interface License {
  id: string
  key: string
  name: string | null
  status: string
  expiresAt: Date
  allowedIps: any
  createdAt: Date
  creator: { name: string; email: string }
  _count: { logs: number }
}

interface LicenseListProps {
  licenses: License[]
}

export function LicenseList({ licenses }: LicenseListProps) {
  const router = useRouter()

  const getStatusBadge = (status: string) => {
    const variants = {
      ACTIVE: "default",
      EXPIRED: "secondary",
      BLOCKED: "destructive",
      DELETED: "outline",
    } as const

    return <Badge variant={variants[status as keyof typeof variants] || "outline"}>{status.toLowerCase()}</Badge>
  }

  const formatIps = (ips: any) => {
    if (!ips || !Array.isArray(ips)) return "Any IP"
    if (ips.includes("*")) return "Any IP"
    return ips.join(", ")
  }

  const handleStatusChange = async (licenseId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/licenses/${licenseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error("Error updating license status:", error)
    }
  }

  const handleDelete = async (licenseId: string) => {
    if (confirm("Are you sure you want to delete this license?")) {
      try {
        const response = await fetch(`/api/licenses/${licenseId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          router.refresh()
        }
      } catch (error) {
        console.error("Error deleting license:", error)
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Licenses ({licenses.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Allowed IPs</TableHead>
              <TableHead>Checks</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {licenses.map((license) => (
              <TableRow key={license.id}>
                <TableCell className="font-medium">{license.name || "Unnamed License"}</TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-2 py-1 rounded">{license.key.substring(0, 8)}...</code>
                </TableCell>
                <TableCell>{getStatusBadge(license.status)}</TableCell>
                <TableCell>
                  <div className="text-sm">{format(new Date(license.expiresAt), "MMM dd, yyyy")}</div>
                  <div className="text-xs text-muted-foreground">{format(new Date(license.expiresAt), "HH:mm")}</div>
                </TableCell>
                <TableCell className="text-sm">{formatIps(license.allowedIps)}</TableCell>
                <TableCell>{license._count.logs}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(license.createdAt), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <LicenseDetailsDialog license={license}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                      </LicenseDetailsDialog>
                      <EditLicenseDialog license={license}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      </EditLicenseDialog>
                      {license.status === "ACTIVE" ? (
                        <DropdownMenuItem onClick={() => handleStatusChange(license.id, "BLOCKED")}>
                          <Ban className="mr-2 h-4 w-4" />
                          Block
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleStatusChange(license.id, "ACTIVE")}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Activate
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(license.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
