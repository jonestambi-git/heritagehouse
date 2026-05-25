import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Mission",
  description: "Discover the mission and vision of HeritageHouse Ministries — to love God and serve people.",
  openGraph: {
    title: "Our Mission | HeritageHouse Ministries",
    description: "Love God, love to serve. The mission and vision of HeritageHouse Ministries.",
  },
};

export default function MissionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
