import type { Metadata } from "next";
import { sermons } from "@/lib/sermons-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sermon = sermons.find((s) => s.slug === slug);

  if (!sermon) return { title: "Sermon Not Found" };

  return {
    title: sermon.title,
    description: sermon.excerpt,
    openGraph: {
      title: `${sermon.title} | AG Church`,
      description: sermon.excerpt,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: sermon.title,
      description: sermon.excerpt,
    },
  };
}

export default function SermonLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
