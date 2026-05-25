import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Give",
  description: "Support the work of HeritageHouse Ministries through your generous giving.",
  openGraph: {
    title: "Give | HeritageHouse Ministries",
    description: "Partner with us through your giving and help advance the Kingdom.",
  },
};

export default function GiveLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
