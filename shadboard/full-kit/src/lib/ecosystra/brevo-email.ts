/**
 * Brevo (Sendinblue) transactional email — https://developers.brevo.com/reference/sendtransacemail
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

export type DueDateReminderEmailPayload = {
  toEmail: string
  toName: string | null
  taskName: string
  boardName: string
  groupName: string | null
  dueDateDisplay: string
  dueDateIso: string
  windowKey: "7d" | "3d" | "1d"
  windowLabel: string
  deepLink: string
  taskStatus: string | null
  priority: string | null
}

function buildDueDateReminderHtml(p: DueDateReminderEmailPayload): string {
  const greeting = p.toName?.trim()
    ? `Hello ${escapeHtml(p.toName.trim())},`
    : "Hello,"
  const hrefSafe = p.deepLink.replace(/&/g, "&amp;").replace(/"/g, "&quot;")
  const urgency =
    p.windowKey === "1d"
      ? { bar: "#dc2626", label: "Action needed soon", badge: "#fef2f2" }
      : p.windowKey === "3d"
        ? { bar: "#ea580c", label: "Upcoming deadline", badge: "#fff7ed" }
        : { bar: "#2563eb", label: "Heads-up", badge: "#eff6ff" }

  const row = (k: string, v: string) =>
    `<tr><td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#64748b;width:120px">${escapeHtml(
      k
    )}</td><td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;font-weight:500">${v}</td></tr>`

  const groupRow =
    p.groupName != null && p.groupName.trim()
      ? row("Group", escapeHtml(p.groupName.trim()))
      : ""

  const statusRow = p.taskStatus?.trim()
    ? row("Status", escapeHtml(p.taskStatus.trim()))
    : ""
  const priorityRow = p.priority?.trim()
    ? row("Priority", escapeHtml(p.priority.trim()))
    : ""

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width"/><meta http-equiv="x-ua-compatible" content="ie=edge"/><title>Due date reminder</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Inter,Segoe UI,system-ui,-apple-system,sans-serif;color:#0f172a;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    ${escapeHtml(p.taskName)} — due in ${escapeHtml(p.windowLabel)} (${escapeHtml(p.dueDateIso)}).
  </div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 40px rgba(15,23,42,0.08);border:1px solid #e2e8f0;">
        <tr><td style="height:4px;background:${urgency.bar};"></td></tr>
        <tr><td style="padding:28px 32px 8px 32px;">
          <p style="margin:0 0 6px 0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#64748b;font-weight:600;">Ecosystra · ${escapeHtml(
            urgency.label
          )}</p>
          <h1 style="margin:0;font-size:22px;line-height:1.25;font-weight:700;color:#0f172a;">Task due in <span style="color:${urgency.bar};">${escapeHtml(
            p.windowLabel
          )}</span></h1>
        </td></tr>
        <tr><td style="padding:8px 32px 0 32px;">
          <p style="margin:0;font-size:15px;line-height:1.6;color:#475569;">${greeting}</p>
          <p style="margin:16px 0 0 0;font-size:15px;line-height:1.6;color:#475569;">This is a scheduled reminder for a task you own or are assigned to. Please review the details below and take any needed action before the due date.</p>
        </td></tr>
        <tr><td style="padding:24px 32px 8px 32px;">
          <table role="presentation" width="100%" style="background:${urgency.badge};border-radius:12px;border:1px solid #e2e8f0;">
            <tr><td style="padding:18px 20px;">
              <p style="margin:0 0 4px 0;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;">Time remaining</p>
              <p style="margin:0;font-size:28px;font-weight:800;color:${urgency.bar};line-height:1;">${escapeHtml(
                p.windowLabel
              )}</p>
              <p style="margin:8px 0 0 0;font-size:13px;color:#64748b;">Target due date: <strong style="color:#0f172a;">${escapeHtml(
                p.dueDateDisplay
              )}</strong> <span style="color:#94a3b8;">(${escapeHtml(
                p.dueDateIso
              )})</span></p>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:16px 32px 8px 32px;">
          <p style="margin:0 0 10px 0;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;">Task details</p>
          <table role="presentation" width="100%" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
            ${row("Task", escapeHtml(p.taskName))}
            ${row("Board", escapeHtml(p.boardName))}
            ${groupRow}
            ${row("Due date", `${escapeHtml(p.dueDateDisplay)} <span style="color:#94a3b8;font-weight:400;">(${escapeHtml(
              p.dueDateIso
            )})</span>`)}
            ${statusRow}
            ${priorityRow}
          </table>
        </td></tr>
        <tr><td style="padding:24px 32px 8px 32px;" align="center">
          <a href="${hrefSafe}" style="display:inline-block;padding:14px 28px;background:#0073ea;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:700;font-size:15px;letter-spacing:0.02em;">Open task in Ecosystra</a>
        </td></tr>
        <tr><td style="padding:8px 32px 28px 32px;">
          <p style="margin:0;font-size:12px;line-height:1.6;color:#94a3b8;text-align:center;">If the button does not work, copy and paste this link into your browser:<br/><span style="word-break:break-all;color:#64748b;">${escapeHtml(
            p.deepLink
          )}</span></p>
        </td></tr>
        <tr><td style="padding:16px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:11px;line-height:1.5;color:#94a3b8;text-align:center;">You received this email because you are listed as the <strong style="color:#64748b;">owner</strong> or an <strong style="color:#64748b;">assignee</strong> on this task. Reminders use <strong style="color:#64748b;">calendar days in Asia/Jakarta (GMT+7)</strong> at 7, 3, and 1 day before the due date.</p>
          <p style="margin:10px 0 0 0;font-size:11px;color:#cbd5e1;text-align:center;">© ${new Date().getUTCFullYear()} Ecosystra · Delivered via Brevo</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

/** Brevo transactional — due date reminder (7d / 3d / 1d). */
export async function sendDueDateReminderEmail(
  p: DueDateReminderEmailPayload
): Promise<boolean> {
  const key = apiKey()
  if (!key) {
    console.warn("[brevo] BREVO_API_KEY not set — skip due reminder", p.toEmail)
    return false
  }

  const senderEmail =
    process.env.BREVO_SENDER_EMAIL?.trim() || "noreply@example.com"
  const senderName = process.env.BREVO_SENDER_NAME?.trim() || "Ecosystra"
  const subject = `[Ecosystra] Reminder: "${p.taskName.slice(0, 60)}${p.taskName.length > 60 ? "..." : ""}" - ${p.windowLabel} left`

  const htmlContent = buildDueDateReminderHtml(p)

  const res = await fetch(`${BREVO_API}/smtp/email`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": key,
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: p.toEmail, name: p.toName?.trim() || p.toEmail }],
      subject,
      htmlContent,
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    console.error(
      "[brevo] due reminder failed",
      res.status,
      p.toEmail,
      errText.slice(0, 400)
    )
    return false
  }
  console.info("[brevo] due reminder sent", p.toEmail, p.windowKey, p.taskName)
  return true
}

export type TaskAssigneeInviteEmailPayload = {
  toEmail: string;
  toName?: string | null;
  taskName: string;
  inviterName: string;
  acceptUrl: string;
};

/** Invite someone by email to accept a task assignment (approval via link). */
export async function sendTaskAssigneeInviteEmail(
  payload: TaskAssigneeInviteEmailPayload
): Promise<{ ok: boolean; message?: string }> {
  const key = apiKey();
  if (!key) {
    console.warn("[brevo] BREVO_API_KEY not set — skip invite email");
    return { ok: false, message: "no_api_key" };
  }

  const senderEmail =
    process.env.BREVO_SENDER_EMAIL?.trim() || "noreply@example.com";
  const senderName = process.env.BREVO_SENDER_NAME?.trim() || "Ecosystra";
  const subject = `[Ecosystra] Invitation: ${payload.taskName}`;
  const hrefSafe = payload.acceptUrl
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;");
  const htmlContent = `
<!DOCTYPE html>
<html><head><meta charset="utf-8" /></head>
<body style="font-family:system-ui,sans-serif;line-height:1.5;color:#1a1a1a">
  <p><strong>${escapeHtml(payload.inviterName)}</strong> invited you to collaborate on <strong>${escapeHtml(payload.taskName)}</strong>.</p>
  <p><a href="${hrefSafe}" style="display:inline-block;padding:12px 20px;background:#0073ea;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">Accept invitation</a></p>
  <p style="font-size:12px;color:#666">If the button does not work, copy this link:<br/>${escapeHtml(
    payload.acceptUrl
  )}</p>
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
          email: payload.toEmail,
          name: payload.toName || payload.toEmail,
        },
      ],
      subject,
      htmlContent,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("[brevo] invite email failed", res.status, errText.slice(0, 500));
    return { ok: false, message: errText };
  }
  console.info("[brevo] invite email sent", payload.toEmail);
  return { ok: true };
}

export type VideoMeetingInviteEmailPayload = {
  toEmail: string
  toName?: string | null
  taskTitle: string
  groupName?: string | null
  roomId: string
  joinUrl: string
  inviterName: string
}

function buildVideoMeetingInviteHtml(p: VideoMeetingInviteEmailPayload): string {
  const greeting = p.toName?.trim()
    ? `Hello ${escapeHtml(p.toName.trim())},`
    : "Hello,"
  const groupLine =
    p.groupName != null && p.groupName.trim()
      ? `<tr><td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#64748b;width:120px">Group</td><td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;font-weight:500">${escapeHtml(
          p.groupName.trim()
        )}</td></tr>`
      : ""
  const hrefSafe = p.joinUrl.replace(/&/g, "&amp;").replace(/"/g, "&quot;")

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width"/><title>Meeting invitation</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Inter,Segoe UI,system-ui,-apple-system,sans-serif;color:#0f172a;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    ${escapeHtml(p.taskTitle)} — video meeting on Ecosystra.
  </div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 40px rgba(15,23,42,0.08);border:1px solid #e2e8f0;">
        <tr><td style="height:4px;background:linear-gradient(90deg,#00FFCC,#0073ea);"></td></tr>
        <tr><td style="padding:28px 32px 8px 32px;">
          <p style="margin:0 0 6px 0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#64748b;font-weight:600;">Ecosystra · Video meeting</p>
          <h1 style="margin:0;font-size:22px;line-height:1.25;font-weight:700;color:#0f172a;">You’re invited to join a meeting</h1>
        </td></tr>
        <tr><td style="padding:8px 32px 0 32px;">
          <p style="margin:0;font-size:15px;line-height:1.6;color:#475569;">${greeting}</p>
          <p style="margin:16px 0 0 0;font-size:15px;line-height:1.6;color:#475569;"><strong style="color:#0f172a;">${escapeHtml(
            p.inviterName
          )}</strong> invited you to a scheduled video call for <strong style="color:#0f172a;">${escapeHtml(
    p.taskTitle
  )}</strong>. Use the secure link below to open the meeting preview and join when you’re ready.</p>
        </td></tr>
        <tr><td style="padding:24px 32px 8px 32px;">
          <table role="presentation" width="100%" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
            <tr><td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#64748b;width:120px">Task</td><td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;font-weight:500">${escapeHtml(
              p.taskTitle
            )}</td></tr>
            ${groupLine}
            <tr><td style="padding:10px 14px;font-size:13px;color:#64748b;width:120px;vertical-align:top">Room</td><td style="padding:10px 14px;font-size:12px;color:#0f172a;font-family:ui-monospace,monospace;word-break:break-all">${escapeHtml(
              p.roomId
            )}</td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:24px 32px 8px 32px;" align="center">
          <a href="${hrefSafe}" style="display:inline-block;padding:14px 28px;background:#0073ea;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:700;font-size:15px;letter-spacing:0.02em;">Join meeting</a>
        </td></tr>
        <tr><td style="padding:8px 32px 28px 32px;">
          <p style="margin:0;font-size:12px;line-height:1.6;color:#94a3b8;text-align:center;">If the button does not work, copy and paste this link into your browser:<br/><span style="word-break:break-all;color:#64748b;">${escapeHtml(
            p.joinUrl
          )}</span></p>
        </td></tr>
        <tr><td style="padding:16px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:11px;line-height:1.5;color:#94a3b8;text-align:center;">You received this because someone shared this meeting link with your address. Sign in to Ecosystra to join the call.</p>
          <p style="margin:10px 0 0 0;font-size:11px;color:#cbd5e1;text-align:center;">© ${new Date().getUTCFullYear()} Ecosystra · Delivered via Brevo</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

/** Transactional invite for ZEGOCLOUD video meeting — external recipients OK. */
export async function sendVideoMeetingInviteEmail(
  p: VideoMeetingInviteEmailPayload
): Promise<{ ok: boolean; message?: string }> {
  const key = apiKey()
  if (!key) {
    console.warn("[brevo] BREVO_API_KEY not set — skip meeting invite", p.toEmail)
    return { ok: false, message: "no_api_key" }
  }

  const senderEmail =
    process.env.BREVO_SENDER_EMAIL?.trim() || "noreply@example.com"
  const senderName = process.env.BREVO_SENDER_NAME?.trim() || "Ecosystra"
  const subject = `[Ecosystra] Meeting: ${p.taskTitle.slice(0, 80)}${p.taskTitle.length > 80 ? "…" : ""}`

  const htmlContent = buildVideoMeetingInviteHtml(p)

  const res = await fetch(`${BREVO_API}/smtp/email`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": key,
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: p.toEmail, name: p.toName?.trim() || p.toEmail }],
      subject,
      htmlContent,
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    console.error(
      "[brevo] meeting invite failed",
      res.status,
      p.toEmail,
      errText.slice(0, 400)
    )
    return { ok: false, message: errText }
  }
  console.info("[brevo] meeting invite sent", p.toEmail)
  return { ok: true }
}
