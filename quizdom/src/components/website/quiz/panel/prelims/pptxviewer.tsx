"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilePowerpoint,
  faCircleExclamation,
  faDownload,
  faSpinner,
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
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!src) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FontAwesomeIcon
          icon={faCircleExclamation}
          className="mb-2 h-10 w-10 text-red-400"
        />
        <span className="font-semibold text-red-600">
          No PPTX file provided.
        </span>
      </div>
    );
  }

  return (
    <div
      className={`
        w-full max-w-3xl mx-auto rounded-2xl shadow-xl border border-gray-200 bg-white
        flex flex-col items-center
        transition-all
      `}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        minHeight: typeof height === "number" ? `${height}px` : height,
      }}
    >
      {/* Header */}
      <div className="w-full flex items-center px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-red-50 rounded-t-2xl">
        <FontAwesomeIcon icon={faFilePowerpoint} className="w-6 h-6 text-orange-500 mr-2" />
        <span className="font-semibold text-gray-700 truncate flex-1">
          {filename || src.split("/").pop() || "Presentation.pptx"}
        </span>
        <span className="text-xs text-gray-400 ml-2">PPTX Viewer</span>
      </div>

      {/* Main content */}
      <div className="flex-1 w-full flex items-center justify-center relative min-h-[250px]">
        <div className="w-full" style={{
          minHeight: typeof height === "number" ? `${height}px` : height,
          height: typeof height === "number" ? `${height}px` : height,
        }}>
          {hasError ? (
            <div className="flex flex-col items-center justify-center w-full py-16">
              <FontAwesomeIcon icon={faCircleExclamation} className="w-12 h-12 text-red-400 mb-2" />
              <div className="text-lg font-semibold text-red-500 mb-2">
                Could not display presentation.
              </div>
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-2 px-4 py-2 bg-orange-600 text-white rounded-lg shadow hover:bg-orange-700 transition"
              >
                <FontAwesomeIcon icon={faDownload} className="mr-2" />
                Download PPTX
              </a>
              <div className="text-xs text-gray-400 mt-4 text-center">
                Make sure the file is accessible and CORS headers are allowed.
              </div>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center w-full h-full py-16">
              <FontAwesomeIcon icon={faSpinner} spin className="h-10 w-10 text-orange-500" />
              <span className="mt-2 text-orange-700">Loading presentation...</span>
            </div>
          ) : (
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
                minHeight: typeof height === "number" ? `${height}px` : height,
                height: typeof height === "number" ? `${height}px` : height,
                borderRadius: "0 0 1rem 1rem",
                overflow: "hidden",
              }}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="w-full rounded-b-2xl border-t border-gray-100 bg-gradient-to-r from-orange-50 to-red-50 px-6 py-2 text-center text-xs text-gray-400">
        Powered by{" "}
        <a
          href="https://www.npmjs.com/package/react-doc-viewer"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-orange-600"
        >
          react-doc-viewer
        </a>
      </div>
    </div>
  );
}
