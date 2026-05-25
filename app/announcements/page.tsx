"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getDailyPhoto } from "@/lib/church-photos";
import { typography, spacing, colors, glass, fonts } from "@/lib/design-system";

interface Announcement {
  _id: string;
  title: string;
  message: string;
  date?: string;
  venue?: string;
  active: boolean;
  createdAt: string;
}

export default function AnnouncementsPage() {
  const bgUrl = getDailyPhoto(3);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/news?limit=50', { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        setAnnouncements(data?.data?.data ?? []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section className="relative w-full min-h-svh overflow-hidden">
      {/* Logo watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true" style={{ zIndex: 0 }}>
        <img src="/logo.png" alt="HeritageHouse Ministries watermark" className="object-contain" style={{ width: "min(80vw, 700px)", height: "min(80vw, 700px)", opacity: 0.04, userSelect: "none" }} />
      </div>

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
            Church
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.8 }}
          >
            announcements.
          </motion.span>
        </motion.h1>

        {/* Loading state */}
        {loading && (
          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p style={{ ...typography.body, color: colors.text.secondary }}>Loading announcements...</p>
          </motion.div>
        )}

        {/* Announcements List */}
        {!loading && (
          <motion.div
            className={`w-full max-w-3xl ${spacing.marginTopLg} flex flex-col ${spacing.spacingSm}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.7 }}
          >
            {announcements.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-12 sm:py-20 text-center"
                style={glass.light}
              >
                <p style={{ ...typography.body, color: colors.text.tertiary }}>No announcements at this time.</p>
                <p style={{ ...typography.small, color: colors.text.muted, marginTop: "0.5rem" }}>Check back soon.</p>
              </div>
            ) : (
              announcements.map((a, i) => (
                <motion.div
                  key={a._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 + i * 0.08, duration: 0.5 }}
                  style={{
                    ...glass.light,
                    padding: "clamp(1rem, 3vw, 1.5rem)",
                  }}
                >
                  <h2
                    style={{
                      ...typography.h4,
                      fontFamily: fonts.serif,
                      color: colors.text.primary,
                      marginBottom: "0.5rem",
                    }}
                  >
                    {a.title}
                  </h2>
                  <p
                    style={{
                      ...typography.body,
                      color: colors.text.secondary,
                      marginBottom: "1rem",
                    }}
                  >
                    {a.message}
                  </p>

                  {(a.date || a.venue) && (
                    <div className="flex flex-wrap gap-2">
                      {a.date && (
                        <div
                          className="flex items-center gap-1.5 px-3 py-1.5"
                          style={{
                            background: "rgba(0,0,0,0.45)",
                            border: `1px solid ${colors.border.light}`,
                            borderRadius: "8px",
                          }}
                        >
                          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                            <rect x="0.5" y="1.5" width="10" height="9" rx="1" stroke="currentColor" strokeWidth="1.1" fill="none" opacity=".6" />
                            <path d="M3 0.5v2M8 0.5v2M0.5 4.5h10" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity=".6" />
                          </svg>
                          <span style={{ ...typography.small, color: colors.text.tertiary }}>{a.date}</span>
                        </div>
                      )}
                      {a.venue && (
                        <div
                          className="flex items-center gap-1.5 px-3 py-1.5"
                          style={{
                            background: "rgba(0,0,0,0.45)",
                            border: `1px solid ${colors.border.light}`,
                            borderRadius: "8px",
                          }}
                        >
                          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                            <path d="M5.5 1C3.57 1 2 2.57 2 4.5c0 2.7 3.5 5.5 3.5 5.5S9 7.2 9 4.5C9 2.57 7.43 1 5.5 1z" stroke="currentColor" strokeWidth="1.1" fill="none" opacity=".6" />
                            <circle cx="5.5" cy="4.5" r="1.2" stroke="currentColor" strokeWidth="1.1" fill="none" opacity=".6" />
                          </svg>
                          <span style={{ ...typography.small, color: colors.text.tertiary }}>{a.venue}</span>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {/* Bottom spacer */}
        <div className="h-8 sm:h-12" />
      </div>
    </section>
  );
}
