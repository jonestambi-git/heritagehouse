"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getDailyPhoto } from "@/lib/church-photos";
import { typography, spacing, colors, glass, fonts } from "@/lib/design-system";

// ─── Types ───────────────────────────────────────────────────────────────────

type MinistryTag = "MEN" | "WOMEN" | "YOUTH" | "FAMILIES" | "ALL_AGES";

interface Ministry {
  _id: string;
  name: string;
  tag: MinistryTag;
  leader: string;
  meets: string;
  bio: string;
  spots: number | null;
}

interface MinistryInfo {
  _id?: string;
  title: string;
  description: string;
  image?: string;
  order: number;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const tagLabels: Record<MinistryTag, string> = {
  MEN: "Men",
  WOMEN: "Women",
  YOUTH: "Youth",
  FAMILIES: "Families",
  ALL_AGES: "All Ages",
};

const tagFilters: ("All" | MinistryTag)[] = [
  "All", "MEN", "WOMEN", "YOUTH", "FAMILIES", "ALL_AGES",
];

const tagColors: Record<MinistryTag, string> = {
  MEN: "bg-sky-500/20 text-sky-200",
  WOMEN: "bg-rose-500/20 text-rose-200",
  YOUTH: "bg-violet-500/20 text-violet-200",
  FAMILIES: "bg-amber-500/20 text-amber-200",
  ALL_AGES: "bg-teal-500/20 text-teal-200",
};

const tagActiveBg: Record<"All" | MinistryTag, string> = {
  All: "bg-white text-black",
  MEN: "bg-sky-400 text-sky-950",
  WOMEN: "bg-rose-400 text-rose-950",
  YOUTH: "bg-violet-400 text-violet-950",
  FAMILIES: "bg-amber-400 text-amber-950",
  ALL_AGES: "bg-teal-400 text-teal-950",
};

// Fallback ministries (not used when data is fetched from API)
const fallbackMinistries: Ministry[] = [
  {
    _id: "1",
    name: "Praise & Worship Team",
    tag: "ALL_AGES",
    leader: "Deacon Samuel Eze",
    meets: "Saturdays 4 PM",
    bio: "Our worship team leads the congregation into the presence of God every Sunday. We welcome singers, instrumentalists, and sound technicians who have a heart for worship.",
    spots: null,
  },
  {
    _id: "2",
    name: "Street Evangelism",
    tag: "ALL_AGES",
    leader: "Sis. Grace Nwosu",
    meets: "Last Saturday of the month",
    bio: "We take the Gospel to the streets, markets, and campuses of Port Harcourt. No experience needed — just a willing heart and a pair of comfortable shoes.",
    spots: 8,
  },
  {
    _id: "3",
    name: "Pastoral Care Team",
    tag: "ALL_AGES",
    leader: "Pastor Ruth Adeyemi",
    meets: "Wednesdays 5 PM",
    bio: "We visit the sick, support the grieving, and walk alongside members going through difficult seasons. Training is provided for all new volunteers.",
    spots: null,
  },
  {
    _id: "4",
    name: "Children's Church",
    tag: "YOUTH",
    leader: "Bro. Emeka Obi",
    meets: "Sundays 8 AM & 10:30 AM",
    bio: "We create a safe, fun, and Spirit-filled environment for children ages 3–12 to encounter God. Teachers, helpers, and creatives are all welcome.",
    spots: 5,
  },
  {
    _id: "5",
    name: "Media & Tech Ministry",
    tag: "ALL_AGES",
    leader: "Bro. Chidi Nkemdirim",
    meets: "Sundays from 7 AM",
    bio: "From live streaming to graphic design, our media team ensures every service reaches beyond the four walls of the church. Designers, videographers, and developers welcome.",
    spots: null,
  },
  {
    _id: "6",
    name: "Prison Outreach",
    tag: "MEN",
    leader: "Deacon Philip Okafor",
    meets: "Second Friday of the month",
    bio: "We minister to inmates at correctional facilities in Rivers State — bringing hope, the Word, and practical support to those who need it most.",
    spots: null,
  },
  {
    _id: "7",
    name: "Prayer Intercessors",
    tag: "ALL_AGES",
    leader: "Sis. Blessing Amadi",
    meets: "Tuesdays & Fridays 6 AM",
    bio: "The engine room of the church. Our intercessors carry the church, the city, and the nations before the throne of God. All are welcome to join.",
    spots: null,
  },
];

const stats = [
  { value: "7", label: "Active ministries" },
  { value: "200+", label: "Volunteers" },
  { value: "52", label: "Sundays a year" },
  { value: "∞", label: "Room for you" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function MinistryPage() {
  const [activeTag, setActiveTag] = useState<"All" | MinistryTag>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [settings, setSettings] = useState<any>(null);
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [ministryInfo, setMinistryInfo] = useState<MinistryInfo[]>([]);
  const [loading, setLoading] = useState(true);

  // Load pastor settings from database
  useEffect(() => {
    fetch("/api/v1/site-settings", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && data?.data) {
          setSettings(data.data);
        } else {
          setSettings({
            pastorName: "Dr. Franklin Ede",
            pastorWifeName: "Mrs. Grace Okafor",
            pastorPhotoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=faces",
            // pastorWifePhotoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces",
            pastorHidden: false,
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/v1/ministries?limit=100", { cache: "no-store" })
      .then((r) => r.json())
      .then((response) => setMinistries(response?.data ?? []))
      .catch(() => setMinistries([]))
      .finally(() => setLoading(false));
  }, []);

  // Fetch ministry info from database
  useEffect(() => {
    fetch("/api/v1/admin/ministry-info", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && data?.data) {
          setMinistryInfo(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const filtered =
    activeTag === "All"
      ? ministries
      : ministries.filter((m) => m.tag === activeTag);

  return (
    <section className="relative w-full min-h-svh overflow-hidden">
      {/* Logo watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true" style={{ zIndex: 0 }}>
        <img src="/logo.png" alt="HeritageHouse Ministries watermark" className="object-contain" style={{ width: "min(80vw, 700px)", height: "min(80vw, 700px)", opacity: 0.10, userSelect: "none" }} />
      </div>
      {/* Background */}

      {/* Content */}
      <div className={`public-content relative flex flex-col items-center min-h-svh ${spacing.containerPadding} ${spacing.containerPaddingY}`} style={{ zIndex: 1 }}>
        {/* Heading */}
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
            Serve with
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.8 }}
          >
            purpose.
          </motion.span>
        </motion.h1>

        {/* Intro + Stats */}
        <motion.div
          className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 w-full max-w-5xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7 }}
        >
          <p style={{ ...typography.body, color: colors.text.secondary, maxWidth: "28rem" }}>
            Every believer is called to serve. Our ministries are the hands and
            feet of this church — each one a place where your gifts, your time,
            and your story become part of something greater than yourself.
          </p>

          <div
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-px"
            style={{
              ...glass.light,
              overflow: "hidden",
            }}
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                className="flex flex-col gap-0.5 px-4 py-4"
                style={{ background: colors.background.glassLight, backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + i * 0.08, duration: 0.5 }}
              >
                <span className="font-black text-2xl sm:text-3xl leading-none" style={{ ...typography.h2, color: colors.text.primary, fontFamily: fonts.serif }}>
                  {s.value}
                </span>
                <span style={{ ...typography.label, color: colors.text.tertiary, marginTop: "4px" }}>
                  {s.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Lead Pastor ── */}
        {!settings?.pastorHidden && settings?.pastorName && (
          <motion.div
            className="mt-12 sm:mt-14 w-full max-w-4xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7 }}
          >
            <p style={{ ...typography.label, color: colors.accent, marginBottom: "24px" }}>
              Our Leadership
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Pastor Card */}
              <motion.div
                className="group relative overflow-hidden rounded-[16px] sm:rounded-[24px]"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.15, duration: 0.5 }}
                whileHover={{ y: -6 }}
              >
                {/* Photo — full bleed */}
                <div className="relative w-full aspect-[3/4] overflow-hidden rounded-[16px] sm:rounded-[24px]">
                  {settings.pastorPhotoUrl ? (
                    <img
                      src={settings.pastorPhotoUrl}
                      alt={settings.pastorName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => { e.currentTarget.src = ""; e.currentTarget.style.display = "none"; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/10">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/40">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                  )}

                  {/* Gradient overlay at bottom */}
                  <div
                    className="absolute inset-0 pointer-events-none rounded-[16px] sm:rounded-[24px]"
                    style={{
                      background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)",
                    }}
                  />

                  {/* Text pinned to bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 md:p-8">
                    <span
                      className="inline-block px-2 py-1 sm:px-3 sm:py-1.5 mb-1.5 sm:mb-3"
                      style={{
                        background: "rgba(255,255,255,0.15)",
                        border: `1px solid ${colors.border.light}`,
                        borderRadius: "6px",
                        color: colors.text.secondary,
                        backdropFilter: "blur(8px)",
                        ...typography.label,
                      }}
                    >
                      Lead Pastor
                    </span>
                    <h3 className="font-black text-sm sm:text-2xl md:text-3xl leading-tight tracking-tight" style={{ ...typography.h2, color: colors.text.primary, fontFamily: fonts.serif }}>
                      {settings.pastorName}
                    </h3>
                  </div>
                </div>
              </motion.div>

              {/* About Pastor Card */}
              <motion.div
                className="flex flex-col gap-4 justify-center"
                style={{
                  ...glass.light,
                  padding: "24px",
                  borderRadius: "16px",
                  border: `1px solid ${colors.border.light}`,
                }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.25, duration: 0.5 }}
              >
                <div
                  className="h-1 w-12"
                  style={{
                    background: `linear-gradient(90deg, ${colors.accent}, transparent)`,
                  }}
                />
                <h3 className="font-black text-xl sm:text-2xl leading-tight" style={{ ...typography.h3, color: colors.text.primary, fontFamily: fonts.serif }}>
                  About the Pastor
                </h3>
                <p style={{ ...typography.body, color: colors.text.secondary, lineHeight: 1.8 }}>
                  Dr. Franklin Ede is the Senior Pastor of HeritageHouse Ministries, Port Harcourt, Nigeria. He is a Chartered Accountant, Healing Evangelist, generational prophet and quintessential leader with a passion for transforming lives through the Gospel of Jesus Christ.
                </p>
                <p style={{ ...typography.body, color: colors.text.secondary, lineHeight: 1.8 }}>
                  Under his leadership, HeritageHouse Ministries has grown into a vibrant, Spirit-filled community dedicated to healing the world and rescuing mankind from the grips of the devil through the preaching of the word of grace.
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ── Ministry Information Section ── */}
        {ministryInfo.length > 0 && (
          <motion.div
            className="mt-12 sm:mt-14 w-full max-w-5xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.7 }}
          >
            <p style={{ ...typography.label, color: colors.accent, marginBottom: "32px" }}>
              Who We Are
            </p>

            <div className="space-y-6">
              {ministryInfo.map((info, i) => (
                <motion.div
                  key={info._id}
                  className="group relative overflow-hidden"
                  style={{
                    ...glass.light,
                    borderRadius: "16px",
                    border: `1px solid ${colors.border.light}`,
                  }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.25 + i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -4 }}
                >
                  {/* Accent bar at top */}
                  <div
                    className="h-1 w-full"
                    style={{
                      background: `linear-gradient(90deg, ${colors.accent}, transparent)`,
                    }}
                  />

                  <div className="p-6 sm:p-8">
                    {/* Title with number */}
                    <div className="flex items-start gap-4 mb-4">
                      <span
                        className="text-4xl sm:text-5xl font-black leading-none flex-shrink-0"
                        style={{
                          color: colors.accent,
                          opacity: 0.2,
                          fontFamily: fonts.serif,
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3
                        className="font-black text-2xl sm:text-3xl leading-tight tracking-tight"
                        style={{
                          ...typography.h2,
                          color: colors.text.primary,
                          fontFamily: fonts.serif,
                        }}
                      >
                        {info.title}
                      </h3>
                    </div>

                    {/* Description with proper formatting */}
                    <div
                      className="space-y-3"
                      style={{
                        ...typography.body,
                        color: colors.text.secondary,
                        lineHeight: 1.8,
                      }}
                    >
                      {info.description.split("\n\n").map((paragraph, idx) => (
                        <p key={idx} className="leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {/* Decorative element */}
                    <div
                      className="mt-6 h-px w-12"
                      style={{
                        background: `linear-gradient(90deg, ${colors.accent}, transparent)`,
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Ministries ────────────────────────────────── */}
        <motion.div
          className="mt-12 sm:mt-16 w-full max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.7 }}
        >
          <div className="flex items-end justify-between mb-5 flex-wrap gap-4">
            <h2 style={{ ...typography.label, color: colors.accent }}>
              Ministries
            </h2>

            {/* Tag filters */}
            <div className="flex flex-wrap gap-2">
              {tagFilters.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setActiveTag(tag);
                    setExpandedId(null);
                  }}
                  className={`transition-all duration-200 ${
                    activeTag === tag
                      ? `${tagActiveBg[tag]} border-transparent`
                      : "border-white/25 text-white/60 hover:border-white/50 hover:text-white bg-transparent"
                  }`}
                  style={{
                    ...typography.label,
                    padding: "6px 12px",
                    border: "1px solid",
                  }}
                >
                  {tag === "All" ? "All" : tagLabels[tag as MinistryTag]}
                </button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="space-y-3 pt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 border-t border-white/20 animate-pulse" />
              ))}
            </div>
          )}

          {/* Accordion */}
          {!loading && (
            <AnimatePresence mode="popLayout">
              {filtered.map((ministry, i) => {
                const id = ministry._id;
                const isOpen = expandedId === id;
                return (
                  <motion.div
                    key={id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className="border-t"
                    style={{ borderColor: colors.border.light }}
                  >
                    <button
                      onClick={() => setExpandedId(isOpen ? null : id)}
                      className="w-full text-left py-4 sm:py-5 grid grid-cols-[1fr_auto] gap-4 items-start group"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm sm:text-base group-hover:opacity-80 transition-opacity" style={{ ...typography.body, color: colors.text.primary }}>
                            {ministry.name}
                          </span>
                          <span className={`${tagColors[ministry.tag]}`} style={{ ...typography.label, padding: "4px 8px" }}>
                            {tagLabels[ministry.tag]}
                          </span>
                          {ministry.spots !== null && (
                            <span className="bg-rose-500/20 text-rose-300" style={{ ...typography.label, padding: "4px 8px" }}>
                              {ministry.spots} spots left
                            </span>
                          )}
                        </div>
                        <span style={{ ...typography.small, color: colors.text.tertiary }}>
                          {ministry.meets} · Led by {ministry.leader}
                        </span>
                      </div>
                      <span
                        className="text-lg mt-0.5 group-hover:opacity-70 transition-all duration-300 inline-block"
                        style={{ color: colors.text.tertiary, transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                      >
                        +
                      </span>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pb-6 pr-8 flex flex-col gap-4 max-w-lg">
                            <p style={{ ...typography.body, color: colors.text.secondary }}>
                              {ministry.bio}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="self-start border-white/40 text-white bg-transparent hover:bg-white hover:text-black tracking-wide rounded-none text-xs px-5"
                              asChild
                            >
                              <a href="/contact">Volunteer</a>
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}

          {!loading && filtered.length === 0 && (
            <motion.div
              className="py-16 flex flex-col items-center gap-3 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="font-black text-4xl" style={{ ...typography.h1, color: colors.text.muted, fontFamily: fonts.serif }}>No ministries yet</p>
              <p style={{ ...typography.body, color: colors.text.tertiary, maxWidth: "20rem" }}>
                {activeTag === "All"
                  ? "Ministries will appear here once the admin adds them."
                  : `No ${tagLabels[activeTag as MinistryTag]} ministries at the moment.`}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* ── How to get involved ───────────────────────── */}
        <motion.div
          className="mt-16 sm:mt-20 border-t pt-10 w-full max-w-4xl"
          style={{ borderColor: colors.border.light }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
        >
          <p style={{ ...typography.label, color: colors.text.muted, marginBottom: "32px" }}>
            How it works
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                step: "01",
                title: "Pick a ministry",
                body: "Browse the list above and find one that matches your gifts, schedule, and passion. Not sure? Come speak with a pastor.",
              },
              {
                step: "02",
                title: "Attend an orientation",
                body: "Every ministry holds a brief welcome session for new volunteers. You'll meet the team, understand the vision, and ask any questions.",
              },
              {
                step: "03",
                title: "Start serving",
                body: "You'll be onboarded, scheduled, and supported. No one is thrown in the deep end — we grow together.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="flex flex-col gap-3 px-6 py-7"
                style={{
                  ...glass.light,
                  boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.28 + i * 0.08, duration: 0.5 }}
              >
                <span className="font-black text-4xl leading-none" style={{ ...typography.h1, color: colors.text.muted, fontFamily: fonts.serif }}>
                  {item.step}
                </span>
                <span className="font-black text-lg leading-tight" style={{ ...typography.h3, color: colors.text.primary, fontFamily: fonts.serif }}>
                  {item.title}
                </span>
                <p style={{ ...typography.body, color: colors.text.secondary }}>
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── CTA ──────────────────────────────────────── */}
        <motion.div
          className="mt-16 sm:mt-20 flex flex-col sm:flex-row sm:items-end justify-between gap-6 w-full max-w-4xl"
          style={{
            ...glass.light,
            border: `1px solid ${colors.border.light}`,
            boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.07)",
            padding: "2rem",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
        >
          <div className="flex flex-col gap-1">
            <p style={{ ...typography.label, color: colors.accent }}>
              Ready to serve?
            </p>
            <p className="font-black text-2xl sm:text-3xl leading-tight" style={{ ...typography.h2, color: colors.text.primary, fontFamily: fonts.serif }}>
              Your gift was made
              <br />
              for a moment like this.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button
              variant="outline"
              className="border-white/50 text-white bg-transparent hover:bg-white hover:text-black font-semibold tracking-wide rounded-none px-7"
              asChild
            >
              <a href="/contact">Talk to a pastor</a>
            </Button>
            <Button
              variant="ghost"
              className="text-white/55 hover:text-white hover:bg-transparent font-semibold tracking-wide rounded-none px-0 underline underline-offset-4"
              asChild
            >
              <a href="/community">See life groups</a>
            </Button>
          </div>
        </motion.div>

        <div className="h-12" />
      </div>
    </section>
  );
}
