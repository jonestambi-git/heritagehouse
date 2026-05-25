"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { getDailyPhoto, getDailyScripture } from "@/lib/church-photos";
import AnnouncementModal from "@/components/AnnouncementModal";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Sermon {
  _id: string;
  title: string;
  pastor: string;
  scripture: string;
  date: string;
  slug?: string;
}

// ─── Service Times Component ──────────────────────────────────────────────────

interface SiteSettings {
  sundayHidden?: boolean;
  sundayTime1?: string;
  sundayTime2?: string;
  mondayHidden?: boolean;
  mondayTime?: string;
  tuesdayHidden?: boolean;
  tuesdayTime?: string;
  wednesdayHidden?: boolean;
  wednesdayTime?: string;
  thursdayHidden?: boolean;
  thursdayTime?: string;
  fridayHidden?: boolean;
  fridayTime?: string;
  saturdayHidden?: boolean;
  saturdayTime?: string;
}

function ServiceTimes() {
  const [serviceDays, setServiceDays] = useState<Array<{ day: string; time: string }>>([]);
  const [settings] = useLocalStorage<SiteSettings | null>("admin-site-settings", null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!settings) {
      setServiceDays([
        { day: "Sunday", time: "8:00 AM & 10:30 AM" },
        { day: "Wednesday", time: "6:00 PM" },
        { day: "Friday", time: "6:00 AM Prayer" },
      ]);
      return;
    }
    const days: Array<{ day: string; time: string }> = [];
    if (!settings.sundayHidden && (settings.sundayTime1 || settings.sundayTime2)) {
      const times = [settings.sundayTime1, settings.sundayTime2].filter(Boolean).join(" & ");
      days.push({ day: "Sunday", time: times });
    }
    if (!settings.mondayHidden && settings.mondayTime) days.push({ day: "Monday", time: settings.mondayTime });
    if (!settings.tuesdayHidden && settings.tuesdayTime) days.push({ day: "Tuesday", time: settings.tuesdayTime });
    if (!settings.wednesdayHidden && settings.wednesdayTime) days.push({ day: "Wednesday", time: settings.wednesdayTime });
    if (!settings.thursdayHidden && settings.thursdayTime) days.push({ day: "Thursday", time: settings.thursdayTime });
    if (!settings.fridayHidden && settings.fridayTime) days.push({ day: "Friday", time: settings.fridayTime });
    if (!settings.saturdayHidden && settings.saturdayTime) days.push({ day: "Saturday", time: settings.saturdayTime });
    setServiceDays(days);
  }, [settings, mounted]);

  if (!mounted || serviceDays.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-px w-full"
      style={{ background: "rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
      {serviceDays.map((s, i) => (
        <div key={s.day} className="flex flex-col gap-1 px-6 py-5" style={{ background: "#0b0b0b" }}>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#42a7c0", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" }}>
            {s.day}
          </span>
          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "rgba(255,255,255,0.85)", fontSize: "20px", fontWeight: 600, lineHeight: 1.2 }}>
            {s.time}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Monthly Programs Component ───────────────────────────────────────────────

interface MonthlyProgram {
  id: string;
  day: string;
  title: string;
  time: string;
  description: string;
  notes: string;
}

const defaultMonthlyPrograms: MonthlyProgram[] = [
  {
    id: "first-day-default",
    day: "1st Sunday",
    title: "First Sunday Communion Service",
    time: "10:30 AM",
    description: "Holy Communion service with special worship and prayer",
    notes: "All members are encouraged to attend",
  },
  {
    id: "last-day-default",
    day: "Last Day",
    title: "Thanksgiving Service",
    time: "6:00 PM",
    description: "Monthly thanksgiving and testimony service",
    notes: "Bring your testimonies to share",
  },
];

function MonthlyPrograms() {
  const [programs] = useLocalStorage<MonthlyProgram[]>("admin-monthly-programs", defaultMonthlyPrograms);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted || !programs || programs.length === 0) return null;

  return (
    <section className="relative z-10" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-7xl mx-auto px-8 py-20 sm:px-14">
        {/* Section header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <motion.p
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#42a7c0", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "8px" }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Monthly Gatherings
            </motion.p>
            <motion.h2
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "white", fontWeight: 700, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", lineHeight: 1.1 }}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              Mark Your Calendar
            </motion.h2>
          </div>
          <div className="hidden sm:block w-24 h-px" style={{ background: "linear-gradient(to right, rgba(66,167,192,0.5), transparent)" }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {programs.map((program, i) => (
            <motion.div
              key={program.id}
              className="group relative overflow-hidden"
              style={{ borderRadius: "2px", background: "#111", border: "1px solid rgba(255,255,255,0.07)" }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
            >
              {/* Number watermark */}
              <span
                className="absolute top-4 right-5 pointer-events-none select-none"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "80px",
                  fontWeight: 700,
                  color: "rgba(66,167,192,0.06)",
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Top accent bar */}
              <div className="h-0.5 w-full" style={{ background: "linear-gradient(to right, #42a7c0, transparent)" }} />

              <div className="px-8 py-8">
                {/* Day badge */}
                <span
                  className="inline-block mb-5 px-3 py-1"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "9px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#42a7c0",
                    border: "1px solid rgba(66,167,192,0.3)",
                    borderRadius: "2px",
                  }}
                >
                  {program.day}
                </span>

                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    color: "rgba(255,255,255,0.92)",
                    fontWeight: 700,
                    fontSize: "clamp(1.3rem, 2.5vw, 1.75rem)",
                    lineHeight: 1.2,
                    marginBottom: "8px",
                  }}
                >
                  {program.title}
                </h3>

                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "#42a7c0", fontSize: "15px", marginBottom: "16px", fontStyle: "italic" }}>
                  {program.time}
                </p>

                <p style={{ fontFamily: "var(--font-body, sans-serif)", color: "rgba(255,255,255,0.5)", fontSize: "13px", lineHeight: 1.7, marginBottom: "20px" }}>
                  {program.description}
                </p>

                {program.notes && (
                  <p style={{ fontFamily: "var(--font-body, sans-serif)", color: "rgba(255,255,255,0.3)", fontSize: "11px", letterSpacing: "0.04em", borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "16px" }}>
                    {program.notes}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Quick Links & Daily Quotes ───────────────────────────────────────────────

const quickLinks = [
  { label: "Visit Us", href: "/location" },
  { label: "Messages", href: "/sermons" },
  { label: "Life Groups", href: "/community" },
  { label: "Give & Support", href: "/give" },
];

const dailyQuotes = [
  { quote: "Faith is not the absence of doubt — it is the decision to trust despite it.", ref: "Hebrews 11:1" },
  { quote: "You are not an afterthought in His story. You are the reason He entered the wilderness.", ref: "Genesis 16:13" },
  { quote: "The table is His. The food is His. The invitation is His. Your only job is to come.", ref: "Psalm 23:5" },
  { quote: "Open your hands. Whatever He wants to place here, receive. Whatever He wants to remove, release.", ref: "Matthew 6:10" },
  { quote: "You are not loved because of what you do. You are loved because of who you are — His.", ref: "Matthew 3:17" },
  { quote: "In this house, we believe there is a God worth talking to. We believe He is listening.", ref: "Joshua 24:15" },
  { quote: "To be seen by God is not a threat. It is the safest thing there is.", ref: "Genesis 16:13" },
];

function getDailyQuote() {
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  return dailyQuotes[dayOfYear % dailyQuotes.length];
}

export default function Hero() {
  const bgUrl = getDailyPhoto(0);
  const scripture = getDailyScripture(0);
  const dailyQuote = getDailyQuote();
  const [recentSermons, setRecentSermons] = useState<Sermon[]>([]);
  const [loadingSermons, setLoadingSermons] = useState(true);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  // Gallery images for sections
  const galleryImages = [
    { src: getDailyPhoto(0), alt: "Church interior" },
    { src: getDailyPhoto(1), alt: "Church exterior" },
    { src: getDailyPhoto(2), alt: "Worship service" },
  ];

  const ministryImages = [
    { src: getDailyPhoto(3), alt: "Ministry 1" },
    { src: getDailyPhoto(4), alt: "Ministry 2" },
    { src: getDailyPhoto(5), alt: "Ministry 3" },
    { src: getDailyPhoto(6), alt: "Ministry 4" },
  ];

  useEffect(() => {
    async function fetchSermons() {
      try {
        const response = await fetch("/api/v1/sermons?limit=3");
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) setRecentSermons(result.data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch sermons:", error);
      } finally {
        setLoadingSermons(false);
      }
    }
    fetchSermons();
  }, []);

  return (
    <>
      {/* Google Fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap');
      `}</style>

      {/* ── Hero section ─────────────────────────────── */}
      <section ref={heroRef} className="relative w-full overflow-hidden" style={{ minHeight: "clamp(80vh, 100svh, 120vh)" }}>

        {/* Parallax background */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{ y: bgY, scale: bgScale, transformOrigin: "center center" }}
        >
          <img
            src={bgUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ zIndex: 0 }}
          />
        </motion.div>

        {/* Sophisticated gradient overlay — dark on left, lighter on right */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(105deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.78) 40%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.72) 100%)",
            zIndex: 1,
          }}
        />

        {/* Vertical text — editorial accent */}
        <div
          className="absolute left-5 top-1/2 hidden lg:flex items-center gap-2"
          style={{ zIndex: 3, transform: "translateY(-50%)" }}
        >
          <span
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "rgba(255,255,255,0.15)",
              fontSize: "9px",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              writingMode: "vertical-rl",
              textOrientation: "mixed",
            }}
          >
            God&apos;s Own Favour Prophetic Ministry
          </span>
          <div className="w-px h-20" style={{ background: "rgba(66,167,192,0.3)" }} />
        </div>

        {/* Page number — bottom right editorial detail */}
        <div
          className="absolute bottom-8 right-8 hidden lg:flex flex-col items-end gap-1"
          style={{ zIndex: 3 }}
        >
          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "rgba(255,255,255,0.12)", fontSize: "42px", fontWeight: 300, lineHeight: 1 }}>
            01
          </span>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "rgba(255,255,255,0.15)", fontSize: "8px", letterSpacing: "0.3em", textTransform: "uppercase" }}>
            Welcome
          </span>
        </div>

        {/* Main content */}
        <div
          className="relative h-full flex flex-col justify-between px-4 py-8 sm:px-8 sm:py-12 lg:px-14 lg:py-16"
          style={{ zIndex: 2, minHeight: "clamp(80vh, 100svh, 120vh)" }}
        >
          {/* Top row — badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="flex items-center justify-between"
          >
            <span
              className="inline-flex items-center gap-2.5 px-5 py-2"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "rgba(255,255,255,0.55)",
                fontSize: "9px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "2px",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              God&apos;s Own Favour Prophetic Ministry · Eleme
            </span>
          </motion.div>

          {/* Center — main headline block */}
          <div className="flex flex-col max-w-4xl">

            {/* Thin rule + overline */}
            <motion.div
              className="flex items-center gap-3 mb-4 sm:mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              <div className="h-px w-8 sm:w-10" style={{ background: "#42a7c0" }} />
              <span
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  color: "#42a7c0",
                  fontSize: "clamp(8px, 2vw, 10px)",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                }}
              >
                Port Harcourt, Nigeria
              </span>
            </motion.div>

            {/* Giant headline — Cormorant serif */}
            <div className="overflow-hidden mb-2 sm:mb-3">
              <motion.h1
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ delay: 0.55, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  color: "white",
                  fontWeight: 700,
                  lineHeight: 0.88,
                  letterSpacing: "-0.02em",
                  fontSize: "clamp(2.5rem, 8vw, 8rem)",
                }}
              >
                Love God,
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-6 sm:mb-8">
              <motion.h1
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ delay: 0.68, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  color: "rgba(255,255,255,0.45)",
                  fontWeight: 300,
                  fontStyle: "italic",
                  lineHeight: 0.88,
                  letterSpacing: "-0.02em",
                  fontSize: "clamp(2.5rem, 8vw, 8rem)",
                }}
              >
                Serve People.
              </motion.h1>
            </div>

            {/* Tagline & description */}
            <motion.div
              className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-8 mb-8 sm:mb-10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.7 }}
            >
              <div className="flex-1">
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    color: "rgba(255,255,255,0.65)",
                    fontSize: "clamp(1rem, 2vw, 1.4rem)",
                    fontStyle: "italic",
                    fontWeight: 300,
                    marginBottom: "6px",
                  }}
                >
                  Every soul is welcome here.
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body, sans-serif)",
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "clamp(12px, 2vw, 13px)",
                    lineHeight: 1.7,
                    maxWidth: "400px",
                  }}
                >
                  A Spirit-filled family rooted in the Word, alive in worship, and committed to transforming lives — right here in Port Harcourt.
                </p>
              </div>

              {/* Scripture pull-quote */}
              <div
                className="flex-shrink-0 sm:max-w-xs"
                style={{
                  borderLeft: "2px solid #42a7c0",
                  paddingLeft: "16px",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    color: "rgba(255,255,255,0.75)",
                    fontSize: "clamp(14px, 2vw, 16px)",
                    fontStyle: "italic",
                    lineHeight: 1.5,
                    marginBottom: "6px",
                  }}
                >
                  &ldquo;{scripture.text}&rdquo;
                </p>
                <span
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: "#42a7c0",
                    fontSize: "8px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                  }}
                >
                  {scripture.verse}
                </span>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap gap-2 sm:gap-3"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.65 }}
            >
              <Link
                href="/location"
                className="group relative overflow-hidden inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-7 py-2.5 sm:py-3.5 transition-all duration-300"
                style={{
                  background: "#42a7c0",
                  borderRadius: "2px",
                }}
              >
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                />
                <span
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: "#000",
                    fontSize: "clamp(9px, 2vw, 11px)",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                  }}
                >
                  Plan a Visit
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "#000" }}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/live-service"
                className="group inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-7 py-2.5 sm:py-3.5 transition-all duration-300 hover:bg-white/10"
                style={{
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: "2px",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: "rgba(255,255,255,0.8)",
                    fontSize: "clamp(9px, 2vw, 11px)",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                  }}
                >
                  Watch Live
                </span>
              </Link>

              <Link
                href="/give"
                className="group inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 transition-all duration-300 hover:bg-white/5"
                style={{ borderRadius: "2px" }}
              >
                <span
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: "rgba(255,255,255,0.35)",
                    fontSize: "clamp(9px, 2vw, 11px)",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                  }}
                  className="group-hover:text-white/60 transition-colors"
                >
                  Give
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Bottom — sermons strip */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7 }}
          >
            <div
              className="w-full overflow-x-auto"
              style={{
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex flex-col sm:flex-row items-stretch min-w-full">
                {/* Label column */}
                <div
                  className="flex-shrink-0 px-4 sm:px-6 py-4 sm:py-5 flex flex-col justify-center"
                  style={{ borderRight: "1px solid rgba(255,255,255,0.08)", minWidth: "140px" }}
                >
                  <p
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      color: "#42a7c0",
                      fontSize: "clamp(8px, 2vw, 9px)",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      marginBottom: "4px",
                    }}
                  >
                    Recent Messages
                  </p>
                  <Link
                    href="/sermons"
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      color: "rgba(255,255,255,0.3)",
                      fontSize: "clamp(8px, 2vw, 9px)",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                    }}
                    className="hover:text-white/60 transition-colors"
                  >
                    View all →
                  </Link>
                </div>

                {/* Sermons */}
                <div className="flex flex-col sm:flex-row flex-1 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.06]">
                  {loadingSermons ? (
                    <div className="flex-1 flex items-center justify-center py-4 sm:py-6 px-4 sm:px-6">
                      <span style={{ fontFamily: "var(--font-body, sans-serif)", color: "rgba(255,255,255,0.25)", fontSize: "12px" }}>Loading sermons...</span>
                    </div>
                  ) : recentSermons.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center py-4 sm:py-6 px-4 sm:px-6">
                      <span style={{ fontFamily: "var(--font-body, sans-serif)", color: "rgba(255,255,255,0.25)", fontSize: "12px" }}>No messages yet</span>
                    </div>
                  ) : (
                    recentSermons.map((sermon, i) => (
                      <Link
                        key={sermon.slug || sermon._id}
                        href={`/sermons/${sermon.slug || sermon._id}`}
                        className="group flex-1 flex flex-col justify-center gap-1 px-4 sm:px-6 py-4 sm:py-5 transition-all duration-200 hover:bg-white/[0.04]"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span
                            style={{
                              fontFamily: "'Cormorant Garamond', Georgia, serif",
                              color: "rgba(255,255,255,0.8)",
                              fontSize: "clamp(13px, 2vw, 15px)",
                              lineHeight: 1.3,
                              fontWeight: 600,
                            }}
                            className="group-hover:text-white transition-colors line-clamp-2"
                          >
                            {sermon.title}
                          </span>
                          <span
                            className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5"
                            style={{ color: "#42a7c0" }}
                          >
                            →
                          </span>
                        </div>
                        <span
                          style={{
                            fontFamily: "var(--font-body, sans-serif)",
                            color: "rgba(255,255,255,0.3)",
                            fontSize: "clamp(10px, 2vw, 11px)",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {sermon.scripture} · {sermon.pastor}
                        </span>
                      </Link>
                    ))
                  )}
                </div>

                {/* Daily quote */}
                <div
                  className="flex-shrink-0 px-4 sm:px-6 py-4 sm:py-5 flex flex-col justify-center sm:max-w-xs"
                  style={{ borderLeft: "1px solid rgba(255,255,255,0.08)", background: "rgba(66,167,192,0.04)" }}
                >
                  <p
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      color: "#42a7c0",
                      fontSize: "clamp(8px, 2vw, 9px)",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                    }}
                  >
                    Today&apos;s Word
                  </p>
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      color: "rgba(255,255,255,0.65)",
                      fontSize: "clamp(12px, 2vw, 13px)",
                      fontStyle: "italic",
                      lineHeight: 1.55,
                      marginBottom: "6px",
                    }}
                  >
                    &ldquo;{dailyQuote.quote}&rdquo;
                  </p>
                  <span
                    style={{
                      fontFamily: "var(--font-body, sans-serif)",
                      color: "rgba(255,255,255,0.25)",
                      fontSize: "10px",
                      letterSpacing: "0.08em",
                    }}
                  >
                    — {dailyQuote.ref}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Quick links strip ─────────────────────────── */}
      <section className="relative z-10" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-8 sm:py-12 lg:px-14">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px" style={{ background: "rgba(255,255,255,0.06)" }}>
            {quickLinks.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.5 }}
              >
                <Link
                  href={item.href}
                  className="group flex items-center justify-between gap-2 sm:gap-3 py-4 sm:py-6 px-3 sm:px-6 transition-all duration-300"
                  style={{ background: "#0a0a0a" }}
                >
                  <div className="flex items-center gap-2 sm:gap-4">
                    <span
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        color: "rgba(66,167,192,0.3)",
                        fontSize: "clamp(20px, 5vw, 28px)",
                        fontWeight: 300,
                        lineHeight: 1,
                      }}
                      className="group-hover:text-[#42a7c0] transition-colors duration-300"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        color: "rgba(255,255,255,0.45)",
                        fontSize: "clamp(9px, 2vw, 10px)",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                      }}
                      className="group-hover:text-white transition-colors duration-300"
                    >
                      {item.label}
                    </span>
                  </div>
                  <span
                    className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 flex-shrink-0"
                    style={{ color: "#42a7c0", fontSize: "12px" }}
                  >
                    →
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission section ───────────────────────────── */}
      <section className="relative z-10 overflow-hidden" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Logo watermark */}
        <div
          className="absolute inset-0 flex items-center justify-end pointer-events-none select-none pr-4 sm:pr-8"
          aria-hidden="true"
        >
          <Image
            src="/heritage-house-logo.svg"
            alt=""
            width={500}
            height={500}
            className="object-contain"
            style={{ opacity: 0.03, userSelect: "none" }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-12 sm:px-8 sm:py-20 lg:px-14 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-24">

            {/* Left — section label + heading */}
            <div className="flex flex-col justify-between">
              <div>
                <motion.p
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: "#42a7c0",
                    fontSize: "clamp(9px, 2vw, 10px)",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    marginBottom: "16px",
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  Our Purpose
                </motion.p>

                <motion.h2
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "clamp(1.8rem, 5vw, 4rem)",
                    lineHeight: 1.05,
                    letterSpacing: "-0.01em",
                    marginBottom: "24px",
                  }}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.7 }}
                >
                  Built on the Word.<br />
                  <span style={{ fontWeight: 300, fontStyle: "italic", color: "rgba(255,255,255,0.5)" }}>
                    Moved by the Spirit.
                  </span>
                </motion.h2>

                <motion.div
                  className="flex flex-wrap gap-4 sm:gap-5 mb-8 sm:mb-12"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.7 }}
                >
                  <Link
                    href="/mission"
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      color: "rgba(255,255,255,0.5)",
                      fontSize: "clamp(10px, 2vw, 11px)",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      textDecoration: "underline",
                      textUnderlineOffset: "4px",
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Our full story →
                  </Link>
                  <Link
                    href="/community"
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      color: "rgba(255,255,255,0.3)",
                      fontSize: "clamp(10px, 2vw, 11px)",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      textDecoration: "underline",
                      textUnderlineOffset: "4px",
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Find a life group →
                  </Link>
                </motion.div>
              </div>

              {/* Stats — stacked column */}
              <motion.div
                className="grid grid-cols-2 gap-px"
                style={{ background: "rgba(255,255,255,0.05)" }}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25, duration: 0.7 }}
              >
                {[
                  { value: "18+", label: "Years serving" },
                  { value: "1,200+", label: "Members" },
                  { value: "40+", label: "Nations" },
                  { value: "∞", label: "Impact" },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col gap-1 px-4 sm:px-6 py-4 sm:py-6" style={{ background: "#0a0a0a" }}>
                    <span
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        color: "white",
                        fontWeight: 300,
                        fontSize: "clamp(1.5rem, 4vw, 2.8rem)",
                        lineHeight: 1,
                        marginBottom: "2px",
                      }}
                    >
                      {s.value}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        color: "rgba(255,255,255,0.3)",
                        fontSize: "clamp(8px, 2vw, 9px)",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                      }}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — mission text */}
            <motion.div
              className="flex flex-col justify-center"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.7 }}
            >
              {/* Decorative line */}
              <div className="w-8 sm:w-12 h-0.5 mb-6 sm:mb-8" style={{ background: "#42a7c0" }} />

              <p
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "clamp(1rem, 2vw, 1.35rem)",
                  lineHeight: 1.75,
                  fontWeight: 400,
                  marginBottom: "20px",
                }}
              >
                We are not just a congregation — we are a family on mission. For over
                eighteen years, AG Church Choba 2 has been a place where broken people
                find wholeness, seekers find truth, and believers grow deeper in Christ.
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body, sans-serif)",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "clamp(13px, 2vw, 14px)",
                  lineHeight: 1.8,
                }}
              >
                Rooted in faith and community, we are passionate about
                Spirit-filled worship, sound biblical teaching, and reaching every
                soul in Port Harcourt and beyond with the love of Jesus.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Service times strip ───────────────────────── */}
      <section className="relative z-10" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#080808" }}>
        <div className="max-w-7xl mx-auto px-4 py-10 sm:px-8 sm:py-14 lg:px-14">
          <div className="flex flex-col gap-6 sm:gap-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-3">
              <div>
                <p
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: "#42a7c0",
                    fontSize: "clamp(9px, 2vw, 10px)",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Gather with us
                </p>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "clamp(1.3rem, 3vw, 2.2rem)",
                    lineHeight: 1.15,
                  }}
                >
                  Come as you are.{" "}
                  <span style={{ fontWeight: 300, fontStyle: "italic", color: "rgba(255,255,255,0.45)" }}>
                    Leave transformed.
                  </span>
                </p>
              </div>
            </div>
            <ServiceTimes />
          </div>
        </div>
      </section>

      {/* ── Monthly Programs ───────────────────────────── */}
      <MonthlyPrograms />

      {/* ── Announcement Modal ────────────────────────── */}
      <AnnouncementModal />
    </>
  );
}