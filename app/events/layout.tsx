import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming services, prayer nights, youth programs, and outreach events at HeritageHouse Ministries.",
  openGraph: {
    title: "Events | HeritageHouse Ministries",
    description: "What's happening at HeritageHouse Ministries — services, prayer, youth, and outreach.",
  },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
