import { mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import { join } from "node:path";

const phrases = [
  "Right — a quick audit. Three questions, no forms.",
  "First: where does your team lose hours every week?",
  "Copying things between tools. Seen it a hundred times — and it’s the easiest to automate.",
  "Reports that build themselves are something of a speciality here.",
  "The same replies, over and over. A system can handle the repeats and leave you the real conversations.",
  "Invoices and forms. Tedious for a human, trivial for a system — and it never makes a typo.",
  "Fair — every team has its own time sink. The humans love an unusual one.",
  "How many people touch that process?",
  "A one-person bottleneck. Good news: small systems ship in weeks, not months.",
  "A small team. That’s real hours back, every single week.",
  "At that scale the waste compounds. So do the savings.",
  "My read: a strong candidate for a simple system. Want the humans to take a proper look?",
  "Done — I’ve left them a note. They’ll take it from here.",
];

function voiceKey(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `v-${(h >>> 0).toString(36)}`;
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit" });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited with ${code}`));
    });
  });
}

const outDirs = [
  join(process.cwd(), "public/reference/assets/robot-voice"),
  join(process.cwd(), "reference/assets/robot-voice"),
];

for (const outDir of outDirs) {
  await mkdir(outDir, { recursive: true });

  for (const phrase of phrases) {
    const key = voiceKey(phrase);
    const wav = join(outDir, `${key}.wav`);
    await run("/usr/bin/say", ["-v", "Daniel", "-r", "178", "-o", wav, "--data-format=LEI16@22050", phrase]);
  }
}
