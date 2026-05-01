"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getDailyPhoto } from "@/lib/church-photos";
import type { YouTubeFeed, YouTubeVideo } from "@/app/api/youtube-feed/route";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function VideoPlayerPage() {
  const { videoId } = useParams<{ videoId: string }>();
  const router = useRouter();
  const bgUrl = getDailyPhoto(3);

  const [feed, setFeed] = useState<YouTubeFeed | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/youtube-feed")
      .then((r) => r.json())
      .then((data: YouTubeFeed) => {
        setFeed(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const video: YouTubeVideo | undefined = feed?.videos.find(
    (v) => v.videoId === videoId,
  );

  // Related = other videos excluding current
  const related = feed?.videos.filter((v) => v.videoId !== videoId).slice(0, 6) ?? [];

  return (
    <section className="relative w-full min-h-svh">
      {/* Background */}
      <motion.div
        className="page-bg"
        style={{ "--bg-url": `url(${bgUrl})` } as React.CSSProperties}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6 }}
      />
      <div className="fixed inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/15 pointer-events-none z-0" />
      <div className="fixed inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-0" />

      <div className="public-content relative z-10 flex flex-col min-h-svh px-6 py-6 sm:px-10 sm:py-8">

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-4"
        >
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 font-body text-white/45 text-xs tracking-widest uppercase hover:text-white transition-colors"
          >
            ← Back
          </button>
        </motion.div>

        {/* Main grid */}
        <motion.div
          className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          {/* ── Left: Player + info ── */}
          <div className="flex flex-col gap-6">
            {/* Player */}
            <div
              className="relative w-full overflow-hidden"
              style={{
                aspectRatio: "16/9",
                background: "rgba(0,0,0,0.6)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "16px",
                boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
              }}
            >
              {videoId ? (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                  title={video?.title ?? "Video"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ border: 0, borderRadius: "16px" }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="font-body text-white/40 text-sm">Loading…</p>
                </div>
              )}
            </div>

            {/* Video info */}
            {loading ? (
              <div className="flex flex-col gap-3 animate-pulse">
                <div className="h-6 w-3/4 rounded-lg bg-white/10" />
                <div className="h-4 w-1/3 rounded-lg bg-white/06" />
              </div>
            ) : video ? (
              <div
                className="p-5 flex flex-col gap-3"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "16px",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.28)",
                }}
              >
                <h1 className="font-heading text-white font-black text-xl sm:text-2xl leading-tight tracking-tight">
                  {video.title}
                </h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-body text-white/45 text-xs">
                    {formatDate(video.published)}
                  </span>
                  <span className="text-white/20">·</span>
                  <span className="font-body text-white/45 text-xs">
                    {video.channelName}
                  </span>
                  <a
                    href={`https://www.youtube.com/watch?v=${video.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-white/35 text-xs hover:text-white transition-colors underline underline-offset-4 ml-auto"
                  >
                    Watch on YouTube ↗
                  </a>
                </div>
                {video.description && (
                  <p className="font-body text-white/55 text-sm leading-relaxed border-t border-white/10 pt-3">
                    {video.description}
                  </p>
                )}
              </div>
            ) : (
              <div
                className="p-5"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: "16px",
                }}
              >
                <p className="font-body text-white/40 text-sm">
                  Video details not available.
                </p>
              </div>
            )}
          </div>

          {/* ── Right: Related videos ── */}
          <div className="flex flex-col gap-4">
            <p className="font-body text-white/40 text-[10px] tracking-widest uppercase">
              More videos
            </p>

            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex gap-3 animate-pulse"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    padding: "0.75rem",
                  }}
                >
                  <div className="w-24 h-14 rounded-lg bg-white/10 shrink-0" />
                  <div className="flex flex-col gap-2 flex-1 justify-center">
                    <div className="h-3 w-full rounded bg-white/10" />
                    <div className="h-2.5 w-2/3 rounded bg-white/06" />
                  </div>
                </div>
              ))
            ) : related.length === 0 ? (
              <p className="font-body text-white/30 text-xs">No other videos yet.</p>
            ) : (
              related.map((v, i) => (
                <motion.div
                  key={v.videoId}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.07, duration: 0.4 }}
                >
                  <Link
                    href={`/media/video/${v.videoId}`}
                    className="group flex gap-3 transition-all duration-300"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.09)",
                      borderRadius: "12px",
                      padding: "0.75rem",
                    }}
                  >
                    {/* Thumbnail */}
                    <div
                      className="relative shrink-0 overflow-hidden"
                      style={{ width: 96, height: 56, borderRadius: "8px" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={v.thumbnail}
                        alt={v.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col gap-1 min-w-0 justify-center">
                      <p className="font-body text-white/85 text-xs font-semibold leading-snug line-clamp-2 group-hover:text-white transition-colors">
                        {v.title}
                      </p>
                      <p className="font-body text-white/35 text-[10px]">
                        {formatDate(v.published)}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        <div className="h-12" />
      </div>
    </section>
  );
}
