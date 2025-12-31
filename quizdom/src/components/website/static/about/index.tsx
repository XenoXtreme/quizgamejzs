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
import Autoplay from "embla-carousel-autoplay";
import type { CarouselApi } from "@/components/ui/carousel";

interface ImageProps {
  src: string;
  alt: string;
}

const images: ImageProps[] = [
  {
    src: "https://static.wixstatic.com/media/bbabb2_29dfb17f56ec450cae2b65efd2dcc67c~mv2.jpg/v1/fill/w_1178,h_662,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/15%20AUGUST%2C%202017.jpg",
    alt: "Independence",
  },
  {
    src: "https://static.wixstatic.com/media/bbabb2_36a542fc09624868875eddafeaab5144~mv2_d_6000_4000_s_4_2.jpg/v1/fill/w_965,h_643,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Annual%20Sports%202015.jpg",
    alt: "School Awards",
  },
  {
    src: "https://static.wixstatic.com/media/bbabb2_473d62aa23674373b5c095634bd194db~mv2_d_3264_1836_s_2.jpg/v1/fill/w_1144,h_643,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/23rd%20January%2C%202017.jpg",
    alt: "School Building",
  },
  {
    src: "https://static.wixstatic.com/media/bbabb2_885b2c25104e443d81d2263cd2c284c8~mv2.jpg/v1/fill/w_720,h_406,al_c,lg_1,q_80,enc_auto/15th%20August%2C%202017.jpg",
    alt: "Students",
  },
  {
    src: "https://static.wixstatic.com/media/bbabb2_30de0bb21a5a4c90b9825381880b5771~mv2_d_4608_3072_s_4_2.jpg/v1/fill/w_994,h_663,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Group%20Photo%20DAY%20Section_JPG.jpg",
    alt: "Teachers",
  },
];

const techStack = [
  {
    name: "Next.js",
    logo: "/assets/icons/nextjs.svg",
    description: "React Framework",
    color: "from-black to-gray-800",
  },
  {
    name: "Tailwind CSS",
    logo: "/assets/icons/tailwindcss.svg",
    description: "CSS Framework",
    color: "from-cyan-400 to-blue-500",
  },
  {
    name: "shadcn/ui",
    logo: "/assets/icons/shadcn.ico",
    description: "UI Components",
    color: "from-blue-500 to-purple-600",
  },
  {
    name: "MongoDB",
    logo: "/assets/icons/mongodb.svg",
    description: "Database",
    color: "from-green-500 to-green-700",
  },
  {
    name: "Express.js",
    logo: "/assets/icons/expressjs.svg",
    description: "Backend Framework",
    color: "from-gray-700 to-gray-900",
  },
  {
    name: "Vercel",
    logo: "/assets/icons/vercel.svg",
    description: "Deployment Platform",
    color: "from-black to-gray-800",
  },
  {
    name: "Socket.io",
    logo: "/assets/icons/socketio.svg",
    description: "Real-time Communication",
    color: "from-gray-600 via-gray-700 via-white to-black",
  },
];

const About = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const plugin = React.useRef(
    Autoplay({
      delay: 4000,
      playOnInit: true,
    })
  );

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="min-h-screen bg-linear-to-br from-[#fffbe6] via-[#f5e9c8] to-[#e6d7b6] px-1 py-8 transition-colors duration-300 sm:px-2 sm:py-16 dark:from-black dark:via-[#101218] dark:to-[#1c1c1c]">
      <div className="mx-auto w-11/12 max-w-6xl rounded-[2.5rem] border border-yellow-100/70 bg-white/80 p-6 shadow-2xl backdrop-blur-2xl sm:w-3/4 sm:p-12 dark:border-yellow-900/40 dark:bg-gray-900/80">
        <div className="flex flex-col items-center">
          {/* Hero Section with Carousel */}
          <div className="mb-8 w-full sm:mb-12">
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                loop: true,
                
              }}
              plugins={[plugin.current]}
              className="relative w-full overflow-hidden rounded-3xl shadow-2xl"
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
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 1200px"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 h-12 w-12 border-2 border-white bg-white/90 shadow-xl transition-all hover:scale-110 hover:bg-white dark:border-gray-700 dark:bg-gray-800/90 dark:hover:bg-gray-800" />
              <CarouselNext className="right-4 h-12 w-12 border-2 border-white bg-white/90 shadow-xl transition-all hover:scale-110 hover:bg-white dark:border-gray-700 dark:bg-gray-800/90 dark:hover:bg-gray-800" />

              {/* Carousel Indicators */}
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
                {Array.from({ length: count }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      index === current
                        ? "w-8 bg-white shadow-lg"
                        : "w-2.5 bg-white/50 hover:bg-white/75"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </Carousel>
          </div>

          {/* Main Title */}
          <h1 className="mb-6 bg-linear-to-tr from-yellow-700 via-yellow-600 to-yellow-400 bg-clip-text text-center text-3xl font-extrabold text-transparent drop-shadow-lg sm:mb-10 sm:text-5xl lg:text-6xl dark:from-yellow-300 dark:via-yellow-200 dark:to-yellow-100">
            About Jalpaiguri Zilla School
          </h1>

          {/* Subtitle */}
          <p className="mb-8 text-center text-lg font-medium text-gray-700 sm:mb-12 sm:text-xl lg:text-2xl dark:text-gray-200">
            <span className="inline-block animate-pulse font-bold text-yellow-700 dark:text-yellow-400">
              🎉 Celebrating 150 Years of Excellence! 🎉
            </span>
            <br />
            Jalpaiguri Zilla School, established on{" "}
            <span className="font-semibold underline decoration-yellow-400/60 underline-offset-4 transition-all duration-300 hover:decoration-yellow-500">
              26th May 1876
            </span>
            , is one of the oldest and most prestigious educational institutions
            in Jalpaiguri, West Bengal. With a rich heritage and a commitment to
            excellence, Jalpaiguri Zilla School has been shaping young minds for
            generations.
          </p>

          {/* Anniversary Highlight */}
          <div className="mb-10 w-full transform cursor-pointer rounded-3xl border-l-8 border-yellow-400/80 bg-linear-to-r from-yellow-50/80 via-white/80 to-yellow-200/80 p-8 shadow-xl transition-transform duration-300 hover:scale-105 sm:mb-14 sm:p-10 dark:border-yellow-600 dark:bg-gray-800/80">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-yellow-600 sm:text-4xl dark:text-yellow-300">
              🏛️ 150th Anniversary Special
            </h2>
            <p className="text-lg font-medium text-gray-700 sm:text-xl dark:text-gray-500">
              In 2026, Jalpaiguri Zilla School proudly marks its{" "}
              <span className="inline-block animate-bounce font-bold text-yellow-700 dark:text-yellow-400">
                150th anniversary
              </span>
              . For a century and a half, we have been dedicated to nurturing
              talent, fostering values, and building a legacy of learning. Join
              us in celebrating this historic milestone!
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid w-full grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-2">
            {/* Mission Section */}
            <div className="space-y-8">
              <div className="transform cursor-pointer rounded-2xl bg-linear-to-br from-blue-50 to-indigo-100 p-6 shadow-lg transition-transform duration-300 hover:scale-105 sm:p-8 dark:from-blue-900/30 dark:to-indigo-900/30">
                <h2 className="mb-4 flex items-center text-2xl font-bold tracking-tight text-gray-800 sm:text-3xl dark:text-blue-300">
                  🎯 Our Mission
                </h2>
                <p className="text-base leading-relaxed font-medium text-gray-700 sm:text-lg dark:text-gray-200">
                  Our mission is to provide quality education that fosters
                  intellectual growth, creativity, and character development. We
                  strive to create a nurturing environment where students are
                  encouraged to achieve their full potential and become
                  responsible citizens.
                </p>
              </div>

              <div className="transform cursor-pointer rounded-2xl bg-linear-to-br from-purple-50 to-pink-100 p-6 shadow-lg transition-transform duration-300 hover:scale-105 sm:p-8 dark:from-purple-900/30 dark:to-pink-900/30">
                <h2 className="mb-4 flex items-center text-2xl font-bold tracking-tight text-gray-800 sm:text-3xl dark:text-purple-300">
                  🌟 Vision
                </h2>
                <p className="text-base leading-relaxed font-medium text-gray-700 sm:text-lg dark:text-gray-200">
                  Jalpaiguri Zilla School envisions empowering students to
                  become lifelong learners and leaders, equipped with knowledge,
                  skills, and values to meet the challenges of a rapidly
                  changing world. We are committed to academic excellence,
                  innovation, and the holistic development of every child.
                </p>
              </div>
            </div>

            {/* History & Facilities Section */}
            <div className="space-y-8">
              <div className="transform cursor-pointer rounded-2xl bg-linear-to-br from-green-50 to-emerald-100 p-6 shadow-lg transition-transform duration-300 hover:scale-105 sm:p-8 dark:from-green-900/30 dark:to-emerald-900/30">
                <h2 className="mb-4 flex items-center text-2xl font-bold tracking-tight text-gray-800 sm:text-3xl dark:text-green-300">
                  📚 History & Values
                </h2>
                <p className="text-base leading-relaxed font-medium text-gray-700 sm:text-lg dark:text-gray-200">
                  Founded over a century ago, Jalpaiguri Zilla School has a
                  proud tradition of academic achievement and holistic
                  development. We value integrity, respect, and a passion for
                  learning. Our dedicated faculty and staff work tirelessly to
                  ensure that every student receives the guidance and support
                  they need to succeed.
                </p>
              </div>

              <div className="transform cursor-pointer rounded-2xl bg-linear-to-br from-orange-50 to-red-100 p-6 shadow-lg transition-transform duration-300 hover:scale-105 sm:p-8 dark:from-orange-900/30 dark:to-red-900/30">
                <h2 className="mb-4 flex items-center text-2xl font-bold tracking-tight text-gray-800 sm:text-3xl dark:text-orange-300">
                  🏢 Facilities
                </h2>
                <p className="text-base leading-relaxed font-medium text-gray-700 sm:text-lg dark:text-gray-200">
                  The school campus features spacious classrooms, well-equipped
                  science and computer laboratories, a library with a rich
                  collection of books, and sports facilities that encourage
                  physical fitness and teamwork. We provide a safe and inclusive
                  environment for all students.
                </p>
              </div>
            </div>
          </div>

          {/* Holistic Development Section */}
          <div className="mt-12 w-full space-y-8 sm:mt-16">
            <div className="transform cursor-pointer rounded-2xl bg-linear-to-br from-teal-50 to-cyan-100 p-8 shadow-lg transition-transform duration-300 hover:scale-105 sm:p-10 dark:from-teal-900/30 dark:to-cyan-900/30">
              <h2 className="mb-4 flex items-center text-2xl font-bold tracking-tight text-gray-800 sm:text-3xl dark:text-teal-300">
                🎨 Holistic Development
              </h2>
              <p className="mb-6 text-base leading-relaxed font-medium text-gray-700 sm:text-lg dark:text-gray-200">
                At Jalpaiguri Zilla School, we believe in nurturing not just
                academic excellence but also creativity, leadership, and social
                responsibility. Our students participate in a wide range of
                co-curricular and extracurricular activities, including sports,
                arts, debates, and community service.
              </p>
            </div>

            {/* Why Choose Us Section */}
            <div className="transform cursor-pointer rounded-2xl bg-linear-to-br from-indigo-50 to-blue-100 p-8 shadow-lg transition-transform duration-300 hover:scale-105 sm:p-10 dark:from-indigo-900/30 dark:to-blue-900/30">
              <h2 className="mb-6 flex items-center text-2xl font-bold tracking-tight text-gray-800 sm:text-3xl dark:text-indigo-300">
                💎 Why Choose Jalpaiguri Zilla School?
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  "Over 150 years of educational excellence",
                  "Experienced and caring teachers",
                  "Focus on both academics and co-curricular activities",
                  "Safe and inclusive learning environment",
                  "Strong alumni network",
                  "Modern facilities and resources",
                  "Commitment to holistic student development",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 rounded-lg bg-white/80 p-3 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md dark:bg-gray-800/80 dark:hover:bg-gray-700/80"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-sm font-bold text-white">
                      ✓
                    </div>
                    <span className="text-sm font-medium text-gray-700 sm:text-base dark:text-gray-200">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tech Stack Section */}
          <div className="mt-12 w-full sm:mt-16">
            <div className="rounded-2xl bg-linear-to-br from-slate-50 to-gray-100 p-8 shadow-lg sm:p-10 dark:from-slate-900/30 dark:to-gray-900/30">
              <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl dark:text-slate-300">
                💻 Tech Stack
              </h2>
              <p className="mb-8 text-center text-lg font-medium text-gray-600 dark:text-gray-300">
                Built with modern technologies for optimal performance and user
                experience
              </p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {techStack.map((tech, index) => (
                  <div
                    key={index}
                    className="group relative transform cursor-pointer overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl dark:bg-gray-800 last:sm:col-span-2 last:lg:col-span-3"
                  >
                    <div
                      className={`absolute inset-0 bg-linear-to-br ${tech.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
                    ></div>
                    <div className="relative z-10 flex flex-col items-center space-y-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 p-3 transition-all duration-300 group-hover:bg-white group-hover:shadow-md dark:bg-gray-700 dark:group-hover:bg-gray-600">
                        <Image
                          src={tech.logo}
                          alt={tech.name}
                          width={40}
                          height={40}
                          loading="lazy"
                          className="object-contain transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            const nextElement = e.currentTarget
                              .nextElementSibling as HTMLElement;
                            if (nextElement) {
                              nextElement.style.display = "flex";
                            }
                          }}
                        />
                        <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-sm font-bold text-gray-600 dark:bg-gray-600 dark:text-gray-300">
                          {tech.name.charAt(0)}
                        </div>
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-gray-800 transition-colors duration-300 group-hover:text-gray-900 dark:text-gray-200 dark:group-hover:text-white">
                          {tech.name}
                        </h3>
                        <p className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300">
                          {tech.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
