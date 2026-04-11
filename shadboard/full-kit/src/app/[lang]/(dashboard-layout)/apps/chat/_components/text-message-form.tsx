"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Send, X } from "lucide-react"

import type { TextMessageFormType } from "../types"

import { TextMessageSchema } from "../_schemas/text-message-schema"

import { useChatContext } from "../_hooks/use-chat-context"
import { ButtonLoading } from "@/components/ui/button"
import { EmojiPicker } from "@/components/ui/emoji-picker"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export function TextMessageForm() {
  const { handleAddTextMessage, replyingTo, setReplyingTo } = useChatContext()
  const form = useForm<TextMessageFormType>({
    resolver: zodResolver(TextMessageSchema),
    defaultValues: {
      text: "",
    },
  })

  const text = form.watch("text")
  const { isSubmitting, isValid } = form.formState
  const isDisabled = isSubmitting || !isValid // Disable button if form is invalid or submitting

  const onSubmit = async (data: TextMessageFormType) => {
    await handleAddTextMessage(data.text)
    form.reset()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-1.5"
      >
        {replyingTo && (
          <div className="flex items-center justify-between gap-2 rounded-md border bg-muted/50 px-2 py-1.5 text-xs">
            <span className="truncate text-muted-foreground">
              Replying to{" "}
              <span className="font-medium text-foreground">
                {(replyingTo.text?.trim() ?? "").slice(0, 80) ||
                  (replyingTo.images?.length ? "Photo" : "Message")}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setReplyingTo(null)}
              className="shrink-0 rounded p-0.5 hover:bg-muted"
              aria-label="Cancel reply"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )}
        <div className="flex w-full justify-center items-center gap-1.5">
        <EmojiPicker
          onEmojiClick={(e) => {
            form.setValue("text", text + e.emoji)
            form.trigger()
          }}
        />

        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="grow space-y-0">
              <FormLabel className="sr-only">Type a message</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Type a message..."
                  autoComplete="off"
                  className="bg-accent"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <ButtonLoading
          isLoading={isSubmitting}
          disabled={isDisabled}
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
