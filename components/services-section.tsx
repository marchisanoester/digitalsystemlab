"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, BotMessageSquare, Chrome, FileSpreadsheet, LayoutDashboard, Mail, PanelsTopLeft, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Eyebrow } from "@/components/eyebrow";
import { dictionary } from "@/lib/dictionaries/en";

const capIcons = [Mail, BotMessageSquare, Sparkles, PanelsTopLeft, FileSpreadsheet, LayoutDashboard, Chrome, BarChart3];

function ServiceIcon({ type }: { type: number }) {
  if (type === 0) {
    return (
      <svg viewBox="0 0 50 50" aria-hidden="true">
        <path d="M14 38V20h20V11" fill="none" stroke="currentColor" strokeWidth="2" opacity=".24" />
        <circle cx="14" cy="38" r="3.2" fill="currentColor" />
        <circle cx="14" cy="20" r="3.2" fill="currentColor" />
        <circle cx="34" cy="20" r="3.2" fill="currentColor" />
        <circle cx="34" cy="11" r="3.2" fill="currentColor" />
        <circle className="map-pulse" r="3" fill="var(--teal)" />
      </svg>
    );
  }
  if (type === 1) {
    return (
      <svg viewBox="0 0 50 50" aria-hidden="true">
        <path d="M14 31V19a11 11 0 0 1 22 0v12" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M14 31v6M36 31v6" stroke="var(--teal)" strokeWidth="2.6" strokeLinecap="round" />
        <circle className="mag-dot d1" cx="25" cy="8" r="2.5" />
        <circle className="mag-dot d2" cx="19" cy="4" r="2.2" />
        <circle className="mag-dot d3" cx="31" cy="4" r="2.2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 50 50" aria-hidden="true">
      <rect x="8" y="12" width="34" height="27" rx="4" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <path d="M8 19h34" stroke="currentColor" strokeWidth="2.2" />
      <path d="M24 23v12" stroke="var(--teal)" strokeWidth="2.4" className="web-sweep" />
      <rect x="19" y="28" width="10" height="4" rx="2" fill="var(--teal)" className="web-sweep" />
      <path d="M14 25h22M14 31h12" stroke="currentColor" strokeWidth="1.6" opacity=".18" />
    </svg>
  );
}

export function ServicesSection() {
  const [open, setOpen] = useState<number | null>(null);
  const [active, setActive] = useState(0);
  const rowRefs = useRef<Array<HTMLDivElement | null>>([]);
  const { services } = dictionary;

  useEffect(() => {
    const update = () => {
      const center = window.innerHeight / 2;
      let best = 0;
      let bestDistance = Infinity;
      rowRefs.current.forEach((row, index) => {
        if (!row) return;
        const rect = row.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - center);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = index;
        }
      });
      setActive(best);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section id="services" className="section-shell overflow-hidden">
      <style jsx global>{`
        @keyframes mapPulse {
          0% { transform: translate(14px, 38px); opacity: 0; }
          10% { opacity: 1; }
          35% { transform: translate(14px, 20px); }
          68% { transform: translate(34px, 20px); }
          100% { transform: translate(34px, 11px); opacity: 0; }
        }
        @keyframes magDrop {
          0% { transform: translateY(-8px); opacity: 0; }
          20%, 70% { opacity: 1; }
          100% { transform: translateY(12px); opacity: 0; }
        }
        @keyframes webSweep {
          0%, 100% { transform: translateX(-8px); }
          50% { transform: translateX(8px); }
        }
        @keyframes capScroll {
          to { transform: translateX(-50%); }
        }
        @keyframes capPulse {
          50% { opacity: 1; }
        }
        .map-pulse { animation: mapPulse 2.8s cubic-bezier(.5,0,.5,1) infinite; }
        .mag-dot { fill: currentColor; animation: magDrop 2.2s ease-in infinite; }
        .d2 { animation-delay: .5s; }
        .d3 { animation-delay: 1.05s; }
        .web-sweep { animation: webSweep 3.2s ease-in-out infinite; }
        .cap-row { animation: capScroll 46s linear infinite; }
        .cap-track:hover .cap-row { animation-play-state: paused; }
        .cap-accent { animation: capPulse 2.4s ease-in-out infinite; opacity: .45; }
        @media (prefers-reduced-motion: reduce) {
          .map-pulse, .mag-dot, .web-sweep, .cap-row, .cap-accent { animation: none !important; }
        }
      `}</style>
      <Eyebrow>{services.eyebrow}</Eyebrow>
      <div className="mt-5 pb-[clamp(40px,6vh,68px)] text-center">
        <h2 className="serif-title mx-auto max-w-[20ch] text-[clamp(34px,4.8vw,60px)]">
          {services.title[0]} <em className="text-ink-soft">{services.title[1]}</em> {services.title[2]}
        </h2>
      </div>

      <div className="border-t border-line">
        {services.items.map((item, index) => {
          const isOpen = open === index;
          const isActive = active === index;
          return (
            <div
              key={item.title}
              ref={(node) => {
                rowRefs.current[index] = node;
              }}
              className={`border-b border-line transition-opacity duration-500 ${
                isActive ? "opacity-100" : "opacity-40"
              }`}
            >
              <button
                type="button"
                className="grid w-full grid-cols-[56px_minmax(0,1fr)_auto] items-start gap-[clamp(18px,3vw,40px)] px-1 py-[clamp(26px,3.4vw,40px)] text-left max-[760px]:grid-cols-[46px_minmax(0,1fr)_auto] max-[760px]:gap-3 max-[760px]:px-0 max-[760px]:py-5"
                onClick={() => setOpen(isOpen ? null : index)}
                aria-expanded={isOpen}
              >
                <span className="flex flex-col items-start gap-3 pt-1">
                  <span className={`font-mono text-[13px] tracking-[0.05em] max-[760px]:text-[11px] ${isActive ? "text-teal" : "text-faint"}`}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="h-[50px] w-[50px] text-ink transition hover:scale-105 max-[760px]:h-11 max-[760px]:w-11">
                    <ServiceIcon type={index} />
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-baseline gap-3 font-serif text-[clamp(23px,2.7vw,33px)] leading-[1.12] tracking-[-0.015em] max-[760px]:text-[21px]">
                    {item.title}
                    {item.flag ? (
                      <span className="rounded-full border border-teal/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-teal">
                        {item.flag}
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-3 block max-w-xl text-[16.5px] leading-[1.55] text-muted max-[760px]:text-[15.5px]">
                    {item.summary}
                  </span>
                </span>
                <span
                  className={`relative h-[42px] w-[42px] shrink-0 rounded-full border transition ${
                    isOpen ? "border-ink bg-ink" : "border-line bg-transparent"
                  }`}
                >
                  <span className={`absolute left-1/2 top-1/2 h-0.5 w-3.5 -translate-x-1/2 -translate-y-1/2 ${isOpen ? "bg-bg" : "bg-ink"}`} />
                  <span
                    className={`absolute left-1/2 top-1/2 h-3.5 w-0.5 -translate-x-1/2 -translate-y-1/2 transition ${
                      isOpen ? "scale-y-0 bg-bg opacity-0" : "bg-ink opacity-100"
                    }`}
                  />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.48, ease: [0.2, 0.7, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-[56px_minmax(0,1fr)] gap-[clamp(18px,3vw,40px)] px-1 pb-[clamp(34px,4vw,48px)] max-[760px]:grid-cols-1 max-[760px]:px-0">
                      <span />
                      <div className="max-w-[620px]">
                        <p className="text-[17px] leading-[1.66] text-ink-soft">{item.body}</p>
                        <div className="mt-6 flex flex-col gap-2.5">
                          {item.examples.map((example) => (
                            <div
                              key={example.title}
                              className="grid grid-cols-[auto_1fr] items-baseline gap-3.5 rounded-xl border border-line-soft bg-white/50 px-4 py-3.5 max-[620px]:grid-cols-1"
                            >
                              <span className="w-fit rounded-md bg-teal/15 px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-[#2f7d63]">
                                Example
                              </span>
                              <p className="text-[15.5px] leading-normal text-muted">
                                <b className="font-semibold text-ink">{example.title}</b>{" "}
                                {example.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="mt-[clamp(48px,6vh,78px)] border-t border-line pt-[clamp(30px,4vh,44px)]">
        <div className="mb-[clamp(22px,3vh,30px)] flex items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-faint before:h-px before:w-[clamp(24px,8vw,70px)] before:bg-line after:h-px after:w-[clamp(24px,8vw,70px)] after:bg-line">
          {services.also}
        </div>
        <div className="cap-track overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_9%,#000_91%,transparent)]">
          <div className="cap-row flex w-max gap-3">
            {[...services.capabilities, ...services.capabilities].map((label, index) => {
              const Icon = capIcons[index % capIcons.length];
              return (
                <span
                  key={`${label}-${index}`}
                  className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-full border border-line bg-white/55 py-2.5 pl-3.5 pr-5 text-[14.5px] font-medium text-ink-soft"
                >
                  <Icon size={20} strokeWidth={1.7} />
                  <span className="cap-accent h-1.5 w-1.5 rounded-full bg-teal" />
                  {label}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
