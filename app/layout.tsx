import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ETNOS LAB | AI Automation, Web Development & Digital Solutions",
  description:
    "ETNOS LAB creates modern websites, custom software, automation systems and digital experiences that help businesses simplify processes, improve efficiency and grow.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="page-grid" />
        {children}
      </body>
    </html>
  );
}
