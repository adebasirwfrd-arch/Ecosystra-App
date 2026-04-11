import { z } from "zod"

/** Cc/Bcc: kosong, satu email, atau beberapa dipisah koma/semicolon. */
const optionalAddressList = z.string().trim().refine(
  (val) => {
    if (val === "") return true
    return val.split(/[,;]+/).every((part) => {
      const t = part.trim()
      return t === "" || z.string().email().safeParse(t).success
    })
  },
  { message: "Invalid email address(es)" }
)

export const EmailComposerSchema = z.object({
  to: z
    .string()
    .trim()
    .min(1, { message: "Recipient is required" })
    .email({ message: "Invalid email address" })
    .transform((s) => s.toLowerCase()),
  cc: optionalAddressList,
  bcc: optionalAddressList,
  subject: z
    .string()
    .trim()
    .min(1, { message: "Subject must contain at least 1 character" })
    .max(100, { message: "Subject must contain at most 100 characters" }),
  content: z
    .string()
    .trim()
    .min(1, { message: "Content must contain at least 1 character" })
    .max(5000, { message: "Content must contain at most 5000 characters" }),
})
