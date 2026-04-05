import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Watch Live",
  description: "Watch Assemblies Of God Church live — Sunday services, Bible study, and more streamed online.",
  openGraph: {
    title: "Watch Live | AG Church",
    description: "Join us online for live worship and the Word.",
  },
};

export default function LiveLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
