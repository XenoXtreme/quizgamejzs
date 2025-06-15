import React, { useState } from "react";
import EnhancedImageViewer from "./image";
import EnhancedAudioPlayer from "./audio";
import EnhancedVideoPlayer from "./video";

interface ComponentProps {
  alt?: string;
  URI?: string;
  type?: string;
  vURI?: string | null;
}

export default function Component({ alt, URI, vURI, type }: ComponentProps) {
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);

  // Handle media play state changes
  const handleAudioPlayStateChange = (isPlaying: boolean) => {
    setIsAudioPlaying(isPlaying);

    // Pause video if it's playing when audio starts
    if (isPlaying && isVideoPlaying) {
      setIsVideoPlaying(false);
    }
  };

  const handleVideoPlayStateChange = (isPlaying: boolean) => {
    setIsVideoPlaying(isPlaying);

    // Pause audio if it's playing when video starts
    if (isPlaying && isAudioPlaying) {
      setIsAudioPlaying(false);
    }
  };

  const renderContent = () => {
    switch (type) {
      case "img":
        return (
          <EnhancedImageViewer
            src={URI}
            alt={alt}
            title={alt}
            className="mx-auto w-full max-w-full px-1 sm:max-w-4xl sm:px-0"
            downloadable={true}
            showControls={true}
          />
        );
      case "video":
        return (
          <div className="mx-auto w-full max-w-full px-1 sm:max-w-4xl sm:px-0">
            <EnhancedVideoPlayer
              src={URI}
              title={alt || "Video"}
              onPlayStateChange={handleVideoPlayStateChange}
            />
          </div>
        );
      case "audio":
        return (
          <div className="flex h-full w-full flex-col items-center justify-center py-4">
            <EnhancedAudioPlayer
              src={URI}
              title={alt || "Audio Track"}
              showVisualizer={true}
              onPlayStateChange={handleAudioPlayStateChange}
              className="w-full max-w-lg"
            />
          </div>
        );
      case "visualaudio":
        return (
          <div className="flex w-full flex-col items-center justify-center gap-4 sm:gap-8">
            <EnhancedImageViewer
              src={URI}
              alt={alt}
              title={alt}
              className="mx-auto w-full max-w-full px-1 sm:max-w-4xl sm:px-0"
              downloadable={true}
              showControls={true}
            />
            {vURI && (
              <div className="w-full max-w-xl">
                <EnhancedAudioPlayer
                  src={vURI}
                  title={`Audio for ${alt || "Visual Question"}`}
                  showVisualizer={true}
                  onPlayStateChange={handleAudioPlayStateChange}
                  className="w-full"
                />
              </div>
            )}
          </div>
        );
      case "visualvideoans":
        return (
          <div className="flex w-full flex-col items-center justify-center gap-4 sm:gap-8">
            <EnhancedImageViewer
              src={URI}
              alt={alt}
              title={alt}
              className="mx-auto w-full max-w-full px-1 sm:max-w-4xl sm:px-0"
              downloadable={true}
              showControls={true}
            />
            {vURI && (
              <div className="mx-auto mt-4 w-full max-w-full sm:mt-6 sm:max-w-4xl">
                <EnhancedVideoPlayer
                  src={vURI}
                  title={`Video for ${alt || "Visual Question"}`}
                  onPlayStateChange={handleVideoPlayStateChange}
                />
              </div>
            )}
          </div>
        );
      default:
        return <div className="text-red-500">Unsupported content type</div>;
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      {renderContent()}
    </div>
  );
}
