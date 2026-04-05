import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming services, prayer nights, youth programs, and outreach events at Assemblies Of God Church.",
  openGraph: {
    title: "Events | AG Church",
    description: "What's happening at Assemblies Of God Church — services, prayer, youth, and outreach.",
  },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
