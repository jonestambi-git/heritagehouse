"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getDailyPhoto } from "@/lib/church-photos";
import { useAuthStore } from "@/lib/stores/authStore";
import { typography, colors, glass, fonts } from "@/lib/design-system";

export default function RegisterPage() {
  const router = useRouter();
  const bgUrl = getDailyPhoto(10);
  const register = useAuthStore((s) => s.register);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [key, setKey] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register({
        fullName,
        email,
        password,
        phone: phone.trim() ? phone : undefined,
        key,
      });

      setSuccess(
        "Account created successfully. You can now sign in, then update role to ADMIN in your database.",
      );

      setTimeout(() => {
        router.push("/admin-login");
      }, 1200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center px-6 py-10">
      <div
        className="page-bg"
        style={
          { "--bg-url": `url(${bgUrl})`, opacity: 0.3 } as React.CSSProperties
        }
      />
      <div className="fixed inset-0 bg-linear-to-br from-black/85 via-black/60 to-black/85 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <span style={{ ...typography.label, color: colors.text.tertiary }}>
            HeritageHouse Ministries
          </span>
          <h1 className="font-black text-4xl leading-none tracking-tight" style={{ ...typography.h2, color: colors.text.primary, fontFamily: fonts.serif }}>
            Register
          </h1>
          <p style={{ ...typography.body, color: colors.text.tertiary, marginTop: "4px" }}>
            Temporary page to create a member account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label style={{ ...typography.label, color: colors.text.tertiary }}>
              Full name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="bg-white/5 border border-white/15 px-3 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors"
              style={{ ...typography.body }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label style={{ ...typography.label, color: colors.text.tertiary }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/5 border border-white/15 px-3 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors"
              style={{ ...typography.body }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label style={{ ...typography.label, color: colors.text.tertiary }}>
              Phone (optional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-white/5 border border-white/15 px-3 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors"
              style={{ ...typography.body }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label style={{ ...typography.label, color: colors.text.tertiary }}>
              Registration key
            </label>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              required
              placeholder="Enter invite key"
              className="bg-white/5 border border-white/15 px-3 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors"
              style={{ ...typography.body }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label style={{ ...typography.label, color: colors.text.tertiary }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-white/5 border border-white/15 px-3 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors"
                style={{ ...typography.body }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label style={{ ...typography.label, color: colors.text.tertiary }}>
                Confirm password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="bg-white/5 border border-white/15 px-3 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-colors"
                style={{ ...typography.body }}
              />
            </div>
          </div>

          {error && <p style={{ ...typography.small, color: "#f87171" }}>{error}</p>}
          {success && (
            <p style={{ ...typography.small, color: "#10b981" }}>{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 border border-white/30 px-6 py-2.5 font-semibold text-sm text-white tracking-wide hover:bg-white hover:text-black transition-colors disabled:opacity-40 cursor-pointer"
            style={{ ...typography.body }}
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <div className="flex items-center justify-between">
          <Link
            href="/admin-login"
            className="text-xs hover:opacity-60 transition-opacity"
            style={{ ...typography.small, color: colors.text.tertiary }}
          >
            ← Back to admin login
          </Link>
          <Link
            href="/"
            className="text-xs hover:opacity-60 transition-opacity"
            style={{ ...typography.small, color: colors.text.tertiary }}
          >
            Return to site
          </Link>
        </div>
      </div>
    </div>
  );
}
