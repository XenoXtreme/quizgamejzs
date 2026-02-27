"use client";

import React, { useState, useRef, useEffect, useMemo, memo } from "react";
import Image from "next/image";
import {
  Calendar,
  Star,
  Zap,
  GraduationCap,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getAvatarColor, getInitials } from "@/lib/avatar";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Member {
  name: string;
  role?: string;
  description?: string;
}

interface SlideImage {
  src: string;
  alt: string;
}

interface TimelineEntry {
  id: string;
  era: string;
  title: string;
  body: string;
  icon: LucideIcon;
  extra?: React.ReactNode;
}

// ─── Accent palette (cycles through timeline items) ──────────────────────────

const ACCENTS = [
  {
    bg: "bg-violet-500",
    ring: "ring-violet-200",
    text: "text-violet-600",
    cardBorder: "border-l-violet-400",
    pill: "bg-violet-100 text-violet-700",
    line: "bg-violet-200",
  },
  {
    bg: "bg-amber-400",
    ring: "ring-amber-200",
    text: "text-amber-600",
    cardBorder: "border-l-amber-400",
    pill: "bg-amber-100 text-amber-700",
    line: "bg-amber-200",
  },
  {
    bg: "bg-sky-500",
    ring: "ring-sky-200",
    text: "text-sky-600",
    cardBorder: "border-l-sky-400",
    pill: "bg-sky-100 text-sky-700",
    line: "bg-sky-200",
  },
  {
    bg: "bg-emerald-500",
    ring: "ring-emerald-200",
    text: "text-emerald-600",
    cardBorder: "border-l-emerald-400",
    pill: "bg-emerald-100 text-emerald-700",
    line: "bg-emerald-200",
  },
  {
    bg: "bg-rose-500",
    ring: "ring-rose-200",
    text: "text-rose-600",
    cardBorder: "border-l-rose-400",
    pill: "bg-rose-100 text-rose-700",
    line: "bg-rose-200",
  },
  {
    bg: "bg-fuchsia-500",
    ring: "ring-fuchsia-200",
    text: "text-fuchsia-600",
    cardBorder: "border-l-fuchsia-400",
    pill: "bg-fuchsia-100 text-fuchsia-700",
    line: "bg-fuchsia-200",
  },
  {
    bg: "bg-orange-500",
    ring: "ring-orange-200",
    text: "text-orange-600",
    cardBorder: "border-l-orange-400",
    pill: "bg-orange-100 text-orange-700",
    line: "bg-orange-200",
  },
  {
    bg: "bg-teal-500",
    ring: "ring-teal-200",
    text: "text-teal-600",
    cardBorder: "border-l-teal-400",
    pill: "bg-teal-100 text-teal-700",
    line: "bg-teal-200",
  },
] as const;

type Accent = (typeof ACCENTS)[number];

// ─── Scroll Progress ─────────────────────────────────────────────────────────

const ScrollBar = memo(() => {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const { scrollY } = window;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPct(max > 0 ? Math.min((scrollY / max) * 100, 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-0.75 bg-neutral-200 dark:bg-neutral-800">
      <div
        className="h-full bg-linear-to-r from-violet-500 via-fuchsia-500 to-amber-400 transition-[width] duration-100 ease-linear"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
});
ScrollBar.displayName = "ScrollBar";

// ─── Scroll Down FAB ─────────────────────────────────────────────────────────

function ScrollFAB() {
  return (
    <button
      onClick={() =>
        window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" })
      }
      aria-label="Scroll down"
      className="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg transition hover:scale-105 hover:shadow-violet-300"
    >
      <ChevronDown className="h-5 w-5" />
    </button>
  );
}

// ─── Minimal Image Carousel ───────────────────────────────────────────────────

function Carousel({ images }: { images: SlideImage[] }) {
  const [idx, setIdx] = useState(0);
  const total = images.length;
  const prev = () => setIdx((i) => (i - 1 + total) % total);
  const next = () => setIdx((i) => (i + 1) % total);

  // Auto-advance
  useEffect(() => {
    const t = setTimeout(next, 4000);
    return () => clearTimeout(t);
  }, [idx]);

  return (
    <div className="relative select-none overflow-hidden rounded-xl">
      <div className="relative aspect-video w-full bg-neutral-100 dark:bg-neutral-800">
        <Image
          src={images[idx].src}
          alt={images[idx].alt}
          fill
          className="object-cover transition-opacity duration-500"
          sizes="(max-width: 768px) 100vw, 60vw"
        />
      </div>

      {/* Controls */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === idx
                ? "w-5 bg-white"
                : "w-1.5 bg-white/50 hover:bg-white/70",
            )}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Lazy Timeline Item ───────────────────────────────────────────────────────

const LazyTimelineItem = memo(
  ({
    entry,
    index,
    accent,
  }: {
    entry: TimelineEntry;
    index: number;
    accent: Accent;
  }) => {
    const [visible, setVisible] = useState(false);
    const [rendered, setRendered] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      const obs = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setRendered(true);
            // Base delay of 180ms + small stagger, capped so later items don't wait forever
            setTimeout(() => setVisible(true), 180 + Math.min(index * 50, 300));
            obs.disconnect();
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
      );
      obs.observe(el);
      return () => obs.disconnect();
    }, [index]);

    const Icon = entry.icon;

    return (
      <div
        ref={ref}
        className={cn(
          "group flex w-full gap-5 pb-8 transition-all duration-700 ease-out",
          visible
            ? "opacity-100 translate-y-0 blur-none"
            : "opacity-0 translate-y-14 blur-sm",
        )}
      >
        {/* Icon + line column */}
        <div className="relative flex flex-col items-center pt-1 shrink-0">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full ring-4 shadow-sm",
              accent.bg,
              accent.ring,
            )}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div className={cn("mt-2 flex-1 w-0.5", accent.line, "opacity-40")} />
        </div>

        {/* Card — full width */}
        <div
          className={cn(
            "flex-1 min-w-0 rounded-xl border border-neutral-200 bg-white shadow-sm",
            "border-l-4",
            accent.cardBorder,
            "dark:border-neutral-800 dark:bg-neutral-900",
            "transition-shadow duration-300 group-hover:shadow-md",
          )}
        >
          <div className="px-5 pt-4 pb-2">
            <span
              className={cn(
                "inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest mb-2",
                accent.pill,
              )}
            >
              {entry.era}
            </span>
            <h3
              className={cn(
                "text-xl font-bold tracking-tight mb-1",
                accent.text,
              )}
            >
              {entry.title}
            </h3>
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {entry.body}
            </p>
          </div>

          {/* Extra content — only mounted when near viewport */}
          {rendered && entry.extra && (
            <div className="px-5 pb-5 pt-3 border-t border-neutral-100 dark:border-neutral-800">
              {entry.extra}
            </div>
          )}
        </div>
      </div>
    );
  },
);
LazyTimelineItem.displayName = "LazyTimelineItem";

// ─── Member Card ──────────────────────────────────────────────────────────────

function MemberCard({ member, accent }: { member: Member; accent?: Accent }) {
  const initials = getInitials(member.name);
  const color = getAvatarColor(member.name);

  return (
    <div className="flex items-center gap-3 rounded-lg border border-neutral-100 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/50">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br ${color} text-xs font-bold text-white`}
      >
        {initials}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-neutral-800 dark:text-neutral-200">
          {member.name}
        </p>
        {member.role && (
          <span
            className={cn(
              "inline-block mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold",
              accent ? accent.pill : "bg-neutral-100 text-neutral-500",
            )}
          >
            {member.role}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const MEMBERS: Member[] = [
  {
    name: "Sri Manoj Kumar Sarkar",
    role: "Quizdom Chief · Mentor-in-Chief",
  },
  { name: "Rupankar Dhar", role: "President" },
  { name: "Priyam Das", role: "Vice President" },
  { name: "Nababrata Roy", role: "Advisor" },
  { name: "Rishiraj Sarkar", role: "Treasurer" },
  { name: "Ananyo Kar", role: "Media Head" },
  { name: "Kaustav Kar", role: "Social Influencer" },
  { name: "Prithwish Chakraborty", role: "Secretary" },
  { name: "Debangik Biswas", role: "Joint Secretary" },
  { name: "Tanmay Das", role: "Joint Secretary" },
  { name: "Prantik Sengupta", role: "Joint Secretary" },
  { name: "Jayostu Modak", role: "Post Coordinator" },
  { name: "Abhradeep Mitra", role: "Marketing Head" },
  { name: "Sinchan Maitra", role: "Technical Head" },
];

const S2: SlideImage[] = Array.from({ length: 7 }, (_, i) => ({
  src: `/assets/history/season2/${i + 1}.jpg`,
  alt: `Season 2 Image ${i + 1}`,
}));

const S3: SlideImage[] = Array.from({ length: 7 }, (_, i) => ({
  src: `/assets/history/season3/${i + 1}.jpeg`,
  alt: `Season 3 Image ${i + 1}`,
}));

const STATS = [
  { value: "19", label: "Schools" },
  { value: String(MEMBERS.length), label: "Members" },
  { value: "2024", label: "Revolution" },
  { value: "∞", label: "Stories" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function QuizHistoryPage() {
  const quizdomAccent = ACCENTS[5]; // fuchsia for the Season 3 members block

  const timeline: TimelineEntry[] = useMemo(
    () => [
      {
        id: "prologue",
        era: "A timeless beginning",
        title: "Prologue: A Place of Questions",
        body: "Step into Jalpaiguri Zilla School, and the very air is charged with curiosity. Even before microphones and projectors, questions were the lifeblood of this institution.",
        icon: GraduationCap,
      },
      {
        id: "emerging",
        era: "Early 2010s",
        title: "An Emerging Tradition",
        body: "By the early 2010s, the quiz was not merely an event — it became a badge of honour. Schools from across Jalpaiguri district participated every year.",
        icon: Star,
      },
      {
        id: "season1",
        era: "2019",
        title: "Season 1 · The Tradition Lives On",
        body: "The beginning of something new — the quiz finds its modern form.",
        icon: Calendar,
        extra: (
          <Carousel
            images={[{ src: "/assets/history/season1/1.jpg", alt: "Season 1" }]}
          />
        ),
      },
      {
        id: "transition",
        era: "A new era dawns",
        title: "A World in Transition",
        body: 'Students craved more than rote answers. "Every Question Has A Story" became the new mantra.',
        icon: Zap,
      },
      {
        id: "season2",
        era: "2023",
        title: "Season 2 · End of the Old Era",
        body: "The quiz felt like a relic. But it was just the calm before the storm — a dress rehearsal for a revolution.",
        icon: GraduationCap,
        extra: <Carousel images={S2} />,
      },
      {
        id: "quizdom",
        era: "2024",
        title: "Season 3 · The Era of Quizdom",
        body: "Quizdom was born: a team committed to carrying the legacy forward with a new-age quizzing culture.",
        icon: Calendar,
        extra: (
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">
                Founding Members
              </p>
              <MemberCard member={MEMBERS[0]} accent={quizdomAccent} />
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {MEMBERS.slice(1).map((m) => (
                  <MemberCard key={m.name} member={m} accent={quizdomAccent} />
                ))}
              </div>
            </div>
            <Carousel images={S3} />
          </div>
        ),
      },
      {
        id: "revolution",
        era: "2024",
        title: "The Revolution",
        body: "Gone were disconnected trivia questions. The quiz became a tapestry of interconnected tales.",
        icon: Zap,
      },
      {
        id: "sesquicentennial",
        era: "2025",
        title: "The Sesquicentennial Year",
        body: "150 years. A monumental milestone for Jalpaiguri Zilla School — and for the quiz that grew with it.",
        icon: Calendar,
      },
      {
        id: "journey",
        era: "Early 2025",
        title: "Journey to Grand Day",
        body: "Sleepless nights, endless research, and a singular goal: to do justice to 150 years of learning.",
        icon: Zap,
      },
      {
        id: "beyond",
        era: "Ongoing",
        title: "Beyond Competition",
        body: "Quizdom is now a movement — hosting workshops, community outreach, and open knowledge sessions.",
        icon: Star,
      },
      {
        id: "eqhas",
        era: "Philosophy",
        title: "Spirit of EQHAS",
        body: "Every Question Has A Story. It's not about cramming; it's about exploring the world through curiosity.",
        icon: Star,
      },
      {
        id: "torch",
        era: "Celebration",
        title: "Carrying the Torch",
        body: "Celebrating 150 years of knowledge, questions, and the belief that learning never ends.",
        icon: GraduationCap,
      },
      {
        id: "unending",
        era: "The future",
        title: "An Unending Story",
        body: "The tale of the Jalpaiguri Zilla School Quiz has only just begun.",
        icon: Calendar,
      },
    ],
    [quizdomAccent],
  );

  const statColors = [
    "text-violet-600",
    "text-fuchsia-600",
    "text-amber-500",
    "text-emerald-600",
  ];

  return (
    <div className="relative min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <ScrollBar />

      {/* Full-width content with generous side padding */}
      <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-24 pb-32 pt-20">
        {/* Header */}
        <header className="mb-12 max-w-3xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400 dark:text-neutral-500">
            Jalpaiguri Zilla School
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-5xl lg:text-6xl">
            Annual Interschool{" "}
            <span className="bg-linear-to-r from-violet-600 via-fuchsia-500 to-amber-500 bg-clip-text text-transparent">
              Quiz
            </span>
          </h1>
          <p className="text-base text-neutral-500 dark:text-neutral-400">
            Legacy · Revolution · The tale continues
          </p>
        </header>

        {/* Timeline — full width */}
        <div className="w-full">
          {timeline.map((entry, i) => (
            <LazyTimelineItem
              key={entry.id}
              entry={entry}
              index={i}
              accent={ACCENTS[i % ACCENTS.length]}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 border-t border-neutral-200 pt-8 dark:border-neutral-800">
          <p className="text-center text-xs text-neutral-400 dark:text-neutral-600">
            Every Question Has A Story — Quizdom, Jalpaiguri Zilla School
          </p>
        </div>
        {/* Stats strip — full width */}
        <div className="mt-5 mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STATS.map(({ value, label }, i) => (
            <div
              key={label}
              className="rounded-xl border border-neutral-200 bg-white px-6 py-5 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <p className={cn("text-3xl font-extrabold", statColors[i])}>
                {value}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-widest text-neutral-400">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <ScrollFAB />
    </div>
  );
}
