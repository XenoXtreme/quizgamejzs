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

// Error display component
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

  const lastTouchDistance = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      lastTouchDistance.current = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && lastTouchDistance.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      const delta = dist - lastTouchDistance.current;
      if (Math.abs(delta) > 5) {
        setZoom((prev) => {
          let next = prev + delta * 0.005;
          next = Math.max(0.5, Math.min(3, next));
          return next;
        });
        lastTouchDistance.current = dist;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length < 2) {
      lastTouchDistance.current = null;
    }
  };

  // --- Responsive: Double-tap to zoom/reset on mobile ---
  const lastTap = useRef<number>(0);
  const handleImageTap = (e: React.TouchEvent<HTMLImageElement>) => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      // Double tap: toggle zoom
      setZoom((prev) => (prev === 1 ? 2 : 1));
    }
    lastTap.current = now;
  };

  // --- Responsive: Keyboard shortcuts for accessibility ---
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        document.activeElement &&
        ["INPUT", "TEXTAREA", "BUTTON", "SELECT"].includes(
          document.activeElement.tagName,
        )
      )
        return;
      switch (e.code) {
        case "ArrowLeft":
          rotateLeft();
          break;
        case "ArrowRight":
          rotateRight();
          break;
        case "ArrowUp":
          zoomIn();
          break;
        case "ArrowDown":
          zoomOut();
          break;
        case "KeyR":
          resetZoom();
          break;
        case "KeyF":
          toggleFullscreen();
          break;
        case "KeyD":
          if (downloadable) downloadImage();
          break;
        default:
          break;
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line
  }, [zoom, downloadable]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (!document.fullscreenElement) {
        // Reset zoom and rotation when exiting fullscreen
        setZoom(1);
        setRotation(0);
        // Fix: force image to re-render by updating key
        if (imageRef.current) {
          imageRef.current.style.display = "none";
          setTimeout(() => {
            if (imageRef.current) imageRef.current.style.display = "block";
          }, 10);
        }
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
      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 z-45 flex items-center justify-center bg-white/80 dark:bg-gray-900/80">
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
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Title bar (visible in normal mode and when hovering in fullscreen) */}
          {displayTitle && (!isFullscreen || controlsVisible) && (
            <div
              className={`p-2 sm:p-3 ${isFullscreen ? "absolute top-0 right-0 left-0 z-10 bg-black/70" : "border-b border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"}`}
            >
              <h3
                className={`truncate text-xs font-medium sm:text-base sm:text-lg ${isFullscreen ? "text-white" : "text-gray-800 dark:text-gray-100"}`}
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
                className="xs:max-h-[60vh] max-h-[40vh] w-auto max-w-full cursor-pointer rounded object-contain shadow-md transition-transform duration-200 sm:max-h-[80vh]"
                style={{
                  transform: `rotate(${rotation}deg) scale(${zoom})`,
                  display: isLoading ? "none" : "block",
                  cursor: isFullscreen ? "zoom-out" : "pointer",
                  background:
                    "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
                  touchAction: "none",
                }}
                onLoad={handleImageLoad}
                onError={handleImageError}
                onTouchEnd={handleImageTap}
              />
            )}
          </div>

          {/* Controls overlay (shown in fullscreen or if controls are enabled) */}
          {showControls && (!isFullscreen || controlsVisible) && (
            <div
              className={`flex flex-col flex-wrap items-center justify-between gap-2 p-2 sm:flex-row sm:gap-0 sm:p-3 ${isFullscreen ? "absolute right-0 bottom-0 left-0 bg-black/70 transition-opacity duration-300" : "border-t border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"} ${isFullscreen && !controlsVisible ? "opacity-0" : "opacity-100"} `}
            >
              <div className="flex w-full flex-wrap items-center justify-center gap-2 sm:w-auto">
                {/* Zoom controls */}
                <Button
                  color={isFullscreen ? "dark" : "light"}
                  size="xs"
                  onClick={zoomOut}
                  disabled={zoom <= 0.5}
                  className={`min-h-[36px] min-w-[36px] cursor-pointer ${isFullscreen ? "border-gray-600 bg-transparent text-white hover:bg-gray-800" : ""}`}
                  pill
                  aria-label="Zoom out"
                >
                  <FontAwesomeIcon icon={faSearchMinus} />
                </Button>
                <Button
                  color={isFullscreen ? "dark" : "light"}
                  size="xs"
                  onClick={resetZoom}
                  className={`min-h-[36px] min-w-[36px] cursor-pointer ${isFullscreen ? "border-gray-600 bg-transparent text-white hover:bg-gray-800" : ""}`}
                  pill
                  aria-label="Reset zoom"
                >
                  <FontAwesomeIcon icon={faSearch} />
                </Button>
                <Button
                  color={isFullscreen ? "dark" : "light"}
                  size="xs"
                  onClick={zoomIn}
                  disabled={zoom >= 3}
                  className={`min-h-[36px] min-w-[36px] cursor-pointer ${isFullscreen ? "border-gray-600 bg-transparent text-white hover:bg-gray-800" : ""}`}
                  pill
                  aria-label="Zoom in"
                >
                  <FontAwesomeIcon icon={faSearchPlus} />
                </Button>
              </div>

              <div className="mt-2 flex w-full flex-wrap items-center justify-center gap-2 sm:mt-0 sm:w-auto">
                {/* Rotation controls */}
                <Button
                  color={isFullscreen ? "dark" : "light"}
                  size="xs"
                  onClick={rotateLeft}
                  className={`min-h-[36px] min-w-[36px] cursor-pointer ${isFullscreen ? "border-gray-600 bg-transparent text-white hover:bg-gray-800" : ""}`}
                  pill
                  aria-label="Rotate left"
                >
                  <FontAwesomeIcon icon={faRotateLeft} />
                </Button>
                <Button
                  color={isFullscreen ? "dark" : "light"}
                  size="xs"
                  onClick={rotateRight}
                  className={`min-h-[36px] min-w-[36px] cursor-pointer ${isFullscreen ? "hover:bg_gray-800 border-gray-600 bg-transparent text-white" : ""}`}
                  pill
                  aria-label="Rotate right"
                >
                  <FontAwesomeIcon icon={faRotateRight} />
                </Button>
                {/* Download button */}
                {downloadable && (
                  <Button
                    color={isFullscreen ? "dark" : "light"}
                    size="xs"
                    onClick={downloadImage}
                    className={`min-h-[36px] min-w-[36px] cursor-pointer ${isFullscreen ? "border-gray-600 bg-transparent text-white hover:bg-gray-800" : ""}`}
                    pill
                    aria-label="Download image"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </Button>
                )}
                {/* Fullscreen toggle */}
                <Button
                  color={isFullscreen ? "dark" : "light"}
                  size="xs"
                  onClick={toggleFullscreen}
                  className={`min-h-[36px] min-w-[36px] cursor-pointer ${isFullscreen ? "border-gray-600 bg-transparent text-white hover:bg-gray-800" : ""}`}
                  pill
                  aria-label={
                    isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                  }
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
