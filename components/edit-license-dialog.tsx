"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { Edit } from "lucide-react"

interface License {
  id: string
  key: string
  name: string | null
  status: string
  expiresAt: Date
  allowedIps: any
}

interface EditLicenseDialogProps {
  license: License
  children?: React.ReactNode
}

export function EditLicenseDialog({ license, children }: EditLicenseDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: license.name || "",
    status: license.status,
    expiresAt: new Date(license.expiresAt).toISOString().split("T")[0],
    allowedIps: Array.isArray(license.allowedIps) ? license.allowedIps.join("\n") : "*",
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const ipsArray = formData.allowedIps
        .split("\n")
        .map((ip) => ip.trim())
        .filter((ip) => ip.length > 0)

      const response = await fetch(`/api/licenses/${license.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name || null,
          status: formData.status,
          expiresAt: new Date(formData.expiresAt).toISOString(),
          allowedIps: ipsArray.length > 0 ? ipsArray : ["*"],
        }),
      })

      if (response.ok) {
        setOpen(false)
        router.refresh()
      } else {
        console.error("Failed to update license")
      }
    } catch (error) {
      console.error("Error updating license:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit License</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">License Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter license name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="BLOCKED">Blocked</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiresAt">Expiration Date</Label>
            <Input
              id="expiresAt"
              type="date"
              value={formData.expiresAt}
              onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="allowedIps">Allowed IPs (one per line, * for any)</Label>
            <Textarea
              id="allowedIps"
              value={formData.allowedIps}
              onChange={(e) => setFormData({ ...formData, allowedIps: e.target.value })}
              placeholder="192.168.1.1&#10;10.0.0.1&#10;*"
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update License"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
