import { NextResponse } from "next/server";

export interface YouTubeVideo {
  videoId: string;
  title: string;
  published: string;
  updated: string;
  thumbnail: string;
  channelName: string;
  channelUrl: string;
  description: string;
}

export interface YouTubeFeed {
  channelId: string;
  channelName: string;
  channelUrl: string;
  videos: YouTubeVideo[];
}

// ─── XML helpers ──────────────────────────────────────────────────────────────

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\:]/g, (c) => "\\" + c);
}

function getTagText(xml: string, tag: string): string {
  const escaped = escapeRegex(tag);
  const re = new RegExp(`<${escaped}[^>]*>([\\s\\S]*?)<\\/${escaped}>`, "i");
  const m = xml.match(re);
  return m ? m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim() : "";
}

function getAttr(xml: string, tag: string, attr: string): string {
  const escaped = escapeRegex(tag);
  const re = new RegExp(`<${escaped}[^>]*\\s${attr}="([^"]*)"`, "i");
  const m = xml.match(re);
  return m ? m[1].trim() : "";
}

function parseEntries(xml: string): YouTubeVideo[] {
  const videos: YouTubeVideo[] = [];
  const entryRe = /<entry>([\s\S]*?)<\/entry>/gi;
  let match: RegExpExecArray | null;

  while ((match = entryRe.exec(xml)) !== null) {
    const entry = match[1];
    const videoId = getTagText(entry, "yt:videoId");
    if (!videoId) continue;

    const thumbnail =
      getAttr(entry, "media:thumbnail", "url") ||
      `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    const mediaGroupMatch = entry.match(/<media:group>([\s\S]*?)<\/media:group>/i);
    const mediaGroup = mediaGroupMatch ? mediaGroupMatch[1] : "";
    const description = getTagText(mediaGroup, "media:description");

    const authorMatch = entry.match(/<author>([\s\S]*?)<\/author>/i);
    const authorXml = authorMatch ? authorMatch[1] : "";
    const channelName = getTagText(authorXml, "name");
    const channelUrl = getTagText(authorXml, "uri");

    videos.push({
      videoId,
      title: getTagText(entry, "title"),
      published: getTagText(entry, "published"),
      updated: getTagText(entry, "updated"),
      thumbnail,
      channelName,
      channelUrl,
      description: description.slice(0, 300),
    });
  }

  return videos;
}

// ─── Fetch with retry ─────────────────────────────────────────────────────────

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3,
  delayMs = 500,
): Promise<Response> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);

      // Retry on 429 (rate limit) or 5xx (server errors), but not 4xx
      if (res.ok || (res.status >= 400 && res.status < 500 && res.status !== 429)) {
        return res;
      }

      if (attempt < retries) {
        // Honour Retry-After header if present, otherwise exponential backoff
        const retryAfter = res.headers.get("Retry-After");
        const wait = retryAfter ? parseInt(retryAfter, 10) * 1000 : delayMs * attempt;
        await new Promise((r) => setTimeout(r, wait));
      } else {
        return res; // Return the failed response on final attempt
      }
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, delayMs * attempt));
    }
  }
  throw new Error("fetchWithRetry: exhausted retries"); // unreachable, satisfies TS
}

// ─── In-memory stale cache ────────────────────────────────────────────────────

let cachedFeed: YouTubeFeed | null = null;
let cacheTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// ─── Route handler ────────────────────────────────────────────────────────────

const CHANNEL_ID = process.env.CHANNEL_ID ?? "UCfKlgkhzeu5qKEYFS42DVHg";

export async function GET() {
  const now = Date.now();

  // Return stale cache immediately while revalidating, or if YouTube is down
  const cacheIsWarm = cachedFeed && now - cacheTime < CACHE_TTL_MS;
  if (cacheIsWarm) {
    return NextResponse.json(cachedFeed, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  }

  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

  try {
    const res = await fetchWithRetry(
      feedUrl,
      {
        // Remove next.revalidate — we handle caching ourselves with the in-memory cache
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; ChurchSite/1.0)",
          Accept: "application/atom+xml, application/xml, text/xml, */*",
        },
      },
      3,    // retries
      600,  // base delay ms
    );

    if (!res.ok) {
      // YouTube is down — serve stale data if we have it, otherwise 502
      if (cachedFeed) {
        console.warn(`YouTube feed returned ${res.status}, serving stale cache`);
        return NextResponse.json(cachedFeed, {
          headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
        });
      }
      return NextResponse.json(
        { error: `YouTube feed returned ${res.status}` },
        { status: 502 },
      );
    }

    const xml = await res.text();
    const channelName = getTagText(xml, "title");

    const feed: YouTubeFeed = {
      channelId: CHANNEL_ID,
      channelName,
      channelUrl: `https://www.youtube.com/channel/${CHANNEL_ID}`,
      videos: parseEntries(xml),
    };

    // Update in-memory cache
    cachedFeed = feed;
    cacheTime = now;

    return NextResponse.json(feed, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";

    // Network error — serve stale data if available
    if (cachedFeed) {
      console.warn(`YouTube feed network error (${message}), serving stale cache`);
      return NextResponse.json(cachedFeed, {
        headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
      });
    }

    return NextResponse.json(
      { error: `YouTube feed error: ${message}` },
      { status: 500 },
    );
  }
}