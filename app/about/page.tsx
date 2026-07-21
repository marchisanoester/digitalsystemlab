import type { Metadata } from "next";
import { AboutClient } from "./about-client";

export const metadata: Metadata = {
  title: "About ETNOS LAB | AI Automation & Digital Product Studio",
  description:
    "Meet ETNOS LAB, a small studio building AI automations, modern websites, custom software and digital systems that simplify work for growing businesses.",
};

export default function AboutPage() {
  return <AboutClient />;
}
