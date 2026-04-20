"use client"

import { useLayoutEffect, useMemo, useRef } from "react"
import {
  Loader2,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Video,
  VideoOff,
} from "lucide-react"

import { cn, getInitials } from "@/lib/utils"

import { useWebRtcCall } from "../_contexts/webrtc-call-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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

function useHasLiveVideo(stream: MediaStream | null) {
  return useMemo(() => {
    if (!stream) return false
    return stream
      .getVideoTracks()
      .some((t) => t.readyState === "live" && t.enabled)
  }, [stream])
}

export function ChatCallOverlay() {
  const {
    status,
    localStream,
    remoteStream,
    callUsesVideo,
    remoteLabel,
    micMuted,
    cameraOff,
    toggleMic,
    toggleCamera,
    acceptIncoming,
    rejectIncoming,
    endCall,
  } = useWebRtcCall()

  /** Separate refs so outgoing vs live dialogs never fight for one ref (black preview). */
  const localVideoOutgoingRef = useRef<HTMLVideoElement>(null)
  const localVideoLiveRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const remoteAudioRef = useRef<HTMLAudioElement>(null)

  const hasRemoteVideo = useHasLiveVideo(remoteStream)

  useLayoutEffect(() => {
    const bind = (el: HTMLVideoElement | null) => {
      if (!el) return
      if (localStream) {
        el.srcObject = localStream
        void el.play().catch(() => undefined)
      } else {
        el.srcObject = null
      }
    }
    bind(localVideoOutgoingRef.current)
    bind(localVideoLiveRef.current)
    return () => {
      const clear = (el: HTMLVideoElement | null) => {
        if (el) el.srcObject = null
      }
      clear(localVideoOutgoingRef.current)
      clear(localVideoLiveRef.current)
    }
  }, [localStream, status])

  useLayoutEffect(() => {
    const v = remoteVideoRef.current
    const a = remoteAudioRef.current
    if (!remoteStream) {
      if (v) v.srcObject = null
      if (a) a.srcObject = null
      return
    }
    if (hasRemoteVideo && v) {
      v.srcObject = remoteStream
      void v.play().catch(() => undefined)
      if (a) a.srcObject = null
    } else if (a) {
      a.srcObject = remoteStream
      void a.play().catch(() => undefined)
      if (v) v.srcObject = null
    }
    return () => {
      if (v) v.srcObject = null
      if (a) a.srcObject = null
    }
  }, [remoteStream, hasRemoteVideo])

  const remoteInitials = getInitials(remoteLabel || "?")

  if (status === "idle") return null

  return (
    <>
      {/* Incoming */}
      <Dialog
        open={status === "incoming"}
        onOpenChange={(o) => !o && rejectIncoming()}
      >
        <DialogContent
          className={cn(
            "overflow-hidden border-0 bg-gradient-to-b from-zinc-900 to-zinc-950 p-0 sm:max-w-md",
            hideDialogClose
          )}
        >
          <div className="flex flex-col items-center gap-6 px-6 py-10 text-center">
            <div className="relative">
              <span className="absolute inset-0 animate-ping rounded-full bg-primary/25" />
              <span className="absolute inset-0 rounded-full ring-4 ring-primary/40" />
              <Avatar className="relative size-28 border-4 border-background shadow-xl">
                <AvatarFallback className="bg-primary/90 text-3xl font-semibold text-primary-foreground">
                  {remoteInitials}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <DialogHeader className="space-y-1">
                <DialogTitle className="text-xl font-semibold tracking-tight">
                  Incoming {callUsesVideo ? "video" : "voice"} call
                </DialogTitle>
                <DialogDescription className="text-base text-muted-foreground">
                  {remoteLabel || "Someone"} is calling
                </DialogDescription>
              </DialogHeader>
            </div>
            <DialogFooter className="w-full flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                type="button"
                variant="outline"
                className="h-12 flex-1 rounded-full border-2"
                onClick={rejectIncoming}
              >
                <PhoneOff className="me-2 size-5" />
                Decline
              </Button>
              <Button
                type="button"
                className="h-12 flex-1 rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={() => void acceptIncoming()}
              >
                <Phone className="me-2 size-5" />
                Accept
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Outgoing */}
      <Dialog open={status === "outgoing"} onOpenChange={(o) => !o && endCall()}>
        <DialogContent
          className={cn(
            "overflow-hidden border-0 bg-gradient-to-b from-zinc-900 to-zinc-950 p-0 sm:max-w-md",
            hideDialogClose
          )}
        >
          <div className="flex flex-col items-center gap-6 px-6 py-10 text-center">
            {callUsesVideo && localStream ? (
              <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-2xl border-2 border-white/10 bg-black shadow-2xl">
                <video
                  ref={localVideoOutgoingRef}
                  className="h-full w-full object-cover"
                  playsInline
                  autoPlay
                  muted
                />
              </div>
            ) : (
              <div className="relative">
                <Loader2 className="size-16 animate-spin text-primary" />
              </div>
            )}
            <div>
              <DialogHeader className="space-y-1">
                <DialogTitle className="text-xl font-semibold">
                  Calling…
                </DialogTitle>
                <DialogDescription className="text-base">
                  Waiting for {remoteLabel || "the other person"} to answer
                </DialogDescription>
              </DialogHeader>
            </div>
            <Button
              type="button"
              variant="destructive"
              className="h-12 w-full max-w-xs rounded-full"
              onClick={endCall}
            >
              <PhoneOff className="me-2 size-5" />
              Cancel call
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Active call — Teams-style */}
      <Dialog open={status === "live"} onOpenChange={(o) => !o && endCall()}>
        <DialogContent
          className={cn(
            "flex h-[min(100dvh,920px)] max-h-[100dvh] w-[min(100vw,1200px)] max-w-[100vw] flex-col gap-0 overflow-hidden rounded-2xl border-0 bg-zinc-950 p-0 text-white shadow-2xl sm:max-w-[min(100vw,1200px)]",
            hideDialogClose
          )}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Call</DialogTitle>
            <DialogDescription>
              {callUsesVideo ? "Video" : "Voice"} call with {remoteLabel}
            </DialogDescription>
          </DialogHeader>

          <div className="relative flex min-h-0 flex-1 flex-col bg-zinc-950">
            {/* Main stage */}
            <div className="relative flex min-h-[280px] flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-950 to-black">
              {hasRemoteVideo ? (
                <video
                  ref={remoteVideoRef}
                  className="absolute inset-0 h-full w-full object-cover"
                  playsInline
                  autoPlay
                />
              ) : (
                <>
                  <div
                    className="absolute inset-0 opacity-40"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, rgb(39 39 42 / 0.9), rgb(9 9 11) 70%)",
                    }}
                  />
                  <div className="relative z-10 flex flex-col items-center gap-4 px-6">
                    <Avatar className="size-32 border-4 border-white/10 shadow-2xl sm:size-40">
                      <AvatarFallback className="bg-gradient-to-br from-sky-600 to-indigo-800 text-4xl font-semibold text-white sm:text-5xl">
                        {remoteInitials}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-lg font-medium text-white/95 sm:text-xl">
                      {remoteLabel || "Contact"}
                    </p>
                    <p className="text-sm text-zinc-400">
                      {callUsesVideo ? "Video call" : "Voice call"}
                    </p>
                  </div>
                </>
              )}

              <audio ref={remoteAudioRef} className="hidden" playsInline />

              {/* Local PiP — video calls */}
              {callUsesVideo && localStream ? (
                <div className="absolute end-4 bottom-24 z-20 w-[min(38%,200px)] overflow-hidden rounded-xl border-2 border-white/20 bg-black shadow-2xl">
                  <video
                    ref={localVideoLiveRef}
                    className={cn(
                      "aspect-video w-full object-cover",
                      cameraOff && "opacity-40"
                    )}
                    playsInline
                    autoPlay
                    muted
                  />
                  {cameraOff && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                      <VideoOff className="size-10 text-white/80" />
                    </div>
                  )}
                </div>
              ) : (
                <video
                  ref={localVideoLiveRef}
                  className="sr-only"
                  playsInline
                  autoPlay
                  muted
                />
              )}

              {/* Top bar */}
              <div className="absolute start-0 top-0 z-30 flex w-full items-center justify-between bg-gradient-to-b from-black/70 to-transparent px-4 py-3">
                <div className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-sm backdrop-blur-md">
                  <span className="size-2 animate-pulse rounded-full bg-emerald-400" />
                  <span className="font-medium">{remoteLabel || "Call"}</span>
                </div>
              </div>
            </div>

            {/* Control bar — Teams-like */}
            <div className="flex shrink-0 items-center justify-center gap-3 border-t border-white/10 bg-zinc-900/95 px-4 py-4 backdrop-blur-md sm:gap-4">
              <Button
                type="button"
                size="icon"
                variant={micMuted ? "destructive" : "secondary"}
                className="size-12 rounded-full border border-white/10 bg-white/10 hover:bg-white/20"
                onClick={toggleMic}
                aria-label={micMuted ? "Unmute microphone" : "Mute microphone"}
              >
                {micMuted ? (
                  <MicOff className="size-5" />
                ) : (
                  <Mic className="size-5" />
                )}
              </Button>
              {callUsesVideo ? (
                <Button
                  type="button"
                  size="icon"
                  variant={cameraOff ? "destructive" : "secondary"}
                  className="size-12 rounded-full border border-white/10 bg-white/10 hover:bg-white/20"
                  onClick={toggleCamera}
                  aria-label={cameraOff ? "Turn camera on" : "Turn camera off"}
                >
                  {cameraOff ? (
                    <VideoOff className="size-5" />
                  ) : (
                    <Video className="size-5" />
                  )}
                </Button>
              ) : null}
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="size-14 rounded-full shadow-lg"
                onClick={endCall}
                aria-label="End call"
              >
                <PhoneOff className="size-6" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
