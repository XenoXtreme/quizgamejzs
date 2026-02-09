"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2, AlertCircle } from "lucide-react";
import {
  Maximize,
  Minimize,
  Download,
  RotateCw,
  RotateCcw,
  ZoomOut,
  ZoomIn,
} from "lucide-react";

// Minimalist error display
function ImageError({ message }: { message: string }) {
  return (
    <Card className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
      <div className="p-8 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5" strokeWidth={1.5} />
          <h2 className="font-medium text-sm">Failed to load image</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          {message}
        </p>
      </div>
    </Card>
  );
}

interface ImageViewerProps {
  src?: string;
  alt?: string;
  title?: string;
  className?: string;
  downloadable?: boolean;
  showControls?: boolean;
}

export default function ImageViewer({
  src,
  alt = "Image",
  title,
  className = "",
  downloadable = true,
  showControls = true,
}: ImageViewerProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout | null>(null);

  const displayTitle = title || alt;

  const handleImageLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setError("Failed to load image.");
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error enabling fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const downloadImage = () => {
    if (!src) return;

    const link = document.createElement("a");
    link.href = src;
    link.download = alt || "image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const rotateLeft = () => {
    setRotation((prev) => (prev - 90) % 360);
  };

  const rotateRight = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const zoomIn = () => {
    if (zoom < 3) {
      setZoom((prev) => Math.min(prev + 0.25, 3));
    }
  };

  const zoomOut = () => {
    if (zoom > 0.5) {
      setZoom((prev) => Math.max(prev - 0.25, 0.5));
    }
  };

  const resetZoom = () => {
    setZoom(1);
    setRotation(0);
  };

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

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      lastTouchDistance.current = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
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

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      lastTouchDistance.current = null;
    }
  };

  const lastTap = useRef(0);
  const handleImageTap = (e: React.TouchEvent) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastTap.current < 300) {
      setZoom((prev) => (prev === 1 ? 2 : 1));
    }
    lastTap.current = now;
  };

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
  }, [zoom, downloadable]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (!document.fullscreenElement) {
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

  useEffect(() => {
    if (!controlsVisible) return;
    if (hoverTimer) clearTimeout(hoverTimer);
    const timer = setTimeout(() => setControlsVisible(false), 3000);
    setHoverTimer(timer);
    return () => clearTimeout(timer);
  }, [controlsVisible]);

  useEffect(() => {
    if (src) {
      setIsLoading(true);
      setError(null);
      setZoom(1);
      setRotation(0);
    }
  }, [src]);

  if (error) {
    return <ImageError message={error} />;
  }

  return (
    <TooltipProvider>
      <Card
        ref={containerRef}
        className={`w-full overflow-hidden bg-white dark:bg-black border border-gray-200 dark:border-gray-800 ${className}`}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Minimal title bar */}
        {displayTitle && (!isFullscreen || controlsVisible) && (
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 transition-opacity duration-200">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {displayTitle}
            </h3>
          </div>
        )}

        {/* Image container */}
        <div
          className="relative w-full bg-gray-50 dark:bg-gray-950 flex items-center justify-center overflow-hidden"
          style={{
            height: isFullscreen ? "100vh" : "70vh",
            maxHeight: isFullscreen ? "100vh" : "70vh",
          }}
        >
          {/* Minimal loading state */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-black/80 z-10 transition-opacity duration-200">
              <Loader2
                className="w-5 h-5 animate-spin text-gray-400"
                strokeWidth={1.5}
              />
            </div>
          )}

          {/* Image */}
          {src && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={imageRef}
              src={src}
              alt={alt}
              onLoad={handleImageLoad}
              onError={handleImageError}
              onTouchStart={handleImageTap}
              className="max-w-full max-h-full object-contain cursor-move transition-transform duration-200 ease-out"
              style={{
                transform: `rotate(${rotation}deg) scale(${zoom})`,
              }}
            />
          )}
        </div>

        {/* Minimal controls */}
        {showControls && (!isFullscreen || controlsVisible) && (
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 transition-opacity duration-200">
            <div className="flex items-center justify-between gap-3">
              {/* Zoom controls */}
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={zoomOut}
                      disabled={zoom <= 0.5}
                      className="h-8 w-8 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 disabled:opacity-30 transition-colors"
                    >
                      <ZoomOut className="w-4 h-4" strokeWidth={1.5} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    Zoom Out
                  </TooltipContent>
                </Tooltip>

                <div className="px-2 min-w-12 text-center">
                  <span className="text-xs font-mono text-gray-600 dark:text-gray-400">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={zoomIn}
                      disabled={zoom >= 3}
                      className="h-8 w-8 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 disabled:opacity-30 transition-colors"
                    >
                      <ZoomIn className="w-4 h-4" strokeWidth={1.5} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    Zoom In
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Rotation controls */}
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={rotateLeft}
                      className="h-8 w-8 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    Rotate Left
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={rotateRight}
                      className="h-8 w-8 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                    >
                      <RotateCw className="w-4 h-4" strokeWidth={1.5} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    Rotate Right
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Action controls */}
              <div className="flex items-center gap-1">
                {downloadable && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={downloadImage}
                        className="h-8 w-8 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                      >
                        <Download className="w-4 h-4" strokeWidth={1.5} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      Download
                    </TooltipContent>
                  </Tooltip>
                )}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={toggleFullscreen}
                      className="h-8 w-8 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                    >
                      {isFullscreen ? (
                        <Minimize className="w-4 h-4" strokeWidth={1.5} />
                      ) : (
                        <Maximize className="w-4 h-4" strokeWidth={1.5} />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        )}
      </Card>
    </TooltipProvider>
  );
}
