// Server component — fetches RSS feed at request time (ISR, revalidates every hour)
import type { Metadata } from "next";
import { getDailyPhoto } from "@/lib/church-photos";
import type { PodcastFeed } from "@/app/api/podcast-feed/route";
import MediaClient from "./MediaClient";

export const revalidate = 3600; // ISR: rebuild this page every hour

export const metadata: Metadata = {
  title: "Media",
  description:
    "Listen to audio messages and watch recorded services from HeritageHouse Ministries, Port Harcourt.",
};

function getTagText(xml: string, tag: string): string {
  const escaped = tag.replace(":", "\\:");
  const re = new RegExp(`<${escaped}[^>]*>([\\s\\S]*?)<\\/${escaped}>`, "i");
  const m = xml.match(re);
  return m ? m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim() : "";
}

function parseItems(xml: string) {
  const items = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = itemRe.exec(xml)) !== null) {
    const item = match[1];
    const enclosureRe = /<enclosure[^>]*url="([^"]*)"[^>]*type="audio[^"]*"/i;
    const enclosureMatch = item.match(enclosureRe);
    const audioUrl = enclosureMatch ? enclosureMatch[1] : "";
    const itunesImageRe = /<itunes:image[^>]*href="([^"]*)"/i;
    const itunesImageMatch = item.match(itunesImageRe);
    const image = itunesImageMatch ? itunesImageMatch[1] : "";
    const epNumStr = getTagText(item, "itunes:episode");
    const episodeNumber = epNumStr ? parseInt(epNumStr, 10) : null;
    const duration = getTagText(item, "itunes:duration");
    const guid = getTagText(item, "guid") || `ep-${index}`;
    const description =
      getTagText(item, "itunes:summary") || getTagText(item, "description") || "";
    const cleanDescription = description.replace(/<[^>]+>/g, "").trim();

    items.push({
      guid,
      title: getTagText(item, "title"),
      description: cleanDescription,
      pubDate: getTagText(item, "pubDate"),
      audioUrl,
      duration,
      image,
      episodeNumber,
    });
    index++;
  }
  return items;
}

async function getPodcastFeed(): Promise<PodcastFeed | null> {
  const RSS_URL =
    process.env.PODCAST_RSS_URL ?? "https://anchor.fm/s/111293d28/podcast/rss";

  try {
    const res = await fetch(RSS_URL, {
      next: { revalidate: 3600 },
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ChurchSite/1.0)",
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
    });

    if (!res.ok) return null;

    const xml = await res.text();
    const channelMatch = xml.match(/<channel>([\s\S]*?)<item>/i);
    const channelXml = channelMatch ? channelMatch[1] : xml;

    const itunesImgRe = /<itunes:image[^>]*href="([^"]*)"/i;
    const itunesImgMatch = channelXml.match(itunesImgRe);
    const imageUrlRe = /<image>[\s\S]*?<url>([\s\S]*?)<\/url>/i;
    const imageUrlMatch = channelXml.match(imageUrlRe);
    const channelImage =
      (itunesImgMatch ? itunesImgMatch[1] : "") ||
      (imageUrlMatch ? imageUrlMatch[1].trim() : "");

    return {
      title: getTagText(channelXml, "title")
        .replace(/^good options:\s*/i, "")
        .trim(),
      description:
        getTagText(channelXml, "itunes:summary") ||
        getTagText(channelXml, "description"),
      image: channelImage,
      link: getTagText(channelXml, "link"),
      episodes: parseItems(xml),
    };
  } catch {
    return null;
  }
}

export default async function MediaPage() {
  const bgUrl = getDailyPhoto(3);
  const feed = await getPodcastFeed();

  return <MediaClient bgUrl={bgUrl} feed={feed} />;
}
