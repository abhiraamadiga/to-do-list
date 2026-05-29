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

export default function ArchiveRoute() {
  const [archivedNotices, setArchivedNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("bulletin_archived");
    if (stored) {
      setArchivedNotices(JSON.parse(stored));
    }
  }, []);

  const saveArchive = (updated: Notice[]) => {
    setArchivedNotices(updated);
    localStorage.setItem("bulletin_archived", JSON.stringify(updated));
  };

  const handleRestoreNotice = (id: string) => {
    const noticeToRestore = archivedNotices.find((n) => n.id === id);
    if (noticeToRestore) {
      // Fetch active notices and append
      const storedActive = localStorage.getItem("bulletin_notices");
      let activeList = storedActive ? JSON.parse(storedActive) : [];
      
      const randomRot = (Math.random() * 4 - 2).toFixed(1);
      const restored = { ...noticeToRestore, rotation: `${randomRot}deg`, isPeeling: false, createdAt: "Restored just now" };
      
      activeList = [restored, ...activeList];
      localStorage.setItem("bulletin_notices", JSON.stringify(activeList));

      // Remove from archive
      const filtered = archivedNotices.filter((n) => n.id !== id);
      saveArchive(filtered);
    }
  };

  const handlePermanentDelete = (id: string) => {
    const filtered = archivedNotices.filter((n) => n.id !== id);
    saveArchive(filtered);
  };

  const getCategoryColorClass = (category: string) => {
    switch (category) {
      case "homework":
        return "bg-secondary-container text-on-secondary-container";
      case "projects":
        return "bg-tertiary-container text-on-tertiary-container";
      case "reminders":
        return "bg-primary-container text-on-primary-container";
      case "gradebook":
        return "bg-error-container text-on-error-container";
      default:
        return "bg-zinc-800 text-zinc-300";
    }
  };

  const getPinColorGradient = (pin: string) => {
    switch (pin) {
      case "red":
        return "bg-linear-to-r from-red-400 via-red-500 to-red-800 shadow-[2px_3px_5px_rgba(0,0,0,0.4)]";
      case "blue":
        return "bg-linear-to-r from-sky-400 via-blue-500 to-blue-800 shadow-[2px_3px_5px_rgba(0,0,0,0.4)]";
      case "silver":
        return "bg-linear-to-r from-zinc-200 via-zinc-400 to-zinc-700 shadow-[2px_3px_5px_rgba(0,0,0,0.4)]";
      default:
        return "bg-linear-to-r from-zinc-400 to-zinc-800 shadow-[2px_3px_5px_rgba(0,0,0,0.4)]";
    }
  };

  return (
    <main className="flex-1 flex flex-col z-10 min-w-0 h-full overflow-hidden">
      {/* Top Blackboard App Bar */}
      <header className="bg-primary-container px-6 md:px-8 py-3 flex flex-col sm:flex-row gap-4 justify-between items-center w-full border-b-[24px] border-secondary-container shadow-lg shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="chalk-text font-bricolage text-3xl md:text-4xl font-extrabold text-on-primary-container drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)] select-none">
            Archived Notices
          </h1>
        </div>
        <div className="flex gap-4 items-center shrink-0">
          <Link href="/">
            <button className="text-xs font-black uppercase bg-[#fff9e6] hover:bg-[#fffcf0] text-[#0e3727] px-3.5 py-2 shadow-xs border border-black/5 hover:scale-105 active:scale-95 transition-all cursor-pointer">
              Back to Board
            </button>
          </Link>
        </div>
      </header>

      {/* Archive Grid View */}
      <div className="flex-1 p-6 md:p-container-padding relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-note-gap overflow-y-auto max-h-[calc(100vh-170px)] select-none">
        {archivedNotices.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-12 text-center text-on-primary-container/40">
            <span className="material-symbols-outlined text-6xl mb-4 opacity-50 animate-pulse select-none animate-bounce">
              archive
            </span>
            <p className="font-bricolage text-lg font-bold">Your archive is empty</p>
            <p className="text-xs max-w-xs mt-1">
              Peel off notices from the main board, and they will curl off and gather safely inside this archive.
            </p>
          </div>
        ) : (
          archivedNotices.map((notice) => {
            let noteBgClass = "bg-note-yellow";
            switch (notice.color) {
              case "pink":
                noteBgClass = "bg-note-pink";
                break;
              case "green":
                noteBgClass = "bg-note-green";
                break;
              case "blue":
                noteBgClass = "bg-note-blue";
                break;
            }

            return (
              <article
                key={notice.id}
                style={{ transform: `rotate(${notice.rotation})` }}
                className={`paper-shadow ${noteBgClass} text-[#121414] p-5 pt-7 relative rounded-xs transition-all duration-300 hover:rotate-0 hover:scale-105 hover:shadow-xl`}
              >
                {/* Unpinned shadow studs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="w-4 h-4 rounded-full relative group">
                    <div className={`w-3.5 h-3.5 rounded-full absolute ${getPinColorGradient(notice.pinColor)}`} />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40 absolute top-0.5 left-0.5" />
                  </div>
                </div>

                <div className="flex flex-col h-full justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <span
                        className={`text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full shrink-0 ${getCategoryColorClass(
                          notice.category
                        )}`}
                      >
                        {notice.category}
                      </span>
                      <span className="text-[10px] font-bold opacity-45">{notice.createdAt}</span>
                    </div>

                    <h3 className="font-bricolage text-lg font-bold leading-tight mb-2 tracking-tight">
                      {notice.title}
                    </h3>
                    
                    <p className="text-xs font-medium leading-relaxed opacity-85 text-zinc-900/90 whitespace-pre-wrap">
                      {notice.content}
                    </p>
                  </div>

                  {/* Actions for Archived slips */}
                  <div className="flex items-center justify-between border-t border-black/10 pt-3 mt-1">
                    <div className="flex items-center gap-1 opacity-50">
                      <span className="material-symbols-outlined text-xs">sell</span>
                      <span className="text-[10px] font-bold capitalize">{notice.color} tag</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRestoreNotice(notice.id)}
                        className="flex items-center gap-1 text-[10px] font-black text-emerald-800 hover:text-emerald-600 px-2 py-0.5 rounded-xs border border-emerald-800/10 hover:bg-emerald-500/10 transition-all uppercase tracking-wider cursor-pointer"
                        title="Repin to Board"
                      >
                        <span className="material-symbols-outlined text-xs select-none">push_pin</span>
                        <span>Repin</span>
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(notice.id)}
                        className="flex items-center gap-1 text-[10px] font-black text-red-800 hover:text-red-600 px-2 py-0.5 rounded-xs border border-red-800/10 hover:bg-red-500/10 transition-all uppercase tracking-wider cursor-pointer"
                        title="Delete Permanently"
                      >
                        <span className="material-symbols-outlined text-xs select-none">delete_forever</span>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Board Footer */}
      <footer className="bg-primary-container px-6 py-4 w-full mt-auto border-t-[24px] border-secondary-container flex flex-col sm:flex-row justify-between items-center text-on-primary-container/60 text-xs font-bold gap-3 shrink-0">
        <div className="flex gap-4">
          <span>Archived Slips: {archivedNotices.length}</span>
        </div>
        <div>
          <span>Softboard Design System v1.0.0</span>
        </div>
      </footer>
    </main>
  );
}
