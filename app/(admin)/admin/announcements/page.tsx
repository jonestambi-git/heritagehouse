"use client";

import { useEffect, useState } from "react";

interface NewsItem {
  _id: string;
  title: string;
  message: string;
  date?: string;
  venue?: string;
  active: boolean;
  createdAt: string;
}

const emptyForm = {
  title: "",
  message: "",
  date: "",
  venue: "",
  active: true,
};

const inputClass =
  "bg-white/5 border border-white/15 px-3 py-2.5 font-body text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/40 transition-colors w-full";

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/v1/admin/news", { credentials: "include", cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setNews(data?.data ?? []))
      .catch(() => setNews([]));
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    setForm((p) => ({
      ...p,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  function startEdit(item: NewsItem) {
    setEditing(item._id);
    setForm({
      title: item.title,
      message: item.message,
      date: item.date ?? "",
      venue: item.venue ?? "",
      active: item.active,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancel() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(false);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const method = editing ? "PUT" : "POST";
      const body = editing ? { ...form, _id: editing } : form;

      const res = await fetch("/api/v1/admin/news", {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "Failed to save");

      // Refresh list
      const updated = await fetch("/api/v1/admin/news", { credentials: "include", cache: "no-store" });
      const updatedData = await updated.json();
      setNews(updatedData?.data ?? []);
      cancel();
    } catch (err: any) {
      setError(err.message ?? "Failed to save news");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this news item?")) return;
    try {
      const res = await fetch("/api/v1/admin/news", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ _id: id }),
      });
      if (res.ok) setNews((p) => p.filter((n) => n._id !== id));
    } catch {
      alert("Failed to delete news item");
    }
  }

  async function toggleActive(item: NewsItem) {
    try {
      const res = await fetch("/api/v1/admin/news", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ _id: item._id, active: !item.active }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNews((p) => p.map((n) => n._id === item._id ? { ...n, active: !n.active } : n));
      }
    } catch {
      alert("Failed to update news item");
    }
  }

  return (
    <div className="flex flex-col min-h-screen px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <span className="font-body text-white/30 text-[10px] tracking-widest uppercase">Admin</span>
          <h1 className="font-heading text-white font-black text-3xl sm:text-4xl leading-none tracking-tight mt-0.5">
            News
          </h1>
          <p className="font-body text-white/40 text-sm mt-1">
            Manage church announcements and news.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setEditing(null); setForm(emptyForm); setShowForm(true); }}
            className="border border-white/30 px-5 py-2 font-body font-semibold text-sm text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
          >
            + New item
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="border border-white/10 p-6 mb-10 backdrop-blur-sm bg-white/3">
          <p className="font-body text-white/30 text-[10px] tracking-widest uppercase mb-5">
            {editing ? "Edit news item" : "New news item"}
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Title */}
            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="News headline"
                className={inputClass}
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1">
              <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Message *</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Full news content…"
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Date & Venue */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                  Date <span className="normal-case opacity-50">(optional)</span>
                </label>
                <input
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  placeholder="e.g. Sunday, June 1"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
                  Venue <span className="normal-case opacity-50">(optional)</span>
                </label>
                <input
                  name="venue"
                  value={form.venue}
                  onChange={handleChange}
                  placeholder="e.g. Main Auditorium"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Active toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
                className="w-4 h-4 accent-white"
              />
              <span className="font-body text-white/60 text-sm">Visible to public</span>
            </label>

            {error && <p className="font-body text-red-400 text-xs">{error}</p>}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="self-start border border-white/30 px-6 py-2.5 font-body font-semibold text-sm text-white hover:bg-white hover:text-black transition-colors disabled:opacity-40 cursor-pointer"
              >
                {saving ? "Saving…" : editing ? "Update" : "Publish"}
              </button>
              <button
                type="button"
                onClick={cancel}
                className="font-body text-white/40 text-sm hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <p className="font-body text-white/30 text-[10px] tracking-widest uppercase mb-2">
        {news.length} item{news.length !== 1 ? "s" : ""}
      </p>
      {news.length === 0 && (
        <p className="font-body text-white/25 text-sm">No news items yet.</p>
      )}
      {news.map((item) => (
        <div
          key={item._id}
          className="flex items-start justify-between gap-4 py-4 border-t border-white/10 hover:border-white/20 transition-colors"
        >
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-body text-white font-semibold text-sm truncate">{item.title}</span>
              <span
                className={`font-body text-[9px] tracking-widest uppercase px-1.5 py-0.5 border ${
                  item.active
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                    : "bg-white/5 text-white/30 border-white/10"
                }`}
              >
                {item.active ? "Live" : "Hidden"}
              </span>
            </div>
            <span className="font-body text-white/35 text-xs line-clamp-1">{item.message}</span>
            {(item.date || item.venue) && (
              <span className="font-body text-white/25 text-xs">
                {[item.date, item.venue].filter(Boolean).join(" · ")}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => toggleActive(item)}
              className="font-body text-white/40 text-xs hover:text-white transition-colors cursor-pointer"
            >
              {item.active ? "Hide" : "Show"}
            </button>
            <button
              onClick={() => startEdit(item)}
              className="font-body text-white/40 text-xs hover:text-white transition-colors cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item._id)}
              className="font-body text-white/25 text-xs hover:text-red-400 transition-colors cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
