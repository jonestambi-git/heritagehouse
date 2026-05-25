import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Location",
  description:
    "Find us at HeritageHouse Ministries, Port Harcourt. Service times, directions, and everything you need to plan your visit.",
  openGraph: {
    title: "Location | HeritageHouse Ministries",
    description:
      "Find us at HeritageHouse Ministries, Port Harcourt. Service times and directions.",
  },
};

export default function LocationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
