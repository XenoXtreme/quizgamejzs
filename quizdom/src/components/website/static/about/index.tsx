"use client";
import React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Autoplay from "embla-carousel-autoplay";
import type { CarouselApi } from "@/components/ui/carousel";

interface ImageProps {
  src: string;
  alt: string;
}

const images: ImageProps[] = [
  {
    src: "/assets/static/about/1.jpg",
    alt: "Independence",
  },
  {
    src: "/assets/static/about/2.jpg",
    alt: "School Awards",
  },
  {
    src: "/assets/static/about/3.jpg",
    alt: "School Building",
  },
  {
    src: "/assets/static/about/4.jpg",
    alt: "Students",
  },
  {
    src: "/assets/static/about/5.jpg",
    alt: "Teachers",
  },
];

const techStack = [
  {
    name: "Next.js",
    logo: "/assets/icons/nextjs.svg",
    description: "React Framework",
    gradient: "from-neutral-800 to-neutral-950",
    hoverBorder: "hover:border-neutral-500",
    iconBg: "bg-neutral-950",
  },
  {
    name: "Tailwind CSS",
    logo: "/assets/icons/tailwindcss.svg",
    description: "CSS Framework",
    gradient: "from-cyan-400 to-blue-600",
    hoverBorder: "hover:border-cyan-400",
    iconBg: "bg-sky-50 dark:bg-sky-900/30",
  },
  {
    name: "shadcn/ui",
    logo: "/assets/icons/shadcn.ico",
    description: "UI Components",
    gradient: "from-violet-500 to-purple-700",
    hoverBorder: "hover:border-violet-400",
    iconBg: "bg-violet-50 dark:bg-violet-900/30",
  },
  {
    name: "MongoDB",
    logo: "/assets/icons/mongodb.svg",
    description: "Database",
    gradient: "from-green-500 to-emerald-700",
    hoverBorder: "hover:border-green-400",
    iconBg: "bg-green-50 dark:bg-green-900/30",
  },
  {
    name: "Express.js",
    logo: "/assets/icons/expressjs.svg",
    description: "Backend Framework",
    gradient: "from-gray-500 to-gray-900",
    hoverBorder: "hover:border-gray-400",
    iconBg: "bg-gray-100 dark:bg-gray-800",
  },
  {
    name: "Vercel",
    logo: "/assets/icons/vercel.svg",
    description: "Deployment Platform",
    gradient: "from-zinc-700 to-zinc-950",
    hoverBorder: "hover:border-zinc-400",
    iconBg: "bg-zinc-900",
  },
  {
    name: "Socket.io",
    logo: "/assets/icons/socketio.svg",
    description: "Real-time Communication",
    gradient: "from-gray-400 to-gray-800",
    hoverBorder: "hover:border-gray-400",
    iconBg: "bg-gray-100 dark:bg-gray-800",
  },
];

const highlights = [
  { icon: "🏛️", text: "Over 150 years of educational excellence" },
  { icon: "👨‍🏫", text: "Experienced and deeply caring teachers" },
  {
    icon: "📚",
    text: "Strong balance of academics & co-curricular activities",
  },
  { icon: "🛡️", text: "Safe, inclusive and welcoming learning environment" },
  { icon: "🤝", text: "Powerful and well-connected alumni network" },
  { icon: "🔬", text: "Modern labs, library and digital resources" },
  { icon: "🌱", text: "Commitment to holistic student development" },
];

const sections = [
  {
    label: "Our Mission",
    emoji: "🎯",
    text: "To provide quality education that fosters intellectual growth, creativity, and character development — nurturing students to achieve their full potential and become responsible, thoughtful citizens.",
    bgGradient: "from-blue-500/10 via-indigo-400/10 to-blue-300/5",
    border: "border-blue-300/60 dark:border-blue-700/40",
    accent: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    blob: "bg-blue-300/20 dark:bg-blue-600/10",
  },
  {
    label: "Vision",
    emoji: "🌟",
    text: "Empowering students to become lifelong learners and leaders, equipped with knowledge, skills, and values to meet the challenges of a rapidly changing world.",
    bgGradient: "from-purple-500/10 via-pink-400/10 to-purple-300/5",
    border: "border-purple-300/60 dark:border-purple-700/40",
    accent: "text-purple-600 dark:text-purple-400",
    iconBg: "bg-purple-100 dark:bg-purple-900/40",
    blob: "bg-purple-300/20 dark:bg-purple-600/10",
  },
  {
    label: "History & Values",
    emoji: "📜",
    text: "Founded over a century ago, Jalpaiguri Zilla School carries a proud tradition of academic achievement. We hold integrity, respect, and a passion for learning at our very core.",
    bgGradient: "from-amber-500/10 via-orange-400/10 to-amber-300/5",
    border: "border-amber-300/60 dark:border-amber-700/40",
    accent: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
    blob: "bg-amber-300/20 dark:bg-amber-600/10",
  },
  {
    label: "Facilities",
    emoji: "🏢",
    text: "Spacious classrooms, well-equipped science and computer labs, a rich library, and excellent sports facilities — all within a safe, inclusive, and inspiring campus.",
    bgGradient: "from-emerald-500/10 via-teal-400/10 to-emerald-300/5",
    border: "border-emerald-300/60 dark:border-emerald-700/40",
    accent: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    blob: "bg-emerald-300/20 dark:bg-emerald-600/10",
  },
];

const About = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const plugin = React.useRef(Autoplay({ delay: 4000, playOnInit: true }));

  React.useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-amber-50/40 to-slate-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-linear-to-r from-amber-500 via-yellow-300 to-amber-500" />

      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-10 sm:py-24">
        {/* ── Header ── */}
        <header className="mb-16 sm:mb-20">
          <Badge
            variant="outline"
            className="mb-5 border-amber-300/70 bg-amber-50 px-3 py-1 text-xs font-bold tracking-widest text-amber-700 uppercase dark:border-amber-700/40 dark:bg-amber-900/20 dark:text-amber-400"
          >
            Est. 26 May 1876
          </Badge>

          <h1 className="mb-5 text-4xl font-extrabold leading-tight tracking-tight text-neutral-900 sm:text-6xl dark:text-neutral-50">
            Jalpaiguri
            <br />
            <span className="bg-linear-to-r from-amber-500 via-yellow-400 to-amber-600 bg-clip-text text-transparent">
              Zilla School
            </span>
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg dark:text-neutral-400">
            One of West Bengal's oldest and most prestigious institutions —
            shaping generations of young minds since 1876. In 2026, we proudly
            mark{" "}
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              150 years of excellence.
            </span>
          </p>
        </header>

        {/* ── Carousel with border wrapper ── */}
        <section className="mb-20 sm:mb-28">
          <div className="rounded-2xl border-2 border-amber-200/70 bg-white p-2 shadow-2xl dark:border-amber-800/30 dark:bg-neutral-900">
            <Carousel
              setApi={setApi}
              opts={{ align: "start", loop: true }}
              plugins={[plugin.current]}
              className="relative w-full overflow-hidden rounded-xl"
            >
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-video w-full">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        loading="lazy"
                        className="object-cover transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 900px"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="left-4 size-10 border border-white/40 bg-black/30 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/50" />
              <CarouselNext className="right-4 size-10 border border-white/40 bg-black/30 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/50" />

              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
                {Array.from({ length: count }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => api?.scrollTo(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === current
                        ? "w-7 h-2 bg-white shadow-md"
                        : "w-2 h-2 bg-white/40 hover:bg-white/70"
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </Carousel>
          </div>
        </section>

        {/* ── 150th Anniversary banner ── */}
        <section className="mb-20 sm:mb-28">
          <div className="relative overflow-hidden rounded-2xl border-2 border-amber-300/60 bg-linear-to-r from-amber-50 via-yellow-50 to-amber-100 p-8 shadow-xl sm:p-10 dark:border-amber-700/30 dark:from-amber-950/50 dark:via-yellow-950/30 dark:to-amber-950/50">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border-50 border-amber-200/30 dark:border-amber-700/15" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full border-28 border-yellow-200/30 dark:border-yellow-800/15" />

            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Milestone
            </span>
            <h2 className="mb-3 text-2xl font-extrabold text-neutral-900 sm:text-3xl dark:text-amber-100">
              🏛️ 150th Anniversary — 2026
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg dark:text-neutral-400">
              For a century and a half, we have been dedicated to nurturing
              talent, fostering values, and building a legacy of learning. Join
              us in celebrating this historic milestone.
            </p>
          </div>
        </section>

        <Separator className="mb-20 dark:bg-neutral-800 sm:mb-28" />

        {/* ── Mission / Vision / History / Facilities ── */}
        <section className="mb-20 sm:mb-28">
          <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            Who We Are
          </span>
          <h2 className="mb-10 text-2xl font-extrabold text-neutral-900 sm:text-3xl dark:text-neutral-50">
            Our Foundation
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {sections.map((s) => (
              <div
                key={s.label}
                className={`group cursor-pointer relative overflow-hidden rounded-2xl border-2 ${s.border} bg-linear-to-br ${s.bgGradient} p-6 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl sm:p-8`}
              >
                {/* decorative blob */}
                <div
                  className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full ${s.blob}`}
                />
                <div
                  className={`pointer-events-none absolute -bottom-6 -left-6 h-20 w-20 rounded-full ${s.blob} opacity-60`}
                />

                <div
                  className={`relative z-10 mb-4 inline-flex items-center justify-center rounded-xl ${s.iconBg} p-3 text-2xl shadow-sm`}
                >
                  {s.emoji}
                </div>

                <h3
                  className={`relative z-10 mb-2 text-xs font-extrabold uppercase tracking-widest ${s.accent}`}
                >
                  {s.label}
                </h3>
                <p className="relative z-10 text-sm leading-relaxed text-neutral-700 sm:text-base dark:text-neutral-300">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <Separator className="mb-20 dark:bg-neutral-800 sm:mb-28" />

        {/* ── Why Choose Us ── */}
        <section className="mb-20 sm:mb-28">
          <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            Why Choose Us
          </span>
          <h2 className="mb-10 text-2xl font-extrabold text-neutral-900 sm:text-3xl dark:text-neutral-50">
            What sets us apart
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {highlights.map((item, i) => (
              <div
                key={i}
                className="group  cursor-pointer flex items-start gap-4 rounded-2xl border-2 border-neutral-200/80 bg-white px-5 py-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-amber-700"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-xl shadow-sm group-hover:bg-amber-100 dark:bg-amber-900/30 dark:group-hover:bg-amber-900/50 transition-colors">
                  {item.icon}
                </span>
                <div className="flex items-start gap-2 pt-0.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  <p className="text-sm font-medium leading-snug text-neutral-700 dark:text-neutral-300">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Separator className="mb-20 dark:bg-neutral-800 sm:mb-28" />

        {/* ── Tech Stack ── */}
        <section>
          <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            Tech Stack
          </span>
          <h2 className="mb-3 text-2xl font-extrabold text-neutral-900 sm:text-3xl dark:text-neutral-50">
            Built with modern tools
          </h2>
          <p className="mb-10 text-sm text-neutral-500 dark:text-neutral-400">
            Engineered for performance, accessibility, and a seamless user
            experience.
          </p>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className={`group cursor-pointer relative overflow-hidden rounded-2xl border-2 border-neutral-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${tech.hoverBorder} dark:border-neutral-800 dark:bg-neutral-900`}
              >
                {/* gradient wash on hover */}
                <div
                  className={`pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-br ${tech.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
                />

                <div
                  className={`relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${tech.iconBg} p-2.5 shadow-sm transition-transform duration-300 group-hover:scale-110`}
                >
                  <Image
                    src={tech.logo}
                    alt={tech.name}
                    width={36}
                    height={36}
                    loading="lazy"
                    className="object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const fallback = e.currentTarget
                        .nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                  <div className="hidden h-8 w-8 items-center justify-center rounded-lg bg-neutral-300 text-xs font-bold text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300">
                    {tech.name.charAt(0)}
                  </div>
                </div>

                <p className="relative z-10 text-sm font-bold text-neutral-800 dark:text-neutral-200">
                  {tech.name}
                </p>
                <p className="relative z-10 mt-0.5 text-xs text-neutral-500 dark:text-neutral-500">
                  {tech.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-24 flex items-center justify-between border-t border-neutral-200 pt-8 dark:border-neutral-800">
          <p className="text-xs text-neutral-400 dark:text-neutral-600">
            © {new Date().getFullYear()} Jalpaiguri Zilla School
          </p>
          <div className="h-1 w-16 rounded-full bg-linear-to-r from-amber-400 to-yellow-300" />
        </footer>
      </div>
    </div>
  );
};

export default About;
