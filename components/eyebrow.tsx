import { BrandDots } from "@/components/brand-dots";

export function Eyebrow({ children, align = "center" }: { children: string; align?: "center" | "left" }) {
  return (
    <div
      className={`mono-label flex items-center gap-3 text-[11.5px] text-faint ${
        align === "center" ? "justify-center" : "justify-start"
      }`}
    >
      <BrandDots small />
      <span>{children}</span>
    </div>
  );
}
