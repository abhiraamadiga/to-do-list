"use client";

import React, { useState } from "react";

interface CalendarEvent {
  id: string;
  date: string; // format: YYYY-MM-DD
  title: string;
  description: string;
  type: "homework" | "projects" | "reminders" | "gradebook";
  completed: boolean;
}

const DEFAULT_EVENTS: CalendarEvent[] = [
  {
    id: "1",
    date: "2024-10-15",
    title: "Physics Lab Report Due",
    description: "Write details on Light Refraction, prism experiments, and verify formulas.",
    type: "projects",
    completed: false,
  },
  {
    id: "2",
    date: "2024-10-22",
    title: "Math Midterm Test",
    description: "Topics include Quadratic equations, Trigonometric Identities, and series.",
    type: "homework",
    completed: false,
  },
  {
    id: "3",
    date: "2024-10-28",
    title: "History Presentation",
    description: "Individual slides outlining the timeline of the French Revolution.",
    type: "reminders",
    completed: false,
  },
  {
    id: "4",
    date: "2024-10-08",
    title: "Bio Term Assignment",
    description: "Plant cells diagram and documentation sheets.",
    type: "homework",
    completed: true,
  },
  {
    id: "5",
    date: "2024-10-02",
    title: "Gandhi Jayanti (Holiday)",
    description: "National holiday commemorating Mahatma Gandhi's birthday. School closed.",
    type: "reminders",
    completed: false,
  },
  {
    id: "6",
    date: "2024-10-04",
    title: "Football Match Practice",
    description: "Inter-school tournament preparation at 4:00 PM on the main sports ground.",
    type: "reminders",
    completed: false,
  },
  {
    id: "7",
    date: "2024-10-09",
    title: "Chemistry Surprise Quiz",
    description: "Periodic table trends, chemical bonds, and covalent compounds.",
    type: "homework",
    completed: false,
  },
  {
    id: "8",
    date: "2024-10-11",
    title: "English Poetry Essay",
    description: "Submit a critical appreciation of Robert Frost's 'The Road Not Taken'.",
    type: "homework",
    completed: false,
  },
  {
    id: "9",
    date: "2024-10-14",
    title: "Midterm Revision Starts",
    description: "Consult subject guides and Homeroom study timetables starting today.",
    type: "reminders",
    completed: false,
  },
  {
    id: "10",
    date: "2024-10-18",
    title: "Computer Lab sorting",
    description: "Verify Python programs for Bubble Sort and Insertion Sort algorithms.",
    type: "projects",
    completed: false,
  },
  {
    id: "11",
    date: "2024-10-21",
    title: "Art Club Exhibition Poster",
    description: "Design posters for the Annual Science and Art Exhibition next month.",
    type: "projects",
    completed: false,
  },
  {
    id: "12",
    date: "2024-10-24",
    title: "School Fest Auditions",
    description: "Music, choir, and drama auditions in the main theater starting at 3:30 PM.",
    type: "reminders",
    completed: false,
  },
  {
    id: "13",
    date: "2024-10-25",
    title: "Parent-Teacher Meeting",
    description: "Report card discussions with homeroom and subject teachers starting 9:00 AM.",
    type: "gradebook",
    completed: false,
  },
  {
    id: "14",
    date: "2024-10-30",
    title: "Physics Project Model",
    description: "Final check and mock presentation of the working model in the physics lab.",
    type: "projects",
    completed: false,
  },
  {
    id: "15",
    date: "2024-10-31",
    title: "Homeroom Halloween Party",
    description: "Bring snacks, dress up, and participate in the corridor decoration challenge!",
    type: "reminders",
    completed: false,
  },
];

interface CalendarDashboardProps {
  onToggleView: (view: "bulletin" | "calendar") => void;
  activeTab: "current" | "archived" | string;
  setActiveTab: (tab: "current" | "archived") => void;
}

export default function CalendarDashboard({
  onToggleView,
  activeTab,
  setActiveTab,
}: CalendarDashboardProps) {
  // Calendar month selection
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2024, 9, 1)); // Default: Oct 1, 2024
  const [events, setEvents] = useState<CalendarEvent[]>(DEFAULT_EVENTS);
  const [selectedDayEvents, setSelectedDayEvents] = useState<CalendarEvent[]>([]);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDesc, setNewEventDesc] = useState("");
  const [newEventCategory, setNewEventCategory] = useState<"homework" | "projects" | "reminders" | "gradebook">("homework");
  const [targetDateStr, setTargetDateStr] = useState("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Helper arrays for calendar generation
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  // Navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Generate calendar days grid
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => {
    // getDay() returns 0 for Sunday, 1 for Monday, etc.
    const day = new Date(y, m, 1).getDay();
    // Shift so 0 represents Monday, 6 represents Sunday
    return day === 0 ? 6 : day - 1;
  };

  const daysCount = getDaysInMonth(year, month);
  const offset = getFirstDayOfMonth(year, month);

  const daysGrid: (number | null)[] = [];
  for (let i = 0; i < offset; i++) {
    daysGrid.push(null);
  }
  for (let d = 1; d <= daysCount; d++) {
    daysGrid.push(d);
  }

  // Format date to YYYY-MM-DD
  const formatDateString = (dayNum: number) => {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(dayNum).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  };

  // Event handlers
  const handleDayClick = (dayNum: number) => {
    const dateStr = formatDateString(dayNum);
    setTargetDateStr(dateStr);
    const dayEvs = events.filter((ev) => ev.date === dateStr);
    setSelectedDayEvents(dayEvs);
    setIsAddEventOpen(true);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const newEv: CalendarEvent = {
      id: Date.now().toString(),
      date: targetDateStr,
      title: newEventTitle,
      description: newEventDesc,
      type: newEventCategory,
      completed: false,
    };

    const updated = [...events, newEv];
    setEvents(updated);
    setSelectedDayEvents(updated.filter((ev) => ev.date === targetDateStr));
    setNewEventTitle("");
    setNewEventDesc("");
    setNewEventCategory("homework");
  };

  const handleDeleteEvent = (id: string) => {
    const updated = events.filter((ev) => ev.id !== id);
    setEvents(updated);
    setSelectedDayEvents(updated.filter((ev) => ev.date === targetDateStr));
  };

  const toggleEventCompleted = (id: string) => {
    const updated = events.map((ev) =>
      ev.id === id ? { ...ev, completed: !ev.completed } : ev
    );
    setEvents(updated);
    setSelectedDayEvents(updated.filter((ev) => ev.date === targetDateStr));
  };

  const getEventCategoryStyle = (type: string) => {
    switch (type) {
      case "homework":
        return "border-emerald-600 bg-emerald-500/10 text-emerald-900";
      case "projects":
        return "border-rose-600 bg-rose-500/10 text-rose-900";
      case "reminders":
        return "border-amber-600 bg-amber-500/10 text-amber-900";
      case "gradebook":
        return "border-sky-600 bg-sky-500/10 text-sky-900";
      default:
        return "border-zinc-400 bg-zinc-100 text-zinc-800";
    }
  };

  // Get color classes for calendar cell styling
  const getCellDetails = (dayNum: number) => {
    const dateStr = formatDateString(dayNum);
    const dayEvs = events.filter((ev) => ev.date === dateStr);

    let cellBg = "bg-[#fffcf2]";
    let cellBorder = "border-black/5";
    
    // Choose specific pastel backgrounds based on event categories
    if (dayEvs.length > 0) {
      const primaryEv = dayEvs[0];
      if (!primaryEv.completed) {
        switch (primaryEv.type) {
          case "homework":
            cellBg = "bg-[#fefae0]";
            cellBorder = "border-t-4 border-emerald-600";
            break;
          case "projects":
            cellBg = "bg-[#d8e2dc]";
            cellBorder = "border-l-4 border-rose-600";
            break;
          case "reminders":
            cellBg = "bg-[#ffe5d9]";
            cellBorder = "border-b-4 border-amber-600";
            break;
          case "gradebook":
            cellBg = "bg-[#dbeafe]";
            cellBorder = "border-r-4 border-sky-600";
            break;
        }
      } else {
        cellBg = "bg-[#f4f4f4] opacity-60";
      }
    }

    return { cellBg, cellBorder, dayEvs };
  };

  return (
    <div className="felt-texture w-full min-h-[calc(100vh-170px)] flex-1 rounded shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] p-6 md:p-container-padding flex flex-col lg:flex-row gap-gutter">

      {/* Left Column: Interactive Month Calendar grid */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Month Header row */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display-lg text-display-lg text-primary-fixed drop-shadow-md tracking-wide chalk-text select-none">
            {monthNames[month]} {year}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrevMonth}
              className="w-10 h-10 flex items-center justify-center bg-secondary-container text-on-secondary-container rounded-full shadow-md hover:scale-110 active:scale-95 transition-all duration-200"
              title="Previous Month"
            >
              <span className="material-symbols-outlined select-none text-base">chevron_left</span>
            </button>
            <button
              onClick={handleNextMonth}
              className="w-10 h-10 flex items-center justify-center bg-secondary-container text-on-secondary-container rounded-full shadow-md hover:scale-110 active:scale-95 transition-all duration-200"
              title="Next Month"
            >
              <span className="material-symbols-outlined select-none text-base">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-3 mb-3 text-center">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((dayName) => (
            <div key={dayName} className="font-label-md text-xs text-on-primary-container/60 uppercase tracking-wider select-none font-bold">
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar Days grid */}
        <div className="grid grid-cols-7 gap-3 flex-1">
          {daysGrid.map((dayNum, idx) => {
            if (dayNum === null) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="h-28 sm:h-32 opacity-15 bg-primary-container/10 border border-dashed border-emerald-950/20 rounded-xs select-none"
                />
              );
            }

            const { cellBg, cellBorder, dayEvs } = getCellDetails(dayNum);
            // Random skeuomorphic rotation slightly persistent via indexes
            const rotDegree = ((dayNum % 3) * 1.2 - 0.6).toFixed(2);

            return (
              <article
                key={`day-${dayNum}`}
                onClick={() => handleDayClick(dayNum)}
                style={{ transform: `rotate(${rotDegree}deg)` }}
                className={`relative h-28 sm:h-32 ${cellBg} ${cellBorder} text-[#121414] paper-shadow p-2 pt-4 cursor-pointer rounded-xs transition-all duration-200 hover:rotate-0 hover:scale-105 hover:shadow-lg hover:z-20`}
              >
                {/* 3D Push Stud Overlap */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-700 shadow-md" />

                {/* Day Digit */}
                <span className="font-bricolage text-sm font-black opacity-80 leading-none select-none">
                  {dayNum}
                </span>

                {/* Daily events indicators */}
                <div className="mt-1 space-y-1 overflow-hidden max-h-[70px]">
                  {dayEvs.map((ev) => (
                    <div
                      key={ev.id}
                      className={`text-[9px] font-extrabold truncate px-1 py-0.5 rounded ${
                        ev.completed
                          ? "line-through bg-zinc-200/50 text-zinc-500 opacity-60"
                          : ev.type === "homework"
                          ? "bg-emerald-500/20 text-emerald-900"
                          : ev.type === "projects"
                          ? "bg-rose-500/20 text-rose-900"
                          : ev.type === "reminders"
                          ? "bg-amber-500/20 text-amber-900"
                          : "bg-sky-500/20 text-sky-900"
                      }`}
                    >
                      {ev.title}
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Right Column: Upcoming deliverables lists (Emulates soft board notepad) */}
      <aside className="w-full lg:w-80 shrink-0 flex flex-col">
        <div className="relative bg-[#ffe5d9] text-[#2d1e16] p-6 pt-8 paper-shadow rounded-xs min-h-[460px] flex flex-col justify-between">
          
          {/* Skeuomorphic Staples */}
          <div className="absolute top-2 left-3 w-5 h-1 bg-zinc-400 opacity-60 rounded-full rotate-[35deg]" />
          <div className="absolute top-2 right-3 w-5 h-1 bg-zinc-400 opacity-60 rounded-full rotate-[-35deg]" />

          {/* Notepad Header */}
          <div>
            <h3 className="font-bricolage text-xl font-bold border-b border-[#d9a08e] pb-2 mb-4 tracking-tight flex items-center gap-2 select-none text-[#541f22]">
              <span className="material-symbols-outlined select-none text-base">checklist</span>
              <span>Upcoming List</span>
            </h3>

            {/* Checkable Deliverables */}
            <ul className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {events
                .filter((ev) => !ev.completed)
                .map((ev) => (
                  <li key={ev.id} className="flex items-start gap-2.5 group">
                    <button
                      onClick={() => toggleEventCompleted(ev.id)}
                      className="material-symbols-outlined text-[#d9a08e] group-hover:text-[#541f22] text-sm mt-1 transition-colors select-none"
                    >
                      push_pin
                    </button>
                    <div>
                      <p className="font-bold text-xs leading-tight group-hover:underline text-[#2d1e16]">
                        {ev.title}
                      </p>
                      <p className="text-[10px] text-[#2d1e16]/65 mt-0.5">
                        Due: {new Date(ev.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </li>
                ))}

              {/* Separator for completed events */}
              {events.some((ev) => ev.completed) && (
                <div className="border-t border-[#d9a08e]/35 my-4 pt-4 select-none">
                  <p className="text-[10px] font-black tracking-wider uppercase text-[#d9a08e]">Completed</p>
                </div>
              )}

              {/* Render Completed Events */}
              {events
                .filter((ev) => ev.completed)
                .map((ev) => (
                  <li key={ev.id} className="flex items-start gap-2.5 opacity-55 line-through group">
                    <button
                      onClick={() => toggleEventCompleted(ev.id)}
                      className="material-symbols-outlined text-zinc-400 group-hover:text-emerald-700 text-sm mt-1 transition-colors select-none"
                    >
                      check_circle
                    </button>
                    <div>
                      <p className="font-bold text-xs leading-tight text-zinc-700">
                        {ev.title}
                      </p>
                      <p className="text-[9px] text-zinc-500 mt-0.5">Done</p>
                    </div>
                  </li>
                ))}
            </ul>
          </div>

          {/* Notepad footer drawing */}
          <div className="pt-6 flex justify-center border-t border-[#d9a08e]/20 mt-4 select-none">
            <img
              alt="Hand drawn sketch"
              className="w-14 h-14 opacity-25 rotate-12"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0ewgEDeNVvZk_UCZxuIdnWNAQEacijZ18UMXWZpBKXEHik6GLQ2C5kWAQ7XysVpzeCjizMmgh_IaRlsDSoke-4zyxp6HXDot6i8T9EyNCRqDQGSl9tnQtNOQA1jA7DJnw435G9f8JoSw2zF2bKYxqiseLqwPQuWLM5-7o1jTB7d2zpSx6sGl9fcL63ZpLcgXYWISgNZgSfoxVzrCDEfRoc_c8Qe8aZacAIIA4sYzUa29z8Cpa6-ws9uOJPhgGyM6WSXLNBLmjiFk"
            />
          </div>
        </div>
      </aside>

      {/* Daily Event details / Add New event overlay */}
      {isAddEventOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-xs transition-opacity"
            onClick={() => setIsAddEventOpen(false)}
          />

          {/* Modal Container */}
          <div className="bg-[#1b4332] text-on-primary-container border-[12px] border-[#38393a] max-w-md w-full relative z-10 shadow-2xl p-6 rounded-xs">
            <div className="flex items-center justify-between mb-4 border-b border-on-primary-container/20 pb-2">
              <h4 className="font-bricolage text-xl font-bold chalk-text">
                Deliverables: {new Date(targetDateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </h4>
              <button
                onClick={() => setIsAddEventOpen(false)}
                className="text-on-primary-container/60 hover:text-white"
              >
                <span className="material-symbols-outlined text-lg select-none">close</span>
              </button>
            </div>

            {/* List existing day events */}
            {selectedDayEvents.length > 0 ? (
              <div className="space-y-3 mb-6">
                <p className="text-[10px] font-black uppercase text-primary tracking-wider">Scheduled Tasks</p>
                <div className="space-y-2.5 max-h-[160px] overflow-y-auto">
                  {selectedDayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className={`border-l-4 p-3 rounded bg-zinc-950/20 text-[#121414] ${getEventCategoryStyle(ev.type)} flex justify-between items-start gap-4`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`font-bold text-xs truncate ${ev.completed ? "line-through opacity-50" : ""}`}>
                            {ev.title}
                          </p>
                          <span className="text-[8px] uppercase font-extrabold bg-[#0d0f0f]/15 px-1.5 py-0.5 rounded">
                            {ev.type}
                          </span>
                        </div>
                        {ev.description && (
                          <p className="text-[10px] opacity-75 leading-tight mt-1 truncate">
                            {ev.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => toggleEventCompleted(ev.id)}
                          className="hover:scale-110 active:scale-95 transition-transform"
                          title={ev.completed ? "Mark Incomplete" : "Mark Complete"}
                        >
                          <span className="material-symbols-outlined text-sm font-bold select-none">
                            {ev.completed ? "undo" : "check"}
                          </span>
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(ev.id)}
                          className="text-rose-800 hover:text-red-500 hover:scale-110 active:scale-95 transition-transform"
                          title="Delete Event"
                        >
                          <span className="material-symbols-outlined text-sm font-bold select-none">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-4 text-center text-on-primary-container/40 text-xs mb-4">
                <span className="material-symbols-outlined text-3xl mb-1 opacity-50 select-none">event_note</span>
                <p>No deliverables pinned for this day.</p>
              </div>
            )}

            {/* Quick Add event form */}
            <form onSubmit={handleAddEvent} className="border-t border-on-primary-container/20 pt-4 space-y-4">
              <p className="text-[10px] font-black uppercase text-primary tracking-wider">Pin New Task</p>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-primary">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Physics Lab Book submission"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full bg-[#121414] border border-on-primary-container/20 focus:border-primary rounded-md p-2 text-xs text-white focus:ring-1 focus:ring-primary outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-primary">Task Details</label>
                <input
                  type="text"
                  placeholder="Additional descriptions/preps..."
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  className="w-full bg-[#121414] border border-on-primary-container/20 focus:border-primary rounded-md p-2 text-xs text-white focus:ring-1 focus:ring-primary outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-primary">Category</label>
                <select
                  value={newEventCategory}
                  onChange={(e) => setNewEventCategory(e.target.value as any)}
                  className="w-full bg-[#121414] border border-on-primary-container/20 focus:border-primary rounded-md p-2 text-xs text-white focus:ring-1 focus:ring-primary outline-hidden"
                >
                  <option value="homework">Homework</option>
                  <option value="projects">Projects</option>
                  <option value="reminders">Reminders</option>
                  <option value="gradebook">Gradebook</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#fff9e6] hover:bg-[#fffdf2] text-[#0e3727] font-black py-2.5 rounded-md text-xs uppercase tracking-wider border border-black/10 transition-transform hover:scale-[1.02]"
              >
                Pin Task to Calendar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
