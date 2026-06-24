"use client";

import { Beaker, Briefcase, Layers, Mail, Menu, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandDots } from "@/components/brand-dots";
import { dictionary } from "@/lib/dictionaries/en";
import { siteConfig } from "@/lib/site-config";

const items = [
  { label: dictionary.nav.services, href: "/#services", icon: Layers },
  { label: dictionary.nav.work, href: "/#work", icon: Briefcase },
  { label: dictionary.nav.labs, href: "/#venture-labs", icon: Beaker },
  { label: dictionary.nav.about, href: "/about", icon: User },
  { label: dictionary.nav.contact, href: "/contact", icon: Mail },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center gap-6 border-b border-line bg-bg/85 px-[clamp(20px,5vw,56px)] py-4 backdrop-blur-xl">
        <Link href="/" className="mr-auto flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <BrandDots />
          <span className="whitespace-nowrap text-[15px] font-semibold tracking-[-0.01em]">
            {siteConfig.name}
          </span>
        </Link>
        <div className="flex items-center gap-[30px] max-[720px]:hidden">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap text-[14.5px] transition hover:text-ink ${
                pathname === item.href ? "text-ink" : "text-muted-2"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="hidden h-9 w-9 items-center justify-center text-ink max-[720px]:flex"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={24} strokeWidth={1.8} /> : <Menu size={24} strokeWidth={1.8} />}
        </button>
      </nav>
      <button
        aria-label="Close menu"
        className={`fixed inset-0 z-40 bg-ink/20 transition ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`fixed right-0 top-[57px] z-50 flex w-[min(76vw,286px)] flex-col rounded-bl-[20px] border-b border-l border-white/50 bg-bg/75 p-3.5 shadow-[-8px_24px_60px_rgba(20,20,20,0.16)] backdrop-blur-2xl transition duration-300 ${
          open ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl border-b border-line-soft px-3 py-3 text-base font-medium text-muted-2 transition last:border-0 hover:bg-ink/[0.04] hover:text-ink"
              onClick={() => setOpen(false)}
            >
              <Icon size={18} strokeWidth={1.7} className="text-muted-2" />
              {item.label}
            </Link>
          );
        })}
      </aside>
    </>
  );
}
