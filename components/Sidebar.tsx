"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [counts, setCounts] = useState({ active: 5, archived: 0, homework: 2, projects: 1, reminders: 1, gradebook: 1 });

  // Sync count indicators from localStorage if present
  useEffect(() => {
    const syncCounts = () => {
      const storedActive = localStorage.getItem("bulletin_notices");
      const storedArchived = localStorage.getItem("bulletin_archived");
      
      let activeList = [];
      let archivedList = [];

      if (storedActive) {
        activeList = JSON.parse(storedActive);
      }
      if (storedArchived) {
        archivedList = JSON.parse(storedArchived);
      }

      setCounts({
        active: activeList.length,
        archived: archivedList.length,
        homework: activeList.filter((n: any) => n.category === "homework").length,
        projects: activeList.filter((n: any) => n.category === "projects").length,
        reminders: activeList.filter((n: any) => n.category === "reminders").length,
        gradebook: activeList.filter((n: any) => n.category === "gradebook").length,
      });
    };

    syncCounts();
    // Set up a listener for storage events to sync across tabs/routes
    window.addEventListener("storage", syncCounts);
    
    // Set up a local polling interval to capture instant navigation transitions
    const interval = setInterval(syncCounts, 1000);

    return () => {
      window.removeEventListener("storage", syncCounts);
      clearInterval(interval);
    };
  }, [pathname]);

  const handleLinkClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Hamburger menu button for mobile (fixed outside layout container) */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#1b4332] text-white border-2 border-[#38393a] rounded shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
        title="Open Navigation"
      >
        <span className="material-symbols-outlined select-none text-xl">menu</span>
      </button>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/75 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`md:w-64 border-r-[24px] border-secondary-container bg-primary-container p-6 z-40 fixed md:relative h-full md:h-auto min-h-full transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } left-0 top-0 bottom-0 flex flex-col justify-between shrink-0`}
        style={{ width: "260px" }}
      >
        <div>
          {/* Student Info Card (Nostalgic School Report Slip) */}
          <div className="bg-[#fff9e6] p-4 rotate-[-1.5deg] shadow-lg mb-8 border border-black/10 text-zinc-950 relative">
            <div className="washi-tape h-4 w-16 absolute -top-2 left-1/2 -translate-x-1/2 rounded-xs" />
            <h2 className="font-bricolage text-xl font-bold text-emerald-950 mb-1 leading-tight">
              Student Portal
            </h2>
            <div className="border-t border-dashed border-emerald-900/30 my-2" />
            <p className="text-xs font-semibold text-emerald-900/70 tracking-wider">
              ROLL NO: 24B-01
            </p>
            <p className="text-xs font-semibold text-emerald-900/70 tracking-wider">
              GRADE: 12-A
            </p>
            <p className="text-xs font-semibold text-emerald-900/70 tracking-wider">
              HOUSE: NEHRU (GREEN)
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-4">
            <Link href="/" onClick={handleLinkClick}>
              <button
                className={`w-full flex items-center gap-3 rounded-lg shadow-sm transition-all duration-200 p-3 text-sm font-bold border border-black/5 hover:scale-105 active:scale-95 text-left cursor-pointer ${
                  pathname === "/"
                    ? "bg-secondary-container text-on-secondary-container rotate-[1deg]"
                    : "bg-emerald-900/20 text-on-primary-container/80 hover:bg-emerald-800/30 hover:rotate-[-1deg]"
                }`}
              >
                <span className="material-symbols-outlined select-none text-base">assignment</span>
                <span>Current Notices</span>
              </button>
            </Link>

            <Link href="/archive" onClick={handleLinkClick}>
              <button
                className={`w-full flex items-center gap-3 rounded-lg shadow-sm transition-all duration-200 p-3 text-sm font-bold border border-black/5 hover:scale-105 active:scale-95 text-left cursor-pointer ${
                  pathname === "/archive"
                    ? "bg-secondary-container text-on-secondary-container rotate-[-1deg]"
                    : "bg-emerald-900/20 text-on-primary-container/80 hover:bg-emerald-800/30 hover:rotate-[1deg]"
                }`}
              >
                <span className="material-symbols-outlined select-none text-base">archive</span>
                <span className="flex-1 flex justify-between items-center">
                  <span>Archived Slips</span>
                  <span className="text-[10px] bg-emerald-950/20 px-1.5 py-0.5 rounded-full font-bold">
                    {counts.archived}
                  </span>
                </span>
              </button>
            </Link>

            <Link href="/calendar" onClick={handleLinkClick}>
              <button
                className={`w-full flex items-center gap-3 rounded-lg shadow-sm transition-all duration-200 p-3 text-sm font-bold border border-black/5 hover:scale-105 active:scale-95 text-left cursor-pointer ${
                  pathname === "/calendar"
                    ? "bg-secondary-container text-on-secondary-container rotate-[1.5deg]"
                    : "bg-emerald-900/20 text-on-primary-container/80 hover:bg-emerald-800/30 hover:rotate-[-1.5deg]"
                }`}
              >
                <span className="material-symbols-outlined select-none text-base">calendar_month</span>
                <span>Calendar View</span>
              </button>
            </Link>

            <Link href="/subjects" onClick={handleLinkClick}>
              <button
                className={`w-full flex items-center gap-3 rounded-lg shadow-sm transition-all duration-200 p-3 text-sm font-bold border border-black/5 hover:scale-105 active:scale-95 text-left cursor-pointer ${
                  pathname === "/subjects"
                    ? "bg-secondary-container text-on-secondary-container rotate-[-1deg]"
                    : "bg-emerald-900/20 text-on-primary-container/80 hover:bg-emerald-800/30 hover:rotate-[1deg]"
                }`}
              >
                <span className="material-symbols-outlined select-none text-base">folder</span>
                <span>Subject Folders</span>
              </button>
            </Link>
          </nav>

          {/* Quick Categories Filter (Shows only when on notices view) */}
          {pathname === "/" && (
            <div className="mt-8 pt-6 border-t border-emerald-900/30">
              <h3 className="font-bricolage text-sm font-bold text-primary mb-3 select-none">
                SUBJECT DELIVERABLES
              </h3>
              <div className="space-y-2">
                {[
                  { value: "homework", label: "Homework", icon: "book", count: counts.homework },
                  { value: "projects", label: "Projects", icon: "science", count: counts.projects },
                  { value: "reminders", label: "Reminders", icon: "alarm", count: counts.reminders },
                  { value: "gradebook", label: "Gradebook", icon: "grading", count: counts.gradebook },
                ].map((cat) => (
                  <div
                    key={cat.value}
                    className="w-full flex items-center justify-between text-xs px-3 py-2 rounded-md text-on-primary-container/70 select-none"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-xs">{cat.icon}</span>
                      <span>{cat.label}</span>
                    </div>
                    <span className="opacity-60 bg-emerald-950/20 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      {cat.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-on-primary-container/20 mt-8">
          <div className="flex items-center gap-3 text-xs opacity-60">
            <span className="material-symbols-outlined text-sm">schedule</span>
            <span>Term Ends: 45 Days</span>
          </div>
        </div>
      </aside>
    </>
  );
}
