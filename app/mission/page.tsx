"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getDailyPhoto } from "@/lib/church-photos";
import { typography, spacing, colors, glass, fonts } from "@/lib/design-system";

// ─── Data ────────────────────────────────────────────────────────────────────

const pillars = [
  {
    icon: "✦",
    title: "Worship",
    body: "Encountering the living God in spirit and truth — through prayer, praise, and the preaching of His Word every week.",
  },
  {
    icon: "◈",
    title: "Community",
    body: "Building authentic relationships that reflect Christ's love. No one walks alone. We carry each other's burdens and celebrate each other's breakthroughs.",
  },
  {
    icon: "◎",
    title: "Mission",
    body: "Taking the Gospel beyond our four walls — to neighbourhoods, campuses, hospitals, prisons, and nations.",
  },
];

const values = [
  {
    id: 1,
    name: "Scripture First",
    sub: "The Bible is our authority and compass",
    body: "Every decision we make — pastoral, financial, structural — is measured against the Word of God. We do not bend Scripture to culture; we let Scripture shape culture.",
  },
  {
    id: 2,
    name: "Holy Spirit Power",
    sub: "We believe in a Spirit-filled life",
    body: "We are Pentecostal in conviction and practice. We believe the gifts of the Spirit are active today and that every believer can live and serve in the Spirit's power.",
  },
  {
    id: 3,
    name: "Radical Generosity",
    sub: "We give our resources, time, and lives",
    body: "Generosity is not a budget line — it's a posture. We tithe, we give, and we serve because we have received freely and choose to give freely.",
  },
  {
    id: 4,
    name: "Integrity in All Things",
    sub: "Public and private character must align",
    body: "We hold ourselves and our leaders to a high standard not out of perfectionism, but because trust is the currency of ministry. What we do in private defines who we are in public.",
  },
  {
    id: 5,
    name: "Faithful to the Ends of the Earth",
    sub: "Missions is not optional",
    body: "Port Harcourt is not our final destination — it is our launching pad. We invest in local, national, and international mission efforts as an expression of our obedience to the Great Commission.",
  },
];

const timeline = [
  {
    year: "2006",
    heading: "Founded.",
    desc: "Pastor James Okafor and a congregation of 14 began meeting in a single room in Rumuola, Port Harcourt — with nothing but faith and a shared hunger for God.",
  },
  {
    year: "2011",
    heading: "First building.",
    desc: "After five years of house meetings and rented halls, the church dedicated its first permanent facility — debt-free — through the giving of the congregation.",
  },
  {
    year: "2018",
    heading: "1,000 members.",
    desc: "A landmark milestone and a reminder that growth is God's business. We expanded our pastoral team and launched six life groups.",
  },
  {
    year: "Today",
    heading: "1,200+ members, 40+ nations.",
    desc: "We are a church that looks like heaven — diverse, united, and still reaching. The mission continues.",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function MissionPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const bgUrl = getDailyPhoto(9);

  return (
    <section className="relative w-full min-h-svh overflow-hidden">
      {/* Logo watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true" style={{ zIndex: 0 }}>
        <img src="/logo.png" alt="HeritageHouse Ministries watermark" className="object-contain" style={{ width: "min(80vw, 700px)", height: "min(80vw, 700px)", opacity: 0.04, userSelect: "none" }} />
      </div>
      {/* Fixed background */}

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
            Why we
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.8 }}
          >
            exist.
          </motion.span>
        </motion.h1>

        {/* Intro + Scripture */}
        <motion.div
          className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 w-full max-w-5xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7 }}
        >
          <p style={{ ...typography.body, color: colors.text.secondary, maxWidth: "28rem" }}>
            Our mission is not a programme — it&apos;s a calling. For over
            eighteen years, we have pursued one thing: to know God deeply, make
            Him known boldly, and serve humanity selflessly — right here in Port
            Harcourt and beyond.
          </p>

          <div className="border-l-2 pl-5 flex flex-col gap-2" style={{ borderColor: colors.border.light }}>
            <p className="font-black text-lg sm:text-xl leading-snug" style={{ ...typography.h3, color: colors.text.primary, fontFamily: fonts.serif }}>
              &quot;Go therefore and make disciples of all nations, baptising
              them in the name of the Father and of the Son and of the Holy
              Spirit.&quot;
            </p>
            <span style={{ ...typography.label, color: colors.text.tertiary }}>
              Matthew 28:19 — The Great Commission
            </span>
          </div>
        </motion.div>

        {/* ── Pillars ───────────────────────────────────── */}
        <motion.div
          className="mt-12 sm:mt-16 w-full max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.7 }}
        >
          <p style={{ ...typography.label, color: colors.accent, marginBottom: "20px" }}>
            Our three pillars
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                className="flex flex-col gap-3 px-6 py-7"
                style={{
                  ...glass.light,
                  boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + i * 0.08, duration: 0.5 }}
              >
                <span className="text-xl leading-none" style={{ color: colors.text.secondary }}>
                  {p.icon}
                </span>
                <span className="font-black text-lg leading-tight" style={{ ...typography.h3, color: colors.text.primary, fontFamily: fonts.serif }}>
                  {p.title}
                </span>
                <p style={{ ...typography.body, color: colors.text.secondary }}>
                  {p.body}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Values + Timeline ─────────────────────────── */}
        <motion.div
          className="mt-12 sm:mt-16 border-t pt-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20"
          style={{ borderColor: colors.border.light }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
        >
          {/* Values accordion */}
          <div>
            <p style={{ ...typography.label, color: colors.accent, marginBottom: "20px" }}>
              Core values
            </p>

            {values.map((v) => {
              const isOpen = expandedId === v.id;
              return (
                <div key={v.id} className="border-t" style={{ borderColor: colors.border.light }}>
                  <button
                    onClick={() => setExpandedId(isOpen ? null : v.id)}
                    className="w-full text-left py-4 sm:py-5 grid grid-cols-[1fr_auto] gap-4 items-start group"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-sm sm:text-base group-hover:opacity-80 transition-colors" style={{ ...typography.body, color: colors.text.primary }}>
                        {v.name}
                      </span>
                      <span style={{ ...typography.small, color: colors.text.tertiary }}>
                        {v.sub}
                      </span>
                    </div>
                    <span
                      className="text-lg mt-0.5 group-hover:opacity-70 transition-all duration-300 inline-block"
                      style={{
                        color: colors.text.tertiary,
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      }}
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
                        <div className="pb-6 pr-8">
                          <p style={{ ...typography.body, color: colors.text.secondary, maxWidth: "28rem" }}>
                            {v.body}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Timeline */}
          <div>
            <p style={{ ...typography.label, color: colors.accent, marginBottom: "20px" }}>
              Our story
            </p>

            <div className="relative pl-6">
              {/* Vertical line */}
              <div className="absolute left-0 top-2 bottom-2 w-px" style={{ background: colors.border.light }} />

              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  className="relative pl-5 pb-7 last:pb-0"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + i * 0.12, duration: 0.5 }}
                >
                  {/* Dot */}
                  <div className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full" style={{ background: colors.border.light }} />

                  <p style={{ ...typography.label, color: colors.text.tertiary, marginBottom: "4px" }}>
                    {item.year}
                  </p>
                  <p style={{ ...typography.body, color: colors.text.secondary }}>
                    <strong style={{ color: colors.text.primary }}>
                      {item.heading}
                    </strong>{" "}
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
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
              Be part of the mission
            </p>
            <p className="font-black text-2xl sm:text-3xl leading-tight" style={{ ...typography.h2, color: colors.text.primary, fontFamily: fonts.serif }}>
              This story is still
              <br />
              being written.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button
              variant="outline"
              className="border-white/50 text-white bg-transparent hover:bg-white hover:text-black font-semibold tracking-wide rounded-none px-7"
              asChild
            >
              <a href="/contact">Join us this Sunday</a>
            </Button>
            <Button
              variant="ghost"
              className="text-white/55 hover:text-white hover:bg-transparent font-semibold tracking-wide rounded-none px-0 underline underline-offset-4"
              asChild
            >
              <a href="/community">Explore life groups</a>
            </Button>
          </div>
        </motion.div>

        <div className="h-12" />
      </div>
    </section>
  );
}
