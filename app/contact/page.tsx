"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDailyPhoto } from "@/lib/church-photos";
import { API_BASE_URL } from "@/lib/constants/config";
import { typography, spacing, colors, glass, fonts } from "@/lib/design-system";

interface ServiceSchedule {
  _id?: string;
  day: string;
  title: string;
  time: string;
  description?: string;
}

const defaultSchedules: ServiceSchedule[] = [
  // {
  //   day: "Monday",
  //   title: "Counseling",
  //   time: "08:00 AM - 05:00 PM",
  //   description: "Pastoral counseling and spiritual guidance",
  // },
  {
    day: "Tuesday",
    title: "Counseling",
    time: "12:00 AM",
    description: "One on one with our Papa",
  },
  {
    day: "Friday",
    title: "Evangelism",
    time: "04:00 PM",
    description: "Soul winnig",
  },
  {
    day: "Sunday",
    title: "Services",
    time: "9:00 AM",
    description: "Sunday services",
  },
];

const contactDetails = [
  {
    label: "Contact Person",
    value: "HeritageHouse Head Quarter",
    href: null,
  },
  {
    label: "Official Line",
    value: "+234 810 800 8447",
    href: "tel:+2348108008447",
  },
  {
    label: "Email",
    value: "contact@heritagehouse.org.ng",
    href: "mailto:contact@heritagehouse.org.ng",
  },
  {
    label: "Address",
    value: "Plot 11b Ameachi Drive, Opp Norwegian Int'l School, Behind Casablanca, GRA Phase 3, Port Harcourt 500101, Rivers State",
    href: "https://maps.google.com/maps?q=Plot+11b+Ameachi+Drive+Port+Harcourt",
  },
];

type FormState = "idle" | "sending" | "sent" | "error";

const inputClass =
  "bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:border-white/60 focus-visible:ring-0 rounded-none h-10";

export default function ContactPage() {
  const bgUrl = getDailyPhoto(3);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.3], [40, 0]);

  const [schedules, setSchedules] = useState<ServiceSchedule[]>(defaultSchedules);
  const [loadingSchedules, setLoadingSchedules] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<FormState>("idle");

  // Fetch service schedules
  useEffect(() => {
    async function fetchSchedules() {
      try {
        const res = await fetch("/api/v1/admin/service-schedule");
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setSchedules(data.data);
        }
      } catch (error) {
        console.error("Error fetching schedules:", error);
      } finally {
        setLoadingSchedules(false);
      }
    }
    fetchSchedules();
  }, []);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen overflow-hidden">
      {/* Logo watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true" style={{ zIndex: 0 }}>
        <img src="/logo.png" alt="HeritageHouse Ministries watermark" className="object-contain" style={{ width: "min(80vw, 700px)", height: "min(80vw, 700px)", opacity: 0.10, userSelect: "none" }} />
      </div>

      {/* Content */}
      <motion.div className={`public-content relative flex flex-col items-center ${spacing.containerPadding} ${spacing.containerPaddingY}`} style={{ zIndex: 1, opacity, y }}>
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
            Get in
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.8 }}
          >
            touch.
          </motion.span>
        </motion.h1>

        {/* Body */}
        <motion.div
          className={`w-full max-w-5xl flex-1 ${spacing.marginTopLg}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          {/* Top section - Contact details and form */}
          <div className={`grid grid-cols-1 lg:grid-cols-2 ${spacing.sectionGapLarge}`}>
            {/* Left — details */}
            <div className="flex flex-col gap-6 sm:gap-8">
              <p style={{ ...typography.body, color: colors.text.secondary, maxWidth: "28rem" }}>
                We&apos;d love to hear from you. Reach out with any questions,
                prayer requests, or if you&apos;d simply like to know more about
                our community.
              </p>
              <dl className="flex flex-col gap-4 sm:gap-5">
                {contactDetails.map((item, i) => (
                  <motion.div
                    key={item.label}
                    className="flex flex-col border-t"
                    style={{ borderColor: colors.border.light, paddingTop: "1rem" }}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 + i * 0.1, duration: 0.6 }}
                  >
                    <dt style={{ ...typography.label, color: colors.text.tertiary, marginBottom: "0.25rem" }}>
                      {item.label}
                    </dt>
                    <dd>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="transition-colors"
                          style={{
                            ...typography.body,
                            color: colors.text.primary,
                            fontWeight: 600,
                          }}
                          target={
                            item.href.startsWith("http") ? "_blank" : undefined
                          }
                          rel={
                            item.href.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                          onMouseEnter={(e) => (e.currentTarget.style.color = colors.text.secondary)}
                          onMouseLeave={(e) => (e.currentTarget.style.color = colors.text.primary)}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span style={{ ...typography.body, color: colors.text.primary, fontWeight: 600 }}>
                          {item.value}
                        </span>
                      )}
                    </dd>
                  </motion.div>
                ))}
              </dl>
            </div>

            {/* Right — form */}
            <div style={{ ...glass.light, padding: "clamp(1.5rem, 3vw, 2rem)" }}>
            {status === "sent" ? (
              <motion.div
                className="flex flex-col gap-3 py-6 sm:py-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <span style={{ ...typography.label, color: colors.text.tertiary }}>
                  Message sent
                </span>
                <p style={{ ...typography.h2, fontFamily: fonts.serif, color: colors.text.primary }}>
                  Thank you,
                  <br />
                  {form.name.split(" ")[0] || "friend"}.
                </p>
                <p style={{ ...typography.body, color: colors.text.secondary, maxWidth: "20rem" }}>
                  We&apos;ll get back to you as soon as we can. May God bless
                  your day.
                </p>
                <button
                  onClick={() => {
                    setStatus("idle");
                    setForm({
                      name: "",
                      email: "",
                      phone: "",
                      subject: "",
                      message: "",
                    });
                  }}
                  className="mt-4 self-start transition-colors"
                  style={{
                    ...typography.small,
                    color: colors.text.tertiary,
                    textDecoration: "underline",
                    textUnderlineOffset: "4px",
                  } as React.CSSProperties}
                  onMouseEnter={(e) => (e.currentTarget.style.color = colors.text.primary)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = colors.text.tertiary)}
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label style={{ ...typography.label, color: colors.primary }}>
                      Name
                    </label>
                    <Input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label style={{ ...typography.label, color: colors.primary }}>
                      Email
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Phone + Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label style={{ ...typography.label, color: colors.primary }}>
                      Phone{" "}
                      <span className="normal-case opacity-50">(optional)</span>
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+234 800 000 0000"
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label style={{ ...typography.label, color: colors.primary }}>
                      Subject
                    </label>
                    <Select
                      value={form.subject}
                      onValueChange={(v) =>
                        setForm((p) => ({ ...p, subject: v }))
                      }
                    >
                      <SelectTrigger
                        className={`${inputClass} w-full data-[size=default]:h-10`}
                      >
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General inquiry</SelectItem>
                        <SelectItem value="prayer">Prayer request</SelectItem>
                        <SelectItem value="membership">Membership</SelectItem>
                        <SelectItem value="events">
                          Events &amp; programs
                        </SelectItem>
                        <SelectItem value="pastoral">Pastoral care</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1">
                  <label style={{ ...typography.label, color: colors.primary }}>
                    Message
                  </label>
                  <Textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Write your message here…"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:border-white/60 focus-visible:ring-0 rounded-none resize-none"
                  />
                </div>

                {/* Error */}
                {status === "error" && (
                  <p style={{ ...typography.body, color: "#ef4444" }}>
                    Something went wrong. Please try again.
                  </p>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={status === "sending"}
                  variant="outline"
                  className="mt-1 self-start gap-2 border-white/50 text-white bg-transparent hover:bg-white hover:text-black font-body tracking-wide rounded-none px-7"
                >
                  {status === "sending" && (
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  )}
                  {status === "sending" ? "Sending…" : "Send message"}
                </Button>
              </form>
            )}
          </div>
          </div>

          {/* Middle — Service Schedule */}
          <motion.div
            className="w-full mt-12 sm:mt-16 pt-12 sm:pt-16 border-t"
            style={{ borderColor: colors.border.light }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            <h3 style={{ ...typography.h3, fontFamily: fonts.serif, color: colors.text.primary, marginBottom: "2rem", textAlign: "center" }}>
              Service Schedule
            </h3>
            {loadingSchedules ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {schedules.map((schedule, i) => (
                  <motion.div
                    key={schedule._id || schedule.day}
                    className="flex flex-col items-center text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6 + i * 0.1, duration: 0.5 }}
                  >
                    <p style={{ ...typography.label, color: colors.primary, marginBottom: "0.5rem" }}>
                      {schedule.day}
                    </p>
                    <p style={{ ...typography.body, color: colors.text.primary }}>
                      {schedule.title}
                    </p>
                    <p style={{ ...typography.small, color: colors.text.tertiary, marginTop: "0.25rem" }}>
                      {schedule.time}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
