"use client";

import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export default function AdminTour() {
  useEffect(() => {
    // Only show once per session
    if (sessionStorage.getItem("admin-tour-done")) return;

    const driverObj = driver({
      showProgress: true,
      animate: true,
      overlayColor: "rgba(0,0,0,0.7)",
      stagePadding: 6,
      stageRadius: 8,
      popoverClass: "admin-tour-popover",
      steps: [
        {
          element: "[data-tour='sidebar']",
          popover: {
            title: "Navigation",
            description: "Use the sidebar to move between Sermons, Events, Messages, and Live settings.",
            side: "right",
            align: "start",
          },
        },
        {
          element: "[data-tour='stats']",
          popover: {
            title: "Overview",
            description: "A quick snapshot of your content — total sermons, featured, series, and pastors.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "[data-tour='sermons-table']",
          popover: {
            title: "Sermons",
            description: "All your sermons are listed here. Click the Sermons link in the sidebar to create, edit, or delete them.",
            side: "top",
            align: "start",
          },
        },
        {
          element: "[data-tour='quick-links']",
          popover: {
            title: "Quick links",
            description: "Jump straight to Events, Live settings, or Messages from here.",
            side: "top",
            align: "start",
          },
        },
      ],
      onDestroyStarted: () => {
        sessionStorage.setItem("admin-tour-done", "1");
        driverObj.destroy();
      },
    });

    // Small delay so the DOM is fully painted
    const t = setTimeout(() => driverObj.drive(), 600);
    return () => clearTimeout(t);
  }, []);

  return null;
}
