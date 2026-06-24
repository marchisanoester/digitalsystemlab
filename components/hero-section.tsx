"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { createElement } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { dictionary } from "@/lib/dictionaries/en";
import { siteConfig } from "@/lib/site-config";

type Phase = "idle" | "speaking" | "choose" | "finals" | "done";

function useSplineRuntime() {
  useEffect(() => {
    if (customElements.get("spline-viewer") || document.querySelector("script[data-spline-viewer]")) return;
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@splinetool/viewer@1.9.48/build/spline-viewer.js";
    script.dataset.splineViewer = "true";
    document.head.appendChild(script);
  }, []);
}

function useStripSplineBadge(wrapper: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const timer = window.setInterval(() => {
      const viewer = wrapper.current?.querySelector("spline-viewer") as HTMLElement & { shadowRoot?: ShadowRoot };
      const badge = viewer?.shadowRoot?.querySelector('a[href*="spline.design"]');
      badge?.remove();
    }, 450);
    return () => window.clearInterval(timer);
  }, [wrapper]);
}

function DotMouth({ levelRef, active }: { levelRef: React.MutableRefObject<number>; active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 156 * dpr;
    canvas.height = 60 * dpr;
    canvas.style.width = "156px";
    canvas.style.height = "60px";
    ctx.scale(dpr, dpr);
    let raf = 0;
    let lastStep = 0;
    let heights = Array.from({ length: 13 }, () => 1);

    const draw = (time: number) => {
      if (time - lastStep > 85) {
        const energy = active ? Math.max(0.08, levelRef.current) : 0.02;
        heights = heights.map((_, index) => {
          const wave = Math.sin(time / 180 + index * 0.9) * 0.5 + 0.5;
          return active ? Math.max(1, Math.round(1 + wave * energy * 4)) : 1;
        });
        lastStep = time;
      }
      ctx.clearRect(0, 0, 156, 60);
      ctx.fillStyle = "rgba(255,255,255,.94)";
      for (let c = 0; c < 13; c += 1) {
        for (let r = 0; r < 5; r += 1) {
          const center = 2;
          const lit = Math.abs(r - center) <= Math.floor(heights[c] / 2);
          ctx.globalAlpha = lit ? 1 : 0.18;
          ctx.beginPath();
          ctx.arc(10 + c * 11, 10 + r * 9, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      levelRef.current *= 0.88;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [active, levelRef]);

  return <canvas ref={canvasRef} className="absolute left-1/2 top-[35%] z-10 w-[12%] min-w-[88px] -translate-x-1/2 -translate-y-1/2 scale-50 max-[860px]:top-[30%] max-[860px]:scale-[.4]" />;
}

function RobotFace({ speakingRef, active }: { speakingRef: React.MutableRefObject<number>; active: boolean }) {
  return (
    <div className={`pointer-events-none absolute inset-0 z-[3] transition-opacity duration-500 ${active ? "opacity-100" : "opacity-0"}`}>
      <div className="absolute left-1/2 top-[37%] aspect-[1.05] w-[31%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(50%_42%_at_50%_40%,rgba(5,7,9,1)_0%,rgba(5,7,9,.72)_45%,rgba(5,7,9,.28)_68%,transparent_85%)] opacity-55 blur-[5px] mix-blend-multiply max-[860px]:top-[32%]" />
      <DotMouth levelRef={speakingRef} active={active} />
      <div className="absolute left-[43.5%] top-[28%] aspect-[1.7] w-[7%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,.95)_0%,rgba(255,255,255,0)_70%)] blur-[5px] mix-blend-screen max-[860px]:top-[24%]" />
      <div className="absolute left-[56.5%] top-[28%] aspect-[1.7] w-[7%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,.95)_0%,rgba(255,255,255,0)_70%)] blur-[5px] mix-blend-screen max-[860px]:top-[24%]" />
    </div>
  );
}

function AuditConsole({ onClose, speakingRef }: { onClose: () => void; speakingRef: React.MutableRefObject<number> }) {
  const script = dictionary.hero.audit;
  const [phase, setPhase] = useState<Phase>("speaking");
  const [step, setStep] = useState(0);
  const [line, setLine] = useState(script.intro);
  const [shown, setShown] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const speak = useCallback(
    (text: string, after: Phase = "choose") => {
      setLine(text);
      setShown(0);
      setPhase("speaking");
      const words = text.split(" ");
      let index = 0;
      const timer = window.setInterval(() => {
        index += 1;
        speakingRef.current = Math.min(1, 0.35 + Math.random() * 0.65);
        setShown(index);
        if (index >= words.length) {
          window.clearInterval(timer);
          window.setTimeout(() => setPhase(after), 260);
        }
      }, 95);
      return () => window.clearInterval(timer);
    },
    [speakingRef],
  );

  useEffect(() => speak(`${script.intro} ${script.steps[0].q}`), [script.intro, script.steps, speak]);

  const choose = (label: string, ack: string) => {
    const nextAnswers = [...answers, label];
    setAnswers(nextAnswers);
    if (step === 0) {
      setStep(1);
      speak(`${ack} ${script.steps[1].q}`);
    } else {
      speak(`${ack} ${script.close}`, "finals");
    }
  };

  const finalAction = (kind: string) => {
    const summary = encodeURIComponent(`Quick audit: ${answers.join(" / ")}`);
    if (kind === "whatsapp" && siteConfig.whatsappUrl !== "#") {
      window.open(`${siteConfig.whatsappUrl}?text=${summary}`, "_blank", "noopener,noreferrer");
    }
    if (kind === "email") {
      window.location.href = `mailto:${siteConfig.email}?subject=Quick audit summary&body=${summary}`;
    }
    if (kind === "calendar" && siteConfig.calendarUrl !== "#") {
      window.open(siteConfig.calendarUrl, "_blank", "noopener,noreferrer");
    }
    speak(script.outro, "done");
  };

  const words = line.split(" ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96, x: "-50%" }}
      animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
      exit={{ opacity: 0, y: 10, scale: 0.96, x: "-50%" }}
      className="absolute bottom-6 left-1/2 z-20 w-[min(460px,calc(100%-28px))] rounded-[22px] border border-line bg-white/85 p-4 shadow-[0_14px_40px_rgba(15,15,16,.16)] backdrop-blur-md"
    >
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-teal shadow-[0_0_0_4px_rgba(84,179,148,.18)]" />
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">{script.label}</span>
        <button type="button" className="ml-auto h-6 w-6 rounded-lg text-faint hover:bg-ink/5 hover:text-ink" onClick={onClose}>
          ×
        </button>
      </div>
      <p className="mt-2 min-h-12 text-[15.5px] leading-[1.55] text-ink">
        {words.map((word, index) => (
          <span key={`${word}-${index}`} className={index < shown ? "opacity-100" : "opacity-0"}>
            {word}{" "}
          </span>
        ))}
      </p>
      <AnimatePresence mode="wait">
        {phase === "choose" ? (
          <motion.div
            key={`step-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={step === 0 ? "mt-3 grid grid-cols-2 gap-2 max-[520px]:grid-cols-1" : "mt-3 flex flex-wrap gap-2"}
          >
            {script.steps[step].options.map((option, index) => (
              <motion.button
                key={option.label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                type="button"
                className="rounded-full border border-line bg-white px-4 py-2 text-left text-[13.5px] font-semibold transition hover:-translate-y-px hover:border-teal/70"
                onClick={() => choose(option.label, option.ack)}
              >
                {option.label}
              </motion.button>
            ))}
          </motion.div>
        ) : null}
        {phase === "finals" ? (
          <motion.div key="finals" className="mt-3 flex flex-wrap gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {script.finals.map((option, index) => (
              <button
                key={option.label}
                type="button"
                className={`rounded-full border px-4 py-2 text-[13.5px] font-semibold transition hover:-translate-y-px ${
                  index < 2 ? "border-ink bg-ink text-bg hover:bg-[#2c2c2a]" : "border-line bg-transparent text-ink hover:border-teal/70"
                }`}
                onClick={() => finalAction(option.kind)}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        ) : null}
        {phase === "done" ? (
          <motion.div key="done" className="mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button
              type="button"
              className="rounded-full border border-line bg-white px-4 py-2 text-[13.5px] font-semibold transition hover:border-teal/70"
              onClick={() => {
                setStep(0);
                setAnswers([]);
                speak(`${script.intro} ${script.steps[0].q}`);
              }}
            >
              {script.again}
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

export function HeroSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const speakingRef = useRef(0);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [viewerReady, setViewerReady] = useState(false);
  const { hero } = dictionary;

  useSplineRuntime();
  useStripSplineBadge(wrapperRef);

  useEffect(() => {
    const timer = window.setTimeout(() => setViewerReady(true), 1100);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section id="hero" className="relative min-h-[calc(100svh-57px)] overflow-hidden">
      <style jsx>{`
        @keyframes spotlight {
          from { opacity: 0; transform: translate(-44%, -42%) scale(.62); }
          to { opacity: 1; transform: translate(-30%, -28%) scale(1); }
        }
        @keyframes robotIn {
          from { opacity: 0; transform: scale(2.7); transform-origin: 50% 28%; }
          to { opacity: 1; transform: scale(1); transform-origin: 50% 28%; }
        }
        .robot-model {
          transform: scale(0.92) translateY(3%);
          transform-origin: 50% 50%;
        }
        @media (max-width: 860px) {
          .robot-model {
            transform: scale(1.08) translateY(0);
            transform-origin: 50% 50%;
          }
        }
        .spotlight { animation: spotlight 2.2s ease .2s both; }
        .robot-enter { animation: robotIn 2.4s cubic-bezier(.2,.7,.2,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .spotlight, .robot-enter { animation: none !important; opacity: 1; transform: none; }
        }
      `}</style>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(27,27,26,.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(27,27,26,.05)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(110%_95%_at_18%_62%,#000_0%,rgba(0,0,0,.5)_38%,transparent_72%)]" />
      <svg className="spotlight pointer-events-none absolute left-[28%] top-[-7rem] z-[1] h-[169%] w-[96%] opacity-0 max-[760px]:left-[-40%] max-[760px]:top-[-5rem] max-[760px]:w-[155%]" viewBox="0 0 1200 900" aria-hidden="true">
        <defs>
          <radialGradient id="heroSpot" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#111" stopOpacity=".11" />
            <stop offset="58%" stopColor="#111" stopOpacity=".035" />
            <stop offset="100%" stopColor="#111" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="650" cy="440" rx="360" ry="430" fill="url(#heroSpot)" />
      </svg>
      <div className="relative z-[2] grid min-h-[calc(100svh-57px)] grid-cols-[minmax(0,1.02fr)_minmax(0,.98fr)] items-center gap-6 px-[clamp(22px,5vw,64px)] max-[860px]:grid-cols-1 max-[860px]:gap-0 max-[860px]:px-0 max-[860px]:pt-7">
        <div className="max-w-[560px] max-[860px]:mx-auto max-[860px]:px-[22px] max-[860px]:text-center">
          <h1 className="serif-title bg-[linear-gradient(to_bottom,#151514_0%,#3c3c39_62%,#6b6b66_100%)] bg-clip-text text-[clamp(40px,5.2vw,66px)] text-transparent max-[860px]:text-[clamp(33px,9vw,46px)]">
            {hero.titleA}
            <br />
            {hero.titleB}
          </h1>
          <p className="mt-6 max-w-[470px] text-[18.5px] leading-[1.6] text-muted max-[860px]:hidden">
            {hero.subtitle}
          </p>
          <div className="mt-10 flex items-center gap-5 max-[860px]:hidden">
            <button type="button" className="hairline-link text-[15px]" onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}>
              {hero.seeWork}
            </button>
          </div>
        </div>
        <div ref={wrapperRef} className="relative h-full min-h-[420px] max-[860px]:min-h-[470px] max-[860px]:w-full">
          <div className="absolute right-[-6%] top-[8%] h-[92%] w-[58%] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(15,15,16,.10)_0%,rgba(15,15,16,.04)_45%,transparent_72%)] blur-2xl" />
          <div className="absolute bottom-[6%] right-[6%] h-[9%] w-[44%] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(15,15,16,.22)_0%,rgba(15,15,16,.08)_55%,transparent_78%)] blur-[10px]" />
          <div className={`robot-enter absolute inset-0 z-[1] overflow-hidden transition-opacity duration-500 ${viewerReady ? "opacity-100" : "opacity-0"}`}>
            <div className="robot-model h-full w-full">
              {createElement("spline-viewer", {
                url: "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode",
                className: "block h-full w-full [filter:saturate(.8)_brightness(1.18)_contrast(.98)]",
              })}
            </div>
          </div>
          {!viewerReady ? (
            <div className="absolute inset-0 z-[2] flex items-center justify-center">
              <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-ink/10 border-t-ink/65" />
            </div>
          ) : null}
          <RobotFace speakingRef={speakingRef} active={consoleOpen} />
          <AnimatePresence>
            {consoleOpen ? (
              <AuditConsole speakingRef={speakingRef} onClose={() => setConsoleOpen(false)} />
            ) : (
              <motion.div
                key="cta"
                initial={{ opacity: 0, y: 10, x: "-50%" }}
                animate={{ opacity: 1, y: 0, x: "-50%" }}
                exit={{ opacity: 0, y: 8, x: "-50%" }}
                className="absolute bottom-6 left-1/2 z-20"
              >
                <Button variant="glass" onClick={() => setConsoleOpen(true)}>
                  <span className="h-2 w-2 rounded-full bg-teal shadow-[0_0_0_4px_rgba(84,179,148,.2)]" />
                  {hero.audit.cta}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="hidden px-[22px] pb-12 max-[860px]:block">
          <p className="text-[17px] leading-[1.65] text-muted">{hero.subtitle}</p>
          <Link href="/#work" className="hairline-link mt-6 inline-block text-[15px]">
            {hero.seeWork}
          </Link>
        </div>
      </div>
    </section>
  );
}
