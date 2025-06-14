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
      className={`mx-auto mb-8 flex w-full max-w-3xl flex-col items-center rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-slate-900/80 shadow-2xl backdrop-blur-lg transition-all
        ${isFullscreen ? "fixed top-0 left-0 z-50 h-screen w-screen max-w-none bg-white/90 dark:bg-slate-900/95" : ""}`}
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
        boxShadow: "0 8px 40px 0 rgba(0,0,0,0.18)",
        border: "1.5px solid rgba(255,255,255,0.18)",
      }}
    >
      {/* Header */}
      <div className="relative flex w-full items-center rounded-t-2xl border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-orange-400/80 via-pink-400/60 to-red-400/80 dark:from-orange-900/80 dark:via-pink-900/60 dark:to-red-900/80 px-6 py-4 shadow-sm">
        <FontAwesomeIcon
          icon={faFilePowerpoint}
          className="mr-2 h-6 w-6 text-orange-600 dark:text-orange-400 drop-shadow"
        />
        <span className="flex-1 truncate font-semibold text-gray-800 dark:text-gray-100 text-lg tracking-wide">
          {filename || src.split("/").pop() || "Presentation.pptx"}
        </span>
        <span className="ml-2 text-xs text-gray-600 dark:text-gray-300 font-medium bg-white/40 dark:bg-slate-800/40 px-2 py-1 rounded">
          PPTX Viewer
        </span>
        {/* Fullscreen Button */}
        <button
          type="button"
          aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          className="ml-3 cursor-pointer rounded-full p-2 transition-all hover:bg-orange-200/70 dark:hover:bg-orange-900/40 focus:outline-none focus:ring-2 focus:ring-orange-400"
          onClick={toggleFullscreen}
        >
          <FontAwesomeIcon
            icon={isFullscreen ? faCompress : faExpand}
            className="text-lg text-orange-600 dark:text-orange-300"
          />
        </button>
      </div>

      {/* Main content */}
      <div className="relative flex min-h-[250px] w-full flex-1 items-center justify-center">
        <div
          className="w-full"
          style={{
            minHeight: isFullscreen
              ? "calc(100vh - 100px)"
              : typeof height === "number"
                ? `${height}px`
                : height,
            height: isFullscreen
              ? "calc(100vh - 100px)"
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
              width: "100%",
              minHeight: isFullscreen
                ? "calc(100vh - 100px)"
                : typeof height === "number"
                  ? `${height}px`
                  : height,
              height: isFullscreen
                ? "calc(100vh - 100px)"
                : typeof height === "number"
                  ? `${height}px`
                  : height,
              borderRadius: isFullscreen ? "0" : "0 0 1rem 1rem",
              overflow: "hidden",
              background: "transparent",
            }}
          />
        </div>
      </div>
    </div>
  );
}
