import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sermons",
  description: "Sermons, reflections, and pastoral letters from our leadership — written to be read slowly.",
  openGraph: {
    title: "Sermons | HeritageHouse Ministries",
    description: "Words that last. Sermons and reflections from HeritageHouse Ministries.",
  },
};

export default function SermonsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
