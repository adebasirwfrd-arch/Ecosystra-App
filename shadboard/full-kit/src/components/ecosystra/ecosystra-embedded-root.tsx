"use client"

import { useState } from "react"

import type { ReactNode } from "react"

import { AvatarStack } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { EcosystraBoardMainView } from "./ecosystra-board-main-view"
import { useEcosystraDictionary } from "./ecosystra-dictionary-context"
import {
  EcosystraGrandbookNewList,
  EcosystraGrandbookSteps,
} from "./ecosystra-grandbook"
import { ecosystraNavLabel } from "./ecosystra-nav-model"

export type EcosystraShellUser = {
  id: string
  name: string | null
  email: string | null
  status?: string | null
  avatarUrl: string | null
} | null

type Props = {
  initialView: string
  /** BCP 47 language tag for embedded content (matches board `lang`). */
  locale?: string
  shellUser: EcosystraShellUser
  onShellSignOut?: () => void
}

function ViewCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children?: ReactNode
}) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle asChild>
          <h1 className="text-xl font-semibold leading-none tracking-tight">
            {title}
          </h1>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {children ? <CardContent>{children}</CardContent> : null}
    </Card>
  )
}

/** In-app workspace mounted under `EcosystraPageChrome`. */
export function EcosystraEmbeddedRoot({
  initialView,
  locale,
  shellUser,
  onShellSignOut,
}: Props) {
  const dictionary = useEcosystraDictionary()
  const pageLang = locale === "ar" ? "ar" : "en"
  const eco = dictionary.ecosystraApp
  const [profileTips, setProfileTips] = useState(true)
  const title = ecosystraNavLabel(dictionary, initialView)

  const description =
    initialView === "dashboard"
      ? eco.dashboardView.defaultTitle
      : initialView === "profile"
        ? eco.profileView.subtitle
        : initialView === "settings"
          ? eco.settingsView.subtitle
          : eco.pageDescription

  if (initialView === "board") {
    return (
      <div
        lang={pageLang}
        className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background"
        data-ecosystra-embedded="true"
      >
        <EcosystraBoardMainView />
      </div>
    )
  }

  return (
    <div
      lang={pageLang}
      className="flex min-h-0 flex-1 flex-col gap-3 overflow-auto bg-background p-2 sm:gap-4 sm:p-4 md:gap-5 md:p-6"
      data-ecosystra-embedded="true"
    >
      <ViewCard title={title} description={description}>
        {initialView === "profile" && shellUser ? (
          <div className="space-y-6">
            <EcosystraGrandbookSteps
              labels={[
                eco.profileView.globalStatus,
                eco.profileView.securityPrivacy,
                eco.profileView.workingHours,
              ]}
              current={1}
              ariaLabel={eco.profileView.stepsTitle}
            />
            <AvatarStack
              size="sm"
              avatars={[
                {
                  alt: shellUser.name ?? shellUser.email ?? "User",
                  src: shellUser.avatarUrl ?? undefined,
                },
                {
                  alt: eco.members,
                  src: undefined,
                },
                {
                  alt: eco.board,
                  src: undefined,
                },
              ]}
              limit={3}
            />
            <dl className="grid gap-2 text-sm">
              <div>
                <dt className="font-medium text-muted-foreground">
                  {eco.profileView.accountIdentity}
                </dt>
                <dd>{shellUser.name ?? "—"}</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">
                  {eco.profileView.emailAddress}
                </dt>
                <dd>{shellUser.email ?? "—"}</dd>
              </div>
            </dl>
            <div>
              <h2 className="mb-2 text-sm font-semibold text-foreground">
                {eco.profileView.listHeading}
              </h2>
              <EcosystraGrandbookNewList className="rounded-md border border-border/60">
                <li className="px-3 py-2 text-sm text-muted-foreground">
                  {eco.profileView.listEmpty}
                </li>
              </EcosystraGrandbookNewList>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-lg border border-border/60 p-3">
              <Label htmlFor="eco-profile-tips" className="text-sm">
                {eco.profileView.toggleTips}
              </Label>
              <Switch
                id="eco-profile-tips"
                checked={profileTips}
                onCheckedChange={setProfileTips}
              />
            </div>
          </div>
        ) : null}
        {onShellSignOut ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => onShellSignOut()}
          >
            {dictionary.navigation.userNav.signOut}
          </Button>
        ) : null}
      </ViewCard>
    </div>
  )
}
