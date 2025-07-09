"use client";
import React, { useState, useEffect } from "react";
import { Button, Card } from "flowbite-react";
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
  },
  {
    title: "Register Your Team",
    description:
      "Form your team and register to compete. Open for students from class IX to XII.",
    image: "/assets/static/register.png",
    link: "/register",
    cta: "Register Now",
  },
  {
    title: "Learn About Us",
    description:
      "Discover the legacy and vision of Jalpaiguri Zilla School, celebrating 150 years of excellence.",
    image: "/assets/static/jzs.png",
    link: "https://jzs1876.wixsite.com/zillaschool/about",
    cta: "About School",
  },
];

export default function HomePage() {
  // STATE
  const [loggedIn, setLoggedIn] = React.useState<boolean>(false);
  useEffect(() => {
    if (window) {
      const token = localStorage.getItem("_user");
      if (token) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    }
  }, [loggedIn]);
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-yellow-50 via-white to-yellow-100 px-1 py-6 transition-colors duration-300 sm:px-2 sm:py-8 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Decorative Blobs */}
      <div className="pointer-events-none absolute z-0 opacity-30 dark:opacity-20">
        <div className="animate-blob absolute top-0 -left-16 h-60 w-60 rounded-full bg-yellow-200 mix-blend-multiply blur-3xl filter sm:h-96 sm:w-96"></div>
        <div className="animate-blob animation-delay-2000 absolute top-0 -right-16 h-60 w-60 rounded-full bg-purple-200 mix-blend-multiply blur-3xl filter sm:h-96 sm:w-96"></div>
        <div className="animate-blob animation-delay-4000 absolute -bottom-16 left-1/4 h-60 w-60 rounded-full bg-pink-200 mix-blend-multiply blur-3xl filter sm:h-96 sm:w-96"></div>
      </div>
      {/* Hero Section */}
      <section className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-8 px-2 py-8 sm:gap-12 sm:py-12 md:flex-row">
        <div className="flex flex-1 flex-col items-start">
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-gray-800 drop-shadow-lg sm:mb-4 sm:text-5xl md:text-6xl dark:text-yellow-300">
            Welcome to{" "}
            <span className="animate-gradient-x bg-gradient-to-r from-yellow-600 via-pink-500 to-purple-600 bg-clip-text text-transparent dark:from-yellow-400 dark:via-pink-400 dark:to-purple-400">
              Quizdom
            </span>
          </h1>
          <h2 className="mb-2 text-xl font-bold tracking-tight text-gray-700 sm:mb-4 sm:text-3xl md:text-4xl dark:text-gray-200">
            Jalpaiguri Zilla School Quiz Portal
          </h2>
          <p className="mb-4 text-base leading-relaxed text-gray-700 sm:mb-8 sm:text-xl dark:text-gray-300">
            Join us in celebrating{" "}
            <span className="font-semibold text-yellow-700 dark:text-yellow-400">
              150 years
            </span>{" "}
            of academic excellence and vibrant competition.
            <br />
            <span className="font-semibold text-pink-600 dark:text-pink-400">
              Test your knowledge, compete with the best, and be a part of our
              legacy!
            </span>
          </p>
          <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:gap-6">
            <Button
              as={Link}
              href="/about"
              color="warning"
              className="rounded-xl border-0 bg-gradient-to-r from-yellow-400 to-pink-400 px-6 py-2 text-base font-bold tracking-wide shadow-xl transition-all hover:scale-110 hover:shadow-2xl sm:px-8 sm:py-3 sm:text-lg dark:from-yellow-500 dark:to-pink-600"
            >
              Learn More
            </Button>
            <Button
              as={Link}
              href={loggedIn ? "/quiz" : "/register"}
              color="dark"
              className="rounded-xl border-0 bg-gradient-to-r from-gray-900 to-purple-900 px-6 py-2 text-base font-bold tracking-wide shadow-xl transition-all hover:scale-110 hover:shadow-2xl sm:px-8 sm:py-3 sm:text-lg dark:from-gray-800 dark:to-purple-800"
            >
              {loggedIn ? "Start Quiz" : "Register Now"}
            </Button>
          </div>
        </div>
        <div className="mt-6 flex flex-1 justify-center md:mt-0">
          <div className="relative">
            <div className="animate-blob absolute -top-4 -left-4 h-20 w-20 rounded-full bg-yellow-200 opacity-60 blur-2xl sm:-top-8 sm:-left-8 sm:h-40 sm:w-40 dark:bg-yellow-700"></div>
            <Image
              src="/assets/static/jzs.png"
              alt="Jalpaiguri Zilla School"
              width={220}
              height={220}
              className="z-10 rounded-2xl border-4 border-yellow-200 bg-white shadow-2xl sm:rounded-3xl dark:border-yellow-700 dark:bg-gray-900"
              priority
            />
            <div className="animate-blob animation-delay-2000 absolute -right-4 -bottom-4 h-16 w-16 rounded-full bg-pink-200 opacity-60 blur-2xl sm:-right-8 sm:-bottom-8 sm:h-32 sm:w-32 dark:bg-pink-700"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-6 px-2 py-8 sm:grid-cols-2 sm:gap-10 sm:py-12 md:grid-cols-3">
        {features.map((feature, idx) => (
          <Card
            key={idx}
            className="hover:shadow-3xl group flex flex-col items-center rounded-2xl border-0 bg-white/90 p-4 shadow-2xl transition-all duration-300 hover:scale-105 sm:p-6 dark:bg-gray-900/90"
          >
            <div className="mb-4 flex w-full justify-center sm:mb-6">
              <div className="relative">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  width={220}
                  height={220}
                  className="rounded-lg border-2 border-yellow-100 bg-white object-cover shadow-lg transition-transform duration-300 group-hover:scale-105 sm:rounded-xl dark:border-gray-800 dark:bg-gray-800"
                />
                <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-pink-200 opacity-40 blur-xl sm:-top-4 sm:-right-4 sm:h-10 sm:w-10 dark:bg-pink-700"></div>
              </div>
            </div>
            <h3 className="mb-2 text-center text-lg font-extrabold tracking-tight text-gray-800 transition group-hover:text-pink-600 sm:mb-3 sm:text-2xl dark:text-yellow-300 dark:group-hover:text-pink-400">
              {feature.title}
            </h3>
            <p className="mb-4 text-center text-base text-gray-700 sm:mb-6 sm:text-lg dark:text-gray-200">
              {feature.description}
            </p>
            <Button
              as={Link}
              href={feature.link}
              color="warning"
              className="rounded-lg border-0 bg-gradient-to-r from-yellow-400 to-pink-400 px-4 py-2 text-sm font-bold shadow transition-all hover:scale-110 hover:shadow-xl sm:px-6 sm:text-base dark:from-yellow-500 dark:to-pink-600"
            >
              {feature.cta}
            </Button>
          </Card>
        ))}
      </section>

      {/* Footer Banner */}
      <section className="relative z-10 mx-auto mt-10 max-w-4xl px-2 text-center sm:mt-16">
        <div className="rounded-2xl border border-yellow-200 bg-gradient-to-r from-yellow-100 via-pink-100 to-purple-100 px-4 py-6 shadow-2xl sm:px-8 sm:py-10 dark:border-yellow-700 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
          <h2 className="mb-2 text-xl font-extrabold tracking-tight text-yellow-800 sm:mb-3 sm:text-3xl dark:text-yellow-400">
            🎉 Celebrating 150 Years of Jalpaiguri Zilla School 🎉
          </h2>
          <p className="mb-4 text-base text-gray-700 sm:mb-6 sm:text-lg dark:text-gray-200">
            Since <span className="font-semibold">26th May 1876</span>,
            nurturing minds and building leaders.
            <br />
          </p>
          <Button
            as={Link}
            href="/about"
            color="dark"
            className="rounded-xl border-0 bg-gradient-to-r from-gray-900 to-purple-900 px-6 py-2 text-base font-bold shadow-xl transition-all hover:scale-110 hover:shadow-2xl sm:px-8 sm:py-3 sm:text-lg dark:from-gray-800 dark:to-purple-800"
          >
            Learn More
          </Button>
        </div>
      </section>
    </div>
  );
}
