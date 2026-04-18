"use client"

import { Sparkles } from "lucide-react"

import {
  AvatarGroup,
  VibeAvatar,
} from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const SAMPLE = "/images/avatars/male-01.svg"

export function VibeAvatarShowcase() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ecosystra avatar (Bluprint / Vibe)</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <section className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Sizes — image, disabled
          </p>
          <div className="flex flex-wrap items-end gap-4">
            <VibeAvatar
              size="xs"
              type="img"
              src={SAMPLE}
              ariaLabel="Demo user"
              disabled
            />
            <VibeAvatar
              size="small"
              type="img"
              src={SAMPLE}
              ariaLabel="Demo user"
              disabled
            />
            <VibeAvatar
              size="medium"
              type="img"
              src={SAMPLE}
              ariaLabel="Demo user"
              disabled
            />
            <VibeAvatar
              size="large"
              type="img"
              src={SAMPLE}
              ariaLabel="Demo user"
              disabled
            />
          </div>
        </section>

        <section className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Text initials — backgroundColor tokens
          </p>
          <div className="flex flex-wrap items-end gap-4">
            <VibeAvatar
              size="medium"
              type="text"
              text="RM"
              backgroundColor="lipstick"
              ariaLabel="Ron Meir"
            />
            <VibeAvatar
              size="large"
              type="text"
              text="RM"
              backgroundColor="done-green"
              ariaLabel="Ron Meir"
            />
            <VibeAvatar
              size="medium"
              type="text"
              text="T1"
              backgroundColor="peach"
              square
              ariaLabel="Team 1"
            />
          </div>
        </section>

        <section className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Square — icon
          </p>
          <VibeAvatar
            size="medium"
            type="icon"
            icon={Sparkles}
            backgroundColor="aquamarine"
            square
            ariaLabel="Highlights"
            withoutTooltip
          />
        </section>

        <section className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Corner badges
          </p>
          <div className="flex flex-wrap gap-6">
            <VibeAvatar
              size="large"
              type="img"
              src={SAMPLE}
              ariaLabel="With guest badge"
              bottomRightBadgeProps={{
                src: SAMPLE,
                size: "small",
              }}
            />
            <VibeAvatar
              size="large"
              type="img"
              src={SAMPLE}
              ariaLabel="With sparkles badge"
              topRightBadgeProps={{
                icon: Sparkles,
                size: "xs",
              }}
            />
          </div>
        </section>

        <section className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Avatar group — max 3, counter
          </p>
          <AvatarGroup max={3} size="medium" counterProps={{ color: "dark" }}>
            <VibeAvatar
              type="img"
              src={SAMPLE}
              ariaLabel="Person one"
              withoutTooltip
            />
            <VibeAvatar
              type="img"
              src={SAMPLE}
              ariaLabel="Person two"
              withoutTooltip
            />
            <VibeAvatar
              type="img"
              src={SAMPLE}
              ariaLabel="Person three"
              withoutTooltip
            />
            <VibeAvatar
              type="img"
              src={SAMPLE}
              ariaLabel="Person four"
              withoutTooltip
            />
            <VibeAvatar
              type="text"
              text="MR"
              backgroundColor="lipstick"
              ariaLabel="Ron Meir"
              withoutTooltip
            />
          </AvatarGroup>
        </section>
      </CardContent>
    </Card>
  )
}
