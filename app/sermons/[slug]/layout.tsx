import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Sermon | ${slug} | HeritageHouse Ministries`,
    description: "Sermon detail",
    openGraph: {
      title: `Sermon | ${slug} | HeritageHouse Ministries`,
      description: "Sermon detail",
      type: "article",
    },
    twitter: {
      card: "summary",
      title: `Sermon | ${slug}`,
      description: "Sermon detail",
    },
  };
}

export default function SermonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
