"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Button } from "flowbite-react";
import Link from "next/link";
import {
  Timeline,
  TimelineItem,
  TimelineContent,
  TimelinePoint,
  TimelineTime,
  TimelineBody,
  TimelineTitle,
} from "flowbite-react";
import {
  HiCalendar,
  HiStar,
  HiLightningBolt,
  HiAcademicCap,
  HiChevronDoubleDown,
} from "react-icons/hi";
import CustomCarousel, { ImageProps } from "@/components/utils/carousel";

// Member interface
interface Member {
  name: string;
  role?: string;
  avatar?: string;
}

// Timeline data interface
interface TimelineData {
  id: string;
  time: string;
  title: string;
  content: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  additionalContent?: React.ReactNode;
}

// Animation state for each timeline item
interface AnimationState {
  hasAnimated: boolean;
  animationDelay: number;
}

// Scroll metrics for progress bar
interface ScrollMetrics {
  scrollY: number;
  viewportHeight: number;
  documentHeight: number;
  scrollProgress: number;
}

// Intersection Observer config
interface ObserverConfig {
  threshold: number;
  rootMargin: string;
}

// Quizdom team data (now with avatars for a modern feel)
const quizdomMembers: Member[] = [
  {
    name: "Rupankar Dhar (Alumnus)",
    role: "President (Strategic Commander)",
  },
  {
    name: "Priyam Das (Alumnus)",
    role: "Vice President (Operational Catalyst)",
  },
  {
    name: "Nababrata Roy (Alumnus)",
    role: "Advisor (Mentor & Knowledge Architect)",
  },
  {
    name: "Rishiraj Sarkar (Alumnus)",
    role: "Treasurer (Financial Navigator)",
  },
  {
    name: "Ananyo Kar",
    role: "Media Head (Digital Storyteller)",
  },
  {
    name: "Kaustav Kar (Alumnus)",
    role: "Social Influencer (Brand Ambassador)",
  },
  {
    name: "Prithwish Chakraborty (Alumnus)",
    role: "Secretary (Administrative Coordinator)",
  },
  {
    name: "Debangik Biswas",
    role: "Joint Secretary (Logistics Expert)",
  },
  {
    name: "Tanmay Das",
    role: "Joint Secretary (Content Strategist)",
  },
  {
    name: "Prantik Sengupta",
    role: "Joint Secretary (Innovation Catalyst)",
  },
  {
    name: "Jayostu Modak",
    role: "Post Coordinator (Communication Specialist)",
  },
  {
    name: "Abhradeep Mitra",
    role: "Marketing Head (Growth Strategist)",
  },
  {
    name: "Sinchan Maitra",
    role: "Technical Head (Tech Handler)",
  },
];

// Modern gradient palettes for cards/timeline
const gradientPalettes = [
  "from-yellow-400 via-orange-400 to-pink-400",
  "from-blue-400 via-purple-400 to-pink-300",
  "from-green-300 via-blue-300 to-purple-200",
  "from-rose-400 via-fuchsia-400 to-indigo-400",
];

// Animated background blobs
function AnimatedBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <div className="animate-blob1 absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-pink-400 opacity-40 blur-3xl"></div>
      <div className="animate-blob2 absolute top-0 right-0 h-72 w-72 rounded-full bg-yellow-200 opacity-50 blur-3xl"></div>
      <div className="animate-blob3 absolute bottom-0 left-0 h-72 w-72 rounded-full bg-purple-300 opacity-40 blur-2xl"></div>
    </div>
  );
}

// Main enhanced component
export default function QuizHistoryPage(): React.JSX.Element {
  // Refs and states
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [animationStates, setAnimationStates] = useState<AnimationState[]>([]);
  const [scrollMetrics, setScrollMetrics] = useState<ScrollMetrics>({
    scrollY: 0,
    viewportHeight: 0,
    documentHeight: 0,
    scrollProgress: 0,
  });
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);

  // Intersection Observer config

  const observerConfig: ObserverConfig = useMemo(
    () => ({
      threshold: 0.14,
      rootMargin: "-100px 0px -100px 0px",
    }),
    [],
  );

  // Animation config
  const animationConfig = useMemo(
    () => ({
      baseDelay: 23,
      staggerDelay: 100,
      easeInOutQuart: "cubic-bezier(0.76, 0, 0.24, 1)",
    }),
    [],
  );

  // Carousels
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
    { src: "/assets/history/season3/8.jpeg", alt: "Season 3 Image 8" },
    { src: "/assets/history/season3/9.jpeg", alt: "Season 3 Image 9" },
    { src: "/assets/history/season3/10.jpeg", alt: "Season 3 Image 10" },
    { src: "/assets/history/season3/11.jpeg", alt: "Season 3 Image 11" },
    { src: "/assets/history/season3/12.jpeg", alt: "Season 3 Image 12" },
    { src: "/assets/history/season3/13.jpeg", alt: "Season 3 Image 13" },
    { src: "/assets/history/season3/14.jpeg", alt: "Season 3 Image 14" },
  ];

  // Timeline data (same as before)
  const timelineData: TimelineData[] = useMemo(
    () => [
      {
        id: "prologue",
        time: "A Timeless Beginning",
        title: "Prologue: A Place of Questions",
        content: `Step into Jalpaiguri Zilla School, and the very air is charged with more than age itself. There is a hush there, woven into the red bricks and echoing through the corridors—a hush that speaks of generations upon generations of questioners. Even prior to microphones, projectors, or digital screens, curiosity was the lifeblood of this institution. Under the boughs of great trees, in dusty classrooms, children questioned one another, not for grades alone, but for the sheer joy of knowing more. The thirst for knowledge was so ingrained into the fabric of day-to-day life that it was only to be expected that something greater would have been born. And thus, from these walls, was born a tradition—the Jalpaiguri Zilla School Interschool Annual Quiz Competition.`,
        icon: HiAcademicCap,
      },
      {
        id: "emerging",
        time: "Early 2010s",
        title: "An Emerging Tradition",
        content: `There is no exact date that marks when the quiz actually gained momentum, but year after year, it became an integral part of the school culture. By the early 2010s, it was not just an event—it became a badge of honor and pride. Schools from the entire Jalpaiguri district participated every year, really looking to prove what they had, with teams of smart students in tow, ready to take on the challenge. Students prepared months in advance, reading books, maps, and all sorts of facts. Teachers were all for it, cheering them on, while alumni would reminisce about their own memories on stage, and audiences came, psyched for the show. For those who took the plunge onto the quiz stage, it was never about winning a trophy. It was about being a part of something bigger, proving they were good enough for the school's tradition, and leaving their stamp in the school's history.`,
        icon: HiStar,
      },
      {
        id: "season1",
        time: "2019",
        title: "Season 1: The Emerging Tradition Lives On",
        content: "2019: The Start of Something New",
        icon: HiCalendar,
        additionalContent: (
          <div className="mt-6 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 shadow-lg dark:border-blue-800 dark:from-blue-900/20 dark:to-cyan-900/20">
            <h3 className="mb-4 text-xl font-bold text-blue-800 sm:text-2xl dark:text-blue-300">
              📸 A Glimpse of the Tradition
            </h3>
            <CustomCarousel
              images={[
                {
                  src: "/assets/history/season1/1.jpg",
                  alt: "Season 1 Image 1",
                },
              ]}
            />
          </div>
        ),
      },
      {
        id: "transition",
        time: "A New Era Dawns",
        title: "A World in Transition, A Changing Quiz",
        content: `So, you know how the world outside of school is moving so fast? Well, students felt the same tension with their own expectations. The old method of just spitting out facts began to sound really dull. They were craving something more interesting, something that required them to actually understand things, not just memorize them. All over India, this hip new quizzing scene was emerging: Every Question Has A Story. Rather than presenting dry facts in list form, quizzes began to tell stories. Clues got embedded in stories about history, science, culture, and what it means to be human. Knowledge became this living puzzle just waiting to be solved. At Jalpaiguri Zilla School, this vision resonated because curiosity had always been a part of the culture there. It got everyone thinking that the school's legendary quiz culture could absolutely make a comeback in a new, modern way.`,
        icon: HiLightningBolt,
      },
      {
        id: "season2",
        time: "2023",
        title: "Season 2: End of the Old Era",
        content:
          "In 2023, the Jalpaiguri Zilla School Interschool Annual Quiz Competition felt like a relic of the past — a shadow of the grand spectacle it once was. The format clung stubbornly to tradition, with questions that tested rote memory rather than sparked curiosity. The audience filled the hall, but the buzz was missing, the thrill replaced by polite applause and yawns. It seemed as though the soul of the quiz had withered — and whispers began to spread: Was this the final curtain call?",
        icon: HiAcademicCap,
        additionalContent: (
          <div>
            <p className="mt-6 leading-relaxed text-gray-700 dark:text-gray-200">
              But fate had other options.
            </p>
            <p className="mt-6 leading-relaxed text-gray-700 dark:text-gray-200">
              Just when it looked like the legacy would fade into silence, a
              spark ignited — a group of passionate students refused to let the
              story end there. They saw 2023 not as a finale, but as a mock
              drill for a revolution. It wasn’t the end; it was the intermission
              before the storm — the calm before a new dawn. With fire in their
              eyes and vision in their hearts, they vowed to rewrite the script.
            </p>
            <p className="mt-6 leading-relaxed text-gray-700 dark:text-gray-200">
              2024 wouldn't just be another edition — it would be a{" "}
              <b>renaissance</b>. A rebirth. The quiz was about to evolve — from
              a boring battle of facts into an electrifying festival of
              intellect, imagination, and innovation. The stage was set for a
              new era… and this time, it wouldn’t just be a competition.
            </p>
            <p className="mt-6 leading-relaxed text-gray-700 dark:text-gray-200">
              It was a <b>movement</b>.
            </p>
            <div className="mt-6 rounded-2xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 p-6 shadow-lg dark:border-yellow-800 dark:from-yellow-900/20 dark:to-orange-900/20">
              <h3 className="mb-4 text-xl font-bold text-yellow-800 sm:text-2xl dark:text-yellow-300">
                📸 A Glimpse of the Past
              </h3>
              <CustomCarousel
                images={season2Carousel}
                autoPlayInterval={4579}
              />
            </div>
          </div>
        ),
      },
      {
        id: "quizdom",
        time: "2024",
        title: "Season 3: The Era of Quizdom",
        content: `In 2024, a new batch of enthusiastic students felt that the moment was right to make a difference. They built Quizdom, the official quiz team of Jalpaiguri Zilla School, committed to continuing the legacy but with a mindset that broke open to the new-age quizzing culture.`,
        icon: HiCalendar,
        additionalContent: (
          <div>
            <div className="mt-6 rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6 shadow-lg dark:border-purple-800 dark:from-purple-900/20 dark:to-pink-900/20">
              <h3 className="mb-4 text-xl font-bold text-purple-800 sm:text-2xl dark:text-purple-300">
                🌟 Founding Members
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {quizdomMembers.map((member, index) => (
                  <div
                    key={index}
                    className="group rounded-xl border border-purple-200 bg-white/80 p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-200/50 dark:border-purple-700 dark:bg-purple-900/20 dark:hover:shadow-purple-900/30"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-sm font-bold text-white">
                        {member.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-gray-900 dark:text-gray-100">
                          {member.name}
                        </p>
                        {member.role && (
                          <p className="text-xs text-purple-600 dark:text-purple-400">
                            <b>
                              <i>{member.role}</i>
                            </b>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
                These founders had one thing in common: that a quiz is not just
                a battle of facts. They felt that it had to challenge,
                entertain, and inspire, weaving knowledge into tales that
                required logic as much as imagination.
              </p>
            </div>
            <div className="mt-6 rounded-2xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 p-6 shadow-lg dark:border-yellow-800 dark:from-yellow-900/20 dark:to-orange-900/20">
              <h3 className="mb-4 text-xl font-bold text-yellow-800 sm:text-2xl dark:text-yellow-300">
                📸 To the New Era
              </h3>
              <CustomCarousel
                images={season3Carousel}
                autoPlayInterval={4579}
              />
            </div>
          </div>
        ),
      },

      {
        id: "revolution",
        time: "2024",
        title: "The Revolution of 2024",
        content: `The 2024 annual quiz, conducted by Quizdom, was a revelation. Gone were the lists of disconnected questions that participants had hitherto faced. Instead, the quiz was a rich tapestry of tales, each strand concealing clues waiting to be unearthed. Nineteen schools took part that year, from every corner of Jalpaiguri district. The auditorium was charged with tension. Teachers, pupils, and visitors leaned forward in their seats, mesmerized not just by the questions themselves, but by the tales being spun before them. Applause erupted not just for correct answers, but for witty leaps of association and breathtaking revelations. By the time trophies were presented, one reality was inescapable: Quizdom had brought Jalpaiguri Zilla School's quiz into a new era.`,
        icon: HiLightningBolt,
      },
      {
        id: "sesquicentennial",
        time: "2025",
        title: "The Sesquicentennial Year",
        content: `So here it is, 2025, and it's a biggie. Jalpaiguri Zilla School is set to reach a monumental milestone—150 years! That's not every anniversary. Everywhere on campus, there are banners blowing in the wind, old pictures from a long, long time ago are posted for everyone to see, and everyone's talking, reliving memories and discussing the future. For Quizdom, this anniversary is more than just another date on the calendar. It's a once-in-a-lifetime opportunity to organize the greatest quiz event the school has ever hosted.`,
        icon: HiCalendar,
      },
      {
        id: "journey",
        time: "Early 2025",
        title: "The Journey to the Grand Day",
        content: `Since the initial weeks of 2025, the Quizdom members have labored with passion. Ideas were sketched and re-sketched, with each aspect studied and refined. The group had imagined a quiz that would not only test the mind but pay tribute to the school heritage and reflect the contemporary spirit of the EQHAS. They wished for this year's competition to be better than all previous years, inviting more schools to join the fold and providing an experience that no one would ever forget. This vision necessitated sleepless nights, endless hours of research, and tireless debates on how to best organize the ideal narrative structure for each round. But the commitment never faltered, for Quizdom knew the sesquicentennial quiz was not just an event—it was history in the making.`,
        icon: HiLightningBolt,
      },
      {
        id: "beyond",
        time: "Ongoing",
        title: "Beyond the Competition",
        content: `Over time, Quizdom has grown into so much more than a club. It has become a movement that is woven into Jalpaipguri Zilla School's fabric. Among its membership, students have found strengths they never knew they had—researching, designing, presenting, and working together in harmony. Younger students have been guided and motivated, and seniors have shared their wisdom, passing it on to each new generation. The organization has even reached beyond the school itself, hosting workshops, mini-quizzes, and outreach activities throughout the district. From an idea born in 2024, it has grown into a force that is redefining the culture of learning and curiosity in Jalpaiguri.`,
        icon: HiStar,
      },
      {
        id: "eqhas",
        time: "Our Philosophy",
        title: "The Spirit of EQHAS",
        content: `So, here’s the deal with Quizdom: they really believe that a quiz isn’t just a bunch of questions and answers—it’s like going on a journey through cool stories. It’s all about that look of excitement you see in someone’s eyes when everything clicks. And you know that moment when the crowd goes quiet, just waiting for the last clue to drop? That’s what it’s about too. They turn boring facts into fun puzzles that make you want to dive in and explore. In the EQHAS world, it’s not just about cramming knowledge—it’s about finding it out for yourself. Each quiz feels like an adventure, pushing everyone to think outside the box and see the connections that bring everything together.`,
        icon: HiStar,
      },
      {
        id: "torch",
        time: "The Grand Celebration",
        title: "Carrying the Torch",
        content: `Hello! So, while the grand 150th birthday bash gets underway, Quizdom is organizing an event that will not just commemorate the school's history but also set the bar high for quizzes. They absolutely understand that this year's quiz is so much more than a competition—it's a celebration of one hundred and fifty years of learning, curiosity, and that never-say-die pursuit of knowledge. And, of course, it's a reminder that the culture of curiosity, that need to know, and that joy of piecing together ideas is gonna keep Jalpaiguri Zilla School going strong for years to come. Even as they gear up for the massive event, Quizdom already thinks big. They dream of a world where they can make an even bigger difference, inspiring even more schools, cultivating even more young minds, and keeping the fire of innovation in the world of modern quizzing. For them, quizzing is not a game—it's a whole way of being, a way of thinking, and a way of keeping curiosity at the heart of learning.`,
        icon: HiAcademicCap,
      },
      {
        id: "unending",
        time: "The Future",
        title: "An Unending Story",
        content: `With the 2025 sesquicentennial quiz hanging precariously on the horizon, there is a buzz of excitement at Jalpaiguri Zilla School. Banners are waving in every corner. District schools are getting their top teams ready, preparing to take up the challenge and grab some glory. At the very heart of it all is Quizdom, totally hyped to host an event that'll leave everyone's memory etched forever. One thing's for sure: the tale of the Jalpaiguri Zilla School Interschool Annual Quiz is far from over. As long as there are questions still to be asked, clues still to be unearthed, and stories still to be told, the quizzing spirit is gonna continue burning brightly. Within these walls, one thing is eternally true: Every question has its own tale. And guess what? This tale is just starting.`,
        icon: HiCalendar,
      },
    ],
    [],
  );
  // Intersection observer logic
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(
            entry.target.getAttribute("data-index") || "-1",
          );
          if (index > -1) {
            setAnimationStates((prev) => {
              const newStates = [...prev];
              if (newStates[index] && !newStates[index].hasAnimated) {
                newStates[index].hasAnimated = true;
                return newStates;
              }
              return prev;
            });
            observerRef.current?.unobserve(entry.target);
          }
        }
      });
    },
    [],
  );

  // Update scroll metrics for progress bar
  const updateScrollMetrics = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollProgress = Math.min(
        scrollY / (documentHeight - viewportHeight),
        1,
      );
      setScrollMetrics({
        scrollY,
        viewportHeight,
        documentHeight,
        scrollProgress,
      });
    });
  }, []);

  // Init animation states
  const initializeAnimationStates = useCallback(() => {
    setAnimationStates(
      timelineData.map((_, index) => ({
        hasAnimated: index === 0,
        animationDelay:
          animationConfig.baseDelay + index * animationConfig.staggerDelay,
      })),
    );
  }, [timelineData, animationConfig.baseDelay, animationConfig.staggerDelay]);

  // Reduced motion preference
  const checkReducedMotion = useCallback(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    const handleMediaChange = (e: MediaQueryListEvent) =>
      setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  // Assign refs to timeline items
  const setItemRef = useCallback(
    (el: HTMLDivElement | null, index: number) => {
      if (index >= 0 && index < timelineData.length) {
        itemRefs.current[index] = el;
      }
    },
    [timelineData.length],
  );

  // Animation classes
  const getAnimationClasses = useCallback(
    (index: number): string => {
      const state = animationStates[index];
      if (!state) return "translate-y-16 opacity-0";
      if (isReducedMotion) {
        return "opacity-100 translate-y-0";
      }
      return `transition-all duration-700 ${
        state.hasAnimated
          ? "translate-y-0 opacity-100"
          : "translate-y-16 opacity-0"
      }`;
    },
    [animationStates, isReducedMotion],
  );

  // Animation delay style
  const getAnimationDelay = useCallback(
    (index: number): React.CSSProperties => {
      const state = animationStates[index];
      if (!state || isReducedMotion) return {};
      return {
        transitionDelay: `${state.animationDelay}ms`,
        transitionTimingFunction: animationConfig.easeInOutQuart,
      };
    },
    [animationStates, isReducedMotion, animationConfig.easeInOutQuart],
  );

  // Effect: setup observers and listeners
  useEffect(() => {
    initializeAnimationStates();
    const cleanupReducedMotion = checkReducedMotion();
    updateScrollMetrics();

    observerRef.current = new IntersectionObserver(
      handleIntersection,
      observerConfig,
    );
    const currentRefs = itemRefs.current.filter(Boolean);
    currentRefs.forEach((ref) => {
      if (ref && observerRef.current) {
        observerRef.current.observe(ref);
      }
    });

    window.addEventListener("scroll", updateScrollMetrics, { passive: true });
    window.addEventListener("resize", updateScrollMetrics, { passive: true });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      observerRef.current?.disconnect();
      window.removeEventListener("scroll", updateScrollMetrics);
      window.removeEventListener("resize", updateScrollMetrics);
      cleanupReducedMotion();
    };
  }, [
    handleIntersection,
    observerConfig,
    updateScrollMetrics,
    initializeAnimationStates,
    checkReducedMotion,
  ]);

  // Modern floating action button for navigation
  function ScrollToNextSectionBtn() {
    const handleScroll = () => {
      // Get all sections with [data-section]
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-section]"),
      );
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      // Find the first section whose top is greater than current scrollY + a little offset
      const currentBottom = scrollY + viewportHeight - 10;

      // Get the section which is next after the current viewport
      let nextSection: HTMLElement | undefined;

      for (let i = 0; i < sections.length; i++) {
        const sectionTop = sections[i].getBoundingClientRect().top + scrollY;
        if (sectionTop > currentBottom) {
          nextSection = sections[i];
          break;
        }
      }

      // If no next section, scroll by one viewport height
      if (nextSection) {
        // Use scrollIntoView with block: "start" and smooth behavior
        nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({
          top: scrollY + viewportHeight - 20,
          behavior: "smooth",
        });
      }
    };

    return (
      <button
        aria-label="Scroll to next section"
        className="fixed right-8 bottom-10 z-50 flex h-14 w-14 animate-bounce cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-yellow-400 text-white shadow-xl transition-all duration-300 hover:from-yellow-400 hover:to-pink-500"
        onClick={handleScroll}
        type="button"
      >
        <HiChevronDoubleDown className="h-7 w-7" />
      </button>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-amber-50 via-white to-rose-50 px-2 py-8 transition-colors duration-500 sm:px-4 sm:py-16 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AnimatedBlobs />
      {/* Progress Bar */}
      <div className="fixed top-0 right-0 left-0 z-50 h-1 bg-gray-200 shadow-md dark:bg-gray-700">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 to-pink-500 transition-all duration-300 ease-out"
          style={{
            width: `${Math.min(scrollMetrics.scrollProgress * 100, 100)}%`,
            transform: `translateZ(0)`,
          }}
        />
      </div>

      {/* Main Card */}
      <div
        className="mx-auto mt-8 w-[85vw] max-w-[1100px] rounded-3xl border-0 bg-white/95 p-6 shadow-2xl backdrop-blur-xl sm:p-12 dark:bg-gray-900/85"
        data-section
      >
        <div className="flex flex-col items-center">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500 bg-clip-text text-4xl font-extrabold text-transparent drop-shadow-lg sm:text-8xl lg:text-7xl dark:from-yellow-300 dark:via-orange-300 dark:to-red-300">
              ⚡ Jalpaiguri Zilla School
            </h1>
            <h2 className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent sm:text-5xl dark:from-purple-400 dark:to-pink-400">
              Annual Interschool Quiz Competition
            </h2>
            <p className="text-xl font-medium text-gray-700 sm:text-2xl dark:text-gray-200">
              <span className="relative">
                <span className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-pink-400 opacity-30 blur"></span>
                <span className="relative font-bold text-yellow-700 dark:text-yellow-400">
                  Legacy. Revolution. The tale continues.
                </span>
              </span>
            </p>
          </div>

          {/* Timeline */}
          <div className="w-full">
            <Timeline className="relative">
              {timelineData.map((item, index) => {
                const gradientClass =
                  gradientPalettes[index % gradientPalettes.length];
                return (
                  <TimelineItem
                    key={item.id}
                    ref={(el: any) => setItemRef(el, index)}
                    data-index={index}
                    className={`group ${getAnimationClasses(index)}`}
                    style={{
                      ...getAnimationDelay(index),
                      willChange: "transform, opacity",
                    }}
                  >
                    <TimelinePoint
                      icon={item.icon}
                      className={`bg-gradient-to-r ${gradientClass} border-2 border-white shadow-lg transition-transform duration-300 group-hover:scale-110 dark:border-gray-900`}
                    />
                    <TimelineContent
                      className={`ml-6 rounded-3xl border-0 bg-white/90 p-8 shadow-xl backdrop-blur-md transition-all duration-500 hover:shadow-2xl dark:bg-gray-800/90`}
                    >
                      <TimelineTime className="mb-2 text-base font-semibold tracking-wide text-gray-600 dark:text-gray-400">
                        {item.time}
                      </TimelineTime>
                      <TimelineTitle className="mb-4 text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                        {item.title}
                      </TimelineTitle>
                      <TimelineBody className="text-lg leading-relaxed text-gray-700 dark:text-gray-200">
                        {item.content}
                      </TimelineBody>
                      {item.additionalContent && (
                        <div className="mt-8">{item.additionalContent}</div>
                      )}
                    </TimelineContent>
                  </TimelineItem>
                );
              })}
            </Timeline>
          </div>

          {/* Stats Section */}
          <div className="mt-16 w-full rounded-3xl border-0 bg-gradient-to-r from-blue-50 to-purple-50 p-8 shadow-xl dark:from-blue-900/20 dark:to-purple-900/20">
            <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
              <div className="space-y-2">
                <div className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                  19
                </div>
                <div className="text-base text-gray-600 dark:text-gray-400">
                  Schools Participated
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-extrabold text-purple-600 dark:text-purple-400">
                  {quizdomMembers.length}
                </div>
                <div className="text-base text-gray-600 dark:text-gray-400">
                  Founding Members
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-extrabold text-pink-600 dark:text-pink-400">
                  2024
                </div>
                <div className="text-base text-gray-600 dark:text-gray-400">
                  Year of Revolution
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-extrabold text-orange-600 dark:text-orange-400">
                  ∞
                </div>
                <div className="text-base text-gray-600 dark:text-gray-400">
                  Stories to Tell
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ScrollToNextSectionBtn />
    </div>
  );
}
