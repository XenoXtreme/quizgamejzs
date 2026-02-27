"use client";
import { useState, useEffect, useRef } from "react";
import { Presentation, Maximize2, Minimize2 } from "lucide-react";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import { Button } from "@/components/ui/button";

interface PptxViewerProps {
  src: string;
  filename?: string;
  height?: number | string;
  width?: number | string;
}

export default function PptxViewer({
  src,
  filename,
  height = 600,
  width = "100%",
}: PptxViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
        })
        .catch(() => {});
    } else {
      document
        .exitFullscreen()
        .then(() => {
          setIsFullscreen(false);
        })
        .catch(() => {});
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    console.log(src);
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  if (!src) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <span className="text-sm font-medium text-red-600">
          No PPTX file provided.
        </span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`group mx-auto flex w-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950 ${
        isFullscreen
          ? "fixed top-0 left-0 z-50 h-screen w-screen rounded-none"
          : "max-w-3xl"
      }`}
      style={{
        width: isFullscreen
          ? "100vw"
          : typeof width === "number"
            ? `${width}px`
            : width,
        minHeight: isFullscreen
          ? "100vh"
          : typeof height === "number"
            ? `${height}px`
            : height,
        height: isFullscreen ? "100vh" : undefined,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-neutral-200 bg-neutral-50/50 px-4 py-3 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-linear-to-br from-orange-500 to-red-500">
          <Presentation className="h-4 w-4 text-white" />
        </div>
        <span className="flex-1 truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {filename || src.split("/").pop() || "Presentation.pptx"}
        </span>
        <span className="rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
          PPTX
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Main content */}
      <div className="relative flex w-full flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <div
          className="w-full"
          style={{
            minHeight: isFullscreen
              ? "calc(100vh - 57px)"
              : typeof height === "number"
                ? `${height}px`
                : height,
            height: isFullscreen
              ? "calc(100vh - 57px)"
              : typeof height === "number"
                ? `${height}px`
                : height,
          }}
        >
          <DocViewer
            documents={[{ uri: src, fileType: "pptx" }]}
            config={{
              header: {
                disableHeader: true,
                disableFileName: true,
                retainURLParams: false,
              },
            }}
            pluginRenderers={DocViewerRenderers}
            style={{
              width: "100vw",
              maxWidth: "100%",
              minHeight: isFullscreen
                ? "calc(100vh - 57px)"
                : typeof height === "number"
                  ? `${height}px`
                  : height,
              height: isFullscreen
                ? "calc(100vh - 57px)"
                : typeof height === "number"
                  ? `${height}px`
                  : height,
              borderRadius: "0",
              overflow: "hidden",
              background: "transparent",
            }}
          />
        </div>
      </div>
    </div>
  );
}
