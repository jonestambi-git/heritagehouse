"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { PodcastFeed } from "@/app/api/podcast-feed/route";
import PodcastEpisodes from "@/components/PodcastEpisodes";
import YouTubeVideos from "@/components/YouTubeVideos";
import { typography, spacing, colors, glass, fonts } from "@/lib/design-system";

type Tab = "audio" | "video";

// ─── Component ────────────────────────────────────────────────────────────────

export default function MediaClient({
  bgUrl,
  feed,
}: {
  bgUrl: string;
  feed: PodcastFeed | null;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("audio");

  return (
    <section className="relative w-full min-h-svh">
      {/* Background */}

      {/* Content */}
      <div className={`public-content relative flex flex-col min-h-svh ${spacing.containerPadding} ${spacing.containerPaddingY}`}>

        {/* Heading */}
        <motion.h1
          className="font-black leading-[0.92] tracking-tight mt-4 sm:mt-6"
          style={{ ...typography.h1, color: colors.text.primary, fontFamily: fonts.serif }}
        >
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Messages
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.8 }}
          >
            &amp; media.
          </motion.span>
        </motion.h1>

        <motion.p
          className="mt-4 leading-relaxed max-w-sm"
          style={{ ...typography.body, color: colors.text.secondary }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.6 }}
        >
          Listen to audio messages or watch recorded services and live replays — anytime, anywhere.
        </motion.p>

        {/* ── Tab switcher ── */}
        <motion.div
          className="mt-8 flex gap-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.6 }}
        >
          {(["audio", "video"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="transition-all duration-200"
              style={
                activeTab === tab
                  ? {
                      ...typography.label,
                      ...glass.light,
                      padding: "10px 20px",
                      color: colors.text.primary,
                      border: `1px solid ${colors.border.light}`,
                    }
                  : {
                      ...typography.label,
                      background: colors.background.glassLight,
                      border: `1px solid ${colors.border.lighter}`,
                      padding: "10px 20px",
                      borderRadius: "10px",
                      color: colors.text.tertiary,
                    }
              }
            >
              {tab === "audio" ? "Audio Messages" : "Video Services"}
            </button>
          ))}
        </motion.div>

        {/* ── Audio tab ── */}
        {activeTab === "audio" && (
          <motion.div
            key="audio"
            className="mt-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {feed ? (
              <PodcastEpisodes feed={feed} />
            ) : (
              <div className="px-6 py-8 flex flex-col gap-3" style={glass.light}>
                <p style={{ ...typography.body, color: colors.text.secondary }}>
                  Audio messages are not yet configured.
                </p>
                <p style={{ ...typography.small, color: colors.text.tertiary, maxWidth: "28rem" }}>
                  Set the{" "}
                  <code style={{ color: colors.text.secondary }}>PODCAST_RSS_URL</code>{" "}
                  environment variable to your Spotify for Podcasters RSS feed
                  URL. Episodes will appear here automatically.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* ── Video tab — fully automatic from YouTube RSS ── */}
        {activeTab === "video" && (
          <motion.div
            key="video"
            className="mt-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <YouTubeVideos />
          </motion.div>
        )}

        {/* ── CTA ── */}
        <motion.div
          className="mt-16 sm:mt-20 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
          style={{
            ...glass.light,
            border: `1px solid ${colors.border.light}`,
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.07)",
            padding: "2rem",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <div className="flex flex-col gap-1">
            <p style={{ ...typography.label, color: colors.text.secondary }}>
              Join us live
            </p>
            <p className="font-black text-2xl sm:text-3xl leading-tight" style={{ ...typography.h2, color: colors.text.primary, fontFamily: fonts.serif }}>
              Experience worship
              <br />
              in person.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <a
              href="/live-service"
              className="border text-white bg-transparent hover:bg-white hover:text-black tracking-wide px-7 py-2 text-sm transition-colors"
              style={{ borderColor: colors.border.light }}
            >
              Watch live stream
            </a>
            <a
              href="/location"
              className="tracking-wide px-0 py-2 text-sm underline underline-offset-4 transition-colors"
              style={{ color: colors.text.secondary }}
              onMouseEnter={(e) => (e.currentTarget.style.color = colors.text.primary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = colors.text.secondary)}
            >
              Find us
            </a>
          </div>
        </motion.div>

        <div className="h-12" />
      </div>
    </section>
  );
}
