"use client"

import { useEffect, useMemo, useState } from "react"
import { Settings2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useWebRtcCall } from "../_contexts/webrtc-call-context"

const DEFAULT_SPEAKER = "__default__"

function pickSelectValue(
  currentId: string,
  devices: { deviceId: string }[]
): string {
  if (devices.some((d) => d.deviceId === currentId)) return currentId
  return devices[0]?.deviceId ?? ""
}

export function ChatCallMediaSettings({
  showVideo,
  disabled,
}: {
  showVideo: boolean
  disabled?: boolean
}) {
  const {
    localStream,
    audioInputDevices,
    videoInputDevices,
    audioOutputDevices,
    currentMicrophoneDeviceId,
    currentCameraDeviceId,
    speakerDeviceId,
    refreshMediaDevices,
    setMicrophoneDeviceId,
    setCameraDeviceId,
    setSpeakerDeviceId,
  } = useWebRtcCall()

  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) void refreshMediaDevices()
  }, [open, refreshMediaDevices])

  const sinkSupported =
    typeof HTMLMediaElement !== "undefined" &&
    "setSinkId" in HTMLMediaElement.prototype

  const micValue = useMemo(
    () => pickSelectValue(currentMicrophoneDeviceId, audioInputDevices),
    [audioInputDevices, currentMicrophoneDeviceId]
  )

  const camValue = useMemo(
    () => pickSelectValue(currentCameraDeviceId, videoInputDevices),
    [currentCameraDeviceId, videoInputDevices]
  )

  const speakerValue = speakerDeviceId || DEFAULT_SPEAKER

  const canUse = Boolean(localStream) && !disabled

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="size-12 shrink-0 rounded-full border border-white/10 bg-white/10 hover:bg-white/20"
          disabled={!canUse}
          aria-label="Audio and video settings"
          title="Audio & video settings"
        >
          <Settings2 className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        side="top"
        className="z-[200] w-[min(92vw,22rem)] space-y-4 border-zinc-700 bg-zinc-900 p-4 text-zinc-100 shadow-xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => {
          const t = e.target as HTMLElement | null
          if (t?.closest?.('[data-slot="select-content"]')) e.preventDefault()
        }}
      >
        <div>
          <p className="text-sm font-semibold text-white">Audio &amp; video</p>
          <p className="mt-1 text-xs leading-relaxed text-zinc-400">
            If the browser blocked the camera or mic, click the lock or site
            icon in the address bar, allow access, then reopen this panel.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-zinc-300">Microphone</Label>
          <Select
            value={micValue}
            onValueChange={(v) => void setMicrophoneDeviceId(v)}
            disabled={!audioInputDevices.length}
          >
            <SelectTrigger className="border-zinc-600 bg-zinc-950 text-sm text-white">
              <SelectValue placeholder="No microphone" />
            </SelectTrigger>
            <SelectContent className="z-[250]">
              {audioInputDevices.map((d) => (
                <SelectItem key={d.deviceId} value={d.deviceId}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showVideo ? (
          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-300">Camera</Label>
            <Select
              value={camValue}
              onValueChange={(v) => void setCameraDeviceId(v)}
              disabled={!videoInputDevices.length}
            >
              <SelectTrigger className="border-zinc-600 bg-zinc-950 text-sm text-white">
                <SelectValue placeholder="No camera" />
              </SelectTrigger>
              <SelectContent className="z-[250]">
                {videoInputDevices.map((d) => (
                  <SelectItem key={d.deviceId} value={d.deviceId}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}

        {sinkSupported ? (
          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-300">Speaker (output)</Label>
            <Select value={speakerValue} onValueChange={setSpeakerDeviceId}>
              <SelectTrigger className="border-zinc-600 bg-zinc-950 text-sm text-white">
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent className="z-[250]">
                <SelectItem value={DEFAULT_SPEAKER}>Default</SelectItem>
                {audioOutputDevices.map((d) => (
                  <SelectItem key={d.deviceId} value={d.deviceId}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}
