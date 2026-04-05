import type { Metadata } from "next";
import { Zalando_Sans_Expanded, DM_Sans, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const zalandoSansExpanded = Zalando_Sans_Expanded({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Assemblies Of God Church",
    template: "%s | AG Church",
  },
  description: "A Spirit-filled community rooted in love, faith, and service. Join us for worship, sermons, and community in Port Harcourt, Rivers State.",
  keywords: ["church", "assemblies of god", "Port Harcourt", "worship", "sermons", "faith"],
  openGraph: {
    type: "website",
    siteName: "Assemblies Of God Church",
    title: "Assemblies Of God Church",
    description: "A Spirit-filled community rooted in love, faith, and service.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Assemblies Of God Church",
    description: "A Spirit-filled community rooted in love, faith, and service.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", zalandoSansExpanded.variable, dmSans.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
