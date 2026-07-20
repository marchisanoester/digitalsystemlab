import { Instagram, Linkedin, MessageCircle } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { dictionary } from "@/lib/dictionaries/en";
import { siteConfig } from "@/lib/site-config";

const socials = [
  { label: dictionary.footer.socials.instagram, href: siteConfig.socials.instagram, icon: Instagram },
  { label: dictionary.footer.socials.linkedin, href: siteConfig.socials.linkedin, icon: Linkedin },
  { label: dictionary.footer.socials.whatsapp, href: siteConfig.socials.whatsapp, icon: MessageCircle },
];

export function Footer() {
  return (
    <footer className="bg-ink text-[#d9d9d4]">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-5 px-[clamp(20px,5vw,64px)] py-8 max-[600px]:flex-col max-[600px]:text-center">
        <Link href="/" className="flex items-center">
          <BrandLogo variant="footer" />
        </Link>
        <div className="text-center font-mono text-[11px] uppercase tracking-[0.08em] text-[#8a8a83]">
          <div>{dictionary.footer.rights}</div>
          <div className="mt-1">{dictionary.footer.built} · {dictionary.locale}</div>
        </div>
        <div className="flex gap-3">
          {socials.map((social) => {
            const Icon = social.icon;
            const external = social.href !== "#";
            return (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-[#e8e8e3] transition hover:-translate-y-px hover:border-teal hover:text-white"
              >
                <Icon size={18} strokeWidth={1.7} />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
