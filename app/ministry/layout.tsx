import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ministry",
  description: "Explore the ministries of HeritageHouse Ministries — worship, youth, prayer, outreach, and more.",
  openGraph: {
    title: "Ministry | HeritageHouse Ministries",
    description: "Explore the ministries of HeritageHouse Ministries.",
  },
};

export default function MinistryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
