"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Eyebrow } from "@/components/eyebrow";
import { dictionary } from "@/lib/dictionaries/en";

function HighFiveRobots() {
  return (
    <div className="mx-auto my-8 h-[112px] w-[180px]">
      <style jsx>{`
        @keyframes lean {
          50% { transform: translateX(4px) rotate(2deg); }
        }
        @keyframes lean2 {
          50% { transform: translateX(-4px) rotate(-2deg); }
        }
        @keyframes burst {
          0%, 45% { opacity: 0; transform: scale(.45); }
          56% { opacity: 1; transform: scale(1); }
          82%, 100% { opacity: 0; transform: scale(1.6); }
        }
        @keyframes blink {
          0%, 42%, 47%, 100% { transform: scaleY(1); }
          44% { transform: scaleY(.15); }
        }
        .ours { transform-origin: 78px 72px; animation: lean 3.8s ease-in-out infinite; }
        .theirs { transform-origin: 108px 72px; animation: lean2 3.8s ease-in-out infinite; }
        .burst { transform-origin: 91px 36px; animation: burst 3.8s ease-in-out infinite; }
        .eye { transform-origin: center; animation: blink 3.8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .ours, .theirs, .burst, .eye { animation: none !important; opacity: 1; transform: none; }
        }
      `}</style>
      <svg viewBox="0 0 180 112" className="h-full w-full overflow-visible" aria-hidden="true">
        <g className="ours">
          <path d="M38 47c0-10 8-18 18-18h22c10 0 18 8 18 18v17c0 10-8 18-18 18H56c-10 0-18-8-18-18V47z" fill="var(--ink)" />
          <rect x="52" y="84" width="31" height="20" rx="7" fill="var(--ink)" />
          <path d="M51 43l-10-20" stroke="var(--ink)" strokeWidth="7" strokeLinecap="round" />
          <path d="M83 45l19-32" stroke="var(--ink)" strokeWidth="7" strokeLinecap="round" />
          <circle className="eye" cx="60" cy="56" r="5" fill="var(--bg)" />
          <circle className="eye" cx="77" cy="56" r="5" fill="var(--bg)" />
          <path d="M68 29V17" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
          <circle cx="68" cy="14" r="5" fill="var(--teal)" opacity=".75" />
        </g>
        <g className="theirs">
          <path d="M91 47c0-10 8-18 18-18h22c10 0 18 8 18 18v17c0 10-8 18-18 18h-22c-10 0-18-8-18-18V47z" fill="var(--bg)" stroke="var(--ink)" strokeWidth="4" />
          <rect x="105" y="84" width="31" height="20" rx="7" fill="var(--bg)" stroke="var(--ink)" strokeWidth="4" />
          <path d="M136 44l12-20" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round" />
          <path d="M104 45L85 13" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round" />
          <circle className="eye" cx="113" cy="56" r="5" fill="var(--ink)" />
          <circle className="eye" cx="130" cy="56" r="5" fill="var(--ink)" />
          <path d="M120 29V17" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
          <circle cx="120" cy="14" r="5" fill="var(--teal)" opacity=".75" />
        </g>
        <g className="burst" fill="none" stroke="var(--teal)" strokeLinecap="round">
          <circle cx="91" cy="36" r="4" fill="var(--teal)" stroke="none" />
          <circle cx="91" cy="36" r="18" strokeWidth="2" opacity=".65" />
          <path d="M91 8v10M91 54v10M64 36h10M108 36h10" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}

export function VentureLabsSection() {
  const { labs } = dictionary;

  return (
    <section id="venture-labs" className="section-shell overflow-hidden py-[clamp(88px,13vh,160px)] text-center before:[mask-image:radial-gradient(92%_62%_at_50%_0%,#000_0%,transparent_62%)]">
      <Eyebrow>{labs.eyebrow}</Eyebrow>
      <HighFiveRobots />
      <h2 className="serif-title mx-auto max-w-[14ch] text-[clamp(38px,5.2vw,62px)]">
        {labs.title[0]} <em className="text-ink-soft">{labs.title[1]}</em> {labs.title[2]}
      </h2>
      <p className="mx-auto mt-6 max-w-[64ch] text-[18px] leading-[1.6] text-muted">
        {labs.lede}
      </p>
      <div className="mx-auto mt-10 flex max-w-[980px] items-center justify-center gap-3 rounded-full border border-line bg-white/50 px-5 py-3 text-sm text-ink-soft max-[760px]:flex-col max-[760px]:rounded-[18px]">
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-2">
          <span className="h-1.5 w-1.5 rounded-full bg-yellow shadow-[0_0_0_5px_rgba(237,187,82,.18)]" />
          {labs.pillLabel}
        </span>
        <span>
          <b className="font-semibold text-ink">{labs.pillProject}</b> {labs.pillBodyA}{" "}
          <b className="font-semibold text-ink">{labs.pillCorporate}</b> {labs.pillBodyB}
        </span>
      </div>
      <div className="mt-12 flex items-center justify-center gap-5 max-[700px]:flex-col">
        <Link href="/contact" className={buttonVariants({ variant: "primary" })}>
          {labs.cta}
        </Link>
        <span className="text-[15px] text-muted">{labs.note}</span>
      </div>
    </section>
  );
}
