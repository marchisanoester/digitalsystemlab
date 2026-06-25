import { NextResponse } from "next/server";

export const runtime = "nodejs";

const RECIPIENT = "marchisano88@gmail.com";
const SUBJECT = "email me audit";

type AuditAnswer = {
  question?: unknown;
  answer?: unknown;
};

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatAnswers(answers: AuditAnswer[]) {
  if (!answers.length) return "No answers captured.";

  return answers
    .map((item, index) => {
      const question = clean(item.question, 600) || "Question not captured";
      const answer = clean(item.answer, 600) || "Answer not captured";
      return `${index + 1}. ${question}\n   Answer: ${answer}`;
    })
    .join("\n\n");
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const payload = body as {
    email?: unknown;
    message?: unknown;
    answers?: unknown;
  };

  const email = clean(payload.email, 320);
  const message = clean(payload.message, 5000);
  const answers = Array.isArray(payload.answers)
    ? (payload.answers as AuditAnswer[]).slice(0, 8)
    : [];

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Add a valid email address." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "Digital System Lab <onboarding@resend.dev>";

  if (!apiKey) {
    return NextResponse.json(
      { error: "Email service is not configured yet." },
      { status: 500 },
    );
  }

  const answersText = formatAnswers(answers);
  const text = [
    "New robot audit summary request.",
    "",
    `User email: ${email}`,
    "",
    "Audit answers:",
    answersText,
    "",
    "User note:",
    message || "(No message provided.)",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#181818">
      <h1 style="font-size:20px;margin:0 0 16px">New robot audit summary request</h1>
      <p><strong>User email:</strong> ${escapeHtml(email)}</p>
      <h2 style="font-size:16px;margin:22px 0 8px">Audit answers</h2>
      <pre style="white-space:pre-wrap;font-family:Arial,sans-serif;background:#f6f6f6;border:1px solid #dedede;border-radius:10px;padding:14px">${escapeHtml(answersText)}</pre>
      <h2 style="font-size:16px;margin:22px 0 8px">User note</h2>
      <p style="white-space:pre-wrap">${escapeHtml(message || "(No message provided.)")}</p>
    </div>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [RECIPIENT],
      subject: SUBJECT,
      reply_to: email,
      text,
      html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Resend email failed:", errorText);

    return NextResponse.json(
      { error: "Could not send the email." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
