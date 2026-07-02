"use client";

import { useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { Eyebrow } from "@/components/eyebrow";
import { dictionary } from "@/lib/dictionaries/en";

function BrowserFrame({
  children,
  url,
  wide = false,
}: {
  children: React.ReactNode;
  url?: string;
  wide?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-[14px] border border-line bg-white shadow-soft">
      <div className="flex h-[30px] items-center gap-1.5 border-b border-line-soft bg-[#f6f6f4] px-3">
        <i className="h-2 w-2 rounded-full bg-[#d9d9d3]" />
        <i className="h-2 w-2 rounded-full bg-[#d9d9d3]" />
        <i className="h-2 w-2 rounded-full bg-[#d9d9d3]" />
        <span className="ml-2 flex h-[13px] max-w-[150px] flex-1 items-center rounded-full bg-[#ececea] px-2 font-mono text-[8px] tracking-[0.04em] text-[#a6a69e]">
          {url}
        </span>
      </div>
      <div className={`relative overflow-hidden bg-[#fcfcfb] ${wide ? "aspect-[1900/845]" : "aspect-[4/3]"}`}>
        {children}
      </div>
    </div>
  );
}

function ToolMockup({ type }: { type: string }) {
  const mockups = dictionary.work.mockups;
  if (type === "invoice") {
    return (
      <div className="mk-invoice absolute inset-0 flex items-center gap-[6%] px-[8%] py-[9%]">
        <div className="relative h-[80%] w-[34%] shrink-0">
          <div className="file f1">invoice_018</div>
          <div className="file f2">invoice_019</div>
          <div className="file f3">invoice_020</div>
          <div className="absolute bottom-[3%] left-1/2 h-[34%] w-[78%] -translate-x-1/2 rounded bg-[#fafaf8] shadow-inner before:absolute before:-top-[16%] before:left-0 before:h-[20%] before:w-[44%] before:rounded-t before:bg-[#eceae5] after:absolute after:left-0 after:top-0 after:h-1 after:w-full after:rounded-full after:bg-teal/45" />
        </div>
        <div className="grid h-[88%] flex-1 grid-cols-[13px_1fr_1fr_.82fr] overflow-hidden rounded border border-line bg-white">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className={`border-b border-r border-[#eeeeeb] ${i < 4 ? "bg-[#f0f0ed]" : ""}`}>
              {i % 4 === 0 ? <span className="flex h-full items-center justify-center font-mono text-[6px] text-[#b2b2aa]">{Math.floor(i / 4)}</span> : null}
              {i > 7 && i % 4 !== 0 ? <span className={`row-fill r${Math.floor(i / 4)}`} /> : null}
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (type === "calc") {
    return (
      <div className="mk-calc absolute inset-0 flex flex-col gap-2.5 px-[11%] py-[9%]">
        {[0, 1, 2].map((n) => (
          <div key={n} className={`qrow q${n + 1} flex items-center gap-2`}>
            <span className="h-1.5 w-[24%] rounded-full bg-[#e0e0da]" />
            <span className="h-2.5 w-5 rounded-full bg-[#ececea]" />
            <span className="sel h-2.5 w-5 rounded-full bg-[#ececea]" />
            <span className="h-2.5 flex-1 rounded bg-[#f0f0ed]"><i /></span>
          </div>
        ))}
        <div className="relative mt-auto h-[40%]">
          <div className="calcing absolute inset-0 flex items-center justify-center font-mono text-[10px] uppercase tracking-[0.1em] text-muted-2">
            {mockups.calculating}
          </div>
          <div className="result absolute inset-0 flex items-center justify-center gap-2.5">
            <div className="relative h-10 w-10">
              <svg viewBox="0 0 36 36" className="-rotate-90">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#e7e7e2" strokeWidth="4" />
                <circle className="donut" cx="18" cy="18" r="14" fill="none" stroke="var(--teal)" strokeWidth="4" strokeDasharray="88" strokeDashoffset="16" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-serif text-[10.5px]">82%</span>
            </div>
            <div className="flex flex-col">
              <b className="text-[10.5px]">{mockups.qualify}</b>
              <span className="font-mono text-[8px] text-teal">{mockups.leadSent}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="mk-gloss absolute inset-0 flex flex-col gap-2 px-[12%] py-[13%]">
      <span className="h-1.5 w-full rounded bg-[#e7e7e2]" />
      <span className="h-1.5 w-[88%] rounded bg-[#e7e7e2]" />
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-[28%] rounded bg-[#e7e7e2]" />
        <span className="term h-2 w-[22%] rounded-sm border-b-2 border-teal bg-teal/30" />
        <span className="h-1.5 flex-1 rounded bg-[#e7e7e2]" />
      </div>
      <span className="h-1.5 w-[70%] rounded bg-[#e7e7e2]" />
      <div className="tip absolute left-[44%] top-[12%] flex w-[44%] flex-col gap-1 rounded-lg bg-ink p-2.5 shadow-lg after:absolute after:bottom-[-5px] after:left-5 after:h-2.5 after:w-2.5 after:rotate-45 after:bg-ink">
        <b className="h-1.5 w-[40%] rounded bg-teal" />
        <i className="h-1 w-[90%] rounded bg-white/40" />
        <i className="h-1 w-[72%] rounded bg-white/40" />
      </div>
    </div>
  );
}

function PlayOnceVideo({ src, rate }: { src: string; rate: number }) {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { amount: 0.35 });

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.playbackRate = rate;
    if (inView) {
      void video.play();
    } else {
      video.pause();
    }
  }, [inView, rate]);

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      className="h-full w-full object-cover [filter:saturate(.6)_brightness(1.04)_contrast(.95)_sepia(.09)]"
    />
  );
}

export function WorkSection() {
  const { work } = dictionary;

  return (
    <section id="work" className="section-shell overflow-hidden before:[mask-image:radial-gradient(88%_64%_at_88%_6%,#000_0%,transparent_60%)] after:[mask-image:radial-gradient(96%_46%_at_26%_100%,#000_0%,transparent_64%)]">
      <style jsx global>{`
        @keyframes fileFly { 0% { opacity: 0; transform: translateY(-22px); } 12%, 65% { opacity: 1; transform: none; } 86%, 100% { opacity: 0; transform: translateY(38px) scale(.45); } }
        @keyframes rowFill { 0%, 32% { opacity: 0; transform: scaleX(.2); } 44%, 90% { opacity: 1; transform: scaleX(1); } 100% { opacity: 0; } }
        @keyframes qIn { 0% { opacity: 0; transform: translateY(4px); } 12%, 90% { opacity: 1; transform: none; } 100% { opacity: 0; } }
        @keyframes typeIn { 0%, 28% { width: 0; } 55%, 92% { width: 66%; } 100% { width: 0; } }
        @keyframes calcing { 0%, 40% { opacity: 0; } 48%, 58% { opacity: 1; } 66%, 100% { opacity: 0; } }
        @keyframes result { 0%, 62% { opacity: 0; } 70%, 94% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes term { 0%, 18%, 100% { background: rgba(84,179,148,.22); } 24%, 80% { background: rgba(84,179,148,.58); } }
        @keyframes tip { 0%, 24% { opacity: 0; transform: scale(.9) translateY(4px); } 34%, 82% { opacity: 1; transform: none; } 100% { opacity: 0; } }
        .file { position:absolute; left:8%; top:6%; width:84%; border:1px solid var(--line); border-radius:4px; background:white; padding:6px 7px 6px 19px; font:7.5px var(--font-plex-mono); color:#6f6f69; letter-spacing:.02em; animation:fileFly 6.5s ease infinite; box-shadow:0 4px 11px -6px rgba(0,0,0,.4); white-space:nowrap; overflow:hidden; }
        .file:before { content:""; position:absolute; left:7px; top:50%; transform:translateY(-50%); width:7px; height:9px; border-radius:1.5px; background:var(--teal); }
        .f2 { animation-delay:2s; } .f3 { animation-delay:4s; }
        .row-fill { display:block; height:3px; width:80%; margin:8px 4px; border-radius:2px; background:#e0e0da; transform-origin:left; animation:rowFill 6.5s ease infinite; }
        .r3 { background:var(--teal); opacity:.8; }
        .qrow { opacity:0; animation:qIn 7s ease infinite; }
        .q2 { animation-delay:.7s; } .q3 { animation-delay:1.4s; }
        .qrow i { display:block; height:4px; border-radius:2px; background:var(--teal); animation:typeIn 7s ease infinite; }
        .qrow .sel { animation:term 7s ease infinite; }
        .calcing { opacity:0; animation:calcing 7s ease infinite; }
        .result { opacity:0; animation:result 7s ease infinite; }
        .term { animation:term 4.6s ease infinite; }
        .tip { opacity:0; transform-origin:left bottom; animation:tip 4.6s ease infinite; }
        @media (prefers-reduced-motion: reduce) {
          .file, .row-fill, .qrow, .qrow i, .qrow .sel, .calcing, .result, .term, .tip { animation:none !important; opacity:1; }
        }
      `}</style>
      <Eyebrow>{work.eyebrow}</Eyebrow>
      <div className="mt-5 pb-[clamp(40px,6vh,64px)] text-center">
        <h2 className="serif-title mx-auto max-w-[18ch] text-[clamp(34px,4.8vw,58px)]">
          {work.title[0]} <em className="text-ink-soft">{work.title[1]}</em>{work.title[2]}
        </h2>
        <p className="mx-auto mt-4 max-w-[46ch] text-[16.5px] leading-[1.6] text-muted">{work.sub}</p>
      </div>

      <GroupLabel n="01">{work.groupTools}</GroupLabel>
      <div className="grid grid-cols-3 gap-[clamp(20px,2.6vw,32px)] max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
        {work.tools.map((item) => (
          <article key={item.title} className="flex flex-col gap-4">
            <BrowserFrame>
              <ToolMockup type={item.mockup} />
            </BrowserFrame>
            <CaseMeta tag={item.tag} title={item.title} text={item.text} />
          </article>
        ))}
      </div>

      <GroupLabel n="02">{work.groupWeb}</GroupLabel>
      <div className="grid grid-cols-3 gap-[clamp(20px,2.6vw,32px)] max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
        {work.webs.map((item) => (
          <article key={item.title} className="flex flex-col gap-4">
            <BrowserFrame url={item.url} wide>
              <PlayOnceVideo src={item.video} rate={item.rate} />
            </BrowserFrame>
            <CaseMeta
              tag={item.tag}
              title={item.title}
              text={item.text}
              collab={item.collab}
            />
          </article>
        ))}
      </div>
    </section>
  );
}

function GroupLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="mb-5 mt-[clamp(34px,5vh,52px)] flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-2 after:h-px after:flex-1 after:bg-line">
      <span className="text-teal">{n}</span>
      {children}
    </div>
  );
}

function CaseMeta({
  tag,
  title,
  text,
  link,
  href,
  collab,
}: {
  tag: string;
  title: string;
  text: string;
  link?: string;
  href?: string;
  collab?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className={`w-fit font-mono text-[10px] uppercase tracking-[0.14em] ${collab ? "text-muted-2" : "text-teal"}`}>
        {tag}
      </span>
      <h3 className="font-serif text-[22px] leading-[1.18] tracking-[-0.01em]">{title}</h3>
      <p className="text-[14.5px] leading-normal text-muted">{text}</p>
      {link ? (
        href ? (
          <a href={href} target="_blank" rel="noreferrer" className="hairline-link mt-0.5 w-fit font-mono text-[13.5px] tracking-[0.04em] text-muted-2">
            {link}
          </a>
        ) : (
          <span className="mt-0.5 w-fit border-b border-line pb-0.5 font-mono text-[13.5px] tracking-[0.04em] text-muted-2 opacity-55">
            {link}
          </span>
        )
      ) : null}
    </div>
  );
}
