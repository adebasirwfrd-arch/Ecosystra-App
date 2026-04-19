"use client"

const GAPI_SCRIPT = "https://apis.google.com/js/api.js"

function loadScriptOnce(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === "undefined") {
      reject(new Error("No document"))
      return
    }
    const existing = document.querySelector(`script[src="${src}"]`)
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true })
      existing.addEventListener(
        "error",
        () => reject(new Error(`Failed to load ${src}`)),
        { once: true }
      )
      return
    }
    const s = document.createElement("script")
    s.src = src
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(s)
  })
}

let pickerApiPromise: Promise<void> | null = null

export function ensureGooglePickerApiLoaded(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Picker requires a browser"))
  }
  if (!pickerApiPromise) {
    pickerApiPromise = (async () => {
      await loadScriptOnce(GAPI_SCRIPT)
      await new Promise<void>((resolve, reject) => {
        const g = (
          window as unknown as {
            gapi?: { load: (n: string, cb: () => void) => void }
          }
        ).gapi
        if (!g?.load) {
          reject(new Error("gapi.load missing"))
          return
        }
        g.load("picker", () => resolve())
      })
    })()
  }
  return pickerApiPromise
}

/**
 * Opens Google Picker; resolves the first selected **file** id, or `null` if cancelled / folder / error.
 */
export function openGoogleDrivePicker(params: {
  oauthToken: string
  developerKey: string
  title?: string
}): Promise<string | null> {
  const { oauthToken, developerKey, title = "Select a file" } = params
  return new Promise((resolve) => {
    const win = window as unknown as {
      google?: {
        picker: {
          Action: { PICKED: string; CANCEL: string }
          Response: { ACTION: string; DOCUMENTS: string }
          DocsView: new () => {
            setIncludeFolders: (v: boolean) => unknown
            setSelectFolderEnabled: (v: boolean) => unknown
          }
          PickerBuilder: new () => {
            addView: (v: unknown) => unknown
            setOAuthToken: (t: string) => unknown
            setDeveloperKey: (k: string) => unknown
            setCallback: (cb: (d: Record<string, unknown>) => void) => unknown
            setTitle: (t: string) => unknown
            build: () => { setVisible: (v: boolean) => void }
          }
        }
      }
    }

    const g = win.google?.picker
    if (!g) {
      resolve(null)
      return
    }

    const view = new g.DocsView()
      .setIncludeFolders(false)
      .setSelectFolderEnabled(false)

    const picker = new g.PickerBuilder()
      .addView(view)
      .setOAuthToken(oauthToken)
      .setDeveloperKey(developerKey)
      .setTitle(title)
      .setCallback((data: Record<string, unknown>) => {
        const action = data[g.Response.ACTION] as string | undefined
        if (action === g.Action.CANCEL) {
          resolve(null)
          return
        }
        if (action !== g.Action.PICKED) {
          resolve(null)
          return
        }
        const docs = data[g.Response.DOCUMENTS] as
          | { id?: string; mimeType?: string }[]
          | undefined
        const first = docs?.[0]
        const id = first?.id
        if (!id) {
          resolve(null)
          return
        }
        if (first.mimeType === "application/vnd.google-apps.folder") {
          resolve(null)
          return
        }
        resolve(id)
      })
      .build()
    picker.setVisible(true)
  })
}
