"use client";

import React, { useState, useEffect } from "react";

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

const DEFAULT_NOTICES: Notice[] = [
  {
    id: "1",
    title: "Math homework: Ex 4.2",
    content: "Solve problems 1 to 10 on quadratic equations. Submit on lined sheets before the first bell tomorrow!",
    category: "homework",
    color: "yellow",
    pinColor: "red",
    rotation: "-1.5deg",
    isPeeling: false,
    createdAt: "Today, 9:00 AM",
  },
  {
    id: "2",
    title: "Science Project Pitch",
    content: "Prepare a 3-slide proposal explaining your working model concept. Team size must not exceed 3 students.",
    category: "projects",
    color: "pink",
    pinColor: "blue",
    rotation: "1.2deg",
    isPeeling: false,
    createdAt: "Yesterday",
  },
  {
    id: "3",
    title: "Physics Lab Prep",
    content: "Read Chapters 5 and 6 on Light Refraction before entering the lab. Wear closed shoes and bring your journals.",
    category: "reminders",
    color: "green",
    pinColor: "silver",
    rotation: "-0.8deg",
    isPeeling: false,
    createdAt: "Today, 11:30 AM",
  },
  {
    id: "4",
    title: "Quarterly Grade Card",
    content: "Grade booklets will be distributed this Friday during Homeroom. Parents' signature is mandatory for return.",
    category: "gradebook",
    color: "blue",
    pinColor: "red",
    rotation: "1.8deg",
    isPeeling: false,
    createdAt: "2 days ago",
  },
  {
    id: "5",
    title: "⚡ Spot Quiz Prep",
    content: "Word on the corridor is that Mr. Sharma is planning a surprise quiz on Trigonometric Identities this Wednesday. Shhh!",
    category: "homework",
    color: "yellow",
    pinColor: "silver",
    rotation: "-2deg",
    isPeeling: false,
    createdAt: "Just now",
  },
];

export default function BulletinBoardRoute() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Notice modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<"homework" | "projects" | "reminders" | "gradebook">("homework");
  const [newColor, setNewColor] = useState<"yellow" | "pink" | "green" | "blue">("yellow");
  const [newPinColor, setNewPinColor] = useState<"red" | "blue" | "silver">("red");

  // Sync notices with localStorage to enable cross-route data persistence
  useEffect(() => {
    const stored = localStorage.getItem("bulletin_notices");
    if (stored) {
      setNotices(JSON.parse(stored));
    } else {
      setNotices(DEFAULT_NOTICES);
      localStorage.setItem("bulletin_notices", JSON.stringify(DEFAULT_NOTICES));
    }
  }, []);

  // Listen for the sidebar custom event to trigger creation modal
  useEffect(() => {
    const handleOpen = () => setIsModalOpen(true);
    window.addEventListener("open-create-notice-modal", handleOpen);
    return () => window.removeEventListener("open-create-notice-modal", handleOpen);
  }, []);

  const saveNotices = (updatedNotices: Notice[]) => {
    setNotices(updatedNotices);
    localStorage.setItem("bulletin_notices", JSON.stringify(updatedNotices));
  };

  // Handle peeling animation and item deletion
  const handlePeelOff = (id: string) => {
    // Mark the notice as peeling to trigger the CSS keyframes animation
    saveNotices(
      notices.map((n) => (n.id === id ? { ...n, isPeeling: true } : n))
    );

    // Wait 800ms then move to archive
    setTimeout(() => {
      const activeList = JSON.parse(localStorage.getItem("bulletin_notices") || "[]");
      const deletedNotice = activeList.find((n: Notice) => n.id === id);
      
      if (deletedNotice) {
        // Fetch current archive list and append
        const storedArchive = localStorage.getItem("bulletin_archived");
        let archiveList = storedArchive ? JSON.parse(storedArchive) : [];
        archiveList = [{ ...deletedNotice, isPeeling: false, createdAt: "Archived just now" }, ...archiveList];
        localStorage.setItem("bulletin_archived", JSON.stringify(archiveList));
      }

      // Filter out of current list
      const filtered = activeList.filter((n: Notice) => n.id !== id);
      saveNotices(filtered);
    }, 800);
  };

  // Add a new notice
  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    // Generate a random rotation between -2 and +2 degrees
    const randomRot = (Math.random() * 4 - 2).toFixed(1);
    const newRotation = `${randomRot}deg`;

    const newNotice: Notice = {
      id: Date.now().toString(),
      title: newTitle,
      content: newContent,
      category: newCategory,
      color: newColor,
      pinColor: newPinColor,
      rotation: newRotation,
      isPeeling: false,
      createdAt: "Just now",
    };

    const updated = [newNotice, ...notices];
    saveNotices(updated);
    
    // Reset fields
    setNewTitle("");
    setNewContent("");
    setNewCategory("homework");
    setNewColor("yellow");
    setNewPinColor("red");
    setIsModalOpen(false);
  };

  // Filter notices based on Category selection and Search query
  const displayedNotices = notices.filter((n) => {
    const matchesCategory =
      selectedCategory === "all" || n.category === selectedCategory;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            Bulletin Board
          </h1>
        </div>

        {/* Dynamic Live Search Bar */}
        <div className="w-full sm:w-auto flex-1 max-w-sm sm:mx-6">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-primary-container/50 text-base select-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-primary-container/40 border border-on-primary-container/20 focus:border-primary rounded-full py-1.5 pl-10 pr-4 text-xs text-on-primary-container placeholder-on-primary-container/40 font-bold focus:ring-1 focus:ring-primary outline-hidden transition-all"
              placeholder="Search notices..."
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-primary-container/50 hover:text-white"
              >
                <span className="material-symbols-outlined text-xs">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick links tag filter */}
        <div className="hidden lg:flex gap-4 items-center">
          {[
            { value: "all", label: "Board Overview" },
            { value: "homework", label: "Homework" },
            { value: "projects", label: "Projects" },
            { value: "reminders", label: "Reminders" },
            { value: "gradebook", label: "Gradebook" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setSelectedCategory(item.value)}
              className={`text-xs font-bold transition-all px-2 py-1 hover:scale-105 select-none ${
                selectedCategory === item.value
                  ? "text-primary border-b-2 border-primary rotate-[-0.5deg]"
                  : "text-primary/70 hover:text-primary hover:rotate-[0.5deg]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Action indicators */}
        <div className="flex gap-4 items-center shrink-0">
          <div className="relative cursor-pointer hover:rotate-[-2deg] hover:scale-105 active:scale-95 transition-all text-primary">
            <span className="material-symbols-outlined text-xl select-none">notifications</span>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-black text-white">
              3
            </span>
          </div>
          <div className="relative group cursor-pointer hover:rotate-[2deg] hover:scale-105 active:scale-95 transition-all text-primary flex items-center gap-1">
            <span className="material-symbols-outlined text-xl select-none">account_circle</span>
            <span className="text-[10px] font-bold hidden sm:inline text-primary-fixed select-none">Abhi R.</span>
          </div>
        </div>
      </header>

      {/* Pinned Notes Grid View */}
      <div className="flex-1 p-6 md:p-container-padding relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-note-gap overflow-y-auto max-h-[calc(100vh-170px)] select-none">
        
        {displayedNotices.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-12 text-center text-on-primary-container/40">
            <span className="material-symbols-outlined text-6xl mb-4 opacity-50 animate-pulse">
              receipt_long
            </span>
            <p className="font-bricolage text-lg font-bold">No notices on the board</p>
            <p className="text-xs max-w-xs mt-1">
              Try altering your search or subject filters, or pin a new notice directly onto the board.
            </p>
          </div>
        ) : (
          displayedNotices.map((notice) => {
            // Class mapping for different pastel note backgrounds
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
                className={`paper-shadow ${noteBgClass} text-[#121414] p-5 pt-7 relative rounded-xs transition-all duration-300 hover:rotate-0 hover:scale-105 hover:shadow-xl ${
                  notice.isPeeling ? "peeling" : ""
                }`}
              >
                {/* Push pin centered at the top overlap */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="w-4 h-4 rounded-full relative group">
                    <div className={`w-3.5 h-3.5 rounded-full absolute ${getPinColorGradient(notice.pinColor)}`} />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40 absolute top-0.5 left-0.5" />
                  </div>
                </div>

                {/* Header block with tape effect occasionally */}
                {notice.id === "5" && (
                  <div className="washi-tape h-4 w-20 absolute -top-1.5 -left-3 rotate-[-30deg] rounded-xs shadow-xs" />
                )}

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

                  {/* Interactive footer actions */}
                  <div className="flex items-center justify-between border-t border-black/10 pt-3 mt-1">
                    <div className="flex items-center gap-1 opacity-50">
                      <span className="material-symbols-outlined text-xs">sell</span>
                      <span className="text-[10px] font-bold capitalize">{notice.color} tag</span>
                    </div>

                    <button
                      onClick={() => handlePeelOff(notice.id)}
                      className="flex items-center gap-1 text-xs font-black text-rose-800 hover:text-red-600 focus:outline-none transition-colors group/peel border border-transparent hover:border-red-900/20 px-2 py-0.5 rounded-xs"
                      title="Peel Off Note"
                    >
                      <span className="material-symbols-outlined text-sm transition-transform group-hover/peel:-rotate-12 select-none">
                        blur_off
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider">Peel Off</span>
                    </button>
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
          <span>Active Notices: {notices.length}</span>
        </div>
        <div>
          <span>Softboard Design System v1.0.0</span>
        </div>
      </footer>

      {/* New Notice Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Tactile Board Dialogue Card */}
          <div className="bg-[#1b4332] text-on-primary-container border-[12px] border-[#38393a] max-w-lg w-full relative z-10 shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 rounded-xs">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-on-primary-container/20">
              <h2 className="font-bricolage text-2xl font-black chalk-text text-on-primary-container tracking-wide">
                Pin A New Notice
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-on-primary-container/60 hover:text-white transition-colors focus:outline-none"
              >
                <span className="material-symbols-outlined select-none text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-primary">Notice Header</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. History Project Deadline"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#121414] border border-on-primary-container/20 focus:border-primary rounded-md p-3 text-sm text-white focus:ring-1 focus:ring-primary outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-primary">Notice Content</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Draft details about submissions, requirements, prep guides, or announcements..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-[#121414] border border-on-primary-container/20 focus:border-primary rounded-md p-3 text-sm text-white focus:ring-1 focus:ring-primary outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-primary">Subject area</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-[#121414] border border-on-primary-container/20 focus:border-primary rounded-md p-2.5 text-xs text-white focus:ring-1 focus:ring-primary outline-hidden capitalize"
                  >
                    <option value="homework">Homework</option>
                    <option value="projects">Projects</option>
                    <option value="reminders">Reminders</option>
                    <option value="gradebook">Gradebook</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-primary">Push Pin Type</label>
                  <select
                    value={newPinColor}
                    onChange={(e) => setNewPinColor(e.target.value as any)}
                    className="w-full bg-[#121414] border border-on-primary-container/20 focus:border-primary rounded-md p-2.5 text-xs text-white focus:ring-1 focus:ring-primary outline-hidden capitalize"
                  >
                    <option value="red">Red Stud</option>
                    <option value="blue">Blue Stud</option>
                    <option value="silver">Chrome Pin</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-primary block">
                  Select Sticky Note Color
                </label>
                <div className="flex gap-4">
                  {[
                    { value: "yellow", bg: "bg-note-yellow", border: "border-yellow-400" },
                    { value: "pink", bg: "bg-note-pink", border: "border-pink-400" },
                    { value: "green", bg: "bg-note-green", border: "border-green-400" },
                    { value: "blue", bg: "bg-note-blue", border: "border-blue-400" },
                  ].map((colorObj) => (
                    <button
                      key={colorObj.value}
                      type="button"
                      onClick={() => setNewColor(colorObj.value as any)}
                      className={`w-10 h-10 rounded-xs ${colorObj.bg} border-2 transition-all flex items-center justify-center hover:scale-105 active:scale-95 cursor-pointer ${
                        newColor === colorObj.value ? "border-emerald-400 ring-2 ring-primary" : "border-black/10"
                      }`}
                      title={`${colorObj.value} tag color`}
                    >
                      {newColor === colorObj.value && (
                        <span className="material-symbols-outlined text-zinc-950 font-black text-sm select-none">check</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-on-primary-container/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-emerald-950/40 hover:bg-emerald-950/60 text-white font-bold py-3 text-xs uppercase tracking-wider border border-emerald-900/40 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#fff9e6] hover:bg-[#fffcf0] text-[#0e3727] font-black py-3 text-xs uppercase tracking-wider border border-black/10 transition-colors cursor-pointer"
                >
                  Pin Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
