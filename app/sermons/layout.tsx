import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sermons",
  description: "Sermons, reflections, and pastoral letters from our leadership — written to be read slowly.",
  openGraph: {
    title: "Sermons | AG Church",
    description: "Words that last. Sermons and reflections from Assemblies Of God Church.",
  },
};

export default function SermonsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
