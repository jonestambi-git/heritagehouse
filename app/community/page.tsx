"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getDailyPhoto } from "@/lib/church-photos";

// ─── Types ────────────────────────────────────────────────────────────────────

type GroupTag = "MEN" | "WOMEN" | "YOUTH" | "FAMILIES" | "ALL_AGES";

interface Group {
  _id: string;
  name: string;
  tag: GroupTag;
  meets: string;
  leader: string;
  bio: string;
  spots: number | null;
}

const tagLabels: Record<GroupTag, string> = {
  MEN: "Men",
  WOMEN: "Women",
  YOUTH: "Youth",
  FAMILIES: "Families",
  ALL_AGES: "All Ages",
};

const tagColors: Record<GroupTag, string> = {
  MEN: "bg-sky-500/20 text-sky-200",
  WOMEN: "bg-rose-500/20 text-rose-200",
  YOUTH: "bg-violet-500/20 text-violet-200",
  FAMILIES: "bg-amber-500/20 text-amber-200",
  ALL_AGES: "bg-teal-500/20 text-teal-200",
};

const tagActiveBg: Record<GroupTag | "ALL", string> = {
  ALL: "bg-white text-black",
  MEN: "bg-sky-400 text-sky-950",
  WOMEN: "bg-rose-400 text-rose-950",
  YOUTH: "bg-violet-400 text-violet-950",
  FAMILIES: "bg-amber-400 text-amber-950",
  ALL_AGES: "bg-teal-400 text-teal-950",
};

const tagFilters: (GroupTag | "ALL")[] = ["ALL", "MEN", "WOMEN", "YOUTH", "FAMILIES", "ALL_AGES"];

// ─── Component ───────────────────────────────────────────────────────────────

export default function CommunityPage() {
  const bgUrl = getDailyPhoto(2);
  const [activeTag, setActiveTag] = useState<GroupTag | "ALL">("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/ministries?limit=100", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setGroups(data?.data ?? []))
      .catch(() => setGroups([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeTag === "ALL" ? groups : groups.filter((g) => g.tag === activeTag);

  return (
    <section className="relative w-full min-h-svh">
      <motion.div
        className="page-bg"
        style={{ "--bg-url": `url(${bgUrl})` } as React.CSSProperties}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6 }}
      />
      <div className="fixed inset-0 bg-linear-to-r from-black/75 via-black/40 to-black/10 z-10" />
      <div className="fixed inset-x-0 bottom-0 h-48 bg-linear-to-t from-black/60 to-transparent z-10" />

      <div className="public-content relative z-10 flex flex-col min-h-svh px-6 py-6 sm:px-10 sm:py-8">
        <motion.h1
          className="font-heading mt-4 sm:mt-6 text-white font-black leading-[0.92] tracking-tight"
          style={{ fontSize: "clamp(2.6rem, 10vw, 6rem)" }}
        >
          <motion.span className="block" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>
            Better
          </motion.span>
          <motion.span className="block" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.68, duration: 0.8 }}>
            together.
          </motion.span>
        </motion.h1>

        <motion.p
          className="mt-8 sm:mt-12 font-body text-white/70 text-sm sm:text-base leading-relaxed max-w-sm"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7 }}
        >
          We believe no one should do life alone. Whether you&apos;re new to faith or have walked with God for years, there&apos;s a place for you in our community.
        </motion.p>

        <motion.div
          className="mt-12 sm:mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.7 }}
        >
          <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
            <div>
              <h2 className="font-body text-white/50 text-xs tracking-widest uppercase mb-1">Life groups</h2>
              {!loading && (
                <p className="font-body text-white/40 text-xs">
                  {filtered.length} {filtered.length === 1 ? "group" : "groups"} available
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {tagFilters.map((tag) => (
                <motion.button
                  key={tag}
                  onClick={() => { setActiveTag(tag); setExpandedId(null); }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`font-body text-xs tracking-widest uppercase px-4 py-2 border transition-all duration-300 ${
                    activeTag === tag
                      ? `${tagActiveBg[tag]} border-transparent shadow-lg`
                      : "border-white/30 text-white/70 hover:border-white/60 hover:text-white bg-white/5 hover:bg-white/10"
                  }`}
                  style={{ borderRadius: "8px" }}
                >
                  {tag === "ALL" ? "All" : tagLabels[tag]}
                </motion.button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <motion.div
              className="py-16 flex flex-col items-center gap-3 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="font-heading text-white/20 font-black text-4xl">No groups yet</p>
              <p className="font-body text-white/35 text-sm max-w-xs">
                {activeTag === "ALL"
                  ? "Community groups will appear here once the admin adds them."
                  : `No ${tagLabels[activeTag as GroupTag]} groups at the moment.`}
              </p>
            </motion.div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((group, i) => {
                  const isOpen = expandedId === group._id;
                  return (
                    <motion.div
                      key={group._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      className="relative overflow-hidden"
                      style={{
                        background: isOpen
                          ? "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 100%)"
                          : "rgba(255,255,255,0.04)",
                        backdropFilter: "blur(16px)",
                        WebkitBackdropFilter: "blur(16px)",
                        border: `1px solid ${isOpen ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.10)"}`,
                        borderRadius: "16px",
                      }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <button
                        onClick={() => setExpandedId(isOpen ? null : group._id)}
                        className="w-full text-left p-5 sm:p-6 grid grid-cols-[1fr_auto] gap-4 items-start group"
                      >
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-body text-white font-bold text-base sm:text-lg">{group.name}</span>
                            <span className={`font-body text-[10px] tracking-widest uppercase px-2.5 py-1 ${tagColors[group.tag]}`} style={{ borderRadius: "6px" }}>
                              {tagLabels[group.tag]}
                            </span>
                            {group.spots !== null && (
                              <span className="font-body text-[10px] tracking-widest uppercase px-2.5 py-1 bg-rose-500/25 text-rose-200 border border-rose-400/30" style={{ borderRadius: "6px" }}>
                                {group.spots} spots left
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-white/50 text-xs">
                            <span className="font-body">{group.meets}</span>
                            <span className="text-white/30">·</span>
                            <span className="font-body">{group.leader}</span>
                          </div>
                        </div>
                        <motion.div
                          className="w-10 h-10 flex items-center justify-center border border-white/30"
                          style={{ borderRadius: "10px", background: isOpen ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)" }}
                          animate={{ rotate: isOpen ? 45 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <span className="font-body text-white/70 text-xl">+</span>
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden border-t border-white/10"
                          >
                            <div className="p-5 sm:p-6 pt-4 flex flex-col gap-5 bg-black/10">
                              <p className="font-body text-white/75 text-sm leading-relaxed max-w-2xl">{group.bio}</p>
                              <Button variant="outline" size="sm" className="self-start border-white/50 text-white bg-white/10 hover:bg-white hover:text-black font-body font-semibold tracking-wide rounded-xl text-xs px-6 py-5" asChild>
                                <a href="/contact">Join this group</a>
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        <motion.div
          className="mt-16 sm:mt-20 flex flex-col sm:flex-row sm:items-end justify-between gap-8 p-8 sm:p-10"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "24px",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
        >
          <div className="flex flex-col gap-2">
            <p className="font-body text-white/50 text-xs tracking-widest uppercase">Ready to belong?</p>
            <p className="font-heading text-white font-black text-3xl sm:text-4xl leading-tight">
              Everyone has a seat<br />at this table.
            </p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <Button variant="outline" className="border-2 border-white/60 text-white bg-white/10 hover:bg-white hover:text-black font-body font-semibold tracking-wide rounded-xl px-8 py-6 text-base" asChild>
              <a href="/contact">Get in touch</a>
            </Button>
            <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-transparent font-body tracking-wide rounded-none px-0 underline underline-offset-4 text-base" asChild>
              <a href="/events">See upcoming events →</a>
            </Button>
          </div>
        </motion.div>

        <div className="h-12" />
      </div>
    </section>
  );
}
