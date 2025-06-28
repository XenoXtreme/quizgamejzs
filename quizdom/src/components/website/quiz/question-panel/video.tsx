import React, { useRef, useState, useEffect } from "react";
import { Button, Card } from "flowbite-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlayCircle,
  faPauseCircle,
  faVolumeUp,
  faVolumeMute,
  faRedo,
  faStepBackward,
  faStepForward,
  faExpand,
  faCompress,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";

interface VideoPlayerProps {
  src?: string;
  title?: string;
  poster?: string;
  onPlayStateChange?: (isPlaying: boolean) => void;
  className?: string;
}

// Error display component (styled like audio)
function VideoError({ message }: { message: string }) {
  return (
    <div className="flex w-full flex-col items-center justify-center px-4 py-8">
      <div className="flex w-full max-w-md flex-col items-center rounded-xl border border-red-300 bg-red-50 p-6 shadow-lg dark:border-red-700 dark:bg-red-900">
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className="mb-4 animate-bounce text-5xl text-red-500"
          aria-hidden="true"
        />
        <h2 className="mb-2 text-lg font-semibold text-red-700 dark:text-red-300">
          Video Error
        </h2>
        <p className="mb-4 text-center text-sm text-red-600 dark:text-red-200">
          {message}
        </p>
        <div className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
          Please check your internet connection or try a different video file.
        </div>
      </div>
    </div>
  );
}

export default function EnhancedVideoPlayer({
  src,
  title = "Video",
  poster,
  onPlayStateChange,
  className = "",
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSpeedDropdown, setShowSpeedDropdown] = useState<boolean>(false);
  const speedDropdownRef = useRef<HTMLDivElement>(null);
  const [seekIndicator, setSeekIndicator] = useState<null | {
    dir: "forward" | "backward";
    key: number;
  }>(null);
  const seekIndicatorKey = useRef(0);

  // Format time in MM:SS format
  const formatTime = (timeInSeconds: number): string => {
    if (isNaN(timeInSeconds)) return "00:00";

    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // --- Enhanced: Keyboard shortcuts ---
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!videoRef.current) return;
      // Only trigger if focused on player or no input is focused
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
    // eslint-disable-next-line
  }, [isPlaying, volume, isMuted, isFullscreen, duration]);

  // --- Enhanced: Volume change helper for keyboard ---
  const changeVolume = (newVolume: number) => {
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
      if (isMuted && newVolume > 0) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  // --- Enhanced: Double-tap seek for mobile ---
  let lastTap = useRef<number>(0);
  let tapTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleVideoTouch = (e: React.TouchEvent<HTMLVideoElement>) => {
    if (!videoRef.current) return;
    const touch = e.touches[0];
    const rect = videoRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const width = rect.width;
    const now = Date.now();

    if (now - lastTap.current < 300) {
      // Double tap detected
      if (x < width * 0.4) {
        skipBackward();
        showSeekIndicator("backward");
      } else if (x > width * 0.6) {
        skipForward();
        showSeekIndicator("forward");
      } else {
        togglePlayPause();
      }
      if (tapTimeout.current) clearTimeout(tapTimeout.current);
    } else {
      tapTimeout.current = setTimeout(() => {
        // Single tap: show controls
        setShowControls(true);
      }, 300);
    }
    lastTap.current = now;
  };

  const showSeekIndicator = (dir: "forward" | "backward") => {
    seekIndicatorKey.current += 1;
    setSeekIndicator({ dir, key: seekIndicatorKey.current });
    setTimeout(() => {
      setSeekIndicator(null);
    }, 700);
  };

  // Handle play/pause toggle
  const togglePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch((error) => {
        toast.error("Failed to play video. Please try again.");
        console.error("Video playback error:", error);
      });
    }
  };

  // Handle video click to toggle play/pause
  const handleVideoClick = () => {
    togglePlayPause();
  };

  // Skip forward 10 seconds
  const skipForward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(
      videoRef.current.currentTime + 10,
      duration,
    );
  };

  // Skip backward 10 seconds
  const skipBackward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(
      videoRef.current.currentTime - 10,
      0,
    );
  };

  // Reset to beginning
  const resetVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
  };

  // Toggle mute state
  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
    toast.info(isMuted ? "Unmuted video" : "Muted video");
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);

    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
      // Unmute if volume is adjusted while muted
      if (isMuted && newVolume > 0) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  // Handle seeking in the progress bar
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);

    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;

    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch((err) => {
        toast.error(
          `Error attempting to enable full-screen mode: ${err.message}`,
        );
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Change playback speed
  const changePlaybackRate = (rate: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  // Auto-hide controls after a period of inactivity
  const handleMouseMove = () => {
    setShowControls(true);

    if (hoverTimer) {
      clearTimeout(hoverTimer);
    }

    if (isPlaying) {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      setHoverTimer(timer);
    }
  };

  // Prevent controls from hiding when interacting
  const handleControlsMouseEnter = () => {
    if (hoverTimer) clearTimeout(hoverTimer);
    setShowControls(true);
  };

  // Reset video state when source changes
  useEffect(() => {
    if (videoRef.current) {
      // Reset state when source changes
      setCurrentTime(0);
      setIsPlaying(false);
      setIsLoading(true);

      // Force the video element to load the new source
      videoRef.current.load();
    }
  }, [src]);

  // Handler for video error (for JSX usage)
  const handleVideoError = (
    e?: React.SyntheticEvent<HTMLVideoElement | HTMLSourceElement, Event>,
  ) => {
    let message =
      "Video file could not be loaded (not found or network error).";
    let errorObj: MediaError | null = null;
    if (e && e.currentTarget) {
      const el = e.currentTarget as HTMLVideoElement | HTMLSourceElement;
      if ("error" in el && el.error) {
        errorObj = el.error;
      }
    }
    if (!errorObj && videoRef.current && videoRef.current.error) {
      errorObj = videoRef.current.error;
    }
    if (errorObj) {
      switch (errorObj.code) {
        case 1:
          message = "Video loading aborted by user.";
          break;
        case 2:
          message = "Network error occurred while loading the video.";
          break;
        case 3:
          message =
            "Video decoding error. The file may be corrupt or unsupported.";
          break;
        case 4:
          message = "Video format is not supported.";
          break;
        default:
          message = "An unknown error occurred while loading the video.";
      }
    }
    setError(message);
    setIsLoading(false);
    setIsPlaying(false);
  };

  // Set up video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set initial volume
    video.volume = volume / 100;

    // Event handlers
    const handleVideoPlay = () => {
      setIsPlaying(true);
      if (onPlayStateChange) {
        onPlayStateChange(true);
      }
    };

    const handleVideoPause = () => {
      setIsPlaying(false);
      if (onPlayStateChange) {
        onPlayStateChange(false);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (onPlayStateChange) {
        onPlayStateChange(false);
      }
    };

    const handleCanPlay = () => setIsLoading(false);

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    // Handle video error
    const handleVideoError = () => {
      setError("Video file could not be loaded (not found or network error).");
      setIsLoading(false);
      setIsPlaying(false);
    };

    // Add event listeners
    video.addEventListener("play", handleVideoPlay);
    video.addEventListener("pause", handleVideoPause);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleVideoError as EventListener);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    // Clean up event listeners on unmount
    return () => {
      video.removeEventListener("play", handleVideoPlay);
      video.removeEventListener("pause", handleVideoPause);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleVideoError as EventListener);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      if (hoverTimer) {
        clearTimeout(hoverTimer);
      }
    };
  }, [onPlayStateChange, volume, hoverTimer]);

  // Close speed dropdown on outside click
  useEffect(() => {
    if (!showSpeedDropdown) return;
    function handleClick(e: MouseEvent) {
      if (
        speedDropdownRef.current &&
        !speedDropdownRef.current.contains(e.target as Node)
      ) {
        setShowSpeedDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showSpeedDropdown]);

  return (
    <Card
      className={`w-full overflow-hidden border border-gray-200 bg-white p-0 shadow-lg dark:border-gray-700 dark:bg-gray-900 ${className}`}
    >
      {/* Error display */}
      {error ? (
        <div className="flex w-full flex-col items-center justify-center py-8">
          <VideoError message={error} />
        </div>
      ) : (
        <div
          ref={videoContainerRef}
          className="relative w-full"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isPlaying && setShowControls(false)}
          tabIndex={0}
          aria-label="Video player container"
        >
          {/* Video element */}
          <video
            ref={videoRef}
            preload="metadata"
            poster={poster}
            onClick={handleVideoClick}
            onTouchEnd={handleVideoTouch}
            className="max-h-[32vh] w-full cursor-pointer rounded-t-lg bg-black object-contain transition-all duration-200 sm:max-h-[40vh] md:max-h-[60vh] lg:max-h-[80vh]"
            onError={handleVideoError}
            tabIndex={0}
            aria-label="Video"
          >
            <source src={src} type="video/mp4" />
            Your browser does not support the video element.
          </video>

          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80">
              <div className="flex animate-pulse flex-col items-center justify-center text-white">
                <svg
                  className="h-10 w-10 animate-spin text-white sm:h-12 sm:w-12"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="mt-2 text-sm sm:text-base">
                  Loading video...
                </span>
              </div>
            </div>
          )}

          {/* Seek indicator overlay (double-tap/keyboard) */}
          {seekIndicator && (
            <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
              <span className="flex animate-bounce items-center justify-center rounded-full bg-black/60 px-3 py-1 text-lg text-white select-none sm:text-2xl md:text-3xl">
                <FontAwesomeIcon
                  icon={
                    seekIndicator.dir === "forward"
                      ? faStepForward
                      : faStepBackward
                  }
                  className="mr-2"
                />
                {seekIndicator.dir === "forward" ? "+10s" : "-10s"}
              </span>
            </div>
          )}

          {/* Video controls overlay */}
          <div
            className={`absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${showControls ? "opacity-100" : "pointer-events-none opacity-0"}`}
            onMouseEnter={handleControlsMouseEnter}
            onTouchStart={handleControlsMouseEnter}
          >
            {/* Title */}
            <div className="absolute top-0 right-0 left-0 bg-gradient-to-b from-black/80 to-transparent p-2 sm:p-3">
              <h3 className="xs:text-sm truncate text-xs font-medium text-white drop-shadow sm:text-base md:text-lg">
                {title}
              </h3>
            </div>

            <div className="p-2 sm:p-3">
              {/* Progress bar */}
              <div className="mb-2">
                <div className="xs:text-xs mb-1 flex justify-between text-[10px] text-white sm:text-sm">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <div className="group xs:h-3 relative mb-2 h-2 w-full rounded-full bg-gray-600/70">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="xs:h-3 absolute z-10 h-2 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                    aria-label="Seek"
                  />
                  <div
                    className="xs:h-3 h-2 rounded-full bg-blue-500"
                    style={{
                      width: `${(currentTime / (duration || 1)) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Main controls */}
              {/* --- Responsive controls layout --- */}
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                {/* Controls row: stack vertically on mobile, horizontally on md+ */}
                <div className="flex w-full flex-row flex-wrap items-center justify-center gap-2 md:w-auto">
                  <Button
                    color="light"
                    size="xs"
                    onClick={skipBackward}
                    pill
                    aria-label="Skip backward 10 seconds"
                    className="min-h-[36px] min-w-[36px] cursor-pointer border border-white/20 bg-transparent text-white hover:bg-white/20"
                  >
                    <FontAwesomeIcon icon={faStepBackward} />
                  </Button>

                  <Button
                    color="light"
                    size="sm"
                    onClick={togglePlayPause}
                    pill
                    aria-label={isPlaying ? "Pause" : "Play"}
                    className="min-h-[44px] min-w-[44px] cursor-pointer border border-blue-700 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <FontAwesomeIcon
                      icon={isPlaying ? faPauseCircle : faPlayCircle}
                      className="text-lg sm:text-xl md:text-2xl"
                    />
                  </Button>

                  <Button
                    color="light"
                    size="xs"
                    onClick={skipForward}
                    pill
                    aria-label="Skip forward 10 seconds"
                    className="min-h-[36px] min-w-[36px] cursor-pointer border border-white/20 bg-transparent text-white hover:bg-white/20"
                  >
                    <FontAwesomeIcon icon={faStepForward} />
                  </Button>

                  <div className="ml-2 flex items-center">
                    <Button
                      color="light"
                      size="xs"
                      onClick={toggleMute}
                      pill
                      aria-label={isMuted ? "Unmute" : "Mute"}
                      className="min-h-[36px] min-w-[36px] cursor-pointer border border-white/20 bg-transparent text-white hover:bg-white/20"
                    >
                      <FontAwesomeIcon
                        icon={isMuted ? faVolumeMute : faVolumeUp}
                      />
                    </Button>
                    {!isMuted && (
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="ml-1 h-2 w-16 cursor-pointer appearance-none rounded-lg bg-gray-600 sm:w-20 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                        aria-label="Volume"
                      />
                    )}
                  </div>
                </div>

                {/* Second row for extra controls, stacked below on mobile */}
                <div className="mt-2 flex w-full flex-row items-center justify-center gap-2 md:mt-0 md:w-auto">
                  {/* Playback speed control */}
                  <div className="relative">
                    <Button
                      color="light"
                      size="xs"
                      pill
                      aria-label="Playback speed"
                      className="min-h-[36px] min-w-[36px] cursor-pointer border border-white/20 bg-transparent text-white hover:bg-white/20"
                      onClick={() => setShowSpeedDropdown((v: boolean) => !v)}
                    >
                      <span className="text-xs font-medium">
                        {playbackRate}x
                      </span>
                    </Button>
                    {showSpeedDropdown && (
                      <div
                        ref={speedDropdownRef}
                        className="absolute right-0 bottom-full z-10 mb-2 min-w-[70px] rounded-md bg-gray-800 p-1 shadow-lg"
                      >
                        {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                          <button
                            key={rate}
                            onClick={() => {
                              changePlaybackRate(rate);
                              setShowSpeedDropdown(false);
                            }}
                            className={`block w-full cursor-pointer rounded px-3 py-1 text-left text-xs hover:bg-gray-700 ${playbackRate === rate ? "text-blue-400" : "text-white"}`}
                            aria-label={`Set speed to ${rate}x`}
                          >
                            {rate}x
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Reset button */}
                  <Button
                    color="light"
                    size="xs"
                    onClick={resetVideo}
                    pill
                    aria-label="Restart video"
                    className="min-h-[36px] min-w-[36px] cursor-pointer border border-white/20 bg-transparent text-white hover:bg-white/20"
                  >
                    <FontAwesomeIcon icon={faRedo} />
                  </Button>

                  {/* Fullscreen button */}
                  <Button
                    color="light"
                    size="xs"
                    onClick={toggleFullscreen}
                    pill
                    aria-label={
                      isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                    }
                    className="min-h-[36px] min-w-[36px] cursor-pointer border border-white/20 bg-transparent text-white hover:bg-white/20"
                  >
                    <FontAwesomeIcon
                      icon={isFullscreen ? faCompress : faExpand}
                    />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Play/Pause Button Overlay (visible when paused) */}
          {!isPlaying && !isLoading && (
            <button
              className="group absolute inset-0 z-20 flex cursor-pointer items-center justify-center bg-black/30"
              onClick={togglePlayPause}
              aria-label="Play"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white/30 bg-blue-600/80 text-white shadow-lg transition-colors group-hover:bg-blue-600 sm:h-16 sm:w-16 md:h-20 md:w-20">
                <FontAwesomeIcon
                  icon={faPlayCircle}
                  className="text-2xl sm:text-3xl md:text-4xl"
                />
              </span>
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
