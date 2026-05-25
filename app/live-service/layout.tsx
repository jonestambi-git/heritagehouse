import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Watch Live",
  description: "Watch HeritageHouse Ministries live — Sunday services, Bible study, and more streamed online.",
  openGraph: {
    title: "Watch Live | HeritageHouse Ministries",
    description: "Join us online for live worship and the Word.",
  },
};

export default function LiveLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
