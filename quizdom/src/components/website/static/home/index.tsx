"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

const features = [
  {
    title: "Annual Quiz Competition",
    description:
      "Participate in the prestigious annual quiz competition of Jalpaiguri Zilla School. Open for both intra and interschool teams.",
    image: "/assets/static/banner.jpg",
    link: "/quiz",
    cta: "Explore Quiz",
    accent: "from-yellow-400 to-amber-500",
    badge: "Featured",
    badgeColor:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  },
  {
    title: "Register Your Team",
    description:
      "Form your team and register to compete. Open for students from class IX to XII.",
    image: "/assets/static/register.png",
    link: "/register",
    cta: "Register Now",
    accent: "from-pink-400 to-rose-500",
    badge: "Open",
    badgeColor:
      "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400",
  },
  {
    title: "Learn About Us",
    description:
      "Discover the legacy and vision of Jalpaiguri Zilla School, celebrating 150 years of excellence.",
    image: "/assets/static/jzs.png",
    link: "https://jzs1876.wixsite.com/zillaschool/about",
    cta: "About School",
    accent: "from-purple-400 to-violet-600",
    badge: "150 Years",
    badgeColor: "bg-cyan-400 dark:bg-indigo-900/40 text-[#ffbf00]",
  },
];

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    if (window && localStorage.getItem("_user")) {
      setLoggedIn(true);
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-linear-to-br from-yellow-50 via-white to-amber-50/60 transition-colors duration-300 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* ── Decorative blobs (unchanged positions, refined colors) ── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="animate-blob absolute -left-24 top-0 h-72 w-72 rounded-full bg-yellow-200/60 blur-3xl dark:bg-yellow-900/30 sm:w-md" />
        <div className="animate-blob animation-delay-2000 absolute -right-24 top-0 h-72 w-72 rounded-full bg-purple-200/50 blur-3xl dark:bg-purple-900/20 sm:w-md" />
        <div className="animate-blob animation-delay-4000 absolute -bottom-20 left-1/4 h-72 w-72 rounded-full bg-pink-200/50 blur-3xl dark:bg-pink-900/20 sm:w-md" />
      </div>

      {/* ════════════════════════════════
          HERO
      ════════════════════════════════ */}
      <section className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-8 px-5 py-12 sm:gap-12 sm:py-20 md:flex-row md:py-24">
        {/* Left copy */}
        <div className="flex flex-1 flex-col items-start">
          {/* pill badge */}
          <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold tracking-widest text-amber-700 shadow-sm dark:border-amber-700/40 dark:bg-amber-900/20 dark:text-amber-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
            </span>
            EST. 1876 · 150 YEARS OF EXCELLENCE
          </span>

          <h1 className="mb-3 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-white">
            Welcome to{" "}
            <span className="bg-linear-to-r from-yellow-500 via-pink-500 to-purple-600 bg-clip-text text-transparent dark:from-yellow-400 dark:via-pink-400 dark:to-purple-400">
              Quizdom
            </span>
          </h1>

          <h2 className="mb-4 text-lg font-semibold text-gray-600 sm:text-xl dark:text-gray-300">
            Jalpaiguri Zilla School Quiz Portal
          </h2>

          <p className="mb-8 max-w-lg text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-400">
            Join us in celebrating{" "}
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              150 years
            </span>{" "}
            of academic excellence and vibrant competition.{" "}
            <span className="font-medium text-pink-600 dark:text-pink-400">
              Test your knowledge, compete with the best, and be part of our
              legacy.
            </span>
          </p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-xl bg-linear-to-r from-yellow-400 to-pink-500 px-7 py-3 text-base font-bold shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl hover:brightness-110 dark:from-yellow-500 dark:to-pink-600"
            >
              <Link href="/about">Learn More</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="rounded-xl bg-linear-to-r from-gray-800 to-purple-900 px-7 py-3 text-base font-bold shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl hover:brightness-110 dark:from-gray-700 dark:to-purple-800"
            >
              <Link href={loggedIn ? "/quiz" : "/register"}>
                {loggedIn ? "Start Quiz" : "Register Now"}
              </Link>
            </Button>
          </div>
        </div>

        {/* Right image */}
        <div className="relative mt-6 flex flex-1 justify-center md:mt-0">
          {/* glow ring */}
          <div className="absolute inset-0 m-auto h-52 w-52 rounded-full bg-linear-to-br from-yellow-300/40 to-pink-300/30 blur-3xl dark:from-yellow-700/30 dark:to-pink-700/20" />
          <div className="relative z-10 rounded-3xl border-2 border-yellow-200/80 bg-white p-1.5 shadow-2xl dark:border-yellow-700/40 dark:bg-gray-900">
            <Image
              src="/assets/static/jzs.png"
              alt="Jalpaiguri Zilla School"
              width={230}
              height={230}
              className="rounded-2xl object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          FEATURES
      ════════════════════════════════ */}
      <section className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-6 px-5 py-10 sm:grid-cols-2 sm:gap-8 sm:py-16 md:grid-cols-3">
        {features.map((feature, idx) => (
          <Card
            key={idx}
            className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white/90 p-0 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:border-neutral-800 dark:bg-gray-900/90"
          >
            {/* image with gradient footer overlay */}
            <div className="relative w-full overflow-hidden">
              <Image
                src={feature.image}
                alt={feature.title}
                width={400}
                height={220}
                className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-48"
              />
              {/* scrim */}
              <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
              {/* badge */}
              <span
                className={`absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-bold shadow ${feature.badgeColor}`}
              >
                {feature.badge}
              </span>
            </div>

            <CardContent className="flex flex-1 flex-col px-5 pt-5 pb-2">
              <h3 className="mb-2 text-lg font-extrabold tracking-tight text-gray-800 transition-colors duration-200 group-hover:text-pink-600 sm:text-xl dark:text-yellow-300 dark:group-hover:text-pink-400">
                {feature.title}
              </h3>
              <p className="flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base">
                {feature.description}
              </p>
            </CardContent>

            <CardFooter className="px-5 pb-5 pt-3">
              <Button
                asChild
                className={`w-full rounded-xl bg-linear-to-r ${feature.accent} border-0 py-2.5 text-sm font-bold shadow transition-all duration-200 hover:scale-105 hover:shadow-lg sm:text-base`}
              >
                <Link href={feature.link}>{feature.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </section>

      {/* ════════════════════════════════
          FOOTER BANNER
      ════════════════════════════════ */}
      <section className="relative z-10 mx-auto mt-8 max-w-4xl px-5 pb-16 text-center sm:mt-12 sm:pb-20">
        <div className="relative overflow-hidden rounded-2xl border border-yellow-200/80 bg-linear-to-r from-yellow-50 via-pink-50 to-purple-50 px-6 py-10 shadow-xl sm:px-10 sm:py-12 dark:border-yellow-800/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
          {/* decorative rings */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full border-30 border-amber-200/30 dark:border-amber-800/20" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 h-28 w-28 rounded-full border-20 border-purple-200/30 dark:border-purple-800/20" />

          <span className="mb-4 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            Milestone
          </span>
          <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-yellow-800 sm:text-3xl dark:text-yellow-400">
            🎉 Celebrating 150 Years of Jalpaiguri Zilla School 🎉
          </h2>
          <p className="mb-7 text-base text-gray-600 sm:text-lg dark:text-gray-300">
            Since{" "}
            <span className="font-semibold text-gray-800 dark:text-white">
              26th May 1876
            </span>
            , nurturing minds and building leaders.
          </p>
          <Button
            asChild
            size="lg"
            className="rounded-xl bg-linear-to-r from-gray-900 to-purple-900 px-8 py-3 text-base font-bold shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl dark:from-gray-800 dark:to-purple-800"
          >
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
