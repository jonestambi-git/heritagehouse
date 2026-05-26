"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface MinistryInfo {
  _id?: string;
  title: string;
  description: string;
  image?: string;
  order: number;
}

const inputClass =
  "bg-white/5 border border-white/15 px-3 py-2.5 font-body text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/40 transition-colors w-full";

export default function AdminMinistryInfoPage() {
  const [items, setItems] = useState<MinistryInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<MinistryInfo>({
    title: "",
    description: "",
    order: 1,
  });

  // Fetch ministry info
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/v1/admin/ministry-info");
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch ministry info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      alert("Title and description are required");
      return;
    }

    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const res = await fetch("/api/v1/admin/ministry-info", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { ...formData, _id: editingId } : formData),
      });

      const data = await res.json();
      if (data.success) {
        await fetchItems();
        setFormData({ title: "", description: "", order: 1 });
        setEditingId(null);
      }
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Failed to save ministry info");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: MinistryInfo) => {
    setFormData(item);
    setEditingId(item._id || null);
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id || !confirm("Are you sure?")) return;

    try {
      const res = await fetch(`/api/v1/admin/ministry-info?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        await fetchItems();
      }
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("Failed to delete ministry info");
    }
  };

  const handleCancel = () => {
    setFormData({ title: "", description: "", order: 1 });
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Ministry Information</h1>

        {/* Form */}
        <div className="bg-white/5 border border-white/15 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit" : "Add New"} Ministry Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Our Vision"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter detailed description..."
                rows={5}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                className={inputClass}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
              >
                {saving ? "Saving..." : editingId ? "Update" : "Add"}
              </Button>
              {editingId && (
                <Button
                  onClick={handleCancel}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded"
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Current Items</h2>

          {loading ? (
            <p className="text-white/50">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-white/50">No ministry information yet</p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="bg-white/5 border border-white/15 rounded-lg p-4 flex justify-between items-start"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-white/60 text-sm mt-1 line-clamp-2">{item.description}</p>
                    <p className="text-white/40 text-xs mt-2">Order: {item.order}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => handleEdit(item)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded text-sm"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
