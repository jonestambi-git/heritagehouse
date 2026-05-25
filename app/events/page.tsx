"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useEvents, useRegisterForEventMutation } from "@/lib/hooks/queries";
import { useUiStore } from "@/lib/stores/uiStore";
import { getDailyPhoto } from "@/lib/church-photos";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { typography, spacing, colors, glass, fonts } from "@/lib/design-system";
import type { ChurchEvent, EventCategory } from "@/lib/types/resources";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MonthlyProgram {
  id: string;
  type: "first" | "last";
  title: string;
  time: string;
  description: string;
  notes: string;
}

const defaultMonthlyPrograms: MonthlyProgram[] = [
  {
    id: "first-day-default",
    type: "first",
    title: "First Sunday Communion Service",
    time: "10:30 AM",
    description: "Holy Communion service with special worship and prayer",
    notes: "All members are encouraged to attend",
  },
  {
    id: "last-day-default",
    type: "last",
    title: "Thanksgiving Service",
    time: "6:00 PM",
    description: "Monthly thanksgiving and testimony service",
    notes: "Bring your testimonies to share",
  },
];

type Category =
  | "All"
  | "Worship"
  | "Community"
  | "Youth"
  | "Prayer"
  | "Special";

const categoryActiveBg: Record<Category, string> = {
  All: "bg-white text-black",
  Worship: "bg-amber-400 text-amber-950",
  Community: "bg-teal-400 text-teal-950",
  Youth: "bg-violet-400 text-violet-950",
  Prayer: "bg-sky-400 text-sky-950",
  Special: "bg-rose-400 text-rose-950",
};

const categories: Category[] = [
  "All",
  "Worship",
  "Community",
  "Youth",
  "Prayer",
  "Special",
];

const categoryToEventCategories: Record<
  Exclude<Category, "All">,
  EventCategory[]
> = {
  Worship: ["SERVICE"],
  Community: ["OUTREACH"],
  Youth: ["YOUTH"],
  Prayer: ["PRAYER"],
  Special: ["OTHER"],
};

const categoryEmptyMessage: Record<Category, string> = {
  All: "No upcoming events at the moment.",
  Worship: "No worship events at the moment.",
  Community: "No community events at the moment.",
  Youth: "No youth events at the moment.",
  Prayer: "No prayer events at the moment.",
  Special: "No special events at the moment.",
};

// ─── Monthly Programs Component ───────────────────────────────────────────────

function MonthlyProgramsSection() {
  const [mounted, setMounted] = useState(false);
  const [programs] = useLocalStorage<MonthlyProgram[]>("admin-monthly-programs", defaultMonthlyPrograms);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) return null;

  if (!programs || programs.length === 0) {
    return null;
  }

  return (
    <motion.div
      className={spacing.marginTopLg}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.75, duration: 0.7 }}
    >
      <p style={{ ...typography.label, color: colors.accent, marginBottom: "1.25rem" }}>
        Monthly Special Programs
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {programs.map((program, i) => (
          <motion.div
            key={program.id}
            className="relative overflow-hidden p-6"
            style={{
              background: "linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(0,0,0,0.5) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(212,175,55,0.25)",
              borderRadius: "20px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 + i * 0.1, duration: 0.5 }}
          >
            {/* Badge */}
            <div className="flex items-center justify-between mb-4">
              <span
                className="px-3 py-1"
                style={{
                  ...typography.label,
                  background: "rgba(212,175,55,0.15)",
                  color: colors.accent,
                  border: "1px solid rgba(212,175,55,0.3)",
                  borderRadius: "8px",
                }}
              >
                {program.type === "first" ? "1st Day of Month" : "Last Day of Month"}
              </span>
              <span
                className={`w-2.5 h-2.5 rounded-full shadow-lg bg-[#D4AF37]`}
              />
            </div>

            {/* Title & Time */}
            <h3 style={{ ...typography.h4, fontFamily: fonts.serif, color: colors.text.primary, marginBottom: "0.5rem" }}>
              {program.title}
            </h3>
            <div className="flex items-center gap-2 mb-4">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ color: colors.text.tertiary }}
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span style={{ ...typography.body, color: colors.text.secondary, fontWeight: 500 }}>
                {program.time}
              </span>
            </div>

            {/* Description */}
            <p style={{ ...typography.body, color: colors.text.secondary, marginBottom: "1rem" }}>
              {program.description}
            </p>

            {/* Notes */}
            {program.notes && (
              <div
                className="inline-flex items-start gap-2 px-3 py-2"
                style={{
                  background: "rgba(0,0,0,0.45)",
                  border: `1px solid ${colors.border.light}`,
                  borderRadius: "10px",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="mt-0.5 flex-shrink-0"
                  style={{ color: colors.text.tertiary }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span style={{ ...typography.small, color: colors.text.tertiary, fontStyle: "italic" }}>
                  {program.notes}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function EventsPage() {
  const bgUrl = getDailyPhoto(6);
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const page = 1;
  const addToast = useUiStore((s) => s.addToast);
  const registerMutation = useRegisterForEventMutation();

  // Fetch real events from API
  const { data: paginatedEvents, isLoading, error, refetch } = useEvents(page);

  useEffect(() => {
    if (error) {
      addToast({ type: "error", message: "Failed to load events" });
    }
  }, [error, addToast]);

  const events = paginatedEvents?.data || [];
  const filtered =
    activeCategory === "All"
      ? events
      : events.filter((e: ChurchEvent) =>
          categoryToEventCategories[activeCategory].includes(e.category),
        );

  const handleRegister = async (eventId: string) => {
    try {
      await registerMutation.mutateAsync({
        eventId,
        registration: {
          firstName: "Guest",
          lastName: "User",
          email: "guest@example.com",
        },
      });
      addToast({ type: "success", message: "Successfully registered!" });
    } catch (error: unknown) {
      addToast({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to register",
      });
    }
  };

  return (
    <section className="relative w-full min-h-svh overflow-hidden">
      {/* Logo watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true" style={{ zIndex: 0 }}>
        <img src="/logo.png" alt="HeritageHouse Ministries watermark" className="object-contain" style={{ width: "min(80vw, 700px)", height: "min(80vw, 700px)", opacity: 0.04, userSelect: "none" }} />
      </div>
      {/* Background */}

      {/* Content */}
      <div className={`public-content relative flex flex-col items-center min-h-svh ${spacing.containerPadding} ${spacing.containerPaddingY}`} style={{ zIndex: 1 }}>
        {/* Heading */}
        <motion.h1
          className="text-white font-black leading-[0.92] tracking-tight text-center"
          style={{
            ...typography.h1,
            fontFamily: fonts.serif,
            marginTop: "clamp(1rem, 3vw, 2rem)",
          }}
        >
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Upcoming
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.8 }}
          >
            events.
          </motion.span>
        </motion.h1>

        {/* Monthly Programs */}
        <MonthlyProgramsSection />

        {/* Category filters */}
        <motion.div
          className={`flex flex-wrap gap-2 justify-center ${spacing.marginTopLg}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.6 }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setExpandedId(null);
              }}
              className={`px-4 py-1.5 border transition-all duration-200 ${
                activeCategory === cat
                  ? `${categoryActiveBg[cat]} border-transparent`
                  : "border-white/25 text-white/70 hover:border-white/50 hover:text-white bg-transparent"
              }`}
              style={{
                ...typography.label,
                borderRadius: "6px",
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Loading state */}
        {isLoading && (
          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p style={{ ...typography.body, color: colors.text.secondary }}>Loading events...</p>
          </motion.div>
        )}

        {/* Error state */}
        {!isLoading && error && (
          <motion.div
            className={`border-t flex-1 ${spacing.marginTopLg}`}
            style={{ borderColor: colors.border.light, paddingTop: "clamp(1.5rem, 3vw, 2rem)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.7 }}
          >
            <p style={{ ...typography.label, color: colors.text.tertiary }}>
              Events
            </p>
            <p style={{ ...typography.body, color: colors.text.secondary, marginTop: "0.5rem" }}>
              Unable to load events right now. Please try again.
            </p>
            <Button
              onClick={() => void refetch()}
              className="mt-4 border-white/40 text-white bg-transparent hover:bg-white hover:text-black font-body tracking-wide rounded-none text-xs px-5"
            >
              Retry
            </Button>
          </motion.div>
        )}

        {/* Events list */}
        {!isLoading && !error && (
          <motion.div
            className={`flex flex-col gap-0 flex-1 w-full max-w-4xl ${spacing.marginTopLg}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.7 }}
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((event: ChurchEvent, i) => {
                const isOpen = expandedId === event.id;
                const eventDate = new Date(event.date || event.createdAt);
                const month = eventDate
                  .toLocaleString("en", { month: "short" })
                  .toUpperCase();
                const day = eventDate.getDate().toString().padStart(2, "0");
                const dayName = eventDate.toLocaleString("en", {
                  weekday: "short",
                });

                return (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ delay: i * 0.05, duration: 0.35 }}
                    className="border-t"
                    style={{ borderColor: colors.border.light }}
                  >
                    <button
                      onClick={() => setExpandedId(isOpen ? null : event.id)}
                      className="w-full text-left py-4 sm:py-5 grid grid-cols-[64px_1fr_auto] sm:grid-cols-[80px_1fr_auto] gap-4 items-start group"
                    >
                      {/* Date block */}
                      <div className="flex flex-col items-center leading-none pt-0.5">
                        <span style={{ ...typography.label, color: colors.text.tertiary }}>
                          {month}
                        </span>
                        <span style={{ ...typography.h2, fontFamily: fonts.serif, color: colors.text.primary, marginTop: "0.25rem", lineHeight: 1 }}>
                          {day}
                        </span>
                        <span style={{ ...typography.label, color: colors.text.tertiary, marginTop: "0.25rem" }}>
                          {dayName}
                        </span>
                      </div>

                      {/* Title + meta */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span style={{ ...typography.body, color: colors.text.primary, fontWeight: 600 }} className="group-hover:opacity-80 transition-opacity">
                            {event.title}
                          </span>
                          {event.featured && (
                            <span style={{ ...typography.label, background: "rgba(212,175,55,0.15)", color: colors.accent, border: "1px solid rgba(212,175,55,0.3)", borderRadius: "4px", padding: "0.25rem 0.5rem" }}>
                              Featured
                            </span>
                          )}
                        </div>
                        <span style={{ ...typography.small, color: colors.text.tertiary }}>
                          {event.time || "TBA"} · {event.location || "TBA"}
                        </span>
                      </div>

                      {/* Expand icon */}
                      <span
                        className="transition-all duration-300"
                        style={{
                          ...typography.h3,
                          color: colors.text.tertiary,
                          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                          display: "inline-block",
                          marginTop: "0.25rem",
                        }}
                      >
                        +
                      </span>
                    </button>

                    {/* Expanded detail */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pb-6 pl-20 sm:pl-24 pr-8 flex flex-col gap-4">
                            <p style={{ ...typography.body, color: colors.text.secondary, maxWidth: "32rem" }}>
                              {event.description}
                            </p>
                            {event.imageUrl && (
                              <a
                                href={event.imageUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="block max-w-lg relative"
                              >
                                <Image
                                  src={event.imageUrl}
                                  alt={event.title}
                                  width={640}
                                  height={256}
                                  className="w-full max-h-64 object-cover"
                                  style={{ border: `1px solid ${colors.border.light}` }}
                                />
                              </a>
                            )}
                            <div className="flex gap-3 flex-wrap">
                              <Button
                                onClick={() => handleRegister(event.id)}
                                disabled={registerMutation.isPending}
                                className="border-white/40 text-white bg-transparent hover:bg-white hover:text-black font-body tracking-wide rounded-none text-xs px-5"
                              >
                                {registerMutation.isPending
                                  ? "Registering..."
                                  : "Register"}
                              </Button>
                              <Button
                                variant="ghost"
                                className="text-white/55 hover:text-white hover:bg-transparent font-body text-xs tracking-wide rounded-none px-0 underline underline-offset-4"
                              >
                                Add to calendar
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filtered.length === 0 && (
              <motion.div
                className="border-t"
                style={{ borderColor: colors.border.light, paddingTop: "clamp(1.5rem, 3vw, 2rem)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p style={{ ...typography.label, color: colors.text.tertiary }}>
                  {activeCategory === "All"
                    ? "Events"
                    : `${activeCategory} events`}
                </p>
                <p style={{ ...typography.body, color: colors.text.secondary, marginTop: "0.5rem" }}>
                  {categoryEmptyMessage[activeCategory]}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Bottom spacer */}
        <div className="h-8 sm:h-12" />
      </div>
    </section>
  );
}
