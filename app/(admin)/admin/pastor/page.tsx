"use client";

import { useEffect, useState } from "react";

interface PastorSettings {
  pastorName: string;
  pastorWifeName: string;
  pastorPhotoUrl: string;
  pastorWifePhotoUrl: string;
  pastorHidden: boolean;
}

const defaults: PastorSettings = {
  pastorName: "Rev. Emmanuel Okafor",
  pastorWifeName: "Mrs. Grace Okafor",
  pastorPhotoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=faces",
  pastorWifePhotoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces",
  pastorHidden: false,
};

const inputClass =
  "bg-white/5 border border-white/15 px-3 py-2.5 font-body text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/40 transition-colors w-full";

const glass: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: "12px",
};

export default function AdminPastorPage() {
  const [settings, setSettings] = useState<PastorSettings>(defaults);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [pastorImagePreview, setPastorImagePreview] = useState<string | null>(null);
  const [wifeImagePreview, setWifeImagePreview] = useState<string | null>(null);

  // Load from database on mount
  useEffect(() => {
    fetch("/api/v1/site-settings", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && data?.data) {
          const s = data.data;
          setSettings({
            pastorName: s.pastorName ?? defaults.pastorName,
            pastorWifeName: s.pastorWifeName ?? defaults.pastorWifeName,
            pastorPhotoUrl: s.pastorPhotoUrl ?? defaults.pastorPhotoUrl,
            pastorWifePhotoUrl: s.pastorWifePhotoUrl ?? defaults.pastorWifePhotoUrl,
            pastorHidden: s.pastorHidden ?? defaults.pastorHidden,
          });
          setPastorImagePreview(s.pastorPhotoUrl ?? defaults.pastorPhotoUrl);
          setWifeImagePreview(s.pastorWifePhotoUrl ?? defaults.pastorWifePhotoUrl);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setSettings((p) => ({ ...p, [name]: e.target.checked }));
    } else {
      setSettings((p) => ({ ...p, [name]: value }));
      // Update preview when URL is typed
      if (name === "pastorPhotoUrl") setPastorImagePreview(value);
      if (name === "pastorWifePhotoUrl") setWifeImagePreview(value);
    }
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, type: "pastor" | "wife") {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert(`Image must be under 10MB. Your file: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (!base64?.startsWith("data:image")) {
        alert("Failed to read image. Please try again.");
        e.target.value = "";
        return;
      }
      if (type === "pastor") {
        setPastorImagePreview(base64);
        setSettings((p) => ({ ...p, pastorPhotoUrl: base64 }));
      } else {
        setWifeImagePreview(base64);
        setSettings((p) => ({ ...p, pastorWifePhotoUrl: base64 }));
      }
    };
    reader.onerror = () => {
      alert("Error reading image. Please try a different file.");
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/v1/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "Failed to save");

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setError(err.message ?? "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 max-w-4xl mx-auto">
        <div className="h-8 w-48 bg-white/5 animate-pulse rounded mb-4" />
        <div className="h-64 bg-white/5 animate-pulse rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <span className="font-body text-white/30 text-[10px] tracking-widest uppercase">Admin</span>
        <h1 className="font-heading text-white font-black text-3xl sm:text-4xl leading-none tracking-tight mt-0.5">
          Lead Pastor
        </h1>
        <p className="font-body text-white/40 text-sm mt-2">
          Manage pastor information and photos. Changes sync across all devices.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Visibility */}
        <section className="p-5 sm:p-6 flex flex-col gap-4" style={glass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-white/30 text-[10px] tracking-widest uppercase mb-1">Visibility</p>
              <p className="font-body text-white/50 text-xs">Show pastor section on Ministry and Location pages</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="pastorHidden"
                checked={!settings.pastorHidden}
                onChange={(e) => setSettings((p) => ({ ...p, pastorHidden: !e.target.checked }))}
                className="w-5 h-5 accent-white"
              />
              <span className="font-body text-white/60 text-sm">Visible</span>
            </label>
          </div>
        </section>

        {/* Lead Pastor */}
        <section className="p-5 sm:p-6 flex flex-col gap-4" style={glass}>
          <p className="font-body text-white/30 text-[10px] tracking-widest uppercase">Lead Pastor</p>

          <div className="flex flex-col gap-3">
            <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Photo</label>
            <div className="flex items-start gap-4">
              <div className="w-32 h-40 overflow-hidden flex-shrink-0" style={{ border: "2px solid rgba(255,255,255,0.2)", borderRadius: "12px", background: "rgba(255,255,255,0.05)" }}>
                {pastorImagePreview ? (
                  <img src={pastorImagePreview} alt="Pastor preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/30">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-white/30 font-body text-white text-sm hover:bg-white/10 transition-colors cursor-pointer" style={{ borderRadius: "8px" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  Upload from device
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "pastor")} className="hidden" />
                </label>
                <p className="font-body text-white/30 text-xs">Or paste URL below. Max 10MB. All formats supported.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Photo URL (optional)</label>
            <input name="pastorPhotoUrl" value={settings.pastorPhotoUrl} onChange={handleChange} placeholder="https://example.com/pastor.jpg" className={inputClass} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Full Name</label>
            <input name="pastorName" value={settings.pastorName} onChange={handleChange} placeholder="Rev. John Doe" className={inputClass} required />
          </div>
        </section>

        {/* Pastor's Wife */}
        <section className="p-5 sm:p-6 flex flex-col gap-4" style={glass}>
          <p className="font-body text-white/30 text-[10px] tracking-widest uppercase">Pastor&apos;s Wife</p>

          <div className="flex flex-col gap-3">
            <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Photo</label>
            <div className="flex items-start gap-4">
              <div className="w-32 h-40 overflow-hidden flex-shrink-0" style={{ border: "2px solid rgba(255,255,255,0.2)", borderRadius: "12px", background: "rgba(255,255,255,0.05)" }}>
                {wifeImagePreview ? (
                  <img src={wifeImagePreview} alt="Wife preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/30">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-white/30 font-body text-white text-sm hover:bg-white/10 transition-colors cursor-pointer" style={{ borderRadius: "8px" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  Upload from device
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "wife")} className="hidden" />
                </label>
                <p className="font-body text-white/30 text-xs">Or paste URL below. Max 10MB. All formats supported.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Photo URL (optional)</label>
            <input name="pastorWifePhotoUrl" value={settings.pastorWifePhotoUrl} onChange={handleChange} placeholder="https://example.com/wife.jpg" className={inputClass} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">Full Name</label>
            <input name="pastorWifeName" value={settings.pastorWifeName} onChange={handleChange} placeholder="Mrs. Jane Doe" className={inputClass} required />
          </div>
        </section>

        {error && <p className="font-body text-red-400 text-xs">{error}</p>}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="border border-white/30 px-6 py-2.5 font-body font-semibold text-sm text-white hover:bg-white hover:text-black transition-colors disabled:opacity-40 cursor-pointer"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          {saved && <span className="font-body text-emerald-400 text-xs">✓ Saved — synced to all devices</span>}
        </div>
      </form>
    </div>
  );
}
