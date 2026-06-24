import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Systems Studio",
  description: "Simple digital systems, automations, tools and small software.",
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
