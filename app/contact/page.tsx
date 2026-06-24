import { Mail, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Eyebrow } from "@/components/eyebrow";
import { Footer } from "@/components/footer";
import { SiteNav } from "@/components/site-nav";
import { buttonVariants } from "@/components/ui/button";
import { dictionary } from "@/lib/dictionaries/en";

export default function ContactPage() {
  const { contact } = dictionary;
  const icons = [Mail, MessageCircle];

  return (
    <>
      <SiteNav />
      <main className="min-h-screen">
      <section className="section-shell overflow-hidden before:[mask-image:radial-gradient(86%_62%_at_50%_0%,#000_0%,transparent_62%)]">
        <Eyebrow>{contact.eyebrow}</Eyebrow>
        <div className="mt-5 text-center">
          <h1 className="serif-title mx-auto max-w-[14ch] text-[clamp(38px,5vw,60px)]">
            {contact.title[0]} <em className="text-ink-soft">{contact.title[1]}</em> {contact.title[2]}
          </h1>
          <p className="mx-auto mt-5 max-w-[58ch] text-[18px] leading-[1.6] text-muted">{contact.lede}</p>
        </div>
        <div className="mx-auto mt-14 grid max-w-[820px] grid-cols-2 gap-5 max-[600px]:grid-cols-1">
          {contact.channels.map((channel, index) => {
            const Icon = icons[index];
            const external = channel.href.startsWith("http");
            return (
              <a
                key={channel.label}
                href={channel.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                className="group rounded-[18px] border border-line bg-white/55 p-6 text-left shadow-soft transition hover:-translate-y-1 hover:border-teal/60"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal text-bg">
                  <Icon size={22} strokeWidth={1.8} />
                </span>
                <span className="mt-6 block font-mono text-[11px] uppercase tracking-[0.18em] text-muted-2">
                  {channel.label}
                </span>
                <span className="mt-2 block font-serif text-[28px] tracking-[-0.01em]">
                  {channel.value}
                </span>
              </a>
            );
          })}
        </div>
        <div className="mt-12 text-center">
          <Link href="/#hero" className={buttonVariants({ variant: "outline" })}>
            <span className="h-2 w-2 rounded-full bg-teal shadow-[0_0_0_4px_rgba(84,179,148,.18)]" />
            {contact.auditCta}
          </Link>
          <p className="mx-auto mt-4 max-w-[44ch] text-[14.5px] leading-normal text-muted-2">
            {contact.note}
          </p>
        </div>
      </section>
      </main>
      <Footer />
    </>
  );
}
