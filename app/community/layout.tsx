import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community",
  description: "Meet the community of Assemblies Of God Church — a family built on faith, love, and service.",
  openGraph: {
    title: "Community | AG Church",
    description: "A family built on faith, love, and service in Port Harcourt.",
  },
};

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
