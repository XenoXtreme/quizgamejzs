"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button, Card, Spinner } from "flowbite-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExpand,
  faCompress,
  faDownload,
  faRotateRight,
  faRotateLeft,
  faSearch,
  faSearchMinus,
  faSearchPlus,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

// Error display component (styled like audio error)
function ImageError({ message }: { message: string }) {
  return (
    <div className="flex w-full flex-col items-center justify-center px-4 py-8">
      <div className="flex w-full max-w-md flex-col items-center rounded-xl border border-red-300 bg-red-50 p-6 shadow-lg dark:border-red-700 dark:bg-red-900">
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className="mb-4 animate-bounce text-5xl text-red-500"
          aria-hidden="true"
        />
        <h2 className="mb-2 text-lg font-semibold text-red-700 dark:text-red-300">
          Image Error
        </h2>
        <p className="mb-4 text-center text-sm text-red-600 dark:text-red-200">
          {message}
        </p>
        <div className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
          Please check your internet connection or try a different image file.
        </div>
      </div>
    </div>
  );
}

interface EnhancedImageViewerProps {
  src?: string;
  alt?: string;
  title?: string;
  className?: string;
  downloadable?: boolean;
  showControls?: boolean;
}

export default function EnhancedImageViewer({
  src,
  alt = "Image",
  title,
  className = "",
  downloadable = true,
  showControls = true,
}: EnhancedImageViewerProps) {
  // Refs
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // State
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [controlsVisible, setControlsVisible] = useState<boolean>(true);
  const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout | null>(null);

  // Display title - use provided title or fallback to alt text
  const displayTitle = title || alt;

  // Handle image load success
  const handleImageLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  // Handle image load error
  const handleImageError = () => {
    setIsLoading(false);
    setError("Failed to load image.");
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        // toast.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Download image
  const downloadImage = () => {
    if (!src) return;

    const link = document.createElement("a");
    link.href = src;
    link.download = alt || "image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // toast.success("Download started");
  };

  // Rotate image left
  const rotateLeft = () => {
    setRotation((prev) => (prev - 90) % 360);
  };

  // Rotate image right
  const rotateRight = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Zoom in
  const zoomIn = () => {
    if (zoom < 3) {
      setZoom((prev) => Math.min(prev + 0.25, 3));
    }
  };

  // Zoom out
  const zoomOut = () => {
    if (zoom > 0.5) {
      setZoom((prev) => Math.max(prev - 0.25, 0.5));
    }
  };

  // Reset zoom
  const resetZoom = () => {
    setZoom(1);
    setRotation(0);
  };

  // Handle mouse move to show controls
  const handleMouseMove = () => {
    setControlsVisible(true);

    if (hoverTimer) {
      clearTimeout(hoverTimer);
    }

    if (isFullscreen) {
      const timer = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
      setHoverTimer(timer);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (!document.fullscreenElement) {
        // Reset zoom and rotation when exiting fullscreen
        setZoom(1);
        setRotation(0);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      if (hoverTimer) {
        clearTimeout(hoverTimer);
      }
    };
  }, [hoverTimer]);

  // Handle source changes
  useEffect(() => {
    if (src) {
      setIsLoading(true);
      setError(null);
      setZoom(1);
      setRotation(0);
    }
  }, [src]);

  return (
    <Card
      className={`w-full overflow-hidden border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900 ${className}`}
    >
      {/* Loading spinner (always show while loading, even if error) */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80">
          <Spinner size="xl" color="info" />
        </div>
      )}
      {/* Error display */}
      {error ? (
        <div className="flex w-full flex-col items-center justify-center py-8">
          <ImageError message={error} />
        </div>
      ) : (
        <div
          ref={containerRef}
          className={`relative flex h-full w-full flex-col ${isFullscreen ? "bg-black" : "bg-white dark:bg-gray-900"}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isFullscreen && setControlsVisible(false)}
        >
          {/* Title bar (visible in normal mode and when hovering in fullscreen) */}
          {displayTitle && (!isFullscreen || controlsVisible) && (
            <div
              className={`p-2 sm:p-3 ${isFullscreen ? "absolute top-0 right-0 left-0 z-10 bg-black/70" : "border-b border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"}`}
            >
              <h3
                className={`truncate text-base font-medium sm:text-lg ${isFullscreen ? "text-white" : "text-gray-800 dark:text-gray-100"}`}
              >
                {displayTitle}
              </h3>
            </div>
          )}

          {/* Image container */}
          <div
            className={`relative flex flex-1 items-center justify-center overflow-hidden ${
              isFullscreen ? "h-screen w-screen" : "h-full w-full"
            }`}
            onClick={isFullscreen ? toggleFullscreen : undefined}
          >
            {/* Image */}
            {src && (
              <img
                ref={imageRef}
                src={src}
                alt={alt}
                className="max-h-[60vh] max-w-full rounded object-contain shadow-md transition-transform duration-200 sm:max-h-[80vh]"
                style={{
                  transform: `rotate(${rotation}deg) scale(${zoom})`,
                  display: isLoading ? "none" : "block",
                  cursor: isFullscreen ? "zoom-out" : "default",
                  background:
                    "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
                }}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            )}
            {/* Spinner removed from here */}
          </div>

          {/* Controls overlay (shown in fullscreen or if controls are enabled) */}
          {showControls && (!isFullscreen || controlsVisible) && (
            <div
              className={`flex flex-wrap items-center justify-between p-2 sm:p-3 ${isFullscreen ? "absolute right-0 bottom-0 left-0 bg-black/70 transition-opacity duration-300" : "border-t border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"} ${isFullscreen && !controlsVisible ? "opacity-0" : "opacity-100"} `}
            >
              <div className="flex items-center space-x-1 sm:space-x-2">
                {/* Zoom controls */}
                <Button
                  color={isFullscreen ? "dark" : "light"}
                  size="xs"
                  onClick={zoomOut}
                  disabled={zoom <= 0.5}
                  className={
                    isFullscreen
                      ? "cursor-pointer border-gray-600 bg-transparent text-white hover:bg-gray-800"
                      : "cursor-pointer"
                  }
                  pill
                >
                  <FontAwesomeIcon icon={faSearchMinus} />
                </Button>

                <Button
                  color={isFullscreen ? "dark" : "light"}
                  size="xs"
                  onClick={resetZoom}
                  className={
                    isFullscreen
                      ? "cursor-pointer border-gray-600 bg-transparent text-white hover:bg-gray-800"
                      : "cursor-pointer"
                  }
                  pill
                >
                  <FontAwesomeIcon icon={faSearch} />
                </Button>

                <Button
                  color={isFullscreen ? "dark" : "light"}
                  size="xs"
                  onClick={zoomIn}
                  disabled={zoom >= 3}
                  className={
                    isFullscreen
                      ? "cursor-pointer border-gray-600 bg-transparent text-white hover:bg-gray-800"
                      : "cursor-pointer"
                  }
                  pill
                >
                  <FontAwesomeIcon icon={faSearchPlus} />
                </Button>
              </div>

              <div className="mt-2 flex items-center space-x-1 sm:mt-0 sm:space-x-2">
                {/* Rotation controls */}
                <Button
                  color={isFullscreen ? "dark" : "light"}
                  size="xs"
                  onClick={rotateLeft}
                  className={
                    isFullscreen
                      ? "cursor-pointer border-gray-600 bg-transparent text-white hover:bg-gray-800"
                      : "cursor-pointer"
                  }
                  pill
                >
                  <FontAwesomeIcon icon={faRotateLeft} />
                </Button>

                <Button
                  color={isFullscreen ? "dark" : "light"}
                  size="xs"
                  onClick={rotateRight}
                  className={
                    isFullscreen
                      ? "cursor-pointer border-gray-600 bg-transparent text-white hover:bg-gray-800"
                      : "cursor-pointer"
                  }
                  pill
                >
                  <FontAwesomeIcon icon={faRotateRight} />
                </Button>

                {/* Download button */}
                {downloadable && (
                  <Button
                    color={isFullscreen ? "dark" : "light"}
                    size="xs"
                    onClick={downloadImage}
                    className={
                      isFullscreen
                        ? "cursor-pointer border-gray-600 bg-transparent text-white hover:bg-gray-800"
                        : "cursor-pointer"
                    }
                    pill
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </Button>
                )}

                {/* Fullscreen toggle */}
                <Button
                  color={isFullscreen ? "dark" : "light"}
                  size="xs"
                  onClick={toggleFullscreen}
                  className={
                    isFullscreen
                      ? "cursor-pointer border-gray-600 bg-transparent text-white hover:bg-gray-800"
                      : "cursor-pointer"
                  }
                  pill
                >
                  <FontAwesomeIcon
                    icon={isFullscreen ? faCompress : faExpand}
                  />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
