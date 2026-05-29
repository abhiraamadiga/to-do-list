"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Notice {
  id: string;
  title: string;
  content: string;
  category: "homework" | "projects" | "reminders" | "gradebook";
  color: "yellow" | "pink" | "green" | "blue";
  pinColor: "red" | "blue" | "silver";
  rotation: string;
  isPeeling: boolean;
  createdAt: string;
}

export default function SubjectsRoute() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [openFolder, setOpenFolder] = useState<"homework" | "projects" | "reminders" | "gradebook" | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("bulletin_notices");
    if (stored) {
      setNotices(JSON.parse(stored));
    }
  }, []);

  const getFolderNotices = (category: "homework" | "projects" | "reminders" | "gradebook") => {
    return notices.filter((n) => n.category === category);
  };

  const getFolderColorClass = (category: string) => {
    switch (category) {
      case "homework":
        return "bg-amber-800 text-amber-100 border-amber-950";
      case "projects":
        return "bg-rose-900 text-rose-100 border-rose-950";
      case "reminders":
        return "bg-emerald-800 text-emerald-100 border-emerald-950";
      case "gradebook":
        return "bg-[#1e3a8a] text-blue-100 border-blue-950";
      default:
        return "bg-zinc-800 text-zinc-100 border-zinc-950";
    }
  };

  const getPaperColorClass = (category: string) => {
    switch (category) {
      case "homework":
        return "bg-note-yellow";
      case "projects":
        return "bg-note-pink";
      case "reminders":
        return "bg-note-green";
      case "gradebook":
        return "bg-note-blue";
      default:
        return "bg-white";
    }
  };

  return (
    <main className="flex-1 flex flex-col z-10 min-w-0 h-full overflow-hidden">
      {/* Top Blackboard App Bar */}
      <header className="bg-primary-container px-6 md:px-8 py-3 flex flex-col sm:flex-row gap-4 justify-between items-center w-full border-b-[24px] border-secondary-container shadow-lg shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="chalk-text font-bricolage text-3xl md:text-4xl font-extrabold text-on-primary-container drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)] select-none">
            {openFolder ? `${openFolder.toUpperCase()} BINDER` : "SUBJECT FOLDERS"}
          </h1>
        </div>
        <div className="flex gap-4 items-center shrink-0">
          {openFolder ? (
            <button
              onClick={() => setOpenFolder(null)}
              className="text-xs font-black uppercase bg-[#fff9e6] hover:bg-[#fffcf0] text-[#0e3727] px-3.5 py-2 shadow-xs border border-black/5 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Close Folder
            </button>
          ) : (
            <Link href="/">
              <button className="text-xs font-black uppercase bg-[#fff9e6] hover:bg-[#fffcf0] text-[#0e3727] px-3.5 py-2 shadow-xs border border-black/5 hover:scale-105 active:scale-95 transition-all cursor-pointer">
                Back to Board
              </button>
            </Link>
          )}
        </div>
      </header>

      {/* Main Folder Catalog content */}
      <div className="flex-1 p-6 md:p-container-padding overflow-y-auto max-h-[calc(100vh-170px)] relative select-none">
        
        {!openFolder ? (
          /* Render the 4 skeuomorphic folders */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-8">
            {(["homework", "projects", "reminders", "gradebook"] as const).map((cat, idx) => {
              const catNotices = getFolderNotices(cat);
              const folderRotation = ((idx % 2) * 2 - 1).toFixed(1);
              
              return (
                <article
                  key={cat}
                  onClick={() => setOpenFolder(cat)}
                  style={{ transform: `rotate(${folderRotation}deg)` }}
                  className={`paper-shadow cursor-pointer border-[8px] p-6 h-80 flex flex-col justify-between rounded-md transition-all duration-200 hover:rotate-0 hover:scale-105 hover:shadow-2xl ${getFolderColorClass(cat)}`}
                >
                  {/* Folder Tab label overlap */}
                  <div className="flex justify-between items-start">
                    <span className="material-symbols-outlined text-4xl select-none">folder_open</span>
                    <span className="text-[10px] font-black uppercase bg-black/20 px-2 py-0.5 rounded-full">
                      {catNotices.length} items
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bricolage text-xl font-black capitalize tracking-tight">
                      {cat}
                    </h3>
                    <div className="h-1 bg-white/20 my-2 rounded" />
                    <p className="text-xs opacity-75 leading-tight">
                      Open this folder to review all deliverable records, schedules, and active notes for {cat}.
                    </p>
                  </div>

                  <div className="flex justify-end pt-4">
                    <span className="text-xs font-black uppercase tracking-wider bg-black/10 hover:bg-black/20 px-3 py-1 rounded transition-colors">
                      OPEN BINDER
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* Render the opened folder: gorgeous double shadows lined paper overlay */
          <div className="w-full max-w-4xl mx-auto bg-white border border-gray-200 text-[#121414] p-8 md:p-10 shadow-2xl rounded-xs min-h-[450px] relative animate-in zoom-in-95 duration-200">
            {/* Skeuomorphic Ring binders elements representation */}
            <div className="absolute left-[-20px] top-1/4 w-10 h-6 bg-zinc-300 rounded-full shadow border-r border-zinc-400 z-10" />
            <div className="absolute left-[-20px] top-2/4 w-10 h-6 bg-zinc-300 rounded-full shadow border-r border-zinc-400 z-10" />
            <div className="absolute left-[-20px] top-3/4 w-10 h-6 bg-zinc-300 rounded-full shadow border-r border-zinc-400 z-10" />

            <div className="flex justify-between items-center border-b-2 border-dashed border-zinc-300 pb-4 mb-6">
              <div>
                <h2 className="font-bricolage text-2xl font-black text-zinc-800 tracking-tight capitalize">
                  📁 {openFolder} Deliverables Catalog
                </h2>
                <p className="text-xs text-zinc-500 font-bold mt-1 uppercase tracking-wider">
                  School Softboard Catalog System
                </p>
              </div>
              <span className="bg-zinc-100 text-zinc-800 text-xs px-3 py-1 rounded-full font-black border border-zinc-200">
                {getFolderNotices(openFolder).length} Active Records
              </span>
            </div>

            {getFolderNotices(openFolder).length === 0 ? (
              <div className="py-16 text-center text-zinc-400 text-sm">
                <span className="material-symbols-outlined text-5xl mb-2 opacity-50 select-none animate-pulse">drafts</span>
                <p className="font-bold">No active notice slips in this folder.</p>
                <p className="text-xs max-w-xs mx-auto mt-1">
                  Create a new notice on the main board and set its subject area to {openFolder} to see it populate here.
                </p>
              </div>
            ) : (
              /* Pinned Lined papers inside binder */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getFolderNotices(openFolder).map((notice) => (
                  <div
                    key={notice.id}
                    className={`p-5 rounded border border-black/5 shadow-md flex flex-col justify-between min-h-[160px] ${getPaperColorClass(
                      openFolder
                    )}`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black uppercase opacity-65 tracking-wider">
                          Record #{notice.id}
                        </span>
                        <span className="text-[10px] font-bold opacity-45">{notice.createdAt}</span>
                      </div>
                      <h3 className="font-bricolage text-base font-black text-zinc-950 leading-tight mb-2 tracking-tight">
                        {notice.title}
                      </h3>
                      <p className="text-xs leading-relaxed text-zinc-900 opacity-90 whitespace-pre-wrap font-medium">
                        {notice.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Board Footer */}
      <footer className="bg-primary-container px-6 py-4 w-full mt-auto border-t-[24px] border-secondary-container flex flex-col sm:flex-row justify-between items-center text-on-primary-container/60 text-xs font-bold gap-3 shrink-0">
        <div>
          <span>Folders Catalog View</span>
        </div>
        <div>
          <span>Softboard Design System v1.0.0</span>
        </div>
      </footer>
    </main>
  );
}
