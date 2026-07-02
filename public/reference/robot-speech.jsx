/* robot-speech.jsx — speech layer for the hero robot.
   · AUDIT_SCRIPT  — all copy in one place (i18n-ready)
   · useDialogue   — word-timed subtitle engine + audit state machine
   · DotMouth      — dot-matrix mouth (canvas), quantized robot-like motion
   · EyeGlows      — soft pulses + blinks over the robot's real eyes (screen blend)
   · FaceRig       — positions mouth + eye glows over the visor (CSS vars, tweakable)
   · useHeadGestures — drives the Spline head with synthetic pointer events while talking
   · AuditConsole  — the CTA pill grown into subtitles + answer chips
   Loaded as text/babel after React; exports to window at the bottom. */

const { useState, useEffect, useRef, useCallback } = React;

/* ─── copy ─────────────────────────────────────────────────────────────── */
const AUDIT_SCRIPT = {
  cta: 'Ask me a quick audit',
  label: 'Quick audit · live',
  intro: 'Right — a quick audit. Three questions, no forms.',
  steps: [
    {
      q: 'First: where does your team lose hours every week?',
      options: [
        { label: 'Manual data entry',
          ack: 'Copying things between tools. Seen it a hundred times — and it\u2019s the easiest to automate.' },
        { label: 'Excel & Reports',
          ack: 'Reports that build themselves are something of a speciality here.' },
        { label: 'Answering the same messages',
          ack: 'The same replies, over and over. A system can handle the repeats and leave you the real conversations.' },
        { label: 'Invoices & paperwork',
          ack: 'Invoices and forms. Tedious for a human, trivial for a system — and it never makes a typo.' },
        { label: 'Something else',
          ack: 'Fair — every team has its own time sink. The humans love an unusual one.' },
      ],
    },
    {
      q: 'How many people touch that process?',
      options: [
        { label: 'Just me',
          ack: 'A one-person bottleneck. Good news: small systems ship in weeks, not months.' },
        { label: '2 to 10',
          ack: 'A small team. That\u2019s real hours back, every single week.' },
        { label: 'More than 10',
          ack: 'At that scale the waste compounds. So do the savings.' },
      ],
    },
  ],
  close: 'My read: a strong candidate for a simple system. Want the humans to take a proper look?',
  finals: [
    { id: 'whatsapp', label: 'WhatsApp them', primary: true },
    { id: 'call', label: 'Book a quick call', primary: true },
  ],
  outro: 'Done — I\u2019ve left them a note. They\u2019ll take it from here.',
  again: 'Run it again',
};

const BOOKING_URL = (() => {
  try {
    return new URLSearchParams(window.location.search).get('booking') || '';
  } catch (e) {
    return '';
  }
})();

const WHATSAPP_URL = 'https://wa.me/34647294703';

function openWhatsAppWindow() {
  const message = encodeURIComponent('Hi, I just ran the quick audit and would like to talk about a simple system.');
  const opened = (window.top || window).open(WHATSAPP_URL + '?text=' + message, 'digital-systems-whatsapp');
  if (opened) {
    try { opened.focus(); } catch (e) {}
    return true;
  }
  return false;
}

function openBookingWindow() {
  if (!BOOKING_URL) return false;
  const w = Math.min(980, Math.max(360, (window.screen && window.screen.availWidth ? window.screen.availWidth : window.innerWidth) - 80));
  const h = Math.min(760, Math.max(560, (window.screen && window.screen.availHeight ? window.screen.availHeight : window.innerHeight) - 80));
  const left = Math.max(0, ((window.screen && window.screen.availWidth ? window.screen.availWidth : window.innerWidth) - w) / 2);
  const top = Math.max(0, ((window.screen && window.screen.availHeight ? window.screen.availHeight : window.innerHeight) - h) / 2);
  const features = 'popup=yes,width=' + Math.round(w) + ',height=' + Math.round(h) + ',left=' + Math.round(left) + ',top=' + Math.round(top);
  const opened = (window.top || window).open(BOOKING_URL, 'digital-systems-booking', features);
  if (opened) {
    try { opened.focus(); } catch (e) {}
    return true;
  }
  return false;
}

/* ─── dialogue engine ──────────────────────────────────────────────────── */
/* Phases: idle → speaking → choose → … → finals → done.
   While speaking, words reveal one by one and speakingRef.level carries the
   mouth "energy" (decayed each frame by DotMouth). */
function useDialogue(script, speed) {
  const [phase, setPhase] = useState('idle');
  const [line, setLine] = useState('');
  const [vis, setVis] = useState(0);
  const [stepIx, setStepIx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const speakingRef = useRef({ level: 0 });
  const audioRef = useRef(null);
  const timers = useRef([]);
  const speedRef = useRef(1);
  speedRef.current = Math.max(0.3, speed || 1);

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const after = (ms, fn) => { timers.current.push(setTimeout(fn, ms)); };
  const voiceKey = (text) => {
    let h = 2166136261;
    for (let i = 0; i < text.length; i += 1) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return 'v-' + (h >>> 0).toString(36);
  };
  const stopVoice = () => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        if (audioRef.current.parentNode) audioRef.current.parentNode.removeChild(audioRef.current);
        audioRef.current = null;
      }
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    } catch (e) {}
  };
  const speakWebSpeech = (text) => {
    try {
      if (!('speechSynthesis' in window)) return;
      const u = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
      const voice = voices.find((v) => /^en[-_]/i.test(v.lang) && /Daniel|Arthur|Google UK English Male|Microsoft.*Guy|Alex/i.test(v.name))
        || voices.find((v) => /^en[-_]/i.test(v.lang))
        || voices[0];
      if (voice) u.voice = voice;
      u.lang = (voice && voice.lang) || 'en-US';
      u.rate = Math.max(0.75, Math.min(1.35, (speedRef.current || 1) * 0.84));
      u.pitch = 0.72;
      u.volume = 1;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  };
  const speakVoice = (text) => {
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'robot-voice', text: text }, '*');
        document.body.dataset.robotVoice = 'parent-audio';
        return;
      }
    } catch (e) {}
    try {
      if (document && document.createElement) {
        const a = document.createElement('audio');
        a.src = '/reference/assets/robot-voice/' + voiceKey(text) + '.wav';
        a.preload = 'auto';
        a.style.display = 'none';
        audioRef.current = a;
        const embedded = window.parent && window.parent !== window;
        a.volume = embedded ? 0.16 : 1;
        a.playbackRate = embedded ? 1.05 : Math.max(0.85, Math.min(1.18, (speedRef.current || 1) * 0.9));
        document.body.appendChild(a);
        document.body.dataset.robotVoice = 'audio-start';
        a.addEventListener('playing', () => { document.body.dataset.robotVoice = 'audio-playing'; }, { once: true });
        a.addEventListener('ended', () => {
          document.body.dataset.robotVoice = 'audio-ended';
          if (a.parentNode) a.parentNode.removeChild(a);
        }, { once: true });
        a.addEventListener('error', () => {
          document.body.dataset.robotVoice = 'audio-error';
          if (a.parentNode) a.parentNode.removeChild(a);
          speakWebSpeech(text);
        }, { once: true });
        const p = a.play();
        if (p && p.catch) p.catch((err) => {
          document.body.dataset.robotVoice = 'audio-blocked:' + ((err && err.name) || 'unknown');
          speakWebSpeech(text);
        });
        return;
      }
    } catch (e) {}
    speakWebSpeech(text);
  };

  const speak = useCallback((segments, thenPhase) => {
    clear();
    stopVoice();
    setPhase('speaking');
    let segIx = 0;
    const nextSeg = () => {
      if (segIx >= segments.length) { speakingRef.current.level = 0; setPhase(thenPhase); return; }
      const text = segments[segIx++];
      const words = text.split(/\s+/);
      setLine(text); setVis(0);
      speakVoice(text);
      let w = 0;
      const tickWord = () => {
        if (w >= words.length) {
          speakingRef.current.level = 0;
          after((980 + words.length * 52) / speedRef.current, nextSeg);
          return;
        }
        const word = words[w++];
        setVis(w);
        /* burst of mouth energy, roughly proportional to the word */
        speakingRef.current.level = Math.min(1, 0.45 + 0.08 * word.length + Math.random() * 0.25);
        let d = 110 + 42 * word.length;
        if (/[.,;:—?!…]$/.test(word)) d += 320;
        after(Math.min(d, 560) / speedRef.current, tickWord);
      };
      tickWord();
    };
    nextSeg();
  }, []);

  const start = useCallback(() => {
    setStepIx(0);
    setAnswers([]);
    speak([script.intro, script.steps[0].q], 'choose');
  }, [speak]);

  const choose = useCallback((opt) => {
    const next = stepIx + 1;
    setAnswers((prev) => prev.concat([{ question: script.steps[stepIx].q, answer: opt.label }]));
    if (next < script.steps.length) {
      setStepIx(next);
      speak([opt.ack, script.steps[next].q], 'choose');
    } else {
      speak([opt.ack, script.close], 'finals');
    }
  }, [stepIx, speak]);

  const finish = useCallback((opt) => {
    if (opt && opt.id === 'whatsapp') {
      clear();
      stopVoice();
      speakingRef.current.level = 0;
      const opened = openWhatsAppWindow();
      const text = opened
        ? 'WhatsApp opened — send the humans your audit.'
        : 'WhatsApp could not open. Please allow popups and try again.';
      setLine(text);
      setVis(text.split(/\s+/).length);
      setPhase('done');
      return;
    }
    if (opt && opt.id === 'call') {
      clear();
      stopVoice();
      speakingRef.current.level = 0;
      const opened = openBookingWindow();
      const text = opened
        ? 'Calendar opened — pick a time that works for you.'
        : 'Calendar could not open. Please allow popups and try again.';
      setLine(text);
      setVis(text.split(/\s+/).length);
      setPhase('done');
      return;
    }
    speak([script.outro], 'done');
  }, [speak]);

  const reset = useCallback(() => {
    clear(); stopVoice(); speakingRef.current.level = 0;
    setPhase('idle'); setLine(''); setVis(0); setStepIx(0);
    setAnswers([]);
  }, []);

  useEffect(() => () => { clear(); stopVoice(); }, []);

  return {
    phase, line, vis, step: script.steps[stepIx], answers,
    start, choose, finish, reset, speakingRef,
    speaking: phase === 'speaking',
  };
}

/* ─── dot-matrix mouth ─────────────────────────────────────────────────── */
/* 13×5 LED-style grid. Columns rise and fall around the center row in
   quantized steps (~85ms) so the motion reads mechanical, not fluid.
   Idle (between lines): a dim center row — a closed mouth. */
function DotMouth({ speakingRef }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    const COLS = 13, ROWS = 5, MIDR = (ROWS - 1) / 2;
    const heights = new Array(COLS).fill(0);
    const targets = new Array(COLS).fill(0);
    let raf, lastStep = 0, lvl = 0;

    const size = () => {
      const w = cv.clientWidth || 80, h = w * 0.42;
      const dpr = window.devicePixelRatio || 1;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    };
    const ro = new ResizeObserver(size); ro.observe(cv); size();

    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      const target = speakingRef.current.level || 0;
      lvl += (target - lvl) * 0.3;
      speakingRef.current.level = target * 0.93; /* decay the burst */

      if (now - lastStep > 85) { /* quantized, robot-like steps */
        lastStep = now;
        for (let c = 0; c < COLS; c++) {
          const center = 1 - Math.abs(c - (COLS - 1) / 2) / ((COLS - 1) / 2);
          const env = 0.22 + 0.78 * center;
          const amp = lvl * env * (0.5 + Math.random() * 0.75);
          targets[c] = Math.min(MIDR, Math.round(amp * (MIDR + 0.6)));
        }
      }
      for (let c = 0; c < COLS; c++) heights[c] += (targets[c] - heights[c]) * 0.55;

      const dpr = window.devicePixelRatio || 1;
      const W = cv.width / dpr, H = cv.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const gx = W / (COLS + 1), gy = H / (ROWS + 1);
      const r = Math.max(1.05, Math.min(gx, gy) * 0.27);
      for (let c = 0; c < COLS; c++) {
        for (let rw = 0; rw < ROWS; rw++) {
          const dRow = Math.abs(rw - MIDR);
          const lit = dRow <= heights[c] + 0.25;
          let a = lit ? 0.92 : 0.09; /* unlit dots barely read, like an off LED */
          if (dRow === 0 && lvl < 0.05) a = 0.55; /* closed mouth = dim center line */
          ctx.beginPath();
          ctx.fillStyle = 'rgba(245,248,247,' + a + ')';
          ctx.shadowColor = 'rgba(255,255,255,0.85)';
          ctx.shadowBlur = lit ? 4 : 0;
          ctx.arc(gx * (c + 1), gy * (rw + 1), r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
  return <canvas ref={ref} className="mouth-canvas" aria-hidden="true"></canvas>;
}

/* ─── eye glows: pulse with speech, blink now and then ─────────────────── */
function EyeGlows({ speakingRef }) {
  const l = useRef(null), r = useRef(null);
  useEffect(() => {
    let raf, blinkAt = performance.now() + 2600, blinkT = -9999;
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      const lvl = speakingRef.current.level || 0;
      let o = 0.22 + lvl * 0.55;
      if (now > blinkAt) { blinkT = now; blinkAt = now + 2400 + Math.random() * 3800; }
      const dt = now - blinkT;
      if (dt >= 0 && dt < 150) o *= dt < 75 ? 1 - dt / 75 : (dt - 75) / 75;
      if (l.current) { l.current.style.opacity = o; r.current.style.opacity = o; }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <React.Fragment>
      <div ref={l} className="eye-glow l"></div>
      <div ref={r} className="eye-glow r"></div>
    </React.Fragment>
  );
}

/* ─── face rig: anchors mouth + eyes over the visor ────────────────────── */
/* d = desktop offsets {dx,dy,scale}, m = mobile offsets (applied via the 860px
   media query). trackRef carries the synthetic head-look target so the whole
   rig rides the head's motion with a slight natural lag. */
function FaceRig({ speakingRef, on, d = {}, m = {}, eyes = true, guide = false, shade = 0.45, follow = 20, trackRef }) {
  const rigRef = useRef(null);
  const gainRef = useRef(follow);
  gainRef.current = follow;
  useEffect(() => {
    const el = rigRef.current; if (!el) return;
    let raf, cx = 0, cy = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const g = (trackRef && trackRef.current) || { dx: 0, dy: 0 };
      const gain = gainRef.current || 0;
      cx += (g.dx * gain - cx) * 0.07;
      cy += (g.dy * gain * 0.6 - cy) * 0.07;
      el.style.transform = 'translate(' + cx.toFixed(3) + '%, ' + cy.toFixed(3) + '%)';
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  const cls = 'face-rig' + (on ? ' on' : '') + (guide ? ' guide' : '');
  const fmt = (v) => { const n = Number(v) || 0; return (n >= 0 ? '+' : '') + n; };
  const sc = (v) => '×' + Number(v == null ? 1 : v).toFixed(2);
  return (
    <div ref={rigRef} className={cls} style={{
      '--twd-dx': (d.dx || 0) + '%', '--twd-dy': (d.dy || 0) + '%', '--twd-scale': d.scale == null ? 1 : d.scale,
      '--twm-dx': (m.dx || 0) + '%', '--twm-dy': (m.dy || 0) + '%', '--twm-scale': m.scale == null ? 1 : m.scale,
      '--shade': shade,
    }}>
      {eyes && <EyeGlows speakingRef={speakingRef} />}
      <div className="mouth-shade"></div>
      <DotMouth speakingRef={speakingRef} />
      {guide && (
        <div className="rig-readout">
          D {fmt(d.dx)} {fmt(d.dy)} {sc(d.scale)} · M {fmt(m.dx)} {fmt(m.dy)} {sc(m.scale)}
        </div>
      )}
    </div>
  );
}

/* ─── head gestures ────────────────────────────────────────────────────── */
/* The Spline head looks at the cursor. While the robot talks we mute real
   pointer input and feed it a slow synthetic wander around the canvas center,
   so the head (and its real eyes) face the viewer with subtle living motion. */
function useHeadGestures(viewerRef, active, gestureRef) {
  useEffect(() => {
    if (!active) return;
    const v0 = viewerRef.current;
    if (v0) v0.style.pointerEvents = 'none';
    const t0 = performance.now();
    const iv = setInterval(() => {
      const vv = viewerRef.current; if (!vv) return;
      let cv = null;
      try { cv = vv.shadowRoot && vv.shadowRoot.querySelector('canvas'); } catch (e) {}
      const target = cv || vv;
      const rect = target.getBoundingClientRect();
      if (!rect.width) return;
      const t = (performance.now() - t0) / 1000;
      const fx = 0.5 + 0.07 * Math.sin(t * 0.7) + 0.03 * Math.sin(t * 1.9 + 1.3);
      const fy = 0.44 + 0.05 * Math.sin(t * 1.1 + 0.6) + 0.02 * Math.sin(t * 2.7);
      if (gestureRef) gestureRef.current = { dx: fx - 0.5, dy: fy - 0.44 };
      const opts = {
        clientX: rect.left + rect.width * fx,
        clientY: rect.top + rect.height * fy,
        bubbles: true, composed: true,
      };
      try {
        target.dispatchEvent(new PointerEvent('pointermove', opts));
        target.dispatchEvent(new MouseEvent('mousemove', opts));
        document.dispatchEvent(new PointerEvent('pointermove', opts));
        document.dispatchEvent(new MouseEvent('mousemove', opts));
        window.dispatchEvent(new PointerEvent('pointermove', opts));
        window.dispatchEvent(new MouseEvent('mousemove', opts));
      } catch (e) {}
    }, 33);
    return () => {
      clearInterval(iv);
      if (gestureRef) gestureRef.current = { dx: 0, dy: 0 };
      const vv = viewerRef.current;
      if (vv) vv.style.pointerEvents = '';
    };
  }, [active]);
}

/* ─── the console: CTA pill → subtitles + answer chips ─────────────────── */
function AuditConsole({ d, script }) {
  if (d.phase === 'idle') {
    return (
      <button className="robot-cta" onClick={d.start} data-comment-anchor="audit-cta">
        <span className="pip"></span>{script.cta}
      </button>
    );
  }
  const words = d.line ? d.line.split(/\s+/) : [];
  return (
    <div className="console" data-comment-anchor="audit-console">
      <div className="convo-top">
        <span className={'pip' + (d.speaking ? ' talk' : '')}></span>
        <span className="convo-label">{script.label}</span>
        <span style={{ flex: 1 }}></span>
        <button className="convo-x" onClick={d.reset} aria-label="Close">×</button>
      </div>
      <p className="subtitle">
        {words.map((w, i) => (
          <span key={d.line + '-' + i} className={'w' + (i < d.vis ? ' on' : '')}>{w + ' '}</span>
        ))}
      </p>
      {d.phase === 'choose' && (
        <div className={'chips' + (d.step.options.length > 3 ? ' grid2' : '')}>
          {d.step.options.map((o, i) => (
            <button key={o.label} className="chip" style={{ animationDelay: i * 70 + 'ms' }}
              onClick={() => d.choose(o)}>{o.label}</button>
          ))}
        </div>
      )}
      {d.phase === 'finals' && (
        <div className="chips">
          {script.finals.map((o, i) => (
            <button key={o.label} className={'chip' + (o.primary ? ' primary' : '')}
              style={{ animationDelay: i * 70 + 'ms' }} onClick={() => d.finish(o)}>{o.label}</button>
          ))}
        </div>
      )}
      {d.phase === 'done' && (
        <div className="chips">
          <button className="chip ghost" onClick={d.start}>{script.again}</button>
        </div>
      )}
    </div>
  );
}

Object.assign(window, {
  AUDIT_SCRIPT, BOOKING_URL, WHATSAPP_URL, openBookingWindow, openWhatsAppWindow, useDialogue, DotMouth, EyeGlows, FaceRig, useHeadGestures, AuditConsole,
});
