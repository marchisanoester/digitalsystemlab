"use client";

import { siteConfig } from "@/lib/site-config";
import { useEffect, useRef, useState } from "react";

const sectionFrames = [
  { id: "s-hero", title: "Hero", src: "/reference/Hero - Robot 3D (Silver).html" },
  { id: "s-services", title: "Services", src: "/reference/Section - Services.html" },
  { id: "s-work", title: "Selected work", src: "/reference/Section - Selected Work.html" },
  { id: "s-labs", title: "Venture Labs", src: "/reference/Section - Venture Labs.html" },
];

const defaultBookingUrl = "https://calendar.app.google/PTFpXj6cZ84ajXDm6";

export function ReferenceLanding() {
  const frameRefs = useRef<Record<string, HTMLIFrameElement | null>>({});
  const robotAudioRef = useRef<HTMLAudioElement | null>(null);
  const lastRobotVoiceRef = useRef<{ text: string; at: number } | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const bookingUrl = process.env.NEXT_PUBLIC_GOOGLE_BOOKING_URL || defaultBookingUrl;

  useEffect(() => {
    const frames = Object.values(frameRefs.current).filter(Boolean) as HTMLIFrameElement[];
    const introLine = "Right — a quick audit. Three questions, no forms.";

    const voiceKey = (text: string) => {
      let h = 2166136261;
      for (let i = 0; i < text.length; i += 1) {
        h ^= text.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
      return `v-${(h >>> 0).toString(36)}`;
    };

    const playRobotVoice = (text: string) => {
      const now = Date.now();
      const last = lastRobotVoiceRef.current;
      if (last?.text === text && now - last.at < 1200) return;
      lastRobotVoiceRef.current = { text, at: now };

      try {
        if (robotAudioRef.current) {
          robotAudioRef.current.pause();
          robotAudioRef.current.currentTime = 0;
        }
        const audio = new Audio(`/reference/assets/robot-voice/${voiceKey(text)}.wav`);
        robotAudioRef.current = audio;
        audio.volume = 1;
        audio.playbackRate = 1.05;
        audio.play().catch(() => {
          // Browsers can still reject synthetic test clicks; a real user click unlocks this.
        });
      } catch {
        // The iframe still handles subtitles/mouth even if audio is unavailable.
      }
    };

    const onRobotVoice = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data as { type?: string; text?: string };
      if (data?.type === "robot-voice" && data.text) playRobotVoice(data.text);
    };

    const syncOne = (frame: HTMLIFrameElement) => {
      if (frame.id === "s-hero") return;
      try {
        const doc = frame.contentDocument;
        if (!doc?.body) return;
        frame.style.height = `${Math.max(doc.documentElement.scrollHeight, doc.body.scrollHeight)}px`;
      } catch {
        // Same-origin in production, but keep the reference assembly tolerant.
      }
    };

    const setupHeroHide = (frame: HTMLIFrameElement) => {
      let tries = 0;
      const timer = window.setInterval(() => {
        tries += 1;
        try {
          const doc = frame.contentDocument;
          const nav = doc?.querySelector("nav") as HTMLElement | null;
          const sliver = doc?.querySelector(".sliver") as HTMLElement | null;
          const cta = doc?.querySelector("[data-comment-anchor='audit-cta']") as HTMLElement | null;
          if (nav) nav.style.display = "none";
          if (sliver) sliver.style.display = "none";
          if (cta && !cta.dataset.parentVoiceWired) {
            cta.dataset.parentVoiceWired = "true";
            cta.addEventListener("pointerdown", () => playRobotVoice(introLine), { passive: true });
          }
          if ((nav && sliver && cta) || tries > 60) window.clearInterval(timer);
        } catch {
          window.clearInterval(timer);
        }
      }, 150);
    };

    const wire = (frame: HTMLIFrameElement) => {
      if (frame.id === "s-hero") {
        setupHeroHide(frame);
        return;
      }
      syncOne(frame);
      try {
        const doc = frame.contentDocument;
        if (!doc) return;
        const observer = new ResizeObserver(() => syncOne(frame));
        observer.observe(doc.documentElement);
        doc.addEventListener("click", () => window.setTimeout(() => syncOne(frame), 560), true);
      } catch {
        // Keep visual baseline resilient.
      }
    };

    frames.forEach((frame) => {
      wire(frame);
      frame.addEventListener("load", () => wire(frame));
    });

    let pollCount = 0;
    const poll = window.setInterval(() => {
      frames.forEach((frame) => syncOne(frame));
      pollCount += 1;
      if (pollCount > 40) window.clearInterval(poll);
    }, 300);

    const onResize = () => frames.forEach((frame) => syncOne(frame));
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        frames.forEach((frame) => {
          try {
            frame.contentWindow?.postMessage("host-scroll", "*");
          } catch {
            // no-op
          }
        });
        ticking = false;
      });
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("load", onResize);
    window.addEventListener("message", onRobotVoice);

    return () => {
      window.clearInterval(poll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("load", onResize);
      window.removeEventListener("message", onRobotVoice);
      if (robotAudioRef.current) {
        robotAudioRef.current.pause();
        robotAudioRef.current = null;
      }
    };
  }, []);

  const go = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 60, behavior: "smooth" });
    setDrawerOpen(false);
  };

  return (
    <main className="reference-landing">
      <style jsx global>{`
        .reference-landing {
          --bg: #fbfbfa;
          --ink: #1b1b1a;
          --muted: #5f5f5a;
          --muted-2: #76766f;
          --faint: #9a9a93;
          --teal: #54b394;
          --orange: #e9674c;
          --yellow: #edbb52;
          --line: rgba(20,20,20,0.10);
          background: var(--bg);
          color: var(--ink);
          font-family: "Hanken Grotesk", system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        .reference-landing * { box-sizing: border-box; }
        .topnav {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 16px clamp(20px, 5vw, 56px);
          background: rgba(251,251,250,0.86);
          -webkit-backdrop-filter: blur(12px);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--line);
        }
        .topnav .brand { display: flex; align-items: center; margin-right: auto; cursor: pointer; }
        .brand-logo { display: block; width: 180px; height: auto; }
        .topnav .links { display: flex; align-items: center; gap: 30px; }
        .topnav a, .topnav button.linkish {
          font-size: 14.5px;
          color: var(--muted-2);
          text-decoration: none;
          white-space: nowrap;
          transition: color .2s;
          cursor: pointer;
          border: 0;
          background: transparent;
          padding: 0;
        }
        .topnav a:hover, .topnav button.linkish:hover { color: var(--ink); }
        .burger { display: none; flex-direction: column; gap: 5px; border: 0; background: transparent; padding: 0; cursor: pointer; }
        .burger span { width: 22px; height: 1.6px; background: var(--ink); }
        .drawer {
          position: fixed;
          top: 57px;
          right: 0;
          width: min(76vw, 286px);
          z-index: 60;
          background: rgba(251,251,250,0.72);
          -webkit-backdrop-filter: blur(18px) saturate(1.4);
          backdrop-filter: blur(18px) saturate(1.4);
          border-left: 1px solid rgba(255,255,255,0.5);
          border-bottom: 1px solid rgba(255,255,255,0.5);
          border-radius: 0 0 0 20px;
          transform: translateX(100%);
          opacity: 0;
          transition: transform .32s cubic-bezier(.2,.7,.2,1), opacity .25s ease;
          display: flex;
          flex-direction: column;
          padding: 20px 14px;
          box-shadow: -8px 24px 60px rgba(20,20,20,0.16);
        }
        .drawer.open { transform: none; opacity: 1; }
        .drawer a, .drawer button {
          display: flex;
          align-items: center;
          gap: 13px;
          cursor: pointer;
          font-weight: 500;
          font-size: 16px;
          color: var(--muted-2);
          text-decoration: none;
          padding: 13px 12px;
          border-radius: 11px;
          transition: color .2s, background .2s;
          border: 0;
          background: transparent;
          text-align: left;
        }
        .drawer svg { width: 18px; height: 18px; color: var(--muted-2); flex-shrink: 0; }
        .drawer a:hover, .drawer button:hover { background: rgba(20,20,20,0.04); color: var(--ink); }
        .scrim {
          position: fixed;
          inset: 0;
          background: rgba(20,20,20,0.18);
          z-index: 55;
          opacity: 0;
          pointer-events: none;
          transition: opacity .3s;
        }
        .scrim.open { opacity: 1; pointer-events: auto; }
        @media (max-width: 720px) {
          .topnav .links { display: none; }
          .burger { display: flex; }
        }
        @media (max-width: 420px) {
          .brand-logo { width: 150px; }
        }
        iframe.sec { display: block; width: 100%; border: 0; background: var(--bg); }
        iframe#s-hero { height: 100vh; height: 100svh; }
        .footer { background: var(--ink); color: #d9d9d4; }
        .footer .inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          padding: 32px clamp(20px, 5vw, 64px);
          max-width: 1180px;
          margin: 0 auto;
        }
        .footer .left { display: flex; align-items: center; }
        .footer .brand-logo { width: 200px; }
        .footer .rights { font-family: "IBM Plex Mono", monospace; font-size: 11px; letter-spacing: 0.08em; color: #8a8a83; }
        .footer .socials { display: flex; gap: 12px; }
        .footer .socials a {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.16);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #e8e8e3;
          transition: border-color .2s, transform .15s, color .2s;
          text-decoration: none;
        }
        .footer .socials a:hover { border-color: var(--teal); color: #fff; transform: translateY(-1px); }
        .footer .socials svg { width: 18px; height: 18px; }
        @media (max-width: 600px) {
          .footer .inner { flex-direction: column; text-align: center; gap: 22px; }
        }
      `}</style>

      <nav className="topnav">
        <button type="button" className="brand" onClick={() => go("s-hero")} aria-label="Home">
          <img
            src={siteConfig.logo.src}
            alt={siteConfig.name}
            width={siteConfig.logo.width}
            height={siteConfig.logo.height}
            className="brand-logo"
          />
        </button>
        <div className="links">
          <button type="button" className="linkish" onClick={() => go("s-services")}>Services</button>
          <button type="button" className="linkish" onClick={() => go("s-work")}>Work</button>
          <button type="button" className="linkish" onClick={() => go("s-labs")}>Venture Labs</button>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </div>
        <button type="button" className="burger" aria-label="Open menu" onClick={() => setDrawerOpen(true)}>
          <span /><span /><span />
        </button>
      </nav>

      <button className={`scrim ${drawerOpen ? "open" : ""}`} aria-label="Close menu" onClick={() => setDrawerOpen(false)} />
      <aside className={`drawer ${drawerOpen ? "open" : ""}`}>
        <button type="button" onClick={() => go("s-services")}><IconStack />Services</button>
        <button type="button" onClick={() => go("s-work")}><IconBriefcase />Work</button>
        <button type="button" onClick={() => go("s-labs")}><IconBeaker />Venture Labs</button>
        <a href="/about"><IconUser />About</a>
        <a href="/contact"><IconMail />Contact</a>
      </aside>

      {sectionFrames.map((frame) => (
        <iframe
          key={frame.id}
          ref={(node) => {
            frameRefs.current[frame.id] = node;
          }}
          className="sec"
          id={frame.id}
          src={
            frame.id === "s-hero" && bookingUrl
              ? `${frame.src}?booking=${encodeURIComponent(bookingUrl)}`
              : frame.src
          }
          title={frame.title}
          scrolling="no"
          allow={frame.id === "s-hero" ? "autoplay" : undefined}
        />
      ))}

      <footer className="footer">
        <div className="inner">
          <div className="left">
            <img
              src={siteConfig.logo.footerSrc}
              alt={siteConfig.name}
              width={siteConfig.logo.footerWidth}
              height={siteConfig.logo.footerHeight}
              className="brand-logo"
            />
          </div>
          <span className="rights">© 2026 — All rights reserved</span>
          <div className="socials">
            <a href="#" aria-label="Instagram"><IconInstagram /></a>
            <a href="#" aria-label="LinkedIn"><IconLinkedIn /></a>
            <a href={siteConfig.socials.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp"><IconWhatsApp /></a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function IconStack() {
  return <svg viewBox="0 0 24 24" fill="none"><path d="M12 3l8 4.5-8 4.5-8-4.5L12 3zM4 12l8 4.5 8-4.5M4 16.5L12 21l8-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>;
}
function IconBriefcase() {
  return <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.7" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.7" /></svg>;
}
function IconBeaker() {
  return <svg viewBox="0 0 24 24" fill="none"><path d="M9 3v6l-4.5 8.5A2 2 0 0 0 6.3 21h11.4a2 2 0 0 0 1.8-2.5L15 9V3M8 3h8M9.5 14h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function IconUser() {
  return <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.7" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>;
}
function IconMail() {
  return <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" /><path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function IconInstagram() {
  return <svg viewBox="0 0 24 24" fill="none"><rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.7" /><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" /><circle cx="17" cy="7" r="1.2" fill="currentColor" /></svg>;
}
function IconLinkedIn() {
  return <svg viewBox="0 0 24 24" fill="none"><rect x="3.5" y="3.5" width="17" height="17" rx="3" stroke="currentColor" strokeWidth="1.7" /><path d="M7 10v7M7 7.2v.01M11 17v-4a2 2 0 0 1 4 0v4M11 10v7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>;
}
function IconWhatsApp() {
  return <svg viewBox="0 0 24 24" fill="none"><path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>;
}
