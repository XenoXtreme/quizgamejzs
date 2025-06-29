"use client";
import React, { useRef, useState, useEffect } from "react";
import { Button, Card, Tooltip } from "flowbite-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlayCircle,
  faPauseCircle,
  faVolumeUp,
  faVolumeMute,
  faRedo,
  faExclamationTriangle,
  faStepBackward,
  faStepForward,
} from "@fortawesome/free-solid-svg-icons";

// Custom AudioVisualizer
function AudioVisualizer({
  isPlaying,
  currentTime,
  duration,
  volume,
  width = 480,
  height = 140,
  barColor = "#2563eb",
}: {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  width?: number;
  height?: number;
  barColor?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastBarHeights = useRef<number[]>([]);

  useEffect(() => {
    if (!isPlaying) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationId: number;
    const barCount = 20;
    if (!lastBarHeights.current.length) {
      lastBarHeights.current = Array(barCount).fill(0);
    }
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      const barWidth = width / barCount;
      const t = currentTime + performance.now() / 1000 / 2;
      const d = duration || 1;
      const v = volume / 100;
      const beat = Math.abs(Math.sin(Math.PI * t * 2));
      const envelope = 0.7 + 0.3 * Math.sin((t / d) * Math.PI * 2);
      for (let i = 0; i < barCount; i++) {
        const freq = 0.5 + 0.5 * Math.sin(t * 0.7 + i * 0.15);
        const base = Math.abs(Math.sin(t * freq + i * 0.25));
        const pulse = 0.5 + 0.5 * Math.sin(t * 2 * Math.PI + i * 0.1);
        const noise = v ? (Math.sin(t * 3.7 + i) + 1) / 8 : 0;
        const targetHeight =
          (base * beat * envelope * pulse * v + noise) * height * 0.7 +
          height * 0.1;
        // Smooth the animation by interpolating previous and target heights
        const prev = lastBarHeights.current[i] || 0;
        const smoothHeight = prev + (targetHeight - prev) * 0.18;
        lastBarHeights.current[i] = smoothHeight;
        ctx.fillStyle = barColor;
        ctx.fillRect(
          i * barWidth,
          height - smoothHeight,
          barWidth * 0.7,
          smoothHeight,
        );
      }
      animationId = requestAnimationFrame(draw);
    }
    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, currentTime, duration, volume, width, height, barColor]);
  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="h-full w-full rounded-lg bg-gray-100 dark:bg-gray-900"
    />
  );
}

interface AudioPlayerProps {
  src?: string;
  title?: string;
  albumCover?: string;
  showVisualizer?: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
  className?: string;
}

// Error display component
function AudioError({ message }: { message: string }) {
  return (
    <div className="flex w-full flex-col items-center justify-center px-4 py-8">
      <div className="flex w-full max-w-md flex-col items-center rounded-xl border border-red-300 bg-red-50 p-6 shadow-lg dark:border-red-700 dark:bg-red-900">
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className="mb-4 animate-bounce text-5xl text-red-500"
          aria-hidden="true"
        />
        <h2 className="mb-2 text-lg font-semibold text-red-700 dark:text-red-300">
          Audio Error
        </h2>
        <p className="mb-4 text-center text-sm text-red-600 dark:text-red-200">
          {message}
        </p>
        <div className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
          Please check your internet connection or try a different audio file.
        </div>
      </div>
    </div>
  );
}

export default function EnhancedAudioPlayer({
  src,
  title = "Audio Track",
  albumCover = "/assets/static/music.avif",
  showVisualizer = true,
  onPlayStateChange,
  className = "",
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLInputElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [wasPlayingBeforeSeek, setWasPlayingBeforeSeek] =
    useState<boolean>(false);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Format time in MM:SS format
  const formatTime = (timeInSeconds: number): string => {
    if (isNaN(timeInSeconds)) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Handle play/pause toggle
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (currentTime >= duration && duration > 0) {
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
      }
      audioRef.current.play().catch(() => {
        setError("Failed to play audio. Please try again.");
        setIsPlaying(false);
      });
    }
    setIsPlaying(!isPlaying);
    if (onPlayStateChange) {
      onPlayStateChange(!isPlaying);
    }
  };

  // Skip forward 10 seconds
  const skipForward = () => {
    if (!audioRef.current || audioRef.current.duration <= 0) return;
    const newTime = Math.min(
      audioRef.current.currentTime + 10,
      audioRef.current.duration,
    );
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Skip backward 10 seconds
  const skipBackward = () => {
    if (!audioRef.current) return;
    const newTime = Math.max(audioRef.current.currentTime - 10, 0);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Reset to beginning
  const resetAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
  };

  // Toggle mute state
  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
      if (isMuted && newVolume > 0) {
        audioRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  // Handle start of seeking
  const handleSeekStart = () => {
    setIsDragging(true);
    setWasPlayingBeforeSeek(isPlaying);
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
    }
  };

  // Handle seeking in the progress bar
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
  };

  // Handle end of seeking
  const handleSeekEnd = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const seekTime = parseFloat((e.target as HTMLInputElement).value);
    if (audioRef.current) {
      const validTime = Math.min(seekTime, duration);
      audioRef.current.currentTime = validTime;
      setCurrentTime(validTime);
      if (wasPlayingBeforeSeek) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      }
    }
    setIsDragging(false);
  };

  // Update audio source when src prop changes
  useEffect(() => {
    if (audioRef.current) {
      setCurrentTime(0);
      setIsPlaying(false);
      setIsLoading(true);
      setError(null); // Clear error on new src
      audioRef.current.load();
    }
  }, [src]);

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume / 100;
    const handleAudioPlay = () => setIsPlaying(true);
    const handleAudioPause = () => setIsPlaying(false);
    const handleLoadedMetadata = () => {
      if (!audio.duration || isNaN(audio.duration)) {
        setError("Audio file could not be loaded.");
        setDuration(0);
        setIsLoading(false);
        return;
      }
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const handleTimeUpdate = () => {
      if (!isDragging) setCurrentTime(audio.currentTime);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      if (onPlayStateChange) onPlayStateChange(false);
    };
    const handleCanPlay = () => setIsLoading(false);
    audio.addEventListener("play", handleAudioPlay);
    audio.addEventListener("pause", handleAudioPause);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("canplay", handleCanPlay);
    return () => {
      audio.removeEventListener("play", handleAudioPlay);
      audio.removeEventListener("pause", handleAudioPause);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [isDragging, onPlayStateChange, volume]);

  // Attach onError to <audio> and <source> directly for reliability
  const handleAudioElementError = (
    e?: React.SyntheticEvent<HTMLAudioElement | HTMLSourceElement, Event>,
  ) => {
    let message =
      "Audio file could not be loaded (not found or network error).";
    if (e && e.currentTarget) {
      const el = e.currentTarget as HTMLAudioElement | HTMLSourceElement;
      if ("error" in el && el.error) {
        switch (el.error.code) {
          case 1:
            message =
              "Aborted: The fetching process for the media resource was aborted by the user agent at the user's request.";
            break;
          case 2:
            message =
              "Network error: A network error caused the audio download to fail.";
            break;
          case 3:
            message =
              "Decode error: The audio playback was aborted due to a corruption problem or unsupported features.";
            break;
          case 4:
            message =
              "Source not supported: The audio could not be loaded because the format is not supported.";
            break;
          default:
            message = "Unknown audio error occurred.";
        }
      }
    }
    setError(message);
    setIsLoading(false);
    setIsPlaying(false);
  };

  // Update progress range max value when duration changes
  useEffect(() => {
    if (progressRef.current && duration > 0) {
      progressRef.current.max = duration.toString();
    }
  }, [duration]);

  // Clean up audio context and analyser on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.src = "";
      }
    };
  }, []);

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
        case "Space":
        case "KeyK":
          e.preventDefault();
          togglePlayPause();
          break;
        case "KeyM":
          toggleMute();
          break;
        case "ArrowUp":
          setVolume((v) => Math.min(v + 10, 100));
          break;
        case "ArrowDown":
          setVolume((v) => Math.max(v - 10, 0));
          break;
        case "KeyR":
          resetAudio();
          break;
        default:
          break;
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line
  }, [isPlaying, volume, isMuted, duration, currentTime]);

  const lastTap = useRef<number>(0);
  const handleVisualizerTap = (e: React.TouchEvent<HTMLDivElement>) => {
    const now = Date.now();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.touches[0]?.clientX ?? 0;
    if (now - lastTap.current < 300) {
      // Double tap: seek
      if (x - rect.left < rect.width / 2) {
        skipBackward();
      } else {
        skipForward();
      }
    }
    lastTap.current = now;
  };

  return (
    <Card
      className={`w-full overflow-hidden border border-gray-200 bg-white p-0 shadow-lg dark:border-gray-700 dark:bg-gray-900 ${className}`}
    >
      {/* Audio element with onError handler */}
      <audio
        ref={audioRef}
        preload="metadata"
        onError={handleAudioElementError}
        tabIndex={-1}
      >
        <source src={src} type="audio/mp3" onError={handleAudioElementError} />
        Your browser does not support the audio element.
      </audio>
      {/* If error, show only error UI */}
      {error ? (
        <div className="flex w-full flex-col items-center justify-center py-8">
          <AudioError message={error} />
        </div>
      ) : (
        <>
          {/* Album cover or waveform visualizer */}
          {showVisualizer && (
            <div className="mb-4 flex w-full justify-center">
              <div
                className="xs:max-w-sm relative flex aspect-video w-full max-w-xs items-center justify-center overflow-hidden rounded-lg bg-gray-100 shadow-md sm:max-w-md dark:bg-gray-900"
                onTouchEnd={handleVisualizerTap}
              >
                {!isPlaying ? (
                  <img
                    alt="album cover"
                    src={albumCover}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <AudioVisualizer
                    isPlaying={isPlaying}
                    currentTime={currentTime}
                    duration={duration}
                    volume={volume}
                    width={320}
                    height={90}
                    barColor="#2563eb"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  {isLoading && (
                    <div className="bg-opacity-50 flex h-full w-full animate-pulse flex-col items-center justify-center bg-black text-white">
                      <svg
                        className="h-8 w-8 animate-spin text-white sm:h-10 sm:w-10"
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
                      <span className="mt-2 text-xs sm:text-base">
                        Loading audio...
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Title */}
          <div className="mb-2 text-center">
            <h3 className="xs:text-base truncate text-sm font-medium text-[silver] sm:text-lg">
              {title}
            </h3>
          </div>

          {/* Progress bar */}
          <div className="xs:px-4 mb-2 px-2">
            <div className="mb-1 flex justify-between text-xs text-gray-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div className="relative mb-2 h-2 w-full rounded-full bg-gray-200">
              <div
                className="pointer-events-none absolute top-0 left-0 h-2 rounded-full bg-blue-600"
                style={{
                  width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                }}
              ></div>
              <input
                ref={progressRef}
                type="range"
                min="0"
                max={duration || 100}
                step="0.01"
                value={currentTime}
                onChange={handleSeek}
                onMouseDown={handleSeekStart}
                onTouchStart={handleSeekStart}
                onMouseUp={handleSeekEnd}
                onTouchEnd={handleSeekEnd}
                disabled={duration <= 0 || isLoading || !!error}
                className="absolute z-10 h-2 w-full cursor-pointer appearance-none bg-transparent opacity-0"
              />
            </div>
          </div>

          {/* Main controls */}
          <div className="xs:gap-3 dark:bg mb-4 flex flex-wrap items-center justify-between gap-2 sm:gap-4">
            <Tooltip content="Go back 10 seconds">
              <Button
                className="cursor-pointer rounded-full border-0 bg-gray-50 text-blue-600 shadow-md transition-all duration-150 hover:bg-blue-200 focus:!ring-2 focus:ring-blue-400 dark:focus:ring-pink-500"
                color="light"
                size="md"
                onClick={skipBackward}
                pill
                disabled={isLoading || currentTime <= 0 || !!error}
              >
                <FontAwesomeIcon
                  icon={faStepBackward}
                  className="text-lg sm:text-xl"
                />
              </Button>
            </Tooltip>
            <Button
              className="scale-110 cursor-pointer !rounded-full !border-0 !bg-blue-600 !text-white !shadow-lg transition-all duration-150 hover:!bg-blue-700 focus:!ring-2 focus:!ring-blue-400"
              color={isPlaying ? "failure" : "success"}
              size="md"
              onClick={togglePlayPause}
              disabled={isLoading || (duration <= 0 && !src) || !!error}
              pill
            >
              <FontAwesomeIcon
                icon={isPlaying ? faPauseCircle : faPlayCircle}
                className="text-lg sm:text-xl"
              />
            </Button>
            <Tooltip content="Go forward 10 seconds">
              <Button
                className="cursor-pointer rounded-full border-0 bg-gray-50 text-blue-600 shadow-md transition-all duration-150 hover:bg-blue-200 focus:!ring-2 focus:ring-blue-400 dark:focus:ring-pink-500"
                color="light"
                size="md"
                onClick={skipForward}
                pill
                disabled={
                  isLoading ||
                  (currentTime >= duration && duration > 0) ||
                  !!error
                }
              >
                <FontAwesomeIcon
                  icon={faStepForward}
                  className="text-lg sm:text-xl"
                />
              </Button>
            </Tooltip>
          </div>

          {/* Secondary controls */}
          <div className="mb-2 flex flex-row items-center justify-center gap-4">
            <div className="flex items-center">
              <Tooltip content={isMuted ? "Unmute" : "Mute"}>
                <Button
                  color="light"
                  size="md"
                  onClick={toggleMute}
                  className="mr-2 cursor-pointer rounded-full border-0 bg-gray-50 text-blue-600 shadow-md transition-all duration-150 hover:bg-blue-200 focus:!ring-2 focus:ring-blue-400 dark:focus:ring-pink-500"
                  disabled={isLoading || !!error}
                  pill
                >
                  <FontAwesomeIcon
                    icon={isMuted ? faVolumeMute : faVolumeUp}
                    className="text-lg sm:text-xl"
                  />
                </Button>
              </Tooltip>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="xs:w-24 h-2 w-16 cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600 sm:w-28"
                disabled={isMuted || isLoading || !!error}
              />
            </div>
            <Tooltip content="Reset to beginning">
              <Button
                className="cursor-pointer rounded-full border-0 text-blue-600 shadow-md transition-all duration-150 hover:bg-blue-200 focus:!ring-2 focus:ring-blue-400 dark:focus:ring-pink-500"
                color="light"
                size="md"
                onClick={resetAudio}
                disabled={isLoading || currentTime === 0 || !!error}
                pill
              >
                <FontAwesomeIcon icon={faRedo} className="text-lg sm:text-xl" />
              </Button>
            </Tooltip>
          </div>
        </>
      )}
    </Card>
  );
}
