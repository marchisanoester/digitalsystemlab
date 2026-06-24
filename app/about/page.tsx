"use client";

import Image from "next/image";
import { Eyebrow } from "@/components/eyebrow";
import { Footer } from "@/components/footer";
import { SiteNav } from "@/components/site-nav";
import { dictionary } from "@/lib/dictionaries/en";

export default function AboutPage() {
  const { about } = dictionary;

  return (
    <>
      <SiteNav />
      <main className="min-h-screen">
      <section className="section-shell overflow-hidden before:[mask-image:radial-gradient(88%_64%_at_50%_0%,#000_0%,transparent_62%)]">
        <Eyebrow>{about.eyebrow}</Eyebrow>
        <div className="mt-5 text-center">
          <h1 className="serif-title mx-auto max-w-[15ch] text-[clamp(36px,5vw,60px)]">
            {about.title[0]} <em className="text-ink-soft">{about.title[1]}</em> {about.title[2]}
          </h1>
          <p className="mx-auto mt-5 max-w-[62ch] text-[17px] leading-[1.6] text-muted">{about.sub}</p>
        </div>
        <div className="mt-16 grid grid-cols-2 gap-[clamp(24px,4vw,54px)] max-[700px]:grid-cols-1">
          {about.people.map((person, index) => (
            <article key={person.name} className="group relative">
              <style jsx>{`
                @keyframes floatPose {
                  50% { transform: translateY(-5px); }
                }
                @keyframes beamSweep {
                  0% { transform: translateX(-130%) rotate(18deg); opacity: 0; }
                  30%, 62% { opacity: .55; }
                  100% { transform: translateX(130%) rotate(18deg); opacity: 0; }
                }
                .pose { animation: floatPose 5.5s ease-in-out ${index * 0.18}s infinite; }
                .beam { animation: beamSweep 2.4s cubic-bezier(.2,.7,.2,1) ${0.2 + index * 0.18}s both; }
                @media (prefers-reduced-motion: reduce) {
                  .pose, .beam { animation: none !important; }
                }
              `}</style>
              <div className="absolute inset-x-10 top-10 h-[70%] rounded-full bg-teal/10 blur-3xl opacity-0 transition group-hover:opacity-100" />
              <div className="pose relative overflow-hidden rounded-[18px] border border-line bg-white/45 shadow-soft transition duration-300 group-hover:-translate-y-1">
                <div className="absolute left-5 top-5 z-10 rounded-full bg-ink px-4 py-2 font-mono text-[11px] tracking-[0.18em] text-bg">
                  {person.number}
                </div>
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    sizes="(max-width: 700px) 90vw, 42vw"
                    className="object-cover grayscale-[.08] transition duration-[1800ms] group-hover:scale-[1.035]"
                    priority
                  />
                  <span className="beam pointer-events-none absolute -inset-y-10 left-0 w-1/3 bg-gradient-to-r from-transparent via-teal/25 to-transparent" />
                </div>
              </div>
              <div className="mt-6">
                <h2 className="font-serif text-[clamp(28px,3vw,36px)] leading-tight tracking-[-0.015em]">
                  {person.name}
                </h2>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-teal">
                  {person.role}
                </p>
                <p className="mt-3 text-[16px] leading-[1.58] text-muted">{person.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      </main>
      <Footer />
    </>
  );
}
