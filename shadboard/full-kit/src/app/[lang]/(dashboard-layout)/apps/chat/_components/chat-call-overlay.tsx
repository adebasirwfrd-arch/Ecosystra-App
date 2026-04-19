"use client"

import { useEffect, useRef } from "react"
import { PhoneOff } from "lucide-react"

import { cn } from "@/lib/utils"

import { useWebRtcCall } from "../_contexts/webrtc-call-context"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const hideDialogClose = "[&>button.absolute.end-4]:hidden"

export function ChatCallOverlay() {
  const {
    status,
    localStream,
    remoteStream,
    callUsesVideo,
    remoteLabel,
    acceptIncoming,
    rejectIncoming,
    endCall,
  } = useWebRtcCall()

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = localVideoRef.current
    if (el && localStream) {
      el.srcObject = localStream
      void el.play().catch(() => undefined)
    }
    return () => {
      if (el) el.srcObject = null
    }
  }, [localStream])

  useEffect(() => {
    const el = remoteVideoRef.current
    if (el && remoteStream) {
      el.srcObject = remoteStream
      void el.play().catch(() => undefined)
    }
    return () => {
      if (el) el.srcObject = null
    }
  }, [remoteStream])

  if (status === "idle") return null

  return (
    <>
      <Dialog
        open={status === "incoming"}
        onOpenChange={(o) => !o && rejectIncoming()}
      >
        <DialogContent className={cn("sm:max-w-md", hideDialogClose)}>
          <DialogHeader>
            <DialogTitle>
              Incoming {callUsesVideo ? "video" : "voice"} call
            </DialogTitle>
            <DialogDescription>
              From {remoteLabel || "someone"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button type="button" variant="outline" onClick={rejectIncoming}>
              Decline
            </Button>
            <Button type="button" onClick={() => void acceptIncoming()}>
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={status === "outgoing"}
        onOpenChange={(o) => !o && endCall()}
      >
        <DialogContent className={cn("sm:max-w-sm", hideDialogClose)}>
          <DialogHeader>
            <DialogTitle>Calling…</DialogTitle>
            <DialogDescription>
              Waiting for the other person to answer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="destructive" onClick={endCall}>
              <PhoneOff className="me-2 size-4" />
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={status === "live"} onOpenChange={(o) => !o && endCall()}>
        <DialogContent
          className={cn(
            "max-h-[90vh] w-full max-w-[100vw] gap-0 p-0 sm:max-w-4xl",
            hideDialogClose
          )}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Active call</DialogTitle>
            <DialogDescription>
              {callUsesVideo ? "Video" : "Voice"} call with{" "}
              {remoteLabel || "contact"}.
            </DialogDescription>
          </DialogHeader>
          <div className="relative flex h-full min-h-[320px] w-full items-center justify-center bg-black">
            <video
              ref={remoteVideoRef}
              className="h-full w-full object-contain"
              playsInline
              autoPlay
            />
            {callUsesVideo ? (
              <video
                ref={localVideoRef}
                className="absolute end-3 bottom-3 z-10 max-h-36 w-auto max-w-[40%] rounded-lg border-2 border-background object-cover shadow-lg"
                playsInline
                autoPlay
                muted
              />
            ) : (
              <video
                ref={localVideoRef}
                className="sr-only"
                playsInline
                autoPlay
                muted
              />
            )}
            <div className="absolute start-3 top-3 rounded-md bg-background/80 px-3 py-1 text-sm text-foreground">
              {remoteLabel || "Call"}
            </div>
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute bottom-6 left-1/2 z-20 size-14 -translate-x-1/2 rounded-full"
              onClick={endCall}
              aria-label="End call"
            >
              <PhoneOff className="size-6" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
