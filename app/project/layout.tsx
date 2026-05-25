import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Community projects, outreach initiatives, and building programmes at HeritageHouse Ministries, Port Harcourt.",
  openGraph: {
    title: "Projects | HeritageHouse Ministries",
    description:
      "See how HeritageHouse Ministries is serving Port Harcourt and beyond through construction, outreach, education, and relief.",
  },
};

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
