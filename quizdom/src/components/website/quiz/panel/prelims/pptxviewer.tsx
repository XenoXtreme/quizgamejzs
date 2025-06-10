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
      className={`mx-auto flex w-full max-w-3xl flex-col items-center rounded-2xl border border-gray-200 bg-white shadow-xl transition-all ${isFullscreen ? "fixed top-0 left-0 z-50 h-screen w-screen max-w-none bg-white" : ""} `}
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
      <div className="relative flex w-full items-center rounded-t-2xl border-b border-gray-100 dark:bg-slate-900 bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4">
        <FontAwesomeIcon
          icon={faFilePowerpoint}
          className="mr-2 h-6 w-6 text-orange-500 cursor-pointer"
        />
        <span className="flex-1 truncate font-semibold text-gray-700">
          {filename || src.split("/").pop() || "Presentation.pptx"}
        </span>
        <span className="ml-2 text-xs text-gray-400">PPTX Viewer</span>
        {/* Fullscreen Button */}
        <button
          type="button"
          aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          className="ml-3 rounded-full p-2 transition-colors hover:bg-orange-100"
          onClick={toggleFullscreen}
        >
          <FontAwesomeIcon
            icon={isFullscreen ? faCompress : faExpand}
            className="text-lg text-orange-600 cursor-pointer"
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
            }}
          />
        </div>
      </div>
    </div>
  );
}
