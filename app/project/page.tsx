"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getDailyPhoto } from "@/lib/church-photos";
import type { ProjectCategory } from "@/lib/projects-data";
import { typography, spacing, colors, glass, fonts } from "@/lib/design-system";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Project {
  _id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  status: "Ongoing" | "Completed" | "Upcoming";
  year: string;
  lead?: string;
  summary: string;
  body?: string;
  goal?: string | null;
  raised?: string | null;
  images: string[];
}

type Filter = "All" | ProjectCategory;

const filters: Filter[] = ["All", "Construction", "Outreach", "Education", "Relief"];

const categoryColors: Record<ProjectCategory, string> = {
  Construction: "bg-amber-500/20 text-amber-200",
  Outreach:     "bg-violet-500/20 text-violet-200",
  Education:    "bg-sky-500/20 text-sky-200",
  Relief:       "bg-rose-500/20 text-rose-200",
};

const categoryActiveBg: Record<Filter, string> = {
  All:          "bg-white text-black",
  Construction: "bg-amber-400 text-amber-950",
  Outreach:     "bg-violet-400 text-violet-950",
  Education:    "bg-sky-400 text-sky-950",
  Relief:       "bg-rose-400 text-rose-950",
};

const statusColors: Record<string, string> = {
  Ongoing:   "bg-emerald-500/20 text-emerald-300",
  Completed: "bg-white/10 text-white/50",
  Upcoming:  "bg-blue-500/20 text-blue-300",
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function ProjectsPage() {
  const bgUrl = getDailyPhoto(7);
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/projects?limit=100", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setProjects(data?.data?.data ?? []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  const stats = [
    { value: projects.length.toString(), label: "Active projects" },
    { value: "500+", label: "Families helped" },
    { value: "₦120M+", label: "Invested" },
    { value: "∞", label: "Impact" },
  ];

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
          className="font-black leading-[0.92] tracking-tight text-center mt-4 sm:mt-6"
          style={{ ...typography.h1, color: colors.text.primary, fontFamily: fonts.serif }}
        >
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Faith in
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.8 }}
          >
            action.
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
            We believe the church exists not just within four walls but in every
            street, school, and home it touches. These are the projects through
            which we put our faith to work.
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
                style={{
                  background: colors.background.glassLight,
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                }}
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

        {/* ── Projects grid ─────────────────────────────── */}
        <motion.div
          className="mt-12 sm:mt-16 w-full max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.7 }}
        >
          <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
            <h2 style={{ ...typography.label, color: colors.accent }}>
              Projects
            </h2>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`transition-all duration-200 ${
                    activeFilter === f
                      ? `${categoryActiveBg[f]} border-transparent`
                      : "border-white/25 text-white/60 hover:border-white/50 hover:text-white bg-transparent"
                  }`}
                  style={{
                    ...typography.label,
                    padding: "6px 12px",
                    border: "1px solid",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
            >
              {filtered.map((project, i) => (
                <motion.div
                  key={project.slug}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                >
                  <Link
                    href={`/project/${project.slug}`}
                    className="group flex flex-col transition-all duration-300 overflow-hidden"
                    style={{
                      ...glass.light,
                      boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
                    }}
                  >
                    {/* Image strip — all images shown */}
                    <div className="grid grid-cols-3 gap-px bg-white/10 h-36 sm:h-40">
                      {project.images.map((src, idx) => (
                        <div key={idx} className="relative overflow-hidden">
                          <Image
                            src={src}
                            alt={`${project.title} photo ${idx + 1}`}
                            fill
                            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 22vw, 14vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {/* dim overlay */}
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                        </div>
                      ))}
                    </div>

                    {/* Card body */}
                    <div className="flex flex-col gap-2 p-4">
                      {/* Badges */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`${categoryColors[project.category]}`}
                          style={{ ...typography.label, padding: "4px 8px" }}
                        >
                          {project.category}
                        </span>
                        <span
                          className={`${statusColors[project.status]}`}
                          style={{ ...typography.label, padding: "4px 8px" }}
                        >
                          {project.status}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-sm sm:text-base leading-snug group-hover:opacity-80 transition-opacity" style={{ ...typography.body, color: colors.text.primary }}>
                        {project.title}
                      </h3>

                      {/* Meta */}
                      <span style={{ ...typography.small, color: colors.text.tertiary }}>
                        {project.year}
                      </span>

                      {/* Summary */}
                      <p style={{ ...typography.small, color: colors.text.secondary }} className="line-clamp-2">
                        {project.summary}
                      </p>

                      {/* CTA arrow */}
                      <div className="flex justify-end mt-1">
                        <span className="text-sm group-hover:opacity-70 group-hover:translate-x-1 transition-all duration-300 inline-block" style={{ color: colors.text.tertiary }}>
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && !loading && (
            <motion.div
              className="py-16 flex flex-col items-center gap-3 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="font-black text-4xl" style={{ ...typography.h1, color: colors.text.muted, fontFamily: fonts.serif }}>No projects yet</p>
              <p style={{ ...typography.body, color: colors.text.tertiary, maxWidth: "20rem" }}>
                {activeFilter === "All"
                  ? "Projects will appear here once the admin adds them."
                  : `No ${activeFilter} projects at the moment.`}
              </p>
            </motion.div>
          )}

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          )}
        </motion.div>

        {/* ── CTA ──────────────────────────────────────── */}
        <motion.div
          className="mt-16 sm:mt-20 pt-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
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
              Get involved
            </p>
            <p className="font-black text-2xl sm:text-3xl leading-tight" style={{ ...typography.h2, color: colors.text.primary, fontFamily: fonts.serif }}>
              Your giving moves
              <br />
              mountains.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <a
              href="/give"
              className="border text-white bg-transparent hover:bg-white hover:text-black font-semibold tracking-wide px-7 py-2 text-sm transition-colors"
              style={{ borderColor: colors.border.light }}
            >
              Give now
            </a>
            <a
              href="/contact"
              className="font-semibold tracking-wide px-0 py-2 text-sm underline underline-offset-4 transition-colors"
              style={{ color: colors.text.secondary }}
              onMouseEnter={(e) => (e.currentTarget.style.color = colors.text.primary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = colors.text.secondary)}
            >
              Volunteer
            </a>
          </div>
        </motion.div>

        <div className="h-12" />
      </div>
    </section>
  );
}
