"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useParams } from "next/navigation"
import { toast } from "sonner"

import type { ChatType } from "../types"

import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client"
import { getDefaultIceServers } from "@/lib/webrtc/ice-servers"

import { useChatContext } from "../_hooks/use-chat-context"

const BROADCAST_EVENT = "webrtc"

type SignalPayload =
  | {
      kind: "offer"
      sdp: string
      callId: string
      from: string
      video: boolean
    }
  | { kind: "answer"; sdp: string; callId: string; from: string }
  | {
      kind: "ice"
      candidate: RTCIceCandidateInit
      callId: string
      from: string
    }
  | { kind: "hangup"; callId: string; from: string }

type CallStatus = "idle" | "incoming" | "outgoing" | "live"

function isSignalPayload(x: unknown): x is SignalPayload {
  if (!x || typeof x !== "object") return false
  const k = (x as { kind?: string }).kind
  return k === "offer" || k === "answer" || k === "ice" || k === "hangup"
}

function unwrapBroadcastPayload(raw: unknown): unknown {
  if (
    raw &&
    typeof raw === "object" &&
    "payload" in raw &&
    (raw as { payload: unknown }).payload !== undefined
  ) {
    return (raw as { payload: unknown }).payload
  }
  return raw
}

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms))
}

export type WebRtcCallContextValue = {
  status: CallStatus
  localStream: MediaStream | null
  remoteStream: MediaStream | null
  /** Incoming offer included video (or we started a video call). */
  callUsesVideo: boolean
  remoteLabel: string
  channelReady: boolean
  micMuted: boolean
  cameraOff: boolean
  toggleMic: () => void
  toggleCamera: () => void
  startAudioCall: () => Promise<void>
  startVideoCall: () => Promise<void>
  acceptIncoming: () => Promise<void>
  rejectIncoming: () => void
  endCall: () => void
}

const WebRtcCallContext = createContext<WebRtcCallContextValue | null>(null)

export function useWebRtcCall() {
  const ctx = useContext(WebRtcCallContext)
  if (!ctx) {
    throw new Error("useWebRtcCall must be used within WebRtcCallProvider")
  }
  return ctx
}

export function WebRtcCallProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const routeThreadId = Array.isArray(params?.id) ? params.id[0] : undefined
  const { currentUser, chatState } = useChatContext()

  const chat = useMemo((): ChatType | null => {
    if (!routeThreadId) return null
    return chatState.chats.find((c) => c.id === routeThreadId) ?? null
  }, [chatState.chats, routeThreadId])

  const otherMembers = useMemo(() => {
    if (!chat) return []
    return chat.users.filter((u) => u.id !== currentUser.id)
  }, [chat, currentUser.id])

  const [status, setStatus] = useState<CallStatus>("idle")
  const [channelReady, setChannelReady] = useState(false)
  /** Same as `channelReady` but updated in the Realtime subscribe callback (no React render delay). */
  const channelReadyRef = useRef(false)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [callUsesVideo, setCallUsesVideo] = useState(true)
  const [remoteLabel, setRemoteLabel] = useState("")
  const [micMuted, setMicMuted] = useState(false)
  const [cameraOff, setCameraOff] = useState(false)

  const pcRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const callIdRef = useRef<string | null>(null)
  const pendingOfferRef = useRef<{
    sdp: string
    callId: string
    from: string
    video: boolean
  } | null>(null)
  const iceBufferRef = useRef<RTCIceCandidateInit[]>([])
  /** Supabase Realtime channel (broadcast) */
  const channelRef = useRef<{
    send: (msg: {
      type: "broadcast"
      event: string
      payload: SignalPayload
    }) => Promise<unknown>
    unsubscribe: () => Promise<unknown>
    subscribe: (cb?: (status: string) => void) => Promise<unknown>
    on: (
      type: "broadcast",
      filter: { event: string },
      handler: (args: { payload: unknown }) => void
    ) => unknown
  } | null>(null)

  const sendSignal = useCallback(async (payload: SignalPayload) => {
    const ch = channelRef.current
    if (!ch) return
    await ch.send({
      type: "broadcast",
      event: BROADCAST_EVENT,
      payload,
    })
  }, [])

  const cleanupMedia = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop())
    localStreamRef.current = null
    setLocalStream(null)
    setRemoteStream(null)
    pcRef.current?.close()
    pcRef.current = null
    callIdRef.current = null
    pendingOfferRef.current = null
    iceBufferRef.current = []
    setStatus("idle")
    setRemoteLabel("")
    setCallUsesVideo(true)
    setMicMuted(false)
    setCameraOff(false)
  }, [])

  const flushIce = useCallback(async (pc: RTCPeerConnection) => {
    const buf = iceBufferRef.current.splice(0, iceBufferRef.current.length)
    for (const c of buf) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(c))
      } catch {
        /* ignore */
      }
    }
  }, [])

  const endCall = useCallback(
    (fromRemote = false) => {
      const id = callIdRef.current
      if (!fromRemote && id) {
        void sendSignal({
          kind: "hangup",
          callId: id,
          from: currentUser.id,
        })
      }
      cleanupMedia()
    },
    [cleanupMedia, currentUser.id, sendSignal]
  )

  const toggleMic = useCallback(() => {
    setMicMuted((m) => {
      const next = !m
      localStreamRef.current?.getAudioTracks().forEach((t) => {
        t.enabled = !next
      })
      return next
    })
  }, [])

  const toggleCamera = useCallback(() => {
    setCameraOff((c) => {
      const next = !c
      localStreamRef.current?.getVideoTracks().forEach((t) => {
        t.enabled = !next
      })
      return next
    })
  }, [])

  const setupPeerConnection = useCallback(
    (callId: string) => {
      const pc = new RTCPeerConnection({
        iceServers: getDefaultIceServers(),
      })
      pcRef.current = pc
      callIdRef.current = callId

      pc.onicecandidate = (ev) => {
        if (!ev.candidate || !callIdRef.current) return
        void sendSignal({
          kind: "ice",
          candidate: ev.candidate.toJSON(),
          callId: callIdRef.current,
          from: currentUser.id,
        })
      }

      pc.ontrack = (ev) => {
        setRemoteStream((prev) => {
          const out = new MediaStream()
          const add = (t: MediaStreamTrack) => {
            if (!out.getTracks().some((x) => x.id === t.id)) out.addTrack(t)
          }
          prev?.getTracks().forEach(add)
          if (ev.streams[0]) {
            ev.streams[0].getTracks().forEach(add)
          } else if (ev.track) {
            add(ev.track)
          }
          return out
        })
        setStatus("live")
      }

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "failed") {
          toast.error("Connection lost")
          endCall(true)
        }
      }

      return pc
    },
    [currentUser.id, endCall, sendSignal]
  )

  const handleRemoteSignal = useCallback(
    async (raw: unknown) => {
      const unwrapped = unwrapBroadcastPayload(raw)
      if (!isSignalPayload(unwrapped)) return
      const payload = unwrapped

      if (payload.from === currentUser.id) return

      if (payload.kind === "hangup") {
        if (
          payload.callId === callIdRef.current ||
          pendingOfferRef.current?.callId === payload.callId
        ) {
          toast.message("Call ended")
          cleanupMedia()
        }
        return
      }

      if (payload.kind === "offer") {
        const peer = chat?.users.find((u) => u.id === payload.from)
        setRemoteLabel(peer?.name ?? "Peer")
        setCallUsesVideo(payload.video)
        pendingOfferRef.current = {
          sdp: payload.sdp,
          callId: payload.callId,
          from: payload.from,
          video: payload.video,
        }
        setStatus("incoming")
        return
      }

      if (payload.kind === "answer") {
        const pc = pcRef.current
        if (!pc || payload.callId !== callIdRef.current) return
        await pc.setRemoteDescription({
          type: "answer",
          sdp: payload.sdp,
        })
        await flushIce(pc)
        setStatus("live")
        return
      }

      if (payload.kind === "ice") {
        const pc = pcRef.current
        if (!pc || payload.callId !== callIdRef.current) {
          iceBufferRef.current.push(payload.candidate)
          return
        }
        if (!pc.remoteDescription) {
          iceBufferRef.current.push(payload.candidate)
          return
        }
        try {
          await pc.addIceCandidate(new RTCIceCandidate(payload.candidate))
        } catch {
          iceBufferRef.current.push(payload.candidate)
        }
      }
    },
    [chat?.users, cleanupMedia, currentUser.id, flushIce]
  )

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    if (!supabase || !routeThreadId) {
      channelReadyRef.current = false
      setChannelReady(false)
      return
    }

    const name = `chat-webrtc-${routeThreadId}`
    const ch = supabase.channel(name, {
      config: { broadcast: { self: false } },
    })

    ch.on(
      "broadcast",
      { event: BROADCAST_EVENT },
      (msg: { payload?: unknown }) => {
        const inner = msg?.payload !== undefined ? msg.payload : msg
        void handleRemoteSignal(inner)
      }
    )

    void ch.subscribe((s: string) => {
      const ok = s === "SUBSCRIBED"
      channelReadyRef.current = ok
      setChannelReady(ok)
      if (s === "CHANNEL_ERROR") {
        toast.error(
          "Realtime error — enable Realtime in Supabase project settings"
        )
      }
    })

    channelRef.current = ch as typeof channelRef.current

    return () => {
      channelReadyRef.current = false
      setChannelReady(false)
      void ch.unsubscribe()
      channelRef.current = null
    }
  }, [routeThreadId, handleRemoteSignal])

  const sendSignalRef = useRef(sendSignal)
  sendSignalRef.current = sendSignal
  const userIdRef = useRef(currentUser.id)
  userIdRef.current = currentUser.id

  useEffect(() => {
    return () => {
      const id = callIdRef.current
      if (id) {
        void sendSignalRef.current({
          kind: "hangup",
          callId: id,
          from: userIdRef.current,
        })
      }
      cleanupMedia()
    }
  }, [routeThreadId, cleanupMedia])

  const startCall = useCallback(
    async (video: boolean) => {
      if (!getSupabaseBrowserClient()) {
        toast.error(
          "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
        )
        return
      }
      if (!routeThreadId || !chat) {
        toast.error("Open a chat first")
        return
      }
      if (otherMembers.length < 1) {
        toast.error("Need at least one other person in this chat to call")
        return
      }
      if (!channelReadyRef.current) {
        const waitToast = toast.loading("Connecting signaling…")
        const deadline = Date.now() + 18_000
        while (!channelReadyRef.current && Date.now() < deadline) {
          await sleep(120)
        }
        toast.dismiss(waitToast)
        if (!channelReadyRef.current) {
          toast.error(
            "Signaling not ready. Check NEXT_PUBLIC_SUPABASE_URL / ANON_KEY on this deployment and Supabase Realtime settings."
          )
          return
        }
      }

      try {
        setCallUsesVideo(video)
        const callee = otherMembers[0]
        setRemoteLabel(callee?.name ?? "Contact")
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: video ? { facingMode: "user" } : false,
        })
        localStreamRef.current = stream
        setLocalStream(stream)

        const callId = crypto.randomUUID()
        const pc = setupPeerConnection(callId)
        stream.getTracks().forEach((t) => pc.addTrack(t, stream))

        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)

        setStatus("outgoing")
        await sendSignal({
          kind: "offer",
          sdp: offer.sdp ?? "",
          callId,
          from: currentUser.id,
          video,
        })
      } catch (e) {
        cleanupMedia()
        toast.error(e instanceof Error ? e.message : "Could not start call")
      }
    },
    [chat, cleanupMedia, currentUser.id, otherMembers.length, routeThreadId, sendSignal, setupPeerConnection]
  )

  const acceptIncoming = useCallback(async () => {
    const pending = pendingOfferRef.current
    if (!pending || !routeThreadId) return

    try {
      setCallUsesVideo(pending.video)
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: pending.video ? { facingMode: "user" } : false,
      })
      localStreamRef.current = stream
      setLocalStream(stream)

      const pc = setupPeerConnection(pending.callId)
      stream.getTracks().forEach((t) => pc.addTrack(t, stream))

      await pc.setRemoteDescription({
        type: "offer",
        sdp: pending.sdp,
      })
      await flushIce(pc)

      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)

      pendingOfferRef.current = null

      await sendSignal({
        kind: "answer",
        sdp: answer.sdp ?? "",
        callId: pending.callId,
        from: currentUser.id,
      })
      setStatus("live")
    } catch (e) {
      cleanupMedia()
      toast.error(e instanceof Error ? e.message : "Could not answer")
    }
  }, [
    cleanupMedia,
    currentUser.id,
    flushIce,
    routeThreadId,
    sendSignal,
    setupPeerConnection,
  ])

  const rejectIncoming = useCallback(() => {
    const pending = pendingOfferRef.current
    if (pending) {
      void sendSignal({
        kind: "hangup",
        callId: pending.callId,
        from: currentUser.id,
      })
    }
    pendingOfferRef.current = null
    setStatus("idle")
    setRemoteLabel("")
  }, [currentUser.id, sendSignal])

  const value = useMemo<WebRtcCallContextValue>(
    () => ({
      status,
      channelReady,
      localStream,
      remoteStream,
      callUsesVideo,
      remoteLabel,
      micMuted,
      cameraOff,
      toggleMic,
      toggleCamera,
      startAudioCall: () => startCall(false),
      startVideoCall: () => startCall(true),
      acceptIncoming,
      rejectIncoming,
      endCall: () => endCall(false),
    }),
    [
      acceptIncoming,
      callUsesVideo,
      cameraOff,
      channelReady,
      endCall,
      localStream,
      micMuted,
      rejectIncoming,
      remoteLabel,
      remoteStream,
      startCall,
      status,
      toggleCamera,
      toggleMic,
    ]
  )

  return (
    <WebRtcCallContext.Provider value={value}>
      {children}
    </WebRtcCallContext.Provider>
  )
}
