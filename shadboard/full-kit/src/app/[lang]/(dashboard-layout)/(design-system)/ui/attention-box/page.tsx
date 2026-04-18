import type { Metadata } from "next"

import { AttentionBoxShowcase } from "./_components/attention-box-showcase"

export const metadata: Metadata = {
  title: "Attention box",
}

export default function AttentionBoxPage() {
  return (
    <section className="container grid gap-6 p-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Attention box</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Five semantic types: primary, neutral, positive, warning, and negative.
          Use optional <code className="rounded bg-muted px-1 py-0.5 text-xs">onClose</code>{" "}
          for dismissible notices.
        </p>
      </div>
      <AttentionBoxShowcase />
    </section>
  )
}
