"use client";
import React, { useRef, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertCircle, Loader2 } from "lucide-react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  FastForward,
  Rewind,
  Maximize,
  Minimize,
  Download,
  Gauge,
} from "lucide-react";
import { toast } from "sonner";

interface VideoPlayerProps {
  src?: string;
  title?: string;
  poster?: string;
  onPlayStateChange?: (isPlaying: boolean) => void;
  className?: string;
  downloadable?: boolean;
}

// Error display component
function VideoError({ message }: { message: string }) {
  return (
    <Card className="w-full bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800">
      <CardContent className="p-6 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-red-700 dark:text-red-200">
          <AlertCircle className="w-6 h-6" />
          <h3 className="font-semibold">Video Error</h3>
        </div>
        <p className="text-sm text-red-600 dark:text-red-300">{message}</p>
        <p className="text-xs text-red-500 dark:text-red-400">
          Please check your internet connection or try a different video file.
        </p>
      </CardContent>
    </Card>
  );
}

const PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const CONTROLS_HIDE_DELAY = 3000; // 3 seconds like YouTube

export default function VideoPlayer({
  src,
  title = "Video",
  poster,
  onPlayStateChange,
  className = "",
  downloadable = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const speedMenuRef = useRef<HTMLDivElement>(null);

  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [seekIndicator, setSeekIndicator] = useState<{
    dir: "forward" | "backward";
    key: number;
  } | null>(null);
  const [, setIsMobile] = useState(false);

  const seekIndicatorKey = useRef(0);
  const lastTap = useRef(0);
  const lastTouchDistance = useRef<number | null>(null);

  // Format time in MM:SS format
  const formatTime = (timeInSeconds: number): string => {
    if (isNaN(timeInSeconds)) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Detect mobile
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 640);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close speed menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        speedMenuRef.current &&
        !speedMenuRef.current.contains(e.target as Node)
      ) {
        setShowSpeedMenu(false);
      }
    }
    if (showSpeedMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSpeedMenu]);

  const changeVolume = React.useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
      if (videoRef.current.muted && newVolume > 0) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  }, []);

  const showSeekIndicator = React.useCallback((dir: "forward" | "backward") => {
    seekIndicatorKey.current += 1;
    setSeekIndicator({ dir, key: seekIndicatorKey.current });
    setTimeout(() => {
      setSeekIndicator(null);
    }, 800);
  }, []);

  // Toggle play/pause
  const togglePlayPause = React.useCallback(() => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play().catch((error) => {
        toast.error("Failed to play video. Please try again.");
        console.error("Video playback error:", error);
      });
    } else {
      videoRef.current.pause();
    }
  }, []);

  // Skip forward 10 seconds
  const skipForward = React.useCallback(() => {
    if (!videoRef.current || videoRef.current.readyState < 2) return;
    const newTime = Math.min(
      videoRef.current.currentTime + 10,
      videoRef.current.duration || 0,
    );
    videoRef.current.currentTime = newTime;
  }, []);

  // Skip backward 10 seconds
  const skipBackward = React.useCallback(() => {
    if (!videoRef.current || videoRef.current.readyState < 2) return;
    const newTime = Math.max(videoRef.current.currentTime - 10, 0);
    videoRef.current.currentTime = newTime;
  }, []);

  // Reset to beginning
  const resetVideo = React.useCallback(() => {
    if (!videoRef.current || videoRef.current.readyState < 2) return;
    videoRef.current.currentTime = 0;
  }, []);

  // Toggle mute
  const toggleMute = React.useCallback(() => {
    if (!videoRef.current) return;
    const newMuted = !videoRef.current.muted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  }, []);

  // Handle seeking
  const handleSeek = React.useCallback((value: number[]) => {
    const seekTime = value[0];
    if (videoRef.current && videoRef.current.readyState >= 2) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  }, []);

  // Toggle fullscreen
  const toggleFullscreen = React.useCallback(() => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        toast.error(`Error: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  // Download video
  const downloadVideo = React.useCallback(() => {
    if (!src) return;

    const link = document.createElement("a");
    link.href = src;
    link.download = title || "video";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [src, title]);

  // Change playback rate
  const changePlaybackRate = React.useCallback((rate: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
  }, []);

  const handleVideoTouch = React.useCallback(
    (e: React.TouchEvent) => {
      if (!videoRef.current) return;
      setShowControls(true);

      const touch = e.touches[0];
      if (!touch) return;

      const rect = videoRef.current.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const width = rect.width;
      const now = Date.now();

      if (now - lastTap.current < 300) {
        // Double tap
        if (x < width * 0.3) {
          skipBackward();
          showSeekIndicator("backward");
        } else if (x > width * 0.7) {
          skipForward();
          showSeekIndicator("forward");
        } else {
          togglePlayPause();
        }
      }
      lastTap.current = now;

      // Auto-hide controls after delay
      if (hoverTimer) clearTimeout(hoverTimer);
      const timer = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, CONTROLS_HIDE_DELAY);
      setHoverTimer(timer);
    },
    [
      isPlaying,
      skipBackward,
      showSeekIndicator,
      skipForward,
      togglePlayPause,
      hoverTimer,
    ],
  );

  // Touch zoom
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
        // Could add pinch zoom if needed
        lastTouchDistance.current = dist;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      lastTouchDistance.current = null;
    }
  };

  // Auto-hide controls on mouse move (YouTube-style)
  const handleMouseMove = () => {
    setShowControls(true);

    if (hoverTimer) {
      clearTimeout(hoverTimer);
    }

    // Only auto-hide if video is playing
    if (isPlaying) {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, CONTROLS_HIDE_DELAY);
      setHoverTimer(timer);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!videoRef.current) return;
      if (
        document.activeElement &&
        ["INPUT", "TEXTAREA", "BUTTON", "SELECT"].includes(
          document.activeElement.tagName,
        )
      )
        return;

      switch (e.code) {
        case "Space":
        case "KeyK":
          e.preventDefault();
          togglePlayPause();
          break;
        case "KeyM":
          e.preventDefault();
          toggleMute();
          break;
        case "KeyF":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "ArrowRight":
          e.preventDefault();
          skipForward();
          showSeekIndicator("forward");
          break;
        case "ArrowLeft":
          e.preventDefault();
          skipBackward();
          showSeekIndicator("backward");
          break;
        case "ArrowUp":
          e.preventDefault();
          changeVolume(Math.min(volume + 10, 100));
          break;
        case "ArrowDown":
          e.preventDefault();
          changeVolume(Math.max(volume - 10, 0));
          break;
        default:
          break;
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    togglePlayPause,
    toggleMute,
    toggleFullscreen,
    skipForward,
    skipBackward,
    showSeekIndicator,
    changeVolume,
    volume,
  ]);

  // Set up video event listeners - MUST come before src change effect
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = volume / 100;
    video.playbackRate = playbackRate;

    const handlePlay = () => {
      setIsPlaying(true);
      onPlayStateChange?.(true);
      // Auto-hide controls after play starts
      if (hoverTimer) clearTimeout(hoverTimer);
      const timer = setTimeout(() => {
        setShowControls(false);
      }, CONTROLS_HIDE_DELAY);
      setHoverTimer(timer);
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPlayStateChange?.(false);
      // Show controls when paused
      setShowControls(true);
      if (hoverTimer) {
        clearTimeout(hoverTimer);
        setHoverTimer(null);
      }
    };

    const handleLoadedMetadata = () => {
      if (videoRef.current) {
        setDuration(videoRef.current.duration);
        setIsLoading(false);
      }
    };

    const handleTimeUpdate = () => {
      if (videoRef.current) {
        setCurrentTime(videoRef.current.currentTime);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onPlayStateChange?.(false);
      setShowControls(true);
      if (hoverTimer) {
        clearTimeout(hoverTimer);
        setHoverTimer(null);
      }
    };

    const handleCanPlay = () => setIsLoading(false);

    const handleLoadStart = () => setIsLoading(true);

    const handleError = () => {
      let message = "Failed to load video.";
      if (videoRef.current?.error) {
        switch (videoRef.current.error.code) {
          case 1:
            message = "Video loading aborted by user.";
            break;
          case 2:
            message = "Network error while loading video.";
            break;
          case 3:
            message = "Video decoding error. File may be corrupt.";
            break;
          case 4:
            message = "Video format not supported.";
            break;
        }
      }
      setError(message);
      setIsLoading(false);
      setIsPlaying(false);
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      if (hoverTimer) clearTimeout(hoverTimer);
    };
  }, [onPlayStateChange, volume, hoverTimer, playbackRate]);

  // Reset video state when source changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Pause the video first
    video.pause();

    // Reset state
    setError(null);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setPlaybackRate(1.0);
    setShowControls(true);

    // Load the new source
    video.load();
  }, [src]);

  if (error) {
    return <VideoError message={error} />;
  }

  return (
    <TooltipProvider>
      <Card
        ref={containerRef}
        className={`w-full overflow-hidden bg-black ${className} ${
          isFullscreen
            ? "p-0! flex items-center justify-center min-h-screen"
            : ""
        }`}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`relative bg-black group ${
            isFullscreen ? "w-[85vw] h-[85vh]" : "aspect-video"
          }`}
        >
          {/* Video Element */}
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            onClick={togglePlayPause}
            onTouchStart={handleVideoTouch}
            className={`w-full h-full cursor-pointer ${isFullscreen ? "object-contain" : ""}`}
          />

          {/* Loading Indicator */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-10 h-10 animate-spin text-white" />
                <p className="text-sm text-white">Loading video...</p>
              </div>
            </div>
          )}

          {/* Seek Indicator */}
          {seekIndicator && (
            <div
              key={seekIndicator.key}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
            >
              <div className="bg-black/70 rounded-lg px-6 py-3 animate-pulse">
                <p className="text-white font-semibold text-lg">
                  {seekIndicator.dir === "forward" ? "+10s" : "-10s"}
                </p>
              </div>
            </div>
          )}

          {/* Play Button Overlay (when paused) */}
          {!isPlaying && !isLoading && (
            <div
              className="cursor-pointer absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 z-10"
              onClick={togglePlayPause}
            >
              <Play className="w-20 h-20 text-white fill-white" />
            </div>
          )}

          {/* Title Bar */}
          {title && showControls && (
            <div
              className={`absolute top-0 left-0 right-0 bg-linear-to-b from-black/60 to-transparent p-4 z-30 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
            >
              <h3 className="text-white font-semibold">{title}</h3>
            </div>
          )}

          {/* Controls Bar */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-4 space-y-3 z-30 transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onMouseEnter={() => hoverTimer && clearTimeout(hoverTimer)}
          >
            {/* Progress Bar */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-white w-10">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={[currentTime]}
                onValueChange={handleSeek}
                max={duration || 100}
                step={0.1}
                className="flex-1 cursor-pointer"
              />
              <span className="text-xs text-white w-10 text-right">
                {formatTime(duration)}
              </span>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                {/* Play/Pause */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={togglePlayPause}
                      className="text-white hover:bg-white/20"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isPlaying ? "Pause (K)" : "Play (K)"}
                  </TooltipContent>
                </Tooltip>

                {/* Skip Backward */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={skipBackward}
                      className="text-white hover:bg-white/20"
                    >
                      <Rewind className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Rewind 10s (←)</TooltipContent>
                </Tooltip>

                {/* Skip Forward */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={skipForward}
                      className="text-white hover:bg-white/20"
                    >
                      <FastForward className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Forward 10s (→)</TooltipContent>
                </Tooltip>

                {/* Volume */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isMuted ? "Unmute (M)" : "Mute (M)"}
                  </TooltipContent>
                </Tooltip>

                {/* Volume Slider */}
                <div className="w-20">
                  <Slider
                    value={[volume]}
                    onValueChange={(v) => changeVolume(v[0])}
                    max={100}
                    step={1}
                    className="w-full cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Reset */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={resetVideo}
                      className="text-white hover:bg-white/20"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reset</TooltipContent>
                </Tooltip>

                {/* Playback Speed Menu */}
                <div ref={speedMenuRef} className="relative">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/20 text-xs w-12"
                        onClick={() => setShowSpeedMenu((prev) => !prev)}
                      >
                        {playbackRate}x
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Playback speed</TooltipContent>
                  </Tooltip>

                  {/* Speed Dropdown */}
                  {showSpeedMenu && (
                    <div className="absolute bottom-full right-0 mb-2 w-36 bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg overflow-hidden">
                      {/* Header */}
                      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10">
                        <Gauge className="w-3.5 h-3.5 text-white/60" />
                        <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
                          Speed
                        </span>
                      </div>

                      {/* Rate Options */}
                      <div className="py-1">
                        {PLAYBACK_RATES.map((rate) => (
                          <button
                            key={rate}
                            onClick={() => changePlaybackRate(rate)}
                            className={`
                              w-full cursor-pointer text-left px-3 py-1.5 text-sm transition-colors flex items-center justify-between
                              ${
                                playbackRate === rate
                                  ? "text-white bg-white/10"
                                  : "text-white/70 hover:text-white hover:bg-white/10"
                              }
                            `}
                          >
                            <span>{rate}x</span>
                            {playbackRate === rate && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Download */}
                {downloadable && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={downloadVideo}
                        className="text-white hover:bg-white/20"
                      >
                        <Download className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Download</TooltipContent>
                  </Tooltip>
                )}

                {/* Fullscreen */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={toggleFullscreen}
                      className="text-white hover:bg-white/20"
                    >
                      {isFullscreen ? (
                        <Minimize className="w-5 h-5" />
                      ) : (
                        <Maximize className="w-5 h-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isFullscreen ? "Exit Fullscreen (F)" : "Fullscreen (F)"}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
}
