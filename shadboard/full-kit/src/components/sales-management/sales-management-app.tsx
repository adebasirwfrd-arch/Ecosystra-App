"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Loader2, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react"
import { toast } from "sonner"

import type { LocaleType } from "@/types"

import { ensureLocalizedPathname } from "@/lib/i18n"

import { CRM_DEAL_STAGES, CRM_LEAD_SOURCES } from "@/lib/crm/crm-constants"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

type DealRow = {
  id: string
  title: string
  companyName: string
  amount: string
  stage: string
  leadSource: string
  countryCode: string
  countryName: string
  ownerName: string
  ownerEmail: string
  probability: number | null
}

export function SalesManagementApp() {
  const params = useParams()
  const locale = (params.lang as LocaleType) || "en"
  const crmHref = ensureLocalizedPathname("/dashboards/crm", locale)

  const [deals, setDeals] = useState<DealRow[]>([])
  const [loading, setLoading] = useState(true)

  const loadDeals = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/crm/deals", { cache: "no-store" })
      if (!res.ok) throw new Error(await res.text())
      const data = (await res.json()) as DealRow[]
      setDeals(data)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load deals")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadDeals()
  }, [loadDeals])

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 border-b pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Sales Management
          </h1>
          <p className="text-muted-foreground text-sm">
            Full CRUD on pipeline data shared with the CRM dashboard — deals drive
            funnel, revenue, geography, and leaderboards.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={crmHref}>Open CRM dashboard</Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void loadDeals()}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RefreshCw className="size-4" />
            )}
            <span className="ml-2">Sync</span>
          </Button>
          <DealDialog onSaved={loadDeals} />
        </div>
      </div>

      <Tabs defaultValue="deals" className="w-full">
        <TabsList className="flex w-full flex-wrap h-auto gap-1">
          <TabsTrigger value="deals">Deals</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline health</TabsTrigger>
        </TabsList>

        <TabsContent value="deals" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Deals</CardTitle>
              <CardDescription>
                Edit stages, owners, and amounts — charts on{" "}
                <Link className="underline" href={crmHref}>
                  /dashboards/crm
                </Link>{" "}
                refresh from the same database.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[min(70vh,720px)] w-full rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Deal</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead className="w-[100px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          <Loader2 className="mx-auto size-6 animate-spin" />
                        </TableCell>
                      </TableRow>
                    ) : deals.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-muted-foreground h-24 text-center"
                        >
                          No deals — run{" "}
                          <code className="rounded bg-muted px-1 py-0.5 text-xs">
                            pnpm db:seed-crm
                          </code>
                        </TableCell>
                      </TableRow>
                    ) : (
                      deals.map((d) => (
                        <TableRow key={d.id}>
                          <TableCell>
                            <div className="font-medium">{d.title}</div>
                            <div className="text-muted-foreground text-xs">
                              {d.companyName}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{d.stage}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm">
                            ${Number(d.amount).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{d.ownerName}</div>
                            <div className="text-muted-foreground text-xs">
                              {d.ownerEmail}
                            </div>
                          </TableCell>
                          <TableCell>
                            {d.countryCode}{" "}
                            <span className="text-muted-foreground text-xs">
                              {d.countryName}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <DealDialog deal={d} onSaved={loadDeals} />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                onClick={async () => {
                                  if (
                                    !confirm(
                                      "Delete this deal? Dashboard metrics will update."
                                    )
                                  )
                                    return
                                  const res = await fetch(
                                    `/api/crm/deals/${d.id}`,
                                    { method: "DELETE" }
                                  )
                                  if (!res.ok) {
                                    toast.error("Delete failed")
                                    return
                                  }
                                  toast.success("Deal removed")
                                  void loadDeals()
                                }}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>How data connects</CardTitle>
              <CardDescription>
                Operational records live in Supabase (`shadboard_content` schema).
                The CRM overview recomputes when at least one deal exists; otherwise
                it falls back to seeded JSON.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <p>
                <strong>Deals</strong> feed sales trend, lead sources, country
                revenue, and rep leaderboards (closed-won totals).
              </p>
              <p>
                <strong>Projects, activities, feedback, reps</strong> are seeded
                from the same `page-content.json` snapshot — extend via{" "}
                <code className="rounded bg-muted px-1">/api/crm/*</code> routes.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function DealDialog({
  deal,
  onSaved,
}: {
  deal?: DealRow
  onSaved: () => void
}) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: deal?.title ?? "",
    companyName: deal?.companyName ?? "",
    amount: deal?.amount ?? "10000",
    stage: deal?.stage ?? "LEAD",
    leadSource: deal?.leadSource ?? "website",
    countryCode: deal?.countryCode ?? "US",
    countryName: deal?.countryName ?? "United States",
    ownerName: deal?.ownerName ?? "",
    ownerEmail: deal?.ownerEmail ?? "",
    probability: deal?.probability != null ? String(deal.probability) : "",
    notes: "",
  })

  useEffect(() => {
    if (!open) return
    setForm({
      title: deal?.title ?? "",
      companyName: deal?.companyName ?? "",
      amount: deal?.amount ?? "10000",
      stage: deal?.stage ?? "LEAD",
      leadSource: deal?.leadSource ?? "website",
      countryCode: deal?.countryCode ?? "US",
      countryName: deal?.countryName ?? "United States",
      ownerName: deal?.ownerName ?? "",
      ownerEmail: deal?.ownerEmail ?? "",
      probability: deal?.probability != null ? String(deal.probability) : "",
      notes: "",
    })
  }, [open, deal])

  async function save() {
    setSaving(true)
    try {
      const payload = {
        title: form.title,
        companyName: form.companyName,
        amount: Number(form.amount),
        stage: form.stage,
        leadSource: form.leadSource,
        countryCode: form.countryCode,
        countryName: form.countryName,
        ownerName: form.ownerName,
        ownerEmail: form.ownerEmail,
        probability: form.probability ? Number(form.probability) : null,
        notes: form.notes || null,
      }
      const url = deal ? `/api/crm/deals/${deal.id}` : "/api/crm/deals"
      const res = await fetch(url, {
        method: deal ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          deal
            ? payload
            : {
                ...payload,
                currency: "USD",
              }
        ),
      })
      if (!res.ok) throw new Error(await res.text())
      toast.success(deal ? "Deal updated" : "Deal created")
      setOpen(false)
      onSaved()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={deal ? "icon" : "sm"} variant={deal ? "ghost" : "default"}>
          {deal ? (
            <Pencil className="size-4" />
          ) : (
            <>
              <Plus className="size-4" />
              <span className="ml-2">New deal</span>
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{deal ? "Edit deal" : "Create deal"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={form.companyName}
              onChange={(e) =>
                setForm((f) => ({ ...f, companyName: e.target.value }))
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Stage</Label>
              <Select
                value={form.stage}
                onValueChange={(v) => setForm((f) => ({ ...f, stage: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CRM_DEAL_STAGES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                value={form.amount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Lead source</Label>
            <Select
              value={form.leadSource}
              onValueChange={(v) => setForm((f) => ({ ...f, leadSource: v }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CRM_LEAD_SOURCES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="cc">Country code</Label>
              <Input
                id="cc"
                value={form.countryCode}
                onChange={(e) =>
                  setForm((f) => ({ ...f, countryCode: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cn">Country name</Label>
              <Input
                id="cn"
                value={form.countryName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, countryName: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="owner">Owner name</Label>
              <Input
                id="owner"
                value={form.ownerName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, ownerName: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Owner email</Label>
              <Input
                id="email"
                type="email"
                value={form.ownerEmail}
                onChange={(e) =>
                  setForm((f) => ({ ...f, ownerEmail: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="prob">Probability % (negotiation)</Label>
            <Input
              id="prob"
              value={form.probability}
              onChange={(e) =>
                setForm((f) => ({ ...f, probability: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => void save()} disabled={saving}>
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
