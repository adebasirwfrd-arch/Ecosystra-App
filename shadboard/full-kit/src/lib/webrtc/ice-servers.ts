/**
 * Default STUN (no TURN). Works on many home networks; strict NAT may need TURN — set env below.
 * Optional: NEXT_PUBLIC_WEBRTC_TURN_URL, NEXT_PUBLIC_WEBRTC_TURN_USER, NEXT_PUBLIC_WEBRTC_TURN_PASS
 */
export function getDefaultIceServers(): RTCIceServer[] {
  const servers: RTCIceServer[] = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ]

  const turnUrl = process.env.NEXT_PUBLIC_WEBRTC_TURN_URL?.trim()
  const turnUser = process.env.NEXT_PUBLIC_WEBRTC_TURN_USER?.trim()
  const turnPass = process.env.NEXT_PUBLIC_WEBRTC_TURN_PASS?.trim()

  if (turnUrl && turnUser !== undefined && turnPass !== undefined) {
    servers.push({
      urls: turnUrl,
      username: turnUser,
      credential: turnPass,
    })
  }

  const extraJson = process.env.NEXT_PUBLIC_WEBRTC_ICE_SERVERS_JSON?.trim()
  if (extraJson) {
    try {
      const parsed = JSON.parse(extraJson) as RTCIceServer[]
      if (Array.isArray(parsed)) servers.push(...parsed)
    } catch {
      /* ignore */
    }
  }

  return servers
}
