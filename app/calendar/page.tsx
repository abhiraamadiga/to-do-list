"use client";

import React from "react";
import Link from "next/link";
import CalendarDashboard from "../dashboard";

export default function CalendarRoute() {
  const dummyToggle = () => {};

  return (
    <main className="flex-1 flex flex-col z-10 min-w-0 h-full overflow-hidden">
      {/* Blackboard header scaled for calendar */}
      <header className="bg-primary-container px-6 md:px-8 py-3 flex flex-col sm:flex-row gap-4 justify-between items-center w-full border-b-[24px] border-secondary-container shadow-lg shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="chalk-text font-bricolage text-3xl md:text-4xl font-extrabold text-on-primary-container drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)] select-none">
            Calendar Board
          </h1>
        </div>
        <div className="flex gap-4 items-center shrink-0">
          <Link href="/">
            <button className="text-xs font-black uppercase bg-[#fff9e6] hover:bg-[#fffcf0] text-[#0e3727] px-3.5 py-2 shadow-xs border border-black/5 hover:scale-105 active:scale-95 transition-all cursor-pointer">
              Back to Notices
            </button>
          </Link>
        </div>
      </header>

      {/* Render the fully interactive calendar component */}
      <CalendarDashboard
        onToggleView={dummyToggle}
        activeTab="current"
        setActiveTab={dummyToggle}
      />
    </main>
  );
}
