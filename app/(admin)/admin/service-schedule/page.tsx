"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { typography, spacing, colors, glass, fonts } from "@/lib/design-system";

interface ServiceSchedule {
  _id?: string;
  day: string;
  title: string;
  time: string;
  description?: string;
}

const defaultSchedules: ServiceSchedule[] = [
  {
    day: "Monday",
    title: "Counseling",
    time: "08:00 AM - 05:00 PM",
    description: "Pastoral counseling and spiritual guidance",
  },
  {
    day: "Tuesday",
    title: "Night Vigil",
    time: "10:00 PM - 06:00 AM",
    description: "Prayer and worship night",
  },
  {
    day: "Friday",
    title: "Healing & Deliverance",
    time: "08:00 AM - 05:30 PM",
    description: "Healing service and deliverance ministry",
  },
  {
    day: "Sunday",
    title: "Services",
    time: "8:00 AM & 12:30 PM",
    description: "Main worship services",
  },
];

export default function ServiceSchedulePage() {
  const [schedules, setSchedules] = useState<ServiceSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<ServiceSchedule>({
    day: "",
    title: "",
    time: "",
    description: "",
  });

  // Fetch schedules
  useEffect(() => {
    fetchSchedules();
  }, []);

  async function fetchSchedules() {
    try {
      const res = await fetch("/api/v1/admin/service-schedule");
      const data = await res.json();
      if (data.success) {
        setSchedules(data.data);
      } else {
        // Initialize with defaults if no data
        setSchedules(defaultSchedules);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setSchedules(defaultSchedules);
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave() {
    if (!formData.day || !formData.title || !formData.time) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      if (editingId) {
        // Update
        const res = await fetch("/api/v1/admin/service-schedule", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, _id: editingId }),
        });
        const data = await res.json();
        if (data.success) {
          setSchedules((prev) =>
            prev.map((s) => (s._id === editingId ? { ...formData, _id: editingId } : s))
          );
          setEditingId(null);
        }
      } else {
        // Create
        const res = await fetch("/api/v1/admin/service-schedule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          setSchedules((prev) => [...prev, data.data]);
          setIsAdding(false);
        }
      }
      setFormData({ day: "", title: "", time: "", description: "" });
    } catch (error) {
      console.error("Error saving schedule:", error);
      alert("Failed to save schedule");
    }
  }

  async function handleDelete(_id: string | undefined) {
    if (!_id) return;
    if (!confirm("Are you sure you want to delete this schedule?")) return;

    try {
      const res = await fetch("/api/v1/admin/service-schedule", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id }),
      });
      const data = await res.json();
      if (data.success) {
        setSchedules((prev) => prev.filter((s) => s._id !== _id));
      }
    } catch (error) {
      console.error("Error deleting schedule:", error);
      alert("Failed to delete schedule");
    }
  }

  function handleEdit(schedule: ServiceSchedule) {
    setFormData(schedule);
    setEditingId(schedule._id || null);
    setIsAdding(false);
  }

  function handleCancel() {
    setFormData({ day: "", title: "", time: "", description: "" });
    setEditingId(null);
    setIsAdding(false);
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ ...typography.h2, fontFamily: fonts.serif, color: colors.text.primary }}>
            Service Schedule
          </h1>
          <p style={{ ...typography.body, color: colors.text.secondary, marginTop: "0.5rem" }}>
            Manage church service times and events
          </p>
        </div>
        {!isAdding && !editingId && (
          <Button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-body px-6 py-2 rounded-lg"
          >
            + Add Schedule
          </Button>
        )}
      </div>

      {/* Form */}
      <AnimatePresence>
        {(isAdding || editingId) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 p-6 rounded-lg"
            style={{ ...glass.light }}
          >
            <h3 style={{ ...typography.h3, fontFamily: fonts.serif, color: colors.text.primary, marginBottom: "1.5rem" }}>
              {editingId ? "Edit Schedule" : "Add New Schedule"}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-2">
                <label style={{ ...typography.label, color: colors.primary }}>
                  Day *
                </label>
                <Input
                  name="day"
                  value={formData.day}
                  onChange={handleInputChange}
                  placeholder="e.g., Monday"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:border-white/60 rounded-lg h-10"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label style={{ ...typography.label, color: colors.primary }}>
                  Title *
                </label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Counseling"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:border-white/60 rounded-lg h-10"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-4">
              <label style={{ ...typography.label, color: colors.primary }}>
                Time *
              </label>
              <Input
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                placeholder="e.g., 08:00 AM - 05:00 PM"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:border-white/60 rounded-lg h-10"
              />
            </div>

            <div className="flex flex-col gap-2 mb-6">
              <label style={{ ...typography.label, color: colors.primary }}>
                Description
              </label>
              <Textarea
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                placeholder="Optional description"
                rows={3}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:border-white/60 rounded-lg resize-none"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white font-body px-6 py-2 rounded-lg"
              >
                {editingId ? "Update" : "Create"}
              </Button>
              <Button
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-700 text-white font-body px-6 py-2 rounded-lg"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Schedules List */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {schedules.map((schedule, i) => (
              <motion.div
                key={schedule._id || schedule.day}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-lg group hover:shadow-lg transition-all"
                style={{ ...glass.light }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p style={{ ...typography.label, color: colors.primary, marginBottom: "0.25rem" }}>
                      {schedule.day}
                    </p>
                    <h3 style={{ ...typography.h4, fontFamily: fonts.serif, color: colors.text.primary }}>
                      {schedule.title}
                    </h3>
                  </div>
                </div>

                <p style={{ ...typography.body, color: colors.text.secondary, marginBottom: "0.5rem" }}>
                  {schedule.time}
                </p>

                {schedule.description && (
                  <p style={{ ...typography.small, color: colors.text.tertiary, marginBottom: "1rem" }}>
                    {schedule.description}
                  </p>
                )}

                <div className="flex gap-2 pt-4 border-t" style={{ borderColor: colors.border.light }}>
                  <Button
                    onClick={() => handleEdit(schedule)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-body text-sm py-1.5 rounded"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(schedule._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-body text-sm py-1.5 rounded"
                  >
                    Delete
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && schedules.length === 0 && (
        <div className="text-center py-12">
          <p style={{ ...typography.body, color: colors.text.tertiary }}>
            No service schedules yet. Create one to get started.
          </p>
        </div>
      )}
    </div>
  );
}
