"use client"

import { Suspense, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Loader2, Video } from "lucide-react"

import { EcosystraZegoMeetingView } from "@/components/ecosystra/ecosystra-meeting"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function MeetingJoinInner() {
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()

  const room = searchParams.get("room")?.trim() ?? ""
  const title = searchParams.get("title")?.trim() ?? "Video meeting"

  const [open, setOpen] = useState(false)

  const meetingUserId = String(session?.user?.id ?? "guest")
  const meetingUserName =
    session?.user?.name?.trim() || session?.user?.email?.trim() || "Participant"

  const canJoin = room.length > 0 && status === "authenticated"

  const preview = useMemo(
    () => (
      <EcosystraZegoMeetingView
        roomID={room}
        userID={meetingUserId}
        userName={meetingUserName}
        open={open}
        onClose={() => setOpen(false)}
      />
    ),
    [room, meetingUserId, meetingUserName, open]
  )

  if (status === "loading") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (status !== "authenticated") {
    return (
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>Sign in required</CardTitle>
          <CardDescription>
            Sign in to Ecosystra to join this meeting.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!room) {
    return (
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>Missing room</CardTitle>
          <CardDescription>
            This link is incomplete. Open the meeting from the calendar or ask
            the host to resend the invitation.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <>
      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Video meeting"
          className="fixed inset-0 z-[10000] flex flex-col bg-background"
        >
          {preview}
        </div>
      ) : null}

      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>
            You’re about to enter the meeting preview. Allow camera and
            microphone when prompted.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="font-mono text-xs text-muted-foreground break-all">
            Room: {room}
          </p>
          <Button
            type="button"
            className="w-full"
            size="lg"
            disabled={!canJoin}
            onClick={() => setOpen(true)}
          >
            <Video className="me-2 size-5" />
            Join meeting
          </Button>
        </CardContent>
      </Card>
    </>
  )
}

export function MeetingJoinClient() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <MeetingJoinInner />
    </Suspense>
  )
}
