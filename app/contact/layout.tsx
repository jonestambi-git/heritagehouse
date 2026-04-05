import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Assemblies Of God Church. Send a message, prayer request, or general inquiry.",
  openGraph: {
    title: "Contact | AG Church",
    description: "Reach out to us with questions, prayer requests, or to learn more about our community.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
