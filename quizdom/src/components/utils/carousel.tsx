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

// Interface for the Carousel component's props
interface CarouselProps {
  images: ImageProps[];
  autoPlayInterval?: number;
}
const CustomCarousel: React.FC<CarouselProps> = ({
  images,
  autoPlayInterval = 5000,
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
      className="relative h-[28rem] overflow-hidden rounded-3xl border border-yellow-100/60 bg-gradient-to-br from-[#fffbe6] via-[#f5e9c8] to-[#e6d7b6] shadow-2xl transition-colors duration-300 dark:border-yellow-900/40 dark:from-[#232323] dark:via-[#2d2d2d] dark:to-[#3a2d1a]"
      style={{
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
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
            className="h-full w-full flex-shrink-0 object-cover"
            loading={index === 0 ? "eager" : "lazy"}
            style={{
              boxShadow:
                "0 8px 32px 0 rgba(31, 38, 135, 0.15), 0 1.5px 6px 0 rgba(255, 215, 0, 0.08)",
              borderRadius: "1.5rem",
              border: "1.5px solid rgba(255, 215, 0, 0.09)",
            }}
          />
        ))}
      </div>

      {/* Previous Button */}
      <button
        className="absolute top-1/2 left-5 -translate-y-1/2 transform cursor-pointer rounded-full border border-yellow-200/60 bg-white/60 p-3 shadow-xl transition-all duration-300 ease-in-out hover:scale-110 hover:bg-yellow-100/80 focus:ring-2 focus:ring-yellow-400 focus:outline-none dark:border-yellow-900/40 dark:bg-gray-900/70 dark:hover:bg-yellow-900/80"
        style={{
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
        onClick={handlePrev}
        aria-label="Previous Image"
        type="button"
      >
        <FontAwesomeIcon
          icon={faChevronLeft}
          className="h-6 w-6 text-yellow-700 drop-shadow"
        />
      </button>

      {/* Next Button */}
      <button
        className="absolute top-1/2 right-5 -translate-y-1/2 transform cursor-pointer rounded-full border border-yellow-200/60 bg-white/60 p-3 shadow-xl transition-all duration-300 ease-in-out hover:scale-110 hover:bg-yellow-100/80 focus:ring-2 focus:ring-yellow-400 focus:outline-none dark:border-yellow-900/40 dark:bg-gray-900/70 dark:hover:bg-yellow-900/80"
        style={{
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
        onClick={handleNext}
        aria-label="Next Image"
        type="button"
      >
        <FontAwesomeIcon
          icon={faChevronRight}
          className="h-6 w-6 text-yellow-700 drop-shadow"
        />
      </button>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 transform space-x-3">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`block h-3.5 w-3.5 cursor-pointer rounded-full border-2 shadow transition-all duration-300 ease-in-out ${
              idx === activeIndex
                ? "scale-125 border-yellow-600 bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-200 shadow-lg"
                : "border-yellow-200 bg-yellow-100/80 hover:bg-yellow-300 dark:border-gray-500 dark:bg-gray-700/80"
            }`}
            style={{
              boxShadow:
                idx === activeIndex
                  ? "0 2px 8px 0 rgba(255, 215, 0, 0.25)"
                  : undefined,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CustomCarousel;
export { CustomCarousel, type ImageProps };
