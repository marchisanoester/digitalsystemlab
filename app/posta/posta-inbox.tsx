"use client";

import { RefreshCw } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

type AuditAnswer = {
  question: string;
  answer: string;
};

type AuditSubmission = {
  id: string;
  email: string;
  message: string;
  answers: AuditAnswer[];
  createdAt: string;
  userAgent?: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function PostaInbox() {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [submissions, setSubmissions] = useState<AuditSubmission[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const selected = useMemo(() => submissions[0], [submissions]);

  async function loadInbox(nextPassword = password) {
    setStatus("loading");
    setError("");

    const response = await fetch("/api/audit-submissions", {
      headers: { "x-posta-password": nextPassword },
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      setStatus("error");
      setError(data.error || "Could not open the inbox.");
      return;
    }

    setSubmissions(data.submissions || []);
    setUnlocked(true);
    setStatus("idle");
  }

  function submitPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void loadInbox(password);
  }

  return (
    <main className="min-h-screen px-5 py-8 text-ink">
      <section className="mx-auto max-w-[1120px]">
        <div className="mb-8 flex items-center justify-between gap-4 border-b border-line pb-5">
          <div>
            <p className="font-mono text-[12px] uppercase tracking-[0.24em] text-muted-2">
              Quick audit · posta
            </p>
            <h1 className="serif-title mt-3 text-[clamp(38px,6vw,74px)]">Audit inbox</h1>
          </div>
          {unlocked && (
            <button
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-4 py-2 text-[14px] text-muted transition hover:border-teal/60 hover:text-ink"
              type="button"
              onClick={() => void loadInbox()}
              disabled={status === "loading"}
            >
              <RefreshCw size={16} className={status === "loading" ? "animate-spin" : ""} />
              Refresh
            </button>
          )}
        </div>

        {!unlocked ? (
          <form
            className="mx-auto mt-20 max-w-[420px] rounded-[24px] border border-line bg-white/72 p-6 shadow-soft"
            onSubmit={submitPassword}
          >
            <label className="block text-[14px] font-semibold" htmlFor="posta-password">
              Password
            </label>
            <input
              id="posta-password"
              className="mt-3 w-full rounded-[16px] border border-line bg-white px-4 py-3 outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/15"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
            {error && <p className="mt-3 text-[14px] text-[#a8322a]">{error}</p>}
            <button
              className="mt-5 rounded-full bg-ink px-5 py-3 font-semibold text-bg transition hover:bg-ink-soft disabled:cursor-wait disabled:opacity-60"
              type="submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Opening..." : "Open posta"}
            </button>
          </form>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
            <aside className="rounded-[22px] border border-line bg-white/62 p-3 shadow-soft">
              <div className="px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-2">
                {submissions.length} messages
              </div>
              <div className="mt-2 space-y-2">
                {submissions.map((item) => (
                  <article key={item.id} className="rounded-[16px] border border-line bg-white p-4">
                    <p className="font-semibold">{item.email}</p>
                    <p className="mt-1 text-[13px] text-muted-2">{formatDate(item.createdAt)}</p>
                    <p className="mt-3 line-clamp-2 text-[14px] text-muted">
                      {item.message || item.answers.map((answer) => answer.answer).join(", ")}
                    </p>
                  </article>
                ))}
                {!submissions.length && (
                  <p className="px-3 py-10 text-center text-[14px] text-muted-2">
                    No audit requests yet.
                  </p>
                )}
              </div>
            </aside>

            <section className="rounded-[24px] border border-line bg-white/72 p-6 shadow-soft">
              {selected ? (
                <>
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-5">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-2">
                        Latest audit request
                      </p>
                      <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.01em]">
                        {selected.email}
                      </h2>
                    </div>
                    <time className="rounded-full border border-line bg-bg px-3 py-2 text-[13px] text-muted">
                      {formatDate(selected.createdAt)}
                    </time>
                  </div>
                  <div className="mt-6 space-y-5">
                    <div>
                      <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-2">
                        Audit answers
                      </h3>
                      <div className="mt-3 space-y-3">
                        {selected.answers.map((answer, index) => (
                          <div key={`${answer.question}-${index}`} className="rounded-[16px] border border-line bg-bg/70 p-4">
                            <p className="text-[14px] text-muted">{answer.question}</p>
                            <p className="mt-2 text-[18px] font-semibold">{answer.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-2">
                        Text me here
                      </h3>
                      <p className="mt-3 whitespace-pre-wrap rounded-[16px] border border-line bg-bg/70 p-4 text-[16px] leading-[1.6] text-muted">
                        {selected.message || "No message provided."}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex min-h-[360px] items-center justify-center text-center text-muted-2">
                  No audit requests yet.
                </div>
              )}
            </section>
          </div>
        )}
      </section>
    </main>
  );
}
