"use client";

import React, { useState } from "react";
import ImageViewer from "./image";
import AudioPlayer from "./audio";
import VideoPlayer from "./video";

interface ComponentProps {
  alt?: string;
  URI?: string;
  type?: string;
  vURI?: string | null;
}

/**
 * Universal Media Component
 * Renders appropriate media player based on type
 * Handles audio/video interlocking to prevent simultaneous playback
 */
export default function Component({ alt, URI, vURI, type }: ComponentProps) {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Pause video if audio starts playing
  const handleAudioPlayStateChange = (isPlaying: boolean) => {
    setIsAudioPlaying(isPlaying);
    if (isPlaying && isVideoPlaying) {
      setIsVideoPlaying(false);
    }
  };

  // Pause audio if video starts playing
  const handleVideoPlayStateChange = (isPlaying: boolean) => {
    setIsVideoPlaying(isPlaying);
    if (isPlaying && isAudioPlaying) {
      setIsAudioPlaying(false);
    }
  };

  // Render appropriate component based on content type
  switch (type) {
    case "img":
      return <ImageViewer src={URI} alt={alt} downloadable={true} />;

    case "video":
      return (
        <VideoPlayer
          src={URI}
          title={alt}
          downloadable={true}
          onPlayStateChange={handleVideoPlayStateChange}
        />
      );

    case "audio":
      return (
        <AudioPlayer
          src={URI}
          title={alt}
          showVisualizer={true}
          onPlayStateChange={handleAudioPlayStateChange}
        />
      );

    case "visualaudio":
      return (
        <div className="flex flex-col gap-4 w-full">
          <ImageViewer src={URI} alt={alt} downloadable={true} />
          {vURI && (
            <AudioPlayer
              src={vURI}
              title={alt}
              showVisualizer={true}
              onPlayStateChange={handleAudioPlayStateChange}
            />
          )}
        </div>
      );

    case "visualvideoans":
      return (
        <div className="flex flex-col gap-4 w-full">
          <ImageViewer src={URI} alt={alt} downloadable={true} />
          {vURI && (
            <VideoPlayer
              src={vURI}
              title={alt}
              downloadable={true}
              onPlayStateChange={handleVideoPlayStateChange}
            />
          )}
        </div>
      );

    default:
      return (
        <div className="w-full rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-950">
          <p className="text-sm font-medium text-red-600 dark:text-red-300">
            ⚠️ Unsupported content type:{" "}
            <code className="font-mono">{type}</code>
          </p>
          <p className="text-xs text-red-500 dark:text-red-400 mt-2">
            Supported types: img, video, audio, visualaudio, visualvideoans
          </p>
        </div>
      );
  }
}
