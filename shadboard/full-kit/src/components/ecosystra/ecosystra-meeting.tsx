"use client"

import { useEffect, useRef, useState } from "react"
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt"
import { Loader2, UserPlus, X } from "lucide-react"

import {
  createZegoMeetingRunId,
  zegoMeetingClientLog,
  zegoMeetingReportClientError,
} from "@/lib/ecosystra/zego-meeting-log"

import { Button } from "@/components/ui/button"
import {
  EcosystraMeetingInvitePanel,
  type MeetingInviteContext,
} from "@/components/ecosystra/ecosystra-meeting-invite-panel"
import { sanitizeZegoUserId } from "@/lib/ecosystra/zego-user-id"

function readShowPreJoinView(): boolean {
  return process.env.NEXT_PUBLIC_ZEGO_SHOW_PREJOIN !== "false"
}

type ZegoEcosystraWindow = Window & {
  __ecosystraZegoLiveroomServerUrl?: string
  __ecosystraZegoEngineOptions?: {
    customDomain?: {
      accesshub?: string
      logreport?: string
      detaillog?: string
    }
  }
}

/**
 * Patched UIKit (`scripts/patch-zego-uikit-server.mjs`) reads these before `new ZegoExpressEngine`,
 * so signaling uses your Console "Server URL" (e.g. coolzcloud) instead of the default zegocloud/coolfcloud mix.
 */
function applyZegoWindowHooksFromEnv(): void {
  if (typeof window === "undefined") return
  const w = window as ZegoEcosystraWindow
  const server = process.env.NEXT_PUBLIC_ZEGO_SERVER_URL?.trim()

  if (server && server.length > 0) {
    w.__ecosystraZegoLiveroomServerUrl = server
  } else {
    delete w.__ecosystraZegoLiveroomServerUrl
  }

  const explicitHub = process.env.NEXT_PUBLIC_ZEGO_ACCESSHUB_HOST?.trim()
  let accesshub: string | undefined
  if (explicitHub && explicitHub.length > 0) {
    accesshub = explicitHub
  } else if (server) {
    try {
      const host = new URL(server).hostname
      if (host.includes("coolzcloud")) {
        accesshub = "accesshub-wss.coolzcloud.com"
      } else if (host.includes("zegocloud.com")) {
        accesshub = "accesshub-wss.zegocloud.com"
      }
    } catch {
      /* ignore invalid URL */
    }
  }

  if (accesshub) {
    w.__ecosystraZegoEngineOptions = { customDomain: { accesshub } }
  } else {
    delete w.__ecosystraZegoEngineOptions
  }
}

export function EcosystraZegoMeetingView({
  roomID,
  userID,
  userName,
  open,
  onClose,
  inviteContext,
  viewerUserId,
}: {
  roomID: string
  userID: string
  userName: string
  open: boolean
  onClose: () => void
  /** When set, shows an “Invite people” panel (email + share link + task roster). */
  inviteContext?: MeetingInviteContext | null
  /** Workspace user id (for roster “You” / self). Defaults to `userID` if unset. */
  viewerUserId?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const kitRef = useRef<ReturnType<typeof ZegoUIKitPrebuilt.create> | null>(
    null
  )
  /** Incremented only in useEffect cleanup — compare with captured genAtStart for stale async (Strict Mode). */
  const generationRef = useRef(0)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  /** Display name for kit token — must stay stable across session hydration. */
  const userNameRef = useRef(userName)
  userNameRef.current = userName

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [invitePanelOpen, setInvitePanelOpen] = useState(false)
  const [joinedZegoUserIds, setJoinedZegoUserIds] = useState<Set<string>>(
    () => new Set()
  )

  const uid = sanitizeZegoUserId(userID)
  const viewerId = viewerUserId?.trim() || userID

  useEffect(() => {
    if (!open) {
      setInvitePanelOpen(false)
      setJoinedZegoUserIds(new Set())
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    if (!containerRef.current) return

    const genAtStart = generationRef.current
    const runId = createZegoMeetingRunId()
    const t0 = performance.now()

    zegoMeetingClientLog({
      runId,
      phase: "effect_start",
      details: {
        generationAtStart: genAtStart,
        roomID,
        roomIDLength: roomID.length,
        userIdLen: uid.length,
        open,
        hasContainer: Boolean(containerRef.current),
        pathname: typeof window !== "undefined" ? window.location.pathname : "",
        showPreJoinView: readShowPreJoinView(),
      },
    })

    void (async () => {
      const isStale = () => generationRef.current !== genAtStart

      setLoading(true)
      setError(null)
      try {
        const appID = Number(
          String(process.env.NEXT_PUBLIC_ZEGO_APP_ID ?? "").trim()
        )
        zegoMeetingClientLog({
          runId,
          phase: "env_check",
          details: {
            nextPublicAppIdPresent: Boolean(
              process.env.NEXT_PUBLIC_ZEGO_APP_ID
            ),
            appIDParsed: Number.isFinite(appID) ? appID : null,
          },
        })
        if (!Number.isFinite(appID) || appID <= 0) {
          const msg =
            "Set NEXT_PUBLIC_ZEGO_APP_ID (same numeric App ID as ZEGO_APP_ID)."
          zegoMeetingClientLog({
            runId,
            phase: "error_env_app_id",
            level: "error",
            errorMessage: msg,
          })
          setError(msg)
          setLoading(false)
          void zegoMeetingReportClientError({
            runId,
            phase: "error_env_app_id",
            message: msg,
          })
          return
        }

        const fetchStarted = performance.now()
        zegoMeetingClientLog({
          runId,
          phase: "fetch_token_request",
          details: { method: "POST", path: "/api/zego/token" },
        })

        const res = await fetch("/api/zego/token", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomID }),
        })
        const fetchMs = Math.round(performance.now() - fetchStarted)

        if (isStale()) {
          zegoMeetingClientLog({
            runId,
            phase: "stale_after_fetch_skipped",
            level: "debug",
            details: {
              genAtStart,
              generationNow: generationRef.current,
              reason: "React effect superseded (e.g. Strict Mode)",
            },
          })
          setLoading(false)
          return
        }

        let rawBody: string
        try {
          rawBody = await res.text()
        } catch (readErr) {
          zegoMeetingClientLog({
            runId,
            phase: "error_read_response_body",
            level: "error",
            errorMessage:
              readErr instanceof Error ? readErr.message : String(readErr),
          })
          throw readErr
        }

        if (isStale()) {
          zegoMeetingClientLog({
            runId,
            phase: "stale_after_fetch_body_skipped",
            level: "debug",
            details: { genAtStart, generationNow: generationRef.current },
          })
          setLoading(false)
          return
        }

        let data: {
          token?: string
          error?: string
          appID?: number
          /** Must match Token04 user id from the server or Zego reports token auth errors. */
          zegoUserId?: string
        }
        try {
          data = JSON.parse(rawBody) as typeof data
        } catch {
          zegoMeetingClientLog({
            runId,
            phase: "error_json_parse",
            level: "error",
            details: {
              httpStatus: res.status,
              bodyLength: rawBody.length,
              bodyPrefix: rawBody.slice(0, 120),
            },
          })
          setError("Invalid JSON from token API")
          setLoading(false)
          return
        }

        const serverAppId =
          typeof data.appID === "number" &&
          Number.isFinite(data.appID) &&
          data.appID > 0
            ? data.appID
            : null

        const kitUserId =
          typeof data.zegoUserId === "string" && data.zegoUserId.length > 0
            ? data.zegoUserId
            : uid

        zegoMeetingClientLog({
          runId,
          phase: "fetch_token_response",
          details: {
            httpStatus: res.status,
            ok: res.ok,
            fetchMs,
            bodyLength: rawBody.length,
            hasTokenKey: typeof data.token === "string",
            tokenLength: typeof data.token === "string" ? data.token.length : 0,
            errorField: typeof data.error === "string" ? data.error : undefined,
            serverAppId,
            nextPublicAppId: appID,
            zegoUserIdFromServerLen: kitUserId.length,
            zegoUserIdMatchesClientProp: kitUserId === uid,
          },
        })

        if (!res.ok) {
          const errMsg = data.error ?? "Failed to get Zego token"
          zegoMeetingClientLog({
            runId,
            phase: "error_token_http",
            level: "error",
            details: { httpStatus: res.status },
            errorMessage: errMsg,
          })
          setError(errMsg)
          setLoading(false)
          void zegoMeetingReportClientError({
            runId,
            phase: "error_token_http",
            message: errMsg,
            extra: { httpStatus: res.status },
          })
          return
        }
        const token = data.token
        if (!token) {
          const errMsg = "No token in response"
          zegoMeetingClientLog({
            runId,
            phase: "error_token_missing",
            level: "error",
            errorMessage: errMsg,
          })
          setError(errMsg)
          setLoading(false)
          void zegoMeetingReportClientError({
            runId,
            phase: "error_token_missing",
            message: errMsg,
          })
          return
        }

        /** Must match the App ID used to sign Token04 on the server, or Zego returns 1102016 (login token format incorrect). */
        const effectiveAppId = serverAppId ?? appID
        if (serverAppId !== null && serverAppId !== appID) {
          zegoMeetingClientLog({
            runId,
            phase: "warn_app_id_mismatch",
            level: "warn",
            details: {
              message:
                "NEXT_PUBLIC_ZEGO_APP_ID differs from server ZEGO_APP_ID; using server appID for kit token.",
              serverAppId,
              nextPublicAppId: appID,
            },
          })
        }

        const displayName = userNameRef.current
        let kitToken: string
        try {
          kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
            effectiveAppId,
            token,
            roomID,
            kitUserId,
            displayName
          )
        } catch (kitErr) {
          zegoMeetingClientLog({
            runId,
            phase: "error_generate_kit_token",
            level: "error",
            errorName: kitErr instanceof Error ? kitErr.name : undefined,
            errorMessage:
              kitErr instanceof Error ? kitErr.message : String(kitErr),
          })
          void zegoMeetingReportClientError({
            runId,
            phase: "error_generate_kit_token",
            message: kitErr instanceof Error ? kitErr.message : String(kitErr),
            stack: kitErr instanceof Error ? kitErr.stack : undefined,
          })
          throw kitErr
        }

        zegoMeetingClientLog({
          runId,
          phase: "kit_token_generated",
          details: {
            kitTokenLength: kitToken.length,
            displayNameLen: displayName.length,
          },
        })

        if (isStale()) {
          zegoMeetingClientLog({
            runId,
            phase: "stale_before_uikit_create_skipped",
            level: "debug",
            details: { genAtStart, generationNow: generationRef.current },
          })
          setLoading(false)
          return
        }

        applyZegoWindowHooksFromEnv()
        zegoMeetingClientLog({
          runId,
          phase: "zego_window_hooks",
          details: {
            liveroomUrlLen:
              typeof window !== "undefined"
                ? (
                    (window as ZegoEcosystraWindow)
                      .__ecosystraZegoLiveroomServerUrl ?? ""
                  ).length
                : 0,
            accesshub:
              (window as ZegoEcosystraWindow).__ecosystraZegoEngineOptions
                ?.customDomain?.accesshub ?? null,
          },
        })

        const zp = ZegoUIKitPrebuilt.create(kitToken)
        kitRef.current = zp
        zegoMeetingClientLog({
          runId,
          phase: "uikit_instance_created",
          details: {
            zegoUIKitVersion:
              typeof ZegoUIKitPrebuilt.getVersion === "function"
                ? ZegoUIKitPrebuilt.getVersion()
                : "unknown",
          },
        })

        if (isStale()) {
          zegoMeetingClientLog({
            runId,
            phase: "stale_after_uikit_create_discarded",
            level: "debug",
            details: { genAtStart, generationNow: generationRef.current },
          })
          zp.destroy()
          kitRef.current = null
          setLoading(false)
          return
        }

        if (!containerRef.current) {
          zegoMeetingClientLog({
            runId,
            phase: "error_no_container_dom",
            level: "error",
          })
          zp.destroy()
          kitRef.current = null
          setError("Meeting container not available")
          setLoading(false)
          return
        }

        const rectBefore = containerRef.current.getBoundingClientRect()
        zegoMeetingClientLog({
          runId,
          phase: "container_metrics",
          details: {
            width: Math.round(rectBefore.width),
            height: Math.round(rectBefore.height),
            top: Math.round(rectBefore.top),
          },
        })

        if (rectBefore.height < 80 || rectBefore.width < 80) {
          zegoMeetingClientLog({
            runId,
            phase: "warn_container_too_small",
            level: "warn",
            details: {
              width: rectBefore.width,
              height: rectBefore.height,
              hint: "Zego UI needs a visible-sized container; check flex/min-height chain.",
            },
          })
        }

        setLoading(false)
        zegoMeetingClientLog({
          runId,
          phase: "loading_cleared_before_join",
        })

        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => resolve())
          })
        })

        if (isStale() || !containerRef.current) {
          zegoMeetingClientLog({
            runId,
            phase: "stale_after_raf_discarded",
            level: "debug",
            details: {
              stale: isStale(),
              hasContainer: Boolean(containerRef.current),
              genAtStart,
              generationNow: generationRef.current,
            },
          })
          zp.destroy()
          kitRef.current = null
          setLoading(false)
          return
        }

        const rectAfter = containerRef.current.getBoundingClientRect()
        zegoMeetingClientLog({
          runId,
          phase: "container_metrics_after_layout",
          details: {
            width: Math.round(rectAfter.width),
            height: Math.round(rectAfter.height),
          },
        })

        const showPreJoinView = readShowPreJoinView()

        zegoMeetingClientLog({
          runId,
          phase: "join_room_call",
          details: {
            scenario: "VideoConference",
            showPreJoinView,
          },
        })

        setJoinedZegoUserIds(new Set([uid]))

        zp.joinRoom({
          container: containerRef.current,
          scenario: {
            mode: ZegoUIKitPrebuilt.VideoConference,
            config: { role: ZegoUIKitPrebuilt.Host },
          },
          showPreJoinView,
          showScreenSharingButton: true,
          showUserList: true,
          layout: "Grid",
          maxUsers: 20,
          branding: {
            logoURL: "/images/branding/ecosystra-logo.jpg",
          },
          onJoinRoom: () => {
            setJoinedZegoUserIds((prev) => new Set([...prev, kitUserId]))
            zegoMeetingClientLog({
              runId,
              phase: "callback_on_join_room",
              durationMs: Math.round(performance.now() - t0),
            })
          },
          onUserJoin: (users) => {
            setJoinedZegoUserIds((prev) => {
              const n = new Set(prev)
              for (const u of users ?? []) {
                const id = u?.userID
                if (id) n.add(String(id))
              }
              return n
            })
            zegoMeetingClientLog({
              runId,
              phase: "callback_on_user_join",
              details: {
                count: users?.length ?? 0,
                ids: (users ?? []).map((u) => u.userID).slice(0, 8),
              },
            })
          },
          onUserLeave: (users) => {
            setJoinedZegoUserIds((prev) => {
              const n = new Set(prev)
              for (const u of users ?? []) {
                const id = u?.userID
                if (id) n.delete(String(id))
              }
              return n
            })
            zegoMeetingClientLog({
              runId,
              phase: "callback_on_user_leave",
              details: {
                count: users?.length ?? 0,
                ids: (users ?? []).map((u) => u.userID).slice(0, 8),
              },
            })
          },
          onYouRemovedFromRoom: () => {
            zegoMeetingClientLog({
              runId,
              phase: "callback_on_you_removed_from_room",
              level: "warn",
            })
          },
          onReturnToHomeScreenClicked: () => {
            zegoMeetingClientLog({
              runId,
              phase: "callback_on_return_to_home_clicked",
            })
          },
          onLeaveRoom: () => {
            zegoMeetingClientLog({
              runId,
              phase: "callback_on_leave_room",
              durationMs: Math.round(performance.now() - t0),
            })
            onCloseRef.current()
          },
        })

        zegoMeetingClientLog({
          runId,
          phase: "join_room_returned",
          details: {
            elapsedMs: Math.round(performance.now() - t0),
          },
        })
      } catch (e) {
        if (!isStale()) {
          const msg = e instanceof Error ? e.message : "Meeting failed to start"
          zegoMeetingClientLog({
            runId,
            phase: "error_caught",
            level: "error",
            errorName: e instanceof Error ? e.name : undefined,
            errorMessage: msg,
          })
          setError(msg)
          void zegoMeetingReportClientError({
            runId,
            phase: "error_caught",
            message: msg,
            stack: e instanceof Error ? e.stack : undefined,
          })
        }
      } finally {
        setLoading(false)
      }
    })()

    return () => {
      generationRef.current += 1
      zegoMeetingClientLog({
        runId,
        phase: "effect_cleanup",
        level: "debug",
        details: {
          hadKit: Boolean(kitRef.current),
          generationAfterBump: generationRef.current,
        },
      })
      kitRef.current?.destroy()
      kitRef.current = null
    }
  }, [open, roomID, uid])

  if (!open) return null

  const headerH = "2.75rem"

  const exitMeeting = (source: "close_button" | "x_button") => {
    const runId = createZegoMeetingRunId()
    zegoMeetingClientLog({
      runId,
      phase: "user_click_close",
      details: { hadKit: Boolean(kitRef.current), source },
    })
    kitRef.current?.destroy()
    kitRef.current = null
    onCloseRef.current()
  }

  return (
    <div className="relative z-10 flex h-full min-h-0 w-full flex-1 flex-col bg-zinc-950">
      {inviteContext && invitePanelOpen ? (
        <div className="pointer-events-auto fixed right-3 top-14 z-[100] w-[min(calc(100vw-1.5rem),20rem)] max-md:left-3 max-md:right-3 max-md:w-auto">
          <EcosystraMeetingInvitePanel
            roomId={roomID}
            invite={inviteContext}
            joinedZegoUserIds={joinedZegoUserIds}
            currentUserId={viewerId}
          />
        </div>
      ) : null}
      <div className="relative z-20 flex h-11 shrink-0 items-center justify-between gap-2 border-b border-border bg-background px-2 pe-1">
        <span className="min-w-0 truncate ps-1 text-sm font-medium">
          Video meeting
        </span>
        <div className="flex shrink-0 items-center gap-1">
          {inviteContext ? (
            <Button
              type="button"
              variant={invitePanelOpen ? "default" : "outline"}
              size="sm"
              onClick={() => setInvitePanelOpen((v) => !v)}
            >
              <UserPlus className="me-1 size-4" />
              Invite
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => exitMeeting("close_button")}
          >
            Close
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 rounded-full"
            aria-label="Exit meeting preview"
            onClick={() => exitMeeting("x_button")}
          >
            <X className="size-5" />
          </Button>
        </div>
      </div>
      <div className="relative flex min-h-0 flex-1 flex-col">
        {loading ? (
          <div className="absolute inset-0 z-[60] flex items-center justify-center bg-background/80">
            <Loader2 className="size-10 animate-spin text-muted-foreground" />
          </div>
        ) : null}
        {error ? (
          <div className="absolute inset-0 z-[70] flex items-center justify-center bg-background p-4 text-center text-sm text-destructive">
            {error}
          </div>
        ) : null}
        <div
          ref={containerRef}
          className="relative z-[1] min-h-0 w-full flex-1 bg-zinc-950"
          style={{
            minHeight: `max(400px, calc(100dvh - ${headerH}))`,
          }}
        />
      </div>
    </div>
  )
}

export { EcosystraZegoMeetingView as EcosystraMeeting }
