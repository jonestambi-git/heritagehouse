import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/lib/providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ag2choba.org';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Assemblies Of God Church | AG2 Choba, Port Harcourt",
    template: "%s | AG Church",
  },
  description:
    "A Spirit-filled community rooted in love, faith, and service. Join us for worship, sermons, and community in Port Harcourt, Rivers State.",
  keywords: [
    "church",
    "assemblies of god",
    "AG2 Choba",
    "Port Harcourt",
    "Rivers State",
    "worship",
    "sermons",
    "faith",
    "christian church",
    "pentecostal church",
    "live service",
    "church events",
    "bible study",
    "prayer",
  ],
  authors: [{ name: "Assemblies Of God Church" }],
  creator: "Assemblies Of God Church",
  publisher: "Assemblies Of God Church",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: siteUrl,
    siteName: "Assemblies Of God Church",
    title: "Assemblies Of God Church | AG2 Choba, Port Harcourt",
    description:
      "A Spirit-filled community rooted in love, faith, and service. Join us for worship, sermons, and community in Port Harcourt, Rivers State.",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Assemblies Of God Church",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Assemblies Of God Church | AG2 Choba, Port Harcourt",
    description:
      "A Spirit-filled community rooted in love, faith, and service.",
    images: [`${siteUrl}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
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
      className={cn("h-full", "antialiased", "font-sans")}
      style={
        {
          "--font-sans": '"Poppins", sans-serif',
          "--font-body": '"Inter", "Segoe UI", Arial, sans-serif',
        } as React.CSSProperties
      }
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          <div className="site-wrapper flex flex-col flex-1">
            <Navbar />
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
