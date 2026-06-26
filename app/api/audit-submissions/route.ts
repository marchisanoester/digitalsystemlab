import { NextResponse } from "next/server";
import {
  listAuditSubmissions,
  saveAuditSubmission,
  type AuditAnswer,
} from "@/lib/audit-inbox";

export const runtime = "nodejs";

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function normalizeAnswers(value: unknown): AuditAnswer[] {
  if (!Array.isArray(value)) return [];

  return value.slice(0, 8).map((item) => {
    const answer = item as { question?: unknown; answer?: unknown };
    return {
      question: clean(answer.question, 600) || "Question not captured",
      answer: clean(answer.answer, 600) || "Answer not captured",
    };
  });
}

function storeErrorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "";

  if (message === "AUDIT_STORE_NOT_CONFIGURED") {
    return NextResponse.json(
      { error: "Audit inbox is not configured yet." },
      { status: 500 },
    );
  }

  console.error("Audit inbox error:", error);

  return NextResponse.json(
    { error: "Could not save the audit request." },
    { status: 502 },
  );
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

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Add a valid email address." }, { status: 400 });
  }

  try {
    const id =
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    await saveAuditSubmission({
      id,
      email,
      message: clean(payload.message, 5000),
      answers: normalizeAnswers(payload.answers),
      createdAt: new Date().toISOString(),
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json({ ok: true, id });
  } catch (error) {
    return storeErrorResponse(error);
  }
}

export async function GET(request: Request) {
  const password = process.env.POSTA_PASSWORD;
  const provided = request.headers.get("x-posta-password");

  if (!password || provided !== password) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const submissions = await listAuditSubmissions(100);
    return NextResponse.json({ submissions });
  } catch (error) {
    return storeErrorResponse(error);
  }
}
