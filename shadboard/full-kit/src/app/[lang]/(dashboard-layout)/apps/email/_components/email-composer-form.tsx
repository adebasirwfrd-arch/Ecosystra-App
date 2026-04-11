"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ListRestart, MoreVertical, Paperclip, Send, X } from "lucide-react"

import type { EmailAttachmentItem, EmailComposerFormType } from "../types"

import { EmailComposerSchema } from "../_schemas/email-composer-schema"
import { consumeComposePrefill } from "../_lib/email-compose-prefill"
import { useEmailContext } from "../_hooks/use-email-context"

import { Button, ButtonLoading } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Editor } from "@/components/ui/editor"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Toggle } from "@/components/ui/toggle"
import { ensureLocalizedPathname } from "@/lib/i18n"
import { toast } from "@/hooks/use-toast"

const MAX_ATTACHMENT_BYTES = 500 * 1024
const MAX_ATTACHMENTS_TOTAL_BYTES = 2 * 1024 * 1024

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => {
      const s = r.result as string
      const i = s.indexOf("base64,")
      resolve(i >= 0 ? s.slice(i + 7) : s)
    }
    r.onerror = () => reject(new Error("Could not read file"))
    r.readAsDataURL(file)
  })
}

async function filesToAttachments(files: File[]): Promise<EmailAttachmentItem[]> {
  let total = 0
  const out: EmailAttachmentItem[] = []
  for (const f of files) {
    if (f.size > MAX_ATTACHMENT_BYTES) {
      throw new Error(`"${f.name}" is larger than 500 KB.`)
    }
    total += f.size
    if (total > MAX_ATTACHMENTS_TOTAL_BYTES) {
      throw new Error("Total attachments must be under 2 MB.")
    }
    const contentBase64 = await fileToBase64(f)
    out.push({
      fileName: f.name,
      mimeType: f.type || "application/octet-stream",
      contentBase64,
    })
  }
  return out
}

export function EmailComposerForm() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([])
  const [showCc, setShowCc] = useState(false)
  const [showBcc, setShowBcc] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [sendLabel, setSendLabel] = useState<string | undefined>(undefined)
  const { handleSendEmail } = useEmailContext()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = useParams()
  const locale = String(params.lang ?? "en")
  const prefillApplied = useRef(false)

  const form = useForm<EmailComposerFormType>({
    resolver: zodResolver(EmailComposerSchema),
    defaultValues: {
      to: "",
      cc: "",
      bcc: "",
      subject: "",
      content: "",
    },
  })

  const { isSubmitting } = form.formState

  useEffect(() => {
    if (prefillApplied.current) return
    if (searchParams.get("prefill") !== "1") return
    prefillApplied.current = true
    const data = consumeComposePrefill()
    if (data) {
      form.reset({
        to: data.to,
        cc: data.cc ?? "",
        bcc: data.bcc ?? "",
        subject: data.subject,
        content: data.content,
      })
      if (data.cc?.trim()) setShowCc(true)
      if (data.bcc?.trim()) setShowBcc(true)
    }
    router.replace(pathname, { scroll: false })
  }, [form, pathname, router, searchParams])

  async function onSubmit(data: EmailComposerFormType) {
    setSendError(null)
    let attachments: EmailAttachmentItem[] | undefined
    try {
      attachments =
        attachmentFiles.length > 0 ? await filesToAttachments(attachmentFiles) : undefined
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Invalid attachments."
      setSendError(msg)
      toast({ title: "Attachments", description: msg, variant: "destructive" })
      return
    }
    const ok = await handleSendEmail(
      data.to,
      data.subject,
      data.content,
      sendLabel,
      data.cc,
      data.bcc,
      attachments
    )
    if (ok) {
      toast({
        title: "Email sent",
        description: "Your message was saved and will appear in Sent.",
      })
      form.reset()
      setAttachmentFiles([])
      setSendLabel(undefined)
      router.push(ensureLocalizedPathname("/apps/email/sent", locale))
    } else {
      const msg =
        "Failed to send. The recipient must have an account in this app (same database). Check the address for typos."
      setSendError(msg)
      toast({
        title: "Could not send",
        description: msg,
        variant: "destructive",
      })
    }
  }

  function onInvalid() {
    toast({
      title: "Fix the form",
      description: "Check To, Subject, and message body. Cc/Bcc can be left blank.",
      variant: "destructive",
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        className="h-full flex flex-col justify-between gap-3"
      >
        <div className="px-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem className="grow space-y-0">
                  <FormControl>
                    <Input type="email" placeholder="To" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-2">
              <Toggle
                pressed={showCc}
                onPressedChange={() => setShowCc(!showCc)}
              >
                Cc
              </Toggle>
              <Separator orientation="vertical" className="h-4" />
              <Toggle
                pressed={showBcc}
                onPressedChange={() => setShowBcc(!showBcc)}
              >
                Bcc
              </Toggle>
            </div>
          </div>
          {showCc && (
            <FormField
              control={form.control}
              name="cc"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="email" placeholder="Cc" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {showBcc && (
            <FormField
              control={form.control}
              name="bcc"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="email" placeholder="Bcc" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="text" placeholder="Subject" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormControl>
                  <Editor
                    placeholder="Write your message here..."
                    onValueChange={field.onChange}
                    className="h-[12.5rem]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              const list = e.target.files
              if (!list?.length) return
              setAttachmentFiles((prev) => [...prev, ...Array.from(list)])
              e.target.value = ""
            }}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-4 w-4" />
              Attach
            </Button>
            <span className="text-xs text-muted-foreground">
              Max 500 KB per file, 2 MB total (stored in the app database).
            </span>
          </div>
          {attachmentFiles.length > 0 ? (
            <ul className="flex flex-col gap-1 text-sm">
              {attachmentFiles.map((f, idx) => (
                <li
                  key={`${f.name}-${idx}`}
                  className="flex items-center justify-between gap-2 rounded-md border border-border px-2 py-1"
                >
                  <span className="truncate">{f.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-8 w-8"
                    onClick={() =>
                      setAttachmentFiles((prev) => prev.filter((_, i) => i !== idx))
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {sendError && (
          <p className="px-3 text-sm text-destructive">{sendError}</p>
        )}
        <div className="flex justify-between items-center p-3 border-t border-border">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem disabled>Save as draft</DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Add label</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={() => setSendLabel("personal")}
                    >
                      Personal
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSendLabel("work")}>
                      Work
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSendLabel("important")}
                    >
                      Important
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSendLabel(undefined)}>
                      No label
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem disabled>Plain text mode</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              type="reset"
              variant="ghost"
              size="icon"
              onClick={() => {
                form.reset()
                setSendLabel(undefined)
              }}
            >
              <ListRestart className="h-4 w-4" />
            </Button>
            {sendLabel ? (
              <span className="text-xs text-muted-foreground capitalize max-sm:hidden">
                Label: {sendLabel}
              </span>
            ) : null}
          </div>

          <ButtonLoading
            isLoading={isSubmitting}
            size="icon"
            icon={Send}
            iconClassName="me-0"
            loadingIconClassName="me-0"
          />
        </div>
      </form>
    </Form>
  )
}
