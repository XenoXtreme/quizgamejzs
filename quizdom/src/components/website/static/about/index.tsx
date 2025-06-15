"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

// Interface for image properties used in the carousel
interface ImageProps {
  src: string;
  alt: string;
}

// Test Data for the carousel
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

// Interface for the Carousel component's props
interface CarouselProps {
  images: ImageProps[];
  autoPlayInterval?: number;
}

// Custom Carousel component
const CustomCarousel: React.FC<CarouselProps> = ({
  images,
  autoPlayInterval = 9000,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  const stopAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startAutoPlay = useCallback(() => {
    stopAutoPlay(); // Clear any existing interval
    intervalRef.current = window.setInterval(() => {
      handleNext();
    }, autoPlayInterval);
  }, [handleNext, autoPlayInterval]);

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [startAutoPlay]);

  useEffect(() => {
    startAutoPlay();
  }, [activeIndex, startAutoPlay]);

  return (
    <div
      className="relative h-[26rem] overflow-hidden rounded-xl bg-gray-200 shadow-lg transition-colors duration-300 dark:bg-gray-800"
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
    >
      {/* Image container with fluid slide transition */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={image.alt}
            className=" h-full w-full flex-shrink-0 object-cover"
            // Preload images for smoother transitions
            loading={index === 0 ? "eager" : "lazy"}
          />
        ))}
      </div>

      {/* Previous Button */}
      <button
        className="absolute top-1/2 left-3 -translate-y-1/2 transform cursor-pointer rounded-full bg-white/70 p-2.5 shadow-md transition-all duration-300 ease-in-out hover:bg-yellow-200 focus:ring-2 focus:ring-yellow-400 focus:outline-none dark:bg-gray-900/70 dark:hover:bg-yellow-900"
        onClick={handlePrev}
        aria-label="Previous Image"
        type="button"
      >
        <FontAwesomeIcon
          icon={faChevronLeft}
          className="h-5 w-5 text-yellow-700"
        />
      </button>

      {/* Next Button */}
      <button
        className="absolute top-1/2 right-3 -translate-y-1/2 transform cursor-pointer rounded-full bg-white/70 p-2.5 shadow-md transition-all duration-300 ease-in-out hover:bg-yellow-200 focus:ring-2 focus:ring-yellow-400 focus:outline-none dark:bg-gray-900/70 dark:hover:bg-yellow-900"
        onClick={handleNext}
        aria-label="Next Image"
        type="button"
      >
        <FontAwesomeIcon
          icon={faChevronRight}
          className="h-5 w-5 text-yellow-700"
        />
      </button>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform space-x-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`cursor-pointer block h-2.5 w-2.5 rounded-full transition-all duration-300 ease-in-out ${
              idx === activeIndex
                ? "scale-125 bg-yellow-500"
                : "bg-yellow-200/80 hover:bg-yellow-400 dark:bg-gray-600/80 dark:hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 px-1 sm:px-2 py-6 sm:py-12 transition-colors duration-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="mx-auto max-w-3xl rounded-3xl border border-yellow-100 bg-white/90 p-4 sm:p-8 shadow-xl backdrop-blur-lg dark:border-gray-800 dark:bg-gray-900/90">
        <div className="flex flex-col items-center">
          <div className="mb-4 sm:mb-8 w-full">
            {/* Custom Carousel */}
            <CustomCarousel images={images} />
          </div>
          <h1 className="mb-4 sm:mb-6 text-center text-2xl sm:text-4xl font-extrabold text-gray-800 drop-shadow dark:text-yellow-300">
            About Jalpaiguri Zilla School
          </h1>
          <p className="mb-4 sm:mb-6 text-center text-base sm:text-lg text-gray-700 dark:text-gray-200">
            <span className="font-semibold text-yellow-700 dark:text-yellow-400">
              Celebrating 150 Years of Excellence!
            </span>
            <br />
            Jalpaiguri Zilla School, established on{" "}
            <span className="font-semibold">26th May 1876</span>, is one of the
            oldest and most prestigious educational institutions in Jalpaiguri, West Bengal.
            With a rich heritage and a commitment to excellence, Jalpaiguri
            Zilla School has been shaping young minds for generations.
          </p>
          <div className="mb-4 sm:mb-8 w-full rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-4 sm:p-6 shadow dark:border-yellow-600 dark:bg-gray-800">
            <h2 className="mb-1 sm:mb-2 text-xl sm:text-2xl font-bold text-yellow-800 dark:text-yellow-400">
              150th Anniversary Special
            </h2>
            <p className="text-gray-700 dark:text-gray-200 text-sm sm:text-base">
              In 2026, Jalpaiguri Zilla School proudly marks its{" "}
              <span className="font-semibold">150th anniversary</span>. For a
              century and a half, we have been dedicated to nurturing talent,
              fostering values, and building a legacy of learning. Join us in
              celebrating this historic milestone!
            </p>
          </div>
          <div className="grid w-full grid-cols-1 gap-4 sm:gap-8 md:grid-cols-2">
            <div>
              <h2 className="mt-4 mb-1 sm:mb-2 text-xl sm:text-2xl font-bold text-gray-800 dark:text-yellow-300">
                Our Mission
              </h2>
              <p className="mb-4 sm:mb-6 text-gray-700 dark:text-gray-200 text-sm sm:text-base">
                Our mission is to provide quality education that fosters
                intellectual growth, creativity, and character development. We
                strive to create a nurturing environment where students are
                encouraged to achieve their full potential and become
                responsible citizens.
              </p>
              <h2 className="mt-4 mb-1 sm:mb-2 text-xl sm:text-2xl font-bold text-gray-800 dark:text-yellow-300">
                Vision
              </h2>
              <p className="mb-4 sm:mb-6 text-gray-700 dark:text-gray-200 text-sm sm:text-base">
                Jalpaiguri Zilla School envisions empowering students to become
                lifelong learners and leaders, equipped with knowledge, skills,
                and values to meet the challenges of a rapidly changing world.
                We are committed to academic excellence, innovation, and the
                holistic development of every child.
              </p>
            </div>
            <div>
              <h2 className="mt-4 mb-1 sm:mb-2 text-xl sm:text-2xl font-bold text-gray-800 dark:text-yellow-300">
                History & Values
              </h2>
              <p className="mb-4 sm:mb-6 text-gray-700 dark:text-gray-200 text-sm sm:text-base">
                Founded over a century ago, Jalpaiguri Zilla School has a proud
                tradition of academic achievement and holistic development. We
                value integrity, respect, and a passion for learning. Our
                dedicated faculty and staff work tirelessly to ensure that every
                student receives the guidance and support they need to succeed.
              </p>
              <h2 className="mt-4 mb-1 sm:mb-2 text-xl sm:text-2xl font-bold text-gray-800 dark:text-yellow-300">
                Facilities
              </h2>
              <p className="mb-4 sm:mb-6 text-gray-700 dark:text-gray-200 text-sm sm:text-base">
                The school campus features spacious classrooms, well-equipped
                science and computer laboratories, a library with a rich
                collection of books, and sports facilities that encourage
                physical fitness and teamwork. We provide a safe and inclusive
                environment for all students.
              </p>
            </div>
          </div>
          <div className="mt-4 sm:mt-8 w-full">
            <h2 className="mb-1 sm:mb-2 text-xl sm:text-2xl font-bold text-gray-800 dark:text-yellow-300">
              Holistic Development
            </h2>
            <p className="mb-4 sm:mb-6 text-gray-700 dark:text-gray-200 text-sm sm:text-base">
              At Jalpaiguri Zilla School, we believe in nurturing not just
              academic excellence but also creativity, leadership, and social
              responsibility. Our students participate in a wide range of
              co-curricular and extracurricular activities, including sports,
              arts, debates, and community service.
            </p>
            <h2 className="mb-1 sm:mb-2 text-xl sm:text-2xl font-bold text-gray-800 dark:text-yellow-300">
              Why Choose Jalpaiguri Zilla School?
            </h2>
            <ul className="mb-6 sm:mb-8 list-inside list-disc space-y-1 text-gray-700 dark:text-gray-200 text-sm sm:text-base">
              <li>Over 150 years of educational excellence</li>
              <li>Experienced and caring teachers</li>
              <li>Focus on both academics and co-curricular activities</li>
              <li>Safe and inclusive learning environment</li>
              <li>Strong alumni network</li>
              <li>Modern facilities and resources</li>
              <li>Commitment to holistic student development</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
