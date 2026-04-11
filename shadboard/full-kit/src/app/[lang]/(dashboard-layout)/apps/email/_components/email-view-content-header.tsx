"use client"

import type { EmailType } from "../types"

import { formatStandardEmailLabel } from "../_lib/email-label-ui"
import { formatDate, getInitials } from "@/lib/utils"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function EmailViewContentHeader({ email }: { email: EmailType }) {
  const labelText = formatStandardEmailLabel(email.label)

  return (
    <Card className="py-1">
      <CardHeader className="flex-row items-center gap-2 py-3">
        <Avatar>
          <AvatarImage src={email.sender?.avatar} alt={email.sender.name} />
          <AvatarFallback>{getInitials(email.sender.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="mb-0">{email.sender.name}</CardTitle>
            {labelText ? (
              <Badge variant="secondary" className="font-normal capitalize">
                {labelText}
              </Badge>
            ) : null}
            {email.muted ? (
              <Badge variant="outline" className="font-normal">
                Muted
              </Badge>
            ) : null}
          </div>
          <CardDescription>{email.sender.email}</CardDescription>
          {email.cc ? (
            <CardDescription className="mt-1 line-clamp-2 break-all">
              Cc: {email.cc}
            </CardDescription>
          ) : null}
          {email.bcc ? (
            <CardDescription className="mt-0.5 line-clamp-2 break-all">
              Bcc: {email.bcc}
            </CardDescription>
          ) : null}
        </div>
        <CardDescription className="ms-auto">
          {formatDate(email.createdAt)}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
