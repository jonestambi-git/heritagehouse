import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Give",
  description: "Support the work of Assemblies Of God Church through your generous giving.",
  openGraph: {
    title: "Give | AG Church",
    description: "Partner with us through your giving and help advance the Kingdom.",
  },
};

export default function GiveLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
