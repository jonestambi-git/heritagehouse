import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Mission",
  description: "Discover the mission and vision of Assemblies Of God Church — to love God and serve people.",
  openGraph: {
    title: "Our Mission | AG Church",
    description: "Love God, love to serve. The mission and vision of Assemblies Of God Church.",
  },
};

export default function MissionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
