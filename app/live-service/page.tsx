"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getDailyPhoto } from "@/lib/church-photos";
import {
  useLivestreamActive,
  useLivestreamSchedule,
} from "@/lib/hooks/queries";
import { toYouTubeEmbedUrl, toYouTubeVideoId, toYouTubeWatchUrl } from "@/lib/utils/youtube";

export default function LiveServicePage() {
  const bgUrl = getDailyPhoto(1);

  const activeQuery = useLivestreamActive();
  const scheduleQuery = useLivestreamSchedule();

  const liveSettings = activeQuery.data;
  const previousStreams =
    scheduleQuery.data ?? liveSettings?.previousStreams ?? [];

  const isLive = !!liveSettings?.isLive && !!liveSettings.streamUrl;
  const embedUrl = liveSettings?.streamUrl
    ? toYouTubeEmbedUrl(liveSettings.streamUrl)
    : "";
  const watchUrl = liveSettings?.streamUrl
    ? toYouTubeWatchUrl(liveSettings.streamUrl)
    : "";
  const videoId = liveSettings?.streamUrl
    ? toYouTubeVideoId(liveSettings.streamUrl)
    : "";
  const serviceTitle = liveSettings?.title || "Sunday Service";
  const serviceDesc =
    liveSettings?.description ||
    "Join us live for worship, the Word, and fellowship.";

  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="relative w-full min-h-svh overflow-hidden">
      {/* Logo watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true" style={{ zIndex: 0 }}>
        <img src="/logo.png" alt="" className="object-contain" style={{ width: "min(80vw, 700px)", height: "min(80vw, 700px)", opacity: 0.04, userSelect: "none" }} />
      </div>

      <div className="public-content relative flex flex-col items-center min-h-svh px-6 py-6 sm:px-10 sm:py-8" style={{ zIndex: 1 }}>
        <motion.h1
          className="font-heading mt-4 sm:mt-6 text-white font-black leading-[0.92] tracking-tight text-center"
          style={{ fontSize: "clamp(2.6rem, 10vw, 6rem)" }}
        >
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {isLive ? "We're live." : "Join us online."}
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.8 }}
          >
            Worship with us.
          </motion.span>
        </motion.h1>

        <motion.div
          className="mt-5 flex items-center gap-4 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.6 }}
        >
          <span className="flex items-center gap-2 font-body text-xs tracking-widest uppercase text-white border border-white/30 px-3 py-1.5">
            <span
              className={`w-2 h-2 rounded-full ${isLive ? "bg-red-500 animate-pulse" : "bg-white/35"}`}
            />
            {isLive ? "Live now" : "Offline"}
          </span>
          <span className="font-body text-white/40 text-xs tracking-wide">
            {serviceTitle}
          </span>
        </motion.div>

        <motion.div
          className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 flex-1"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.7 }}
        >
          <div className="flex flex-col gap-6">
            <div className="relative w-full aspect-video bg-black/50 border border-white/15 overflow-hidden">
              {isLive && embedUrl ? (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={embedUrl}
                  title="Live Service"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
                  <div className="w-14 h-14 border border-white/20 flex items-center justify-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-white/40"
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                  <p className="font-body text-white/50 text-sm max-w-xs leading-relaxed">
                    No livestream is active right now. When the service is live,
                    this player will open the YouTube stream here.
                  </p>
                  {watchUrl ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/30 text-white bg-transparent hover:bg-white hover:text-black font-body tracking-wide rounded-none text-xs px-5 mt-1"
                      asChild
                    >
                      <a href={watchUrl} target="_blank" rel="noreferrer">
                        Open on YouTube
                      </a>
                    </Button>
                  ) : null}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-start border-t border-white/20 pt-5">
              <div className="flex flex-col gap-1">
                <h2 className="font-heading text-white font-black text-xl sm:text-2xl leading-tight">
                  {serviceTitle}
                </h2>
                <p className="font-body text-white/65 text-sm leading-relaxed mt-2 max-w-md">
                  {serviceDesc}
                </p>
              </div>
              <div className="flex gap-3 sm:flex-col">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/40 text-white bg-transparent hover:bg-white hover:text-black font-body tracking-wide rounded-none text-xs px-5"
                  onClick={copyLink}
                >
                  {copied ? "Copied!" : "Share"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/55 hover:text-white hover:bg-transparent font-body text-xs tracking-wide rounded-none px-0 underline underline-offset-4"
                  asChild
                >
                  <a href="/give">Give online</a>
                </Button>
              </div>
            </div>

            <div className="p-4 sm:p-5" style={{
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "16px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}>
              <p className="font-body text-white/30 text-[10px] tracking-widest uppercase mb-3">
                Previous streams
              </p>
              {previousStreams.length === 0 ? (
                <p className="font-body text-white/40 text-sm">
                  Archived streams will appear here after you end a live
                  session.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {previousStreams.map((stream) => (
                    <a
                      key={stream.id}
                      href={toYouTubeWatchUrl(stream.streamUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between gap-4 border-t border-white/10 pt-3 first:border-t-0 first:pt-0 hover:text-white transition-colors"
                    >
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="font-body text-white text-sm font-semibold truncate">
                          {stream.title}
                        </span>
                        <span className="font-body text-white/35 text-xs">
                          {stream.date}
                        </span>
                      </div>
                      <span className="font-body text-white/40 text-xs shrink-0">
                        Watch
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── YouTube Live Chat ── */}
          <div
            className="flex flex-col overflow-hidden sticky top-4 self-start"
            style={{
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "16px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.28)",
              minHeight: "480px",
              height: "560px",
            }}
          >
            <div className="px-4 py-3 border-b border-white/15 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-body text-white/60 text-xs tracking-widest uppercase">
                  Live chat
                </span>
                {isLive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                )}
              </div>
              {videoId && (
                <a
                  href={`https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${typeof window !== "undefined" ? window.location.hostname : "localhost"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-white/35 text-[10px] tracking-widest uppercase hover:text-white transition-colors"
                >
                  Open ↗
                </a>
              )}
            </div>

            <div className="flex-1 overflow-hidden">
              {isLive && videoId ? (
                <iframe
                  src={`https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${typeof window !== "undefined" ? window.location.hostname : "localhost"}`}
                  className="w-full h-full"
                  style={{ border: "none" }}
                  title="YouTube Live Chat"
                  allow="autoplay"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    className="text-white/20"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <p className="font-body text-white/35 text-xs leading-relaxed">
                    Live chat will appear here when the service is streaming.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row sm:items-end justify-between gap-5"
          style={{
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: "20px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.07)",
            padding: "1.5rem 2rem",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.6 }}
        >
          <div className="flex flex-col gap-1">
            <p className="font-body text-xs tracking-widest uppercase" style={{ color: "#D4AF37" }}>
              Need prayer?
            </p>
            <p className="font-heading text-white font-black text-xl sm:text-2xl leading-tight">
              We believe in the
              <br className="hidden sm:block" /> power of prayer.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button
              variant="outline"
              className="border-white/50 text-white bg-transparent hover:bg-white hover:text-black font-body tracking-wide rounded-none px-7"
              asChild
            >
              <a href="/contact">Submit a prayer request</a>
            </Button>
            <Button
              variant="ghost"
              className="text-white/55 hover:text-white hover:bg-transparent font-body tracking-wide rounded-none px-0 underline underline-offset-4"
              asChild
            >
              <a href="/events">Upcoming services</a>
            </Button>
          </div>
        </motion.div>

        <div className="h-12" />
      </div>
    </section>
  );
}
