import { siteConfig } from "@/lib/site-config";

type BrandLogoProps = {
  variant?: "nav" | "footer";
};

export function BrandLogo({ variant = "nav" }: BrandLogoProps) {
  const isFooter = variant === "footer";
  const size =
    isFooter
      ? "h-auto w-[200px] max-[600px]:w-[184px]"
      : "h-auto w-[180px] max-[420px]:w-[150px]";

  return (
    <img
      src={isFooter ? siteConfig.logo.footerSrc : siteConfig.logo.src}
      alt={siteConfig.name}
      width={isFooter ? siteConfig.logo.footerWidth : siteConfig.logo.width}
      height={isFooter ? siteConfig.logo.footerHeight : siteConfig.logo.height}
      className={size}
    />
  );
}
