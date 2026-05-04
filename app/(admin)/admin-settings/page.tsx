"use client";

import { useState } from "react";

const inputClass =
  "bg-white/5 border border-white/15 px-3 py-2.5 font-body text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/40 transition-colors w-full";

const glass: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: "12px",
};

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (!currentPassword) {
      setMessage({ type: "error", text: "Current password is required" });
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (newPassword && newPassword.length < 8) {
      setMessage({ type: "error", text: "New password must be at least 8 characters" });
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newEmail: newEmail || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "Failed to update credentials" });
        return;
      }

      setMessage({ type: "success", text: "Credentials updated successfully!" });
      
      // Clear form
      setCurrentPassword("");
      setNewEmail("");
      setNewPassword("");
      setConfirmPassword("");

      // Auto-hide success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <span className="font-body text-white/30 text-[10px] tracking-widest uppercase">
          Admin
        </span>
        <h1 className="font-heading text-white font-black text-3xl sm:text-4xl leading-none tracking-tight mt-0.5">
          Settings
        </h1>
        <p className="font-body text-white/40 text-sm mt-2">
          Manage your admin account credentials.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Change Credentials */}
        <section className="p-5 sm:p-6 flex flex-col gap-4" style={glass}>
          <p className="font-body text-white/30 text-[10px] tracking-widest uppercase">
            Change Credentials
          </p>

          {/* Current Password */}
          <div className="flex flex-col gap-1">
            <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
              Current Password *
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className={inputClass}
              required
            />
            <p className="font-body text-white/30 text-xs mt-1">
              Required to verify your identity
            </p>
          </div>

          {/* New Email */}
          <div className="flex flex-col gap-1">
            <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
              New Email (optional)
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Leave blank to keep current email"
              className={inputClass}
            />
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-1">
            <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
              New Password (optional)
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              className={inputClass}
              minLength={8}
            />
            <p className="font-body text-white/30 text-xs mt-1">
              Minimum 8 characters
            </p>
          </div>

          {/* Confirm New Password */}
          {newPassword && (
            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className={inputClass}
                required={!!newPassword}
              />
            </div>
          )}

          {/* Message */}
          {message && (
            <div
              className={`px-4 py-3 font-body text-sm ${
                message.type === "success"
                  ? "bg-green-500/10 border border-green-500/30 text-green-400"
                  : "bg-red-500/10 border border-red-500/30 text-red-400"
              }`}
              style={{ borderRadius: "8px" }}
            >
              {message.text}
            </div>
          )}
        </section>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="border border-white/30 px-6 py-2.5 font-body font-semibold text-sm text-white hover:bg-white hover:text-black transition-colors disabled:opacity-40 cursor-pointer"
          >
            {saving ? "Updating…" : "Update Credentials"}
          </button>
        </div>
      </form>

      {/* Security Note */}
      <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20" style={{ borderRadius: "8px" }}>
        <p className="font-body text-yellow-400/80 text-xs">
          <strong>Security Note:</strong> After changing your credentials, you will need to sign in again with your new email and/or password.
        </p>
      </div>
    </div>
  );
}
