import { z } from "zod"

/** `POST /api/chat/threads` */
export const chatCreateThreadBodySchema = z
  .object({
    name: z.string().optional(),
    memberUserIds: z.array(z.string()).optional(),
    ecoItemId: z.preprocess(
      (val) => (val === "" ? null : val),
      z.union([z.string(), z.null()]).optional()
    ),
  })
  .strict()

/** `PATCH /api/chat/[threadId]/preferences` */
export const chatPreferencesPatchBodySchema = z
  .object({
    muted: z.boolean().optional(),
    blocked: z.boolean().optional(),
  })
  .strict()
  .refine((b) => typeof b.muted === "boolean" || typeof b.blocked === "boolean", {
    message: "Provide muted and/or blocked boolean",
  })

const chatFileAttachmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.number(),
  type: z.string(),
  url: z.string(),
})

/** `POST /api/chat/[threadId]/messages` */
export const chatPostMessageBodySchema = z
  .object({
    text: z.string().optional(),
    attachments: z.array(chatFileAttachmentSchema).optional(),
    replyToMessageId: z.string().optional(),
    forwardedFromMessageId: z.string().optional(),
  })
  .strict()

/** `PATCH /api/chat/[threadId]/messages/[messageId]` */
export const chatPatchMessageBodySchema = z
  .object({
    text: z.string().optional(),
  })
  .strict()

/** `POST .../messages/[messageId]/forward` */
export const chatForwardMessageBodySchema = z
  .object({
    targetThreadId: z.string().min(1),
  })
  .strict()
