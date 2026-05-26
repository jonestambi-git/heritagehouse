"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import Link from "next/link";
import { useSermons, useSearchSermons } from "@/lib/hooks/queries";
import { useUiStore } from "@/lib/stores/uiStore";
import { getDailyPhoto } from "@/lib/church-photos";
import PodcastEpisodes from "@/components/PodcastEpisodes";
import YouTubeVideos from "@/components/YouTubeVideos";
import type { PodcastFeed } from "@/app/api/podcast-feed/route";
import { useEffect } from "react";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { typography, spacing, colors, glass, fonts } from "@/lib/design-system";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "word" | "audio" | "video";

interface SermonItem {
  id?: string;
  slug: string;
  title: string;
  pastor?: string;
  author?: string;
  date?: string;
  dateISO?: string;
  excerpt?: string;
  content?: string;
  createdAt?: string;
  tags?: string[];
}

const tabs: { id: Tab; label: string }[] = [
  { id: "word", label: "The Word" },
  { id: "audio", label: "Audio Messages" },
  { id: "video", label: "Video Sessions" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function SermonsPage() {
  const bgUrl = getDailyPhoto(5);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.3], [40, 0]);

  const [activeTab, setActiveTab] = useState<Tab>("word");

  // ── The Word state ──
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const addToast = useUiStore((s) => s.addToast);

  // ── Hidden items (blocklist) ──
  const [hiddenItems] = useLocalStorage<Array<{ id: string; type: string }>>("admin-hidden-media", []);
  const [hiddenSermonIds, setHiddenSermonIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const sermonIds = new Set(
      hiddenItems.filter((item) => item.type === 'sermon').map((item) => item.id)
    );
    setHiddenSermonIds(sermonIds);
  }, [hiddenItems]);

  const {
    data: searchResults,
    isLoading: isSearching,
    error: searchError,
  } = useSearchSermons(searchTerm);
  const { data: paginatedSermons, isLoading, error } = useSermons(page);

  if (error) addToast({ type: "error", message: "Failed to load sermons" });
  if (searchError) addToast({ type: "error", message: "Search failed" });

  const displaySermons = searchTerm
    ? searchResults?.data || []
    : paginatedSermons?.data || [];
  
  // Filter out hidden sermons
  const filtered = displaySermons.filter((sermon) => {
    const sermonId = sermon.id || (sermon as any)._id || (sermon as any).slug;
    return !hiddenSermonIds.has(sermonId);
  });
  
  const featured = filtered.length > 0 ? filtered[0] : null;

  // ── Audio state — fetch podcast feed client-side ──
  const [podcastFeed, setPodcastFeed] = useState<PodcastFeed | null>(null);
  const [podcastLoading, setPodcastLoading] = useState(false);
  const [podcastError, setPodcastError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab !== "audio" || podcastFeed !== null || podcastLoading) return;
    let cancelled = false;
    setPodcastLoading(true);
    fetch("/api/podcast-feed")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const ct = r.headers.get("content-type") || "";
        if (!ct.includes("application/json")) throw new Error("Invalid response from podcast API");
        return r.json();
      })
      .then((data: PodcastFeed & { error?: string }) => {
        if (cancelled) return;
        if (data.error) throw new Error(data.error);
        setPodcastFeed(data);
        setPodcastLoading(false);
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setPodcastError(e.message);
          setPodcastLoading(false);
        }
      });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <section ref={sectionRef} className="relative w-full min-h-svh overflow-hidden">
      {/* Logo watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true" style={{ zIndex: 0 }}>
        <img src="/logo.png" alt="HeritageHouse Ministries watermark" className="object-contain" style={{ width: "min(80vw, 700px)", height: "min(80vw, 700px)", opacity: 0.10, userSelect: "none" }} />
      </div>
      {/* Background */}

      {/* Content */}
      <motion.div className={`public-content relative flex flex-col items-center min-h-svh ${spacing.containerPadding} ${spacing.containerPaddingY}`} style={{ zIndex: 1, opacity, y }}>

        {/* Heading */}
        <motion.h1
          className="font-heading mt-4 sm:mt-6 font-black leading-[0.92] tracking-tight text-center"
          style={{ ...typography.h1, color: colors.text.primary, fontFamily: fonts.serif }}
        >
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Words that
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.8 }}
          >
            last.
          </motion.span>
        </motion.h1>

        <motion.p
          className="mt-4 text-center max-w-sm leading-relaxed"
          style={{ ...typography.body, color: colors.text.secondary }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.6 }}
        >
          Read the Word, listen to audio messages, or watch recorded services — anytime, anywhere.
        </motion.p>

        {/* ── Tab switcher ── */}
        <motion.div
          className="mt-8 flex flex-wrap gap-2 justify-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.6 }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="transition-all duration-200"
              style={
                activeTab === tab.id
                  ? {
                      ...typography.label,
                      ...glass.light,
                      padding: "10px 20px",
                      color: colors.accent,
                      border: `1px solid ${colors.border.accent}`,
                    }
                  : {
                      ...typography.label,
                      background: colors.background.glassLight,
                      border: `1px solid ${colors.border.light}`,
                      padding: "10px 20px",
                      borderRadius: "10px",
                      color: colors.text.tertiary,
                    }
              }
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* ══════════════════════════════════════════════
            TAB 1 — THE WORD (written sermons)
        ══════════════════════════════════════════════ */}
        <AnimatePresence mode="wait">
          {activeTab === "word" && (
            <motion.div
              key="word"
              className="mt-10 flex flex-col w-full max-w-4xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              {/* Loading */}
              {isLoading && (
                <div className="flex items-center gap-3 py-8">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <p style={{ ...typography.small, color: colors.text.tertiary }}>Loading sermons…</p>
                </div>
              )}

              {/* Featured sermon */}
              {!isLoading && featured && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8"
                >
                  <p style={{ ...typography.label, color: colors.text.muted, marginBottom: "12px" }}>
                    Featured
                  </p>
                  <Link
                    href={`/sermons/${featured.slug}`}
                    className="group block p-5 sm:p-6"
                    style={glass.light}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 sm:gap-10 items-start">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span style={{ ...typography.label, color: colors.text.muted }}>
                            Latest sermon
                          </span>
                          <span style={{ ...typography.small, color: colors.text.tertiary }}>
                            {featured.date || new Date(featured.dateISO || featured.createdAt || Date.now()).toLocaleDateString()}
                          </span>
                        </div>
                        <h2
                          className="font-black leading-[0.95] tracking-tight group-hover:opacity-80 transition-opacity"
                          style={{ ...typography.h2, color: colors.text.primary, fontFamily: fonts.serif }}
                        >
                          {featured.title}
                        </h2>
                        <p style={{ ...typography.body, color: colors.text.secondary, maxWidth: "32rem" }} className="line-clamp-3">
                          {featured.excerpt || (featured as SermonItem).content}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span style={{ ...typography.small, color: colors.text.secondary }}>
                            {featured.pastor || (featured as SermonItem).author || "Pastor"}
                          </span>
                          <span style={{ ...typography.small, color: colors.text.muted }}>·</span>
                          <span style={{ ...typography.small, color: colors.text.tertiary }}>5 min read</span>
                        </div>
                      </div>
                      <span className="hidden sm:block text-3xl group-hover:opacity-60 group-hover:translate-x-1 transition-all duration-300 mt-2" style={{ color: colors.text.tertiary }}>
                        →
                      </span>
                    </div>
                    <span className="mt-5 inline-block tracking-widest uppercase border-b pb-0.5 group-hover:opacity-100 transition-opacity" style={{ ...typography.label, color: colors.text.secondary, borderColor: colors.border.light }}>
                      Read sermon
                    </span>
                  </Link>
                </motion.div>
              )}

              {/* Sermon list */}
              {!isLoading && (
                <>
                  <p style={{ ...typography.label, color: colors.text.muted, marginBottom: "4px" }}>
                    All sermons — {filtered.length} messages
                  </p>
                  <AnimatePresence mode="popLayout">
                    {filtered.map((sermon, i) => (
                      <motion.div
                        key={sermon.slug}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ delay: i * 0.04, duration: 0.3 }}
                      >
                        <Link
                          href={`/sermons/${sermon.slug}`}
                          className="group flex items-start gap-5 sm:gap-8 py-5 border-t transition-colors"
                          style={{ borderColor: colors.border.light }}
                          onMouseEnter={(e) => (e.currentTarget.style.borderColor = colors.border.accent)}
                          onMouseLeave={(e) => (e.currentTarget.style.borderColor = colors.border.light)}
                        >
                          <div className="hidden sm:flex flex-col items-center w-10 flex-shrink-0 pt-0.5 leading-none">
                            <span style={{ ...typography.label, color: colors.text.muted }}>
                              {new Date(sermon.dateISO || sermon.createdAt || sermon.date || Date.now())
                                .toLocaleString("en", { month: "short" })
                                .toUpperCase()}
                            </span>
                            <span className="font-black text-2xl leading-none mt-0.5" style={{ ...typography.h3, color: colors.text.primary }}>
                              {new Date(sermon.dateISO || sermon.createdAt || sermon.date || Date.now())
                                .getDate()
                                .toString()
                                .padStart(2, "0")}
                            </span>
                          </div>
                          <div className="flex-1 flex flex-col gap-1.5">
                            <span style={{ ...typography.label, color: colors.text.muted }}>
                              Sermon
                            </span>
                            <h3 className="font-semibold group-hover:opacity-75 transition-opacity leading-snug" style={{ ...typography.h4, color: colors.text.primary }}>
                              {sermon.title}
                            </h3>
                            <p style={{ ...typography.small, color: colors.text.tertiary, maxWidth: "44rem" }} className="line-clamp-2 hidden sm:block">
                              {sermon.excerpt || (sermon as SermonItem).content}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <span style={{ ...typography.small, color: colors.text.tertiary }}>
                                {sermon.pastor || (sermon as SermonItem).author || "Pastor"}
                              </span>
                              <span style={{ ...typography.small, color: colors.text.muted }}>·</span>
                              <span style={{ ...typography.small, color: colors.text.tertiary }}>5 min read</span>
                            </div>
                          </div>
                          <span className="text-xl group-hover:opacity-60 group-hover:translate-x-1 transition-all duration-300 mt-1 flex-shrink-0" style={{ color: colors.text.tertiary }}>
                            →
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {filtered.length === 0 && (
                    <p style={{ ...typography.body, color: colors.text.secondary }} className="pt-8">
                      No sermons found. Check back soon.
                    </p>
                  )}

                  {/* Pagination */}
                  {!searchTerm && paginatedSermons?.pagination && (
                    <motion.div
                      className="flex items-center justify-between mt-10 px-5 py-4"
                      style={glass.light}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="transition-colors disabled:cursor-not-allowed"
                        style={{
                          ...typography.label,
                          color: page === 1 ? colors.text.muted : colors.text.secondary,
                        }}
                      >
                        ← Previous
                      </button>
                      <span style={{ ...typography.small, color: colors.text.tertiary }}>
                        Page {page} of{" "}
                        {Math.ceil((paginatedSermons.pagination?.total || 0) / 10)}
                      </span>
                      <button
                        onClick={() => setPage(page + 1)}
                        disabled={
                          page >= Math.ceil((paginatedSermons.pagination?.total || 0) / 10)
                        }
                        className="transition-colors disabled:cursor-not-allowed"
                        style={{
                          ...typography.label,
                          color: page >= Math.ceil((paginatedSermons.pagination?.total || 0) / 10) ? colors.text.muted : colors.text.secondary,
                        }}
                      >
                        Next →
                      </button>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════
              TAB 2 — AUDIO MESSAGES (Spotify RSS)
          ══════════════════════════════════════════════ */}
          {activeTab === "audio" && (
            <motion.div
              key="audio"
              className="mt-10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              {podcastLoading && (
                <div className="flex items-center gap-3 py-8">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <p style={{ ...typography.small, color: colors.text.tertiary }}>Loading audio messages…</p>
                </div>
              )}

              {podcastError && !podcastLoading && (
                <div className="px-6 py-8 flex flex-col gap-3" style={glass.light}>
                  <p style={{ ...typography.body, color: colors.text.secondary }}>
                    Could not load audio messages.
                  </p>
                  <p style={{ ...typography.small, color: colors.text.tertiary }}>{podcastError}</p>
                </div>
              )}

              {!podcastLoading && !podcastError && podcastFeed && (
                <PodcastEpisodes feed={podcastFeed} />
              )}
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════
              TAB 3 — VIDEO SESSIONS (YouTube RSS)
          ══════════════════════════════════════════════ */}
          {activeTab === "video" && (
            <motion.div
              key="video"
              className="mt-10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              <YouTubeVideos />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-16" />
      </motion.div>
    </section>
  );
}
