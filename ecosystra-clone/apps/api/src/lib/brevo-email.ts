/**
 * Brevo (Sendinblue) transactional email — https://developers.brevo.com/reference/sendtransacemail
 * Set BREVO_API_KEY and a verified sender (BREVO_SENDER_EMAIL) in the API environment.
 */

const BREVO_API = "https://api.brevo.com/v3";

function apiKey(): string | null {
  const k = process.env.BREVO_API_KEY?.trim();
  return k || null;
}

function formatChangesHtml(
  changes: Record<string, { old?: unknown; new?: unknown }>
): string {
  const rows = Object.entries(changes)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px;border:1px solid #eee"><strong>${escapeHtml(
          k
        )}</strong></td><td style="padding:8px;border:1px solid #eee">${escapeHtml(
          String(v?.old ?? "—")
        )}</td><td style="padding:8px;border:1px solid #eee">${escapeHtml(
          String(v?.new ?? "—")
        )}</td></tr>`
    )
    .join("");
  return `<table style="border-collapse:collapse;width:100%;max-width:560px"><thead><tr><th style="text-align:left;padding:8px;border:1px solid #eee">Field</th><th style="text-align:left;padding:8px;border:1px solid #eee">Before</th><th style="text-align:left;padding:8px;border:1px solid #eee">After</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type TaskEmailPayload = {
  taskId: string;
  assigneeEmail: string;
  assigneeName?: string | null;
  changes: Record<string, { old?: unknown; new?: unknown }>;
  deepLink: string;
  summary: string;
};

export async function sendTaskNotificationEmail(
  payload: TaskEmailPayload
): Promise<{ ok: boolean; message?: string }> {
  const key = apiKey();
  if (!key) {
    console.warn("[brevo] BREVO_API_KEY not set — skip email");
    return { ok: false, message: "no_api_key" };
  }

  const senderEmail =
    process.env.BREVO_SENDER_EMAIL?.trim() || "noreply@example.com";
  const senderName = process.env.BREVO_SENDER_NAME?.trim() || "Ecosystra";

  const subject = `[Ecosystra] ${payload.summary}`;
  const changesBlock =
    Object.keys(payload.changes).length > 0
      ? formatChangesHtml(payload.changes)
      : "<p><em>No field diff attached.</em></p>";

  const hrefSafe = payload.deepLink.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  const htmlContent = `
<!DOCTYPE html>
<html><head><meta charset="utf-8" /></head>
<body style="font-family:system-ui,sans-serif;line-height:1.5;color:#1a1a1a">
  <p>${escapeHtml(payload.summary)}</p>
  <p><strong>Task ID:</strong> ${escapeHtml(payload.taskId)}</p>
  <p><a href="${hrefSafe}" style="display:inline-block;padding:12px 20px;background:#0073ea;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">Open task</a></p>
  <p style="font-size:12px;color:#666">If the button does not work, copy this link:<br/>${escapeHtml(
    payload.deepLink
  )}</p>
  <h3 style="margin-top:24px;font-size:14px">Changes</h3>
  ${changesBlock}
</body></html>`;

  const res = await fetch(`${BREVO_API}/smtp/email`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": key,
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [
        {
          email: payload.assigneeEmail,
          name: payload.assigneeName || payload.assigneeEmail,
        },
      ],
      subject,
      htmlContent,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(
      "[brevo] HTTP error",
      res.status,
      "sender:",
      senderEmail,
      "→",
      payload.assigneeEmail,
      errText.slice(0, 500),
    );
    return { ok: false, message: errText };
  }

  console.info(
    "[brevo] API accepted message",
    "from:",
    senderEmail,
    "→",
    payload.assigneeEmail,
  );
  return { ok: true };
}
