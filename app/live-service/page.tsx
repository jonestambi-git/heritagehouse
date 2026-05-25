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
import { typography, spacing, colors, glass, fonts } from "@/lib/design-system";

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
        <img src="/logo.png" alt="HeritageHouse Ministries watermark" className="object-contain" style={{ width: "min(80vw, 700px)", height: "min(80vw, 700px)", opacity: 0.04, userSelect: "none" }} />
      </div>

      <div className={`public-content relative flex flex-col items-center min-h-svh ${spacing.containerPadding} ${spacing.containerPaddingY}`} style={{ zIndex: 1 }}>
        <motion.h1
          className="font-black leading-[0.92] tracking-tight text-center mt-4 sm:mt-6"
          style={{ ...typography.h1, color: colors.text.primary, fontFamily: fonts.serif }}
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
          <span className="flex items-center gap-2 border px-3 py-1.5" style={{ ...typography.label, color: colors.text.primary, borderColor: colors.border.light, borderRadius: "6px" }}>
            <span
              className={`w-2 h-2 rounded-full ${isLive ? "bg-red-500 animate-pulse" : "bg-white/35"}`}
            />
            {isLive ? "Live now" : "Offline"}
          </span>
          <span style={{ ...typography.small, color: colors.text.tertiary }}>
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
            <div className="relative w-full aspect-video bg-black/50 border overflow-hidden" style={{ borderColor: colors.border.light, borderRadius: "2px" }}>
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
                  <div className="w-14 h-14 border flex items-center justify-center" style={{ borderColor: colors.border.light, borderRadius: "2px" }}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      style={{ color: colors.text.tertiary }}
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                  <p style={{ ...typography.body, color: colors.text.secondary, maxWidth: "20rem" }}>
                    No livestream is active right now. When the service is live,
                    this player will open the YouTube stream here.
                  </p>
                  {watchUrl ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/30 text-white bg-transparent hover:bg-white hover:text-black tracking-wide rounded-none text-xs px-5 mt-1"
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

            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-start border-t pt-5" style={{ borderColor: colors.border.light }}>
              <div className="flex flex-col gap-1">
                <h2 className="font-black text-xl sm:text-2xl leading-tight" style={{ ...typography.h2, color: colors.text.primary, fontFamily: fonts.serif }}>
                  {serviceTitle}
                </h2>
                <p style={{ ...typography.body, color: colors.text.secondary, marginTop: "8px", maxWidth: "28rem" }}>
                  {serviceDesc}
                </p>
              </div>
              <div className="flex gap-3 sm:flex-col">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/40 text-white bg-transparent hover:bg-white hover:text-black tracking-wide rounded-none text-xs px-5"
                  onClick={copyLink}
                >
                  {copied ? "Copied!" : "Share"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/55 hover:text-white hover:bg-transparent text-xs tracking-wide rounded-none px-0 underline underline-offset-4"
                  asChild
                >
                  <a href="/give">Give online</a>
                </Button>
              </div>
            </div>

            <div className="p-4 sm:p-5" style={glass.light}>
              <p style={{ ...typography.label, color: colors.text.muted, marginBottom: "12px" }}>
                Previous streams
              </p>
              {previousStreams.length === 0 ? (
                <p style={{ ...typography.body, color: colors.text.secondary }}>
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
                      className="flex items-center justify-between gap-4 border-t pt-3 first:border-t-0 first:pt-0 hover:text-white transition-colors"
                      style={{ borderColor: colors.border.light }}
                    >
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="font-semibold truncate" style={{ ...typography.body, color: colors.text.primary }}>
                          {stream.title}
                        </span>
                        <span style={{ ...typography.small, color: colors.text.tertiary }}>
                          {stream.date}
                        </span>
                      </div>
                      <span style={{ ...typography.small, color: colors.text.tertiary, flexShrink: 0 }}>
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
              ...glass.light,
              minHeight: "480px",
              height: "560px",
            }}
          >
            <div className="px-4 py-3 border-b flex items-center justify-between shrink-0" style={{ borderColor: colors.border.light }}>
              <div className="flex items-center gap-2">
                <span style={{ ...typography.label, color: colors.text.secondary }}>
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
                  style={{ ...typography.label, color: colors.text.tertiary }}
                  className="hover:text-white transition-colors"
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
                    style={{ color: colors.text.muted }}
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <p style={{ ...typography.small, color: colors.text.tertiary }}>
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
            ...glass.light,
            border: `1px solid ${colors.border.light}`,
            boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.07)",
            padding: "1.5rem 2rem",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.6 }}
        >
          <div className="flex flex-col gap-1">
            <p style={{ ...typography.label, color: colors.accent }}>
              Need prayer?
            </p>
            <p className="font-black text-xl sm:text-2xl leading-tight" style={{ ...typography.h2, color: colors.text.primary, fontFamily: fonts.serif }}>
              We believe in the
              <br className="hidden sm:block" /> power of prayer.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button
              variant="outline"
              className="border-white/50 text-white bg-transparent hover:bg-white hover:text-black tracking-wide rounded-none px-7"
              asChild
            >
              <a href="/contact">Submit a prayer request</a>
            </Button>
            <Button
              variant="ghost"
              className="text-white/55 hover:text-white hover:bg-transparent tracking-wide rounded-none px-0 underline underline-offset-4"
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
