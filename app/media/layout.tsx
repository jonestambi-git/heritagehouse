import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media",
  description:
    "Listen to audio messages on Spotify and watch recorded services on YouTube from HeritageHouse Ministries, Port Harcourt.",
  openGraph: {
    title: "Media | HeritageHouse Ministries",
    description:
      "Audio messages and video recordings from HeritageHouse Ministries, Port Harcourt.",
  },
};

export default function MediaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
