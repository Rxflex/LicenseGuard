"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format, addMonths } from "date-fns"

interface CreateLicenseDialogProps {
  children: React.ReactNode
}

export function CreateLicenseDialog({ children }: CreateLicenseDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [expiresAt, setExpiresAt] = useState<Date>(addMonths(new Date(), 1)) // По умолчанию 1 месяц
  const [allowedIps, setAllowedIps] = useState("*")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!expiresAt) return

    setLoading(true)
    try {
      const ips = allowedIps
        .split(",")
        .map((ip) => ip.trim())
        .filter(Boolean)

      const response = await fetch("/api/licenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || null,
          description: description || null,
          expiresAt: expiresAt.toISOString(),
          allowedIps: ips.length === 0 || ips.includes("*") ? ["*"] : ips,
        }),
      })

      if (response.ok) {
        setOpen(false)
        setName("")
        setDescription("")
        setExpiresAt(addMonths(new Date(), 1))
        setAllowedIps("*")
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to create license:", error)
    } finally {
      setLoading(false)
    }
  }

  // Функция для изменения даты истечения
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value)
    if (!isNaN(date.getTime())) {
      setExpiresAt(date)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New License</DialogTitle>
          <DialogDescription>Create a new license key with custom settings and restrictions.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name (optional)</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="License name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="License description"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expiresAt">Expires At</Label>
              <div className="flex items-center">
                <Input
                  id="expiresAt"
                  type="date"
                  value={format(expiresAt, "yyyy-MM-dd")}
                  onChange={handleExpiryChange}
                  className="w-full"
                />
                <CalendarIcon className="ml-2 h-4 w-4 text-gray-400" />
              </div>
              <p className="text-xs text-muted-foreground">Current expiry: {format(expiresAt, "PPP")}</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ips">Allowed IPs</Label>
              <Input
                id="ips"
                value={allowedIps}
                onChange={(e) => setAllowedIps(e.target.value)}
                placeholder="* for any IP, or comma-separated IPs"
              />
              <p className="text-xs text-muted-foreground">
                Use * to allow any IP, or specify comma-separated IP addresses
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading || !expiresAt}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create License
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
