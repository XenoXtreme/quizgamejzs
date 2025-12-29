"use client";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilePowerpoint,
  faExpand,
  faCompress,
} from "@fortawesome/free-solid-svg-icons";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

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
        <span className="font-semibold text-red-600">
          No PPTX file provided.
        </span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`mx-auto mb-8 flex w-full max-w-3xl flex-col items-center rounded-3xl border border-gray-200 bg-gradient-to-br from-white/80 via-orange-50/80 to-pink-50/80 shadow-2xl backdrop-blur-2xl transition-all dark:border-gray-700 dark:from-slate-900/80 dark:via-slate-800/80 dark:to-orange-900/80 ${isFullscreen ? "fixed top-0 left-0 z-50 h-screen w-screen max-w-none bg-white/90 dark:bg-slate-900/95" : ""} max-w-full sm:max-w-3xl`}
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
        boxShadow: "0 12px 48px 0 rgba(255, 140, 0, 0.13), 0 8px 40px 0 rgba(0,0,0,0.18)",
        border: "1.5px solid rgba(255,255,255,0.18)",
      }}
    >
      {/* Header */}
      <div className="relative flex w-full items-center rounded-t-3xl border-b border-gray-100 bg-gradient-to-r from-orange-400/80 via-pink-400/60 to-red-400/80 px-4 py-4 shadow-md sm:px-8 dark:border-gray-700 dark:from-orange-900/80 dark:via-pink-900/60 dark:to-red-900/80">
        <FontAwesomeIcon
          icon={faFilePowerpoint}
          className="mr-3 h-6 w-6 text-orange-600 drop-shadow-lg sm:h-7 sm:w-7 dark:text-orange-400"
        />
        <span className="flex-1 truncate text-lg font-bold tracking-wide text-gray-800 sm:text-xl dark:text-gray-100">
          {filename || src.split("/").pop() || "Presentation.pptx"}
        </span>
        <span className="ml-2 rounded bg-white/40 px-3 py-1 text-xs font-semibold text-gray-600 sm:text-sm dark:bg-slate-800/40 dark:text-gray-300">
          PPTX Viewer
        </span>
        {/* Fullscreen Button */}
        <button
          type="button"
          aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          className="ml-3 cursor-pointer rounded-full p-2 transition-all hover:bg-orange-200/70 focus:ring-2 focus:ring-orange-400 focus:outline-none dark:hover:bg-orange-900/40"
          onClick={toggleFullscreen}
        >
          <FontAwesomeIcon
            icon={isFullscreen ? faCompress : faExpand}
            className="text-lg text-orange-600 dark:text-orange-300"
          />
        </button>
      </div>

      {/* Main content */}
      <div className="relative flex min-h-[180px] w-full flex-1 items-center justify-center sm:min-h-[250px]">
        <div
          className="w-full"
          style={{
            minHeight: isFullscreen
              ? "calc(100vh - 70px)"
              : typeof height === "number"
                ? `${height}px`
                : height,
            height: isFullscreen
              ? "calc(100vh - 70px)"
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
            pluginRenderers={
              // @ts-ignore
              DocViewerRenderers
            }
            style={{
              width: "100vw",
              maxWidth: "100%",
              minHeight: isFullscreen
                ? "calc(100vh - 70px)"
                : typeof height === "number"
                  ? `${height}px`
                  : height,
              height: isFullscreen
                ? "calc(100vh - 70px)"
                : typeof height === "number"
                  ? `${height}px`
                  : height,
              borderRadius: isFullscreen ? "0" : "0 0 1.5rem 1.5rem",
              overflow: "hidden",
              background: "transparent",
            }}
          />
        </div>
      </div>
    </div>
  );
}
