import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ministry",
  description: "Explore the ministries of Assemblies Of God Church — worship, youth, prayer, outreach, and more.",
  openGraph: {
    title: "Ministry | AG Church",
    description: "Explore the ministries of Assemblies Of God Church.",
  },
};

export default function MinistryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
