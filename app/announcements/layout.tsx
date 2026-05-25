import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Announcements | HeritageHouse Ministries, Port Harcourt",
  description: "Stay up to date with the latest announcements from HeritageHouse Ministries, Port Harcourt.",
};

export default function AnnouncementsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
