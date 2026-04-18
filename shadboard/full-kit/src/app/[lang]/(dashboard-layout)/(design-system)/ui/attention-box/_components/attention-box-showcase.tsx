"use client"

import { useState } from "react"

import { AttentionBox } from "@/components/ui/attention-box"

export function AttentionBoxShowcase() {
  const [visible, setVisible] = useState({
    primary: true,
    neutral: true,
    positive: true,
    warning: true,
    negative: true,
  })

  return (
    <div className="grid max-w-4xl gap-6">
      <div className="grid gap-6 sm:grid-cols-[minmax(0,240px)_minmax(0,600px)] sm:items-start sm:gap-x-16 sm:gap-y-6">
        <p className="text-sm font-bold text-foreground pt-1">Primary</p>
        <div className="min-w-0">
          {visible.primary ? (
            <AttentionBox
              title="Heads up"
              text="This message gives you helpful context without requiring immediate action."
              onClose={() =>
                setVisible((v) => ({ ...v, primary: false }))
              }
            />
          ) : (
            <p className="text-sm text-muted-foreground">Dismissed.</p>
          )}
        </div>

        <p className="text-sm font-bold text-foreground pt-1">Neutral</p>
        <div className="min-w-0">
          {visible.neutral ? (
            <AttentionBox
              type="neutral"
              title="General note"
              text="Use this style for more subtle visual emphasis, or for neutral custom contexts."
              onClose={() =>
                setVisible((v) => ({ ...v, neutral: false }))
              }
            />
          ) : (
            <p className="text-sm text-muted-foreground">Dismissed.</p>
          )}
        </div>

        <p className="text-sm font-bold text-foreground pt-1">Positive</p>
        <div className="min-w-0">
          {visible.positive ? (
            <AttentionBox
              type="positive"
              title="You're doing great"
              text="Indicates success; you can keep working without interruptions."
              onClose={() =>
                setVisible((v) => ({ ...v, positive: false }))
              }
            />
          ) : (
            <p className="text-sm text-muted-foreground">Dismissed.</p>
          )}
        </div>

        <p className="text-sm font-bold text-foreground pt-1">Warning</p>
        <div className="min-w-0">
          {visible.warning ? (
            <AttentionBox
              type="warning"
              title="Caution"
              text="Shows important warnings you should review before moving forward."
              onClose={() =>
                setVisible((v) => ({ ...v, warning: false }))
              }
            />
          ) : (
            <p className="text-sm text-muted-foreground">Dismissed.</p>
          )}
        </div>

        <p className="text-sm font-bold text-foreground pt-1">Negative</p>
        <div className="min-w-0">
          {visible.negative ? (
            <AttentionBox
              type="negative"
              title="Low on free space"
              text="Highlights errors or limitations you should be aware of."
              onClose={() =>
                setVisible((v) => ({ ...v, negative: false }))
              }
            />
          ) : (
            <p className="text-sm text-muted-foreground">Dismissed.</p>
          )}
        </div>
      </div>
    </div>
  )
}
