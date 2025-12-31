"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  memo,
} from "react";
import Image from "next/image";
import {
  Calendar,
  Star,
  Zap,
  GraduationCap,
  ChevronsDown,
  LucideIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

// UTILS
import { cn } from "@/lib/utils";
import { getAvatarColor, getInitials } from "@/lib/avatar";

// Types
interface Member {
  name: string;
  role?: string;
  description?: string;
  avatar?: string;
}

interface TimelineData {
  id: string;
  time: string;
  title: string;
  content: string;
  icon: LucideIcon;
  additionalContent?: React.ReactNode;
}

interface ImageProps {
  src: string;
  alt: string;
}

// Scroll Progress Bar
const ScrollProgress = memo(() => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollProgress = scrollY / (documentHeight - viewportHeight);
      setWidth(Math.min(scrollProgress * 100, 100));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 right-0 left-0 z-50 h-1.5 bg-gray-200 shadow-md dark:bg-gray-800">
      <div
        className="h-full bg-linear-to-r from-yellow-400 via-orange-500 to-pink-500 transition-all duration-150 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
});
ScrollProgress.displayName = "ScrollProgress";

// Scroll To Next Button
function ScrollToNext() {
  const handleScroll = () => {
    window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" });
  };
  return (
    <Button
      size="icon"
      className="fixed right-8 bottom-10 z-50 h-14 w-14 animate-bounce rounded-full bg-linear-to-br from-pink-500 to-yellow-400 shadow-xl hover:from-yellow-400 hover:to-pink-500"
      onClick={handleScroll}
      aria-label="Scroll down"
    >
      <ChevronsDown className="h-7 w-7" />
    </Button>
  );
}

// Enhanced Carousel Component
function HistoryCarousel({ images }: { images: ImageProps[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="relative w-full">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {images.map((img, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/1">
              <div className="p-1">
                {/* Using Next.js Image:
                  1. Parent div needs 'relative' and an aspect ratio.
                  2. Image uses 'fill' prop.
                */}
                <div className="relative overflow-hidden rounded-xl border border-gray-200 shadow-sm dark:border-gray-800 aspect-video w-full">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Prominent Buttons */}
        <CarouselPrevious className="absolute left-4 top-1/2 h-12 w-12 -translate-y-1/2 border-2 border-white bg-black/50 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-black/80 hover:scale-110 dark:border-gray-800 dark:bg-white/20" />
        <CarouselNext className="absolute right-4 top-1/2 h-12 w-12 -translate-y-1/2 border-2 border-white bg-black/50 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-black/80 hover:scale-110 dark:border-gray-800 dark:bg-white/20" />
      </Carousel>

      {/* Indicators */}
      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-2 w-2 rounded-full transition-all duration-300",
              current === index + 1
                ? "w-8 bg-linear-to-r from-purple-500 to-pink-500"
                : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-700"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// Data Constants
const quizdomMembers: Member[] = [
  {
    name: "Sri Manoj Kumar Sarkar (ASSISTANT MASTER - M.A. (Economics), B.Ed.)",
    role: "Quizdom Chief (Mentor-in-Chief)",
    description:
      "The guiding light of Quizdom, inspiring generations with unwavering support.",
  },
  { name: "Rupankar Dhar (Alumnus)", role: "President" },
  { name: "Priyam Das (Alumnus)", role: "Vice President" },
  { name: "Nababrata Roy (Alumnus)", role: "Advisor" },
  { name: "Rishiraj Sarkar (Alumnus)", role: "Treasurer" },
  { name: "Ananyo Kar", role: "Media Head" },
  { name: "Kaustav Kar (Alumnus)", role: "Social Influencer" },
  { name: "Prithwish Chakraborty (Alumnus)", role: "Secretary" },
  { name: "Debangik Biswas", role: "Joint Secretary" },
  { name: "Tanmay Das", role: "Joint Secretary" },
  { name: "Prantik Sengupta", role: "Joint Secretary" },
  { name: "Jayostu Modak", role: "Post Coordinator" },
  { name: "Abhradeep Mitra", role: "Marketing Head" },
  { name: "Sinchan Maitra", role: "Technical Head" },
];

const gradientPalettes = [
  "from-yellow-400 via-orange-400 to-pink-400",
  "from-blue-400 via-purple-400 to-pink-300",
  "from-green-300 via-blue-300 to-purple-200",
  "from-rose-400 via-fuchsia-400 to-indigo-400",
];

const season2Carousel: ImageProps[] = [
  { src: "/assets/history/season2/1.jpg", alt: "Season 2 Image 1" },
  { src: "/assets/history/season2/2.jpg", alt: "Season 2 Image 2" },
  { src: "/assets/history/season2/3.jpg", alt: "Season 2 Image 3" },
  { src: "/assets/history/season2/4.jpg", alt: "Season 2 Image 4" },
  { src: "/assets/history/season2/5.jpg", alt: "Season 2 Image 5" },
  { src: "/assets/history/season2/6.jpg", alt: "Season 2 Image 6" },
  { src: "/assets/history/season2/7.jpg", alt: "Season 2 Image 7" },
];

const season3Carousel: ImageProps[] = [
  { src: "/assets/history/season3/1.jpeg", alt: "Season 3 Image 1" },
  { src: "/assets/history/season3/2.jpeg", alt: "Season 3 Image 2" },
  { src: "/assets/history/season3/3.jpeg", alt: "Season 3 Image 3" },
  { src: "/assets/history/season3/4.jpeg", alt: "Season 3 Image 4" },
  { src: "/assets/history/season3/5.jpeg", alt: "Season 3 Image 5" },
  { src: "/assets/history/season3/6.jpeg", alt: "Season 3 Image 6" },
  { src: "/assets/history/season3/7.jpeg", alt: "Season 3 Image 7" },
];

// Sub-components
function AnimatedBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="animate-blob1 absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-pink-400 opacity-20 blur-3xl will-change-transform"></div>
      <div className="animate-blob2 absolute top-0 right-0 h-72 w-72 rounded-full bg-yellow-200 opacity-30 blur-3xl will-change-transform"></div>
      <div className="animate-blob3 absolute bottom-0 left-0 h-72 w-72 rounded-full bg-purple-300 opacity-20 blur-2xl will-change-transform"></div>
    </div>
  );
}

const TimelinePoint = memo(
  ({
    icon: Icon,
    className = "",
  }: {
    icon: LucideIcon;
    className?: string;
  }) => (
    <div className="relative flex flex-col items-center">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${className}`}
      >
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div className="absolute top-12 h-full w-0.5 bg-linear-to-b from-gray-300 to-transparent dark:from-gray-700"></div>
    </div>
  )
);
TimelinePoint.displayName = "TimelinePoint";

// Main Page
export default function QuizHistoryPage(): React.JSX.Element {
  const [animationStates, setAnimationStates] = useState<
    Record<number, boolean>
  >({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(
            entry.target.getAttribute("data-index") || "-1"
          );
          if (index > -1) {
            setAnimationStates((prev) => {
              if (prev[index]) return prev; // Already animated
              return { ...prev, [index]: true };
            });
            observerRef.current?.unobserve(entry.target);
          }
        }
      });
    },
    []
  );

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    });

    const elements = document.querySelectorAll(".timeline-item");
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [handleIntersection]);

  const timelineData: TimelineData[] = useMemo(
    () => [
      {
        id: "prologue",
        time: "A Timeless Beginning",
        title: "Prologue: A Place of Questions",
        content: `Step into Jalpaiguri Zilla School, and the very air is charged with more than age itself. Even prior to microphones, projectors, or digital screens, curiosity was the lifeblood of this institution.`,
        icon: GraduationCap,
      },
      {
        id: "emerging",
        time: "Early 2010s",
        title: "An Emerging Tradition",
        content: `By the early 2010s, it was not just an event—it became a badge of honor. Schools from the entire Jalpaiguri district participated every year.`,
        icon: Star,
      },
      {
        id: "season1",
        time: "2019",
        title: "Season 1: The Tradition Lives On",
        content: "2019: The Start of Something New",
        icon: Calendar,
        additionalContent: (
          <Card className="mt-6 border-blue-200 bg-linear-to-br from-blue-50 to-cyan-50 dark:border-blue-800 dark:from-blue-900/20 dark:to-cyan-900/20">
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-300">
                📸 A Glimpse of the Tradition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <HistoryCarousel
                images={[
                  { src: "/assets/history/season1/1.jpg", alt: "Season 1" },
                ]}
              />
            </CardContent>
          </Card>
        ),
      },
      {
        id: "transition",
        time: "A New Era Dawns",
        title: "A World in Transition",
        content: `The world was moving fast. Students craved something more interesting than rote memorization. 'Every Question Has A Story' became the new mantra.`,
        icon: Zap,
      },
      {
        id: "season2",
        time: "2023",
        title: "Season 2: End of the Old Era",
        content:
          "In 2023, the quiz felt like a relic. But it was just the calm before the storm—a mock drill for a revolution.",
        icon: GraduationCap,
        additionalContent: (
          <div className="mt-6 space-y-6">
            <p className="leading-relaxed text-gray-700 dark:text-gray-200">
              2024 wouldn&apos;t just be another edition — it would be a{" "}
              <b>renaissance</b>.
            </p>
            <Card className="border-yellow-200 bg-linear-to-br from-yellow-50 to-orange-50 dark:border-yellow-800 dark:from-yellow-900/20 dark:to-orange-900/20">
              <CardHeader>
                <CardTitle className="text-yellow-800 dark:text-yellow-300">
                  📸 A Glimpse of the Past
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HistoryCarousel images={season2Carousel} />
              </CardContent>
            </Card>
          </div>
        ),
      },
      {
        id: "quizdom",
        time: "2024",
        title: "Season 3: The Era of Quizdom",
        content: `In 2024, Quizdom was built. A team committed to continuing the legacy with a new-age quizzing culture.`,
        icon: Calendar,
        additionalContent: (
          <div className="mt-6 space-y-6">
            <Card className="border-purple-200 bg-linear-to-br from-purple-50 to-pink-50 dark:border-purple-800 dark:from-purple-900/20 dark:to-pink-900/20">
              <CardHeader>
                <CardTitle className="text-purple-800 dark:text-purple-300">
                  🌟 Founding Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Card className="col-span-1 border-purple-400 dark:border-purple-700 sm:col-span-2">
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-4">
                        <Avatar
                          className={`h-12 w-12 bg-linear-to-r ${getAvatarColor(
                            quizdomMembers[0].name
                          )}`}
                        >
                          <AvatarFallback className="bg-transparent text-white font-semibold">
                            {getInitials(quizdomMembers[0].name.substring(4))}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-lg font-bold text-purple-800 dark:text-purple-100">
                            {quizdomMembers[0].name}
                          </p>
                          <Badge variant="secondary" className="mt-1">
                            <i>{quizdomMembers[0].role}</i>
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {/* Minimized list for performance - add more if needed */}
                  {quizdomMembers.slice(1).map((member, index) => (
                    <Card
                      key={index}
                      className="cursor-pointer border-purple-200 transition-all hover:-translate-y-1 hover:shadow-lg dark:border-purple-700"
                    >
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-center space-x-3">
                          <Avatar
                            className={`h-12 w-12 bg-linear-to-r ${getAvatarColor(
                              member.name
                            )}`}
                          >
                            <AvatarFallback className="bg-transparent text-white font-semibold">
                              {getInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">
                              {member.name}
                            </p>
                            <Badge variant="outline" className="text-[10px]">
                              <i>{member.role}</i>
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-linear-to-br from-yellow-50 to-orange-50 dark:border-yellow-800 dark:from-yellow-900/20 dark:to-orange-900/20">
              <CardHeader>
                <CardTitle className="text-yellow-800 dark:text-yellow-300">
                  📸 To the New Era
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HistoryCarousel images={season3Carousel} />
              </CardContent>
            </Card>
          </div>
        ),
      },
      {
        id: "revolution",
        time: "2024",
        title: "The Revolution of 2024",
        content:
          "Gone were disconnected questions. The quiz became a tapestry of tales.",
        icon: Zap,
      },
      {
        id: "sesquicentennial",
        time: "2025",
        title: "The Sesquicentennial Year",
        content:
          "150 years! A monumental milestone for Jalpaiguri Zilla School.",
        icon: Calendar,
      },
      {
        id: "journey",
        time: "Early 2025",
        title: "Journey to Grand Day",
        content:
          "Sleepless nights and endless research to honor the 150th year.",
        icon: Zap,
      },
      {
        id: "beyond",
        time: "Ongoing",
        title: "Beyond Competition",
        content: "Quizdom is now a movement, hosting workshops and outreach.",
        icon: Star,
      },
      {
        id: "eqhas",
        time: "Philosophy",
        title: "Spirit of EQHAS",
        content:
          "Every Question Has A Story. It's not about cramming; it's about exploring.",
        icon: Star,
      },
      {
        id: "torch",
        time: "Celebration",
        title: "Carrying the Torch",
        content: "Celebrating 150 years of learning and curiosity.",
        icon: GraduationCap,
      },
      {
        id: "unending",
        time: "The Future",
        title: "An Unending Story",
        content: "The tale of Jalpaiguri Zilla School Quiz is just starting.",
        icon: Calendar,
      },
    ],
    []
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-linear-to-br from-amber-50 via-white to-rose-50 px-2 py-8 transition-colors duration-500 sm:px-4 sm:py-16 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AnimatedBlobs />
      <ScrollProgress />

      <div
        className="mx-auto mt-8 w-[90vw] max-w-275 rounded-3xl border-0 bg-white/95 p-6 shadow-2xl backdrop-blur-xl sm:p-12 dark:bg-gray-900/85"
        data-section
      >
        <div className="flex flex-col items-center">
          <div className="mb-12 text-center">
            <h1 className="mb-4 bg-linear-to-r from-yellow-600 via-orange-500 to-red-500 bg-clip-text text-4xl font-extrabold text-transparent drop-shadow-lg sm:text-7xl">
              ⚡ Jalpaiguri Zilla School
            </h1>
            <h2 className="mb-4 bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent sm:text-4xl">
              Annual Interschool Quiz Competition
            </h2>
            <p className="text-xl font-medium text-yellow-700 dark:text-yellow-400">
              Legacy. Revolution. The tale continues.
            </p>
          </div>

          <div className="w-full">
            {timelineData.map((item, index) => {
              const gradientClass =
                gradientPalettes[index % gradientPalettes.length];
              const isAnimated = animationStates[index];

              return (
                <div
                  key={item.id}
                  data-index={index}
                  className={cn(
                    "timeline-item group relative flex gap-6 pb-12 transition-all duration-700",
                    isAnimated
                      ? "translate-y-0 opacity-100"
                      : "translate-y-16 opacity-0"
                  )}
                >
                  <TimelinePoint
                    icon={item.icon}
                    className={`bg-linear-to-r ${gradientClass} border-2 border-white shadow-lg`}
                  />

                  <div className="flex-1">
                    <Card className="border-0 shadow-xl backdrop-blur-md transition-all duration-300 hover:shadow-2xl">
                      <CardHeader>
                        <CardDescription className="mb-2 text-base font-semibold tracking-wide">
                          {item.time}
                        </CardDescription>
                        <CardTitle className="text-2xl text-yellow-700 dark:text-yellow-400">
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-200">
                          {item.content}
                        </p>
                        {item.additionalContent && (
                          <div className="mt-8">{item.additionalContent}</div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats Card */}
          <Card className="mt-16 w-full border-0 bg-linear-to-r from-blue-50 to-purple-50 shadow-xl dark:from-blue-900/20 dark:to-purple-900/20">
            <CardContent className="pt-8">
              <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
                <div className="space-y-2">
                  <div className="text-4xl font-extrabold text-blue-600">
                    19
                  </div>
                  <div className="text-sm text-gray-600">Schools</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-extrabold text-purple-600">
                    {quizdomMembers.length}
                  </div>
                  <div className="text-sm text-gray-600">Members</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-extrabold text-pink-600">
                    2024
                  </div>
                  <div className="text-sm text-gray-600">Revolution</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-extrabold text-orange-600">
                    ∞
                  </div>
                  <div className="text-sm text-gray-600">Stories</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ScrollToNext />
    </div>
  );
}
