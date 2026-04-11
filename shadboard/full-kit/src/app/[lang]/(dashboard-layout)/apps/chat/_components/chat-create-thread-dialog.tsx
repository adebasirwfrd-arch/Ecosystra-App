"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Check, ChevronsUpDown, ListTodo, Loader2, UserPlus, X } from "lucide-react"
import { toast } from "sonner"

import { useChatContext } from "../_hooks/use-chat-context"
import { cn, getInitials } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

type ComposeUser = {
  id: string
  email: string
  name: string
  avatarUrl: string | null
}

type ComposeTask = {
  id: string
  name: string
  boardName: string
}

function unlockBodyPointerEvents(): void {
  queueMicrotask(() => {
    document.body.style.removeProperty("pointer-events")
  })
}

export function ChatCreateThreadDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { createThreadWithOptions } = useChatContext()

  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<ComposeUser[]>([])
  const [tasks, setTasks] = useState<ComposeTask[]>([])
  const [title, setTitle] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [taskId, setTaskId] = useState<string | null>(null)
  const [peopleOpen, setPeopleOpen] = useState(false)
  const [taskOpen, setTaskOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/chat/compose-options")
      if (!res.ok) {
        toast.error("Could not load people and tasks")
        return
      }
      const data = (await res.json()) as {
        users?: ComposeUser[]
        tasks?: ComposeTask[]
      }
      setUsers(Array.isArray(data.users) ? data.users : [])
      setTasks(Array.isArray(data.tasks) ? data.tasks : [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    void load()
  }, [open, load])

  const reset = useCallback(() => {
    setTitle("")
    setSelectedIds([])
    setTaskId(null)
    setPeopleOpen(false)
    setTaskOpen(false)
  }, [])

  const handleDialogChange = useCallback(
    (o: boolean) => {
      onOpenChange(o)
      if (!o) {
        reset()
        unlockBodyPointerEvents()
      }
    },
    [onOpenChange, reset]
  )

  const userById = useMemo(() => {
    const m = new Map<string, ComposeUser>()
    for (const u of users) m.set(u.id, u)
    return m
  }, [users])

  const selectedTask = taskId
    ? tasks.find((t) => t.id === taskId) ?? null
    : null

  const toggleUser = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const onSubmit = async () => {
    setSubmitting(true)
    try {
      const ok = await createThreadWithOptions({
        name: title.trim() || "New chat",
        memberUserIds: selectedIds,
        ecoItemId: taskId,
      })
      if (ok) handleDialogChange(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent
        className="gap-0 overflow-hidden rounded-xl border bg-background p-0 shadow-lg sm:max-w-lg"
        aria-describedby={undefined}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className="border-b bg-muted/40 px-6 py-4">
          <DialogHeader className="gap-1 text-left">
            <DialogTitle className="text-lg font-semibold tracking-tight">
              New chat
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Name the conversation, add people from your workspace, and
              optionally link a task from boards.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div className="space-y-2">
            <Label htmlFor="chat-title" className="text-xs font-medium">
              Chat title
            </Label>
            <Input
              id="chat-title"
              placeholder="e.g. Sprint sync — design"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-accent/50"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">People</Label>
            {loading ? (
              <Skeleton className="h-10 w-full rounded-md" />
            ) : (
              <>
                <div className="flex min-h-10 flex-wrap gap-2 rounded-lg border border-dashed border-border/80 bg-muted/20 p-2">
                  {selectedIds.length === 0 ? (
                    <span className="px-1 text-xs text-muted-foreground">
                      No one added yet — search below.
                    </span>
                  ) : (
                    selectedIds.map((id) => {
                      const u = userById.get(id)
                      if (!u) return null
                      return (
                        <Badge
                          key={id}
                          variant="secondary"
                          className="gap-1.5 py-1 ps-1 pe-0.5 font-normal"
                        >
                          <Avatar className="size-5">
                            <AvatarImage src={u.avatarUrl ?? undefined} alt="" />
                            <AvatarFallback className="text-[9px]">
                              {getInitials(u.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="max-w-[140px] truncate">{u.name}</span>
                          <button
                            type="button"
                            className="rounded-sm p-0.5 hover:bg-secondary-foreground/10"
                            aria-label={`Remove ${u.name}`}
                            onClick={() => toggleUser(id)}
                          >
                            <X className="size-3" />
                          </button>
                        </Badge>
                      )
                    })
                  )}
                </div>

                <Popover open={peopleOpen} onOpenChange={setPeopleOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={peopleOpen}
                      className="h-10 w-full justify-between font-normal"
                    >
                      <span className="flex items-center gap-2 truncate text-muted-foreground">
                        <UserPlus className="size-4 shrink-0 opacity-70" />
                        Add people…
                      </span>
                      <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search by name or email…" />
                      <CommandList className="max-h-56">
                        <CommandEmpty>
                          {users.length === 0
                            ? "No other workspace users yet."
                            : "No matching people."}
                        </CommandEmpty>
                        <CommandGroup>
                          {users.map((u) => {
                            const on = selectedIds.includes(u.id)
                            return (
                              <CommandItem
                                key={u.id}
                                value={`${u.name} ${u.email}`}
                                onSelect={() => toggleUser(u.id)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 size-4 shrink-0",
                                    on ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <Avatar className="size-7 mr-2">
                                  <AvatarImage
                                    src={u.avatarUrl ?? undefined}
                                    alt=""
                                  />
                                  <AvatarFallback className="text-[10px]">
                                    {getInitials(u.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex min-w-0 flex-1 flex-col">
                                  <span className="truncate font-medium">
                                    {u.name}
                                  </span>
                                  <span className="truncate text-xs text-muted-foreground">
                                    {u.email}
                                  </span>
                                </div>
                              </CommandItem>
                            )
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="text-xs font-medium">Linked task</Label>
            <p className="text-xs text-muted-foreground">
              Tie this chat to a row on your task boards (optional).
            </p>
            {loading ? (
              <Skeleton className="h-10 w-full rounded-md" />
            ) : (
              <Popover open={taskOpen} onOpenChange={setTaskOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={taskOpen}
                    className="h-10 w-full justify-between font-normal"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <ListTodo className="size-4 shrink-0 opacity-70" />
                      {selectedTask ? (
                        <span className="truncate">
                          <span className="font-medium">{selectedTask.name}</span>
                          {selectedTask.boardName ? (
                            <span className="text-muted-foreground">
                              {" "}
                              · {selectedTask.boardName}
                            </span>
                          ) : null}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">
                          No task linked
                        </span>
                      )}
                    </span>
                    <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search tasks…" />
                    <CommandList className="max-h-52">
                      <CommandEmpty>
                        {tasks.length === 0
                          ? "No tasks in the database yet."
                          : "No matching tasks."}
                      </CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="__none__"
                          onSelect={() => {
                            setTaskId(null)
                            setTaskOpen(false)
                          }}
                        >
                          <span className="text-muted-foreground">
                            Don&apos;t link a task
                          </span>
                        </CommandItem>
                        {tasks.map((t) => (
                          <CommandItem
                            key={t.id}
                            value={`${t.name} ${t.boardName}`}
                            onSelect={() => {
                              setTaskId(t.id)
                              setTaskOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 size-4 shrink-0",
                                taskId === t.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-medium">{t.name}</p>
                              {t.boardName ? (
                                <p className="truncate text-xs text-muted-foreground">
                                  {t.boardName}
                                </p>
                              ) : null}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t bg-muted/20 px-6 py-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => handleDialogChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => void onSubmit()}
            disabled={submitting || loading}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Creating…
              </>
            ) : (
              "Create chat"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
