"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
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
  RotateCw,
  FastForward,
  Rewind,
} from "lucide-react";

// Custom AudioVisualizer with enhanced styling
function AudioVisualizer({
  isPlaying,
  currentTime,
  duration,
  volume,
  width = 480,
  height = 140,
  barColor = "#000000",
  peakColor = "#666666",
  gradientEndColor = "#333333",
  mirrorEffect = false,
}: {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  width?: number;
  height?: number;
  barColor?: string;
  peakColor?: string;
  gradientEndColor?: string;
  mirrorEffect?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastBarHeights = useRef<number[]>([]);
  const peakHeights = useRef<number[]>([]);

  useEffect(() => {
    if (!isPlaying) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const barCount = 32;
    const barSpacing = 0.4;
    const barCornerRadius = 3;

    if (!lastBarHeights.current.length) {
      lastBarHeights.current = Array(barCount).fill(0);
      peakHeights.current = Array(barCount).fill(0);
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      const singleBarWidth = width / (barCount + barCount * barSpacing);
      const actualBarWidth = singleBarWidth;
      const gap = singleBarWidth * barSpacing;

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

        const prev = lastBarHeights.current[i] || 0;
        const smoothHeight = prev + (targetHeight - prev) * 0.18;
        lastBarHeights.current[i] = smoothHeight;

        peakHeights.current[i] = Math.max(
          peakHeights.current[i] * 0.98,
          smoothHeight,
        );

        const x = i * (actualBarWidth + gap);
        const barHeight = smoothHeight;

        // Create gradient for the bar
        const gradient = ctx.createLinearGradient(
          x,
          height - barHeight,
          x,
          height,
        );
        gradient.addColorStop(0, barColor);
        gradient.addColorStop(1, gradientEndColor);
        ctx.fillStyle = gradient;

        // Draw main bar (rounded rectangle)
        ctx.beginPath();
        ctx.moveTo(x + barCornerRadius, height - barHeight);
        ctx.lineTo(x + actualBarWidth - barCornerRadius, height - barHeight);
        ctx.quadraticCurveTo(
          x + actualBarWidth,
          height - barHeight,
          x + actualBarWidth,
          height - barHeight + barCornerRadius,
        );
        ctx.lineTo(x + actualBarWidth, height - barCornerRadius);
        ctx.quadraticCurveTo(
          x + actualBarWidth,
          height,
          x + actualBarWidth - barCornerRadius,
          height,
        );
        ctx.lineTo(x + barCornerRadius, height);
        ctx.quadraticCurveTo(x, height, x, height - barCornerRadius);
        ctx.lineTo(x, height - barHeight + barCornerRadius);
        ctx.quadraticCurveTo(
          x,
          height - barHeight,
          x + barCornerRadius,
          height - barHeight,
        );
        ctx.closePath();
        ctx.fill();

        // Draw peak indicator
        ctx.fillStyle = peakColor;
        const peakLineHeight = 2;
        ctx.fillRect(
          x,
          height - peakHeights.current[i] - peakLineHeight,
          actualBarWidth,
          peakLineHeight,
        );

        // Mirror effect
        if (mirrorEffect) {
          const mirrorY = height - barHeight;
          const mirrorHeight = barHeight * 0.4;
          const mirrorGradient = ctx.createLinearGradient(
            x,
            mirrorY + mirrorHeight,
            x,
            mirrorY,
          );
          mirrorGradient.addColorStop(
            0,
            `rgba(${parseInt(barColor.slice(1, 3), 16)}, ${parseInt(barColor.slice(3, 5), 16)}, ${parseInt(barColor.slice(5, 7), 16)}, 0.15)`,
          );
          mirrorGradient.addColorStop(
            1,
            `rgba(${parseInt(gradientEndColor.slice(1, 3), 16)}, ${parseInt(gradientEndColor.slice(3, 5), 16)}, ${parseInt(gradientEndColor.slice(5, 7), 16)}, 0)`,
          );
          ctx.fillStyle = mirrorGradient;

          ctx.beginPath();
          ctx.moveTo(x + barCornerRadius, mirrorY + mirrorHeight);
          ctx.lineTo(
            x + actualBarWidth - barCornerRadius,
            mirrorY + mirrorHeight,
          );
          ctx.quadraticCurveTo(
            x + actualBarWidth,
            mirrorY + mirrorHeight,
            x + actualBarWidth,
            mirrorY + mirrorHeight - barCornerRadius,
          );
          ctx.lineTo(x + actualBarWidth, mirrorY + barCornerRadius);
          ctx.quadraticCurveTo(
            x + actualBarWidth,
            mirrorY,
            x + actualBarWidth - barCornerRadius,
            mirrorY,
          );
          ctx.lineTo(x + barCornerRadius, mirrorY);
          ctx.quadraticCurveTo(x, mirrorY, x, mirrorY + barCornerRadius);
          ctx.lineTo(x, mirrorY + mirrorHeight - barCornerRadius);
          ctx.quadraticCurveTo(
            x,
            mirrorY + mirrorHeight,
            x + barCornerRadius,
            mirrorY + mirrorHeight,
          );
          ctx.closePath();
          ctx.fill();
        }
      }
      animationId = requestAnimationFrame(draw);
    }
    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [
    isPlaying,
    currentTime,
    duration,
    volume,
    width,
    height,
    barColor,
    peakColor,
    gradientEndColor,
    mirrorEffect,
  ]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="h-full w-full"
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

function AudioError({ message }: { message: string }) {
  return (
    <Card className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
      <CardContent className="p-8 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5" strokeWidth={1.5} />
          <h3 className="font-medium text-sm">Failed to load audio</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          {message}
        </p>
      </CardContent>
    </Card>
  );
}

export default function AudioPlayer({
  src,
  title = "Audio Track",
  albumCover = "/assets/static/music-album-poster.jpg",
  showVisualizer = true,
  onPlayStateChange,
  className = "",
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDragging] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState<boolean>(false);

  const lastTap = useRef(0);

  const formatTime = (timeInSeconds: number): string => {
    if (isNaN(timeInSeconds)) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const togglePlayPause = React.useCallback(() => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      if (
        audioRef.current.currentTime >= audioRef.current.duration &&
        audioRef.current.duration > 0
      ) {
        audioRef.current.currentTime = 0;
      }
      audioRef.current.play().catch(() => {
        setError("Failed to play audio. Please try again.");
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, []);

  const skipForward = React.useCallback(() => {
    if (!audioRef.current || audioRef.current.duration <= 0) return;
    const newTime = Math.min(
      audioRef.current.currentTime + 10,
      audioRef.current.duration,
    );
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }, []);

  const skipBackward = React.useCallback(() => {
    if (!audioRef.current) return;
    const newTime = Math.max(audioRef.current.currentTime - 10, 0);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }, []);

  const resetAudio = React.useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
  }, []);

  const toggleMute = React.useCallback(() => {
    if (!audioRef.current) return;
    const newMuted = !audioRef.current.muted;
    audioRef.current.muted = newMuted;
    setIsMuted(newMuted);
  }, []);

  const handleVolumeChange = React.useCallback((value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
      if (audioRef.current.muted && newVolume > 0) {
        audioRef.current.muted = false;
        setIsMuted(false);
      }
    }
  }, []);

  const handleSeek = React.useCallback((value: number[]) => {
    const seekTime = value[0];
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  }, []);

  const handleVisualizerClick = React.useCallback(() => {
    togglePlayPause();
  }, [togglePlayPause]);

  const handleVisualizerTap = React.useCallback(
    (e: React.TouchEvent) => {
      const now = Date.now();
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = e.touches[0]?.clientX ?? 0;
      if (now - lastTap.current < 300) {
        if (x - rect.left < rect.width / 2) {
          skipBackward();
        } else {
          skipForward();
        }
      }
      lastTap.current = now;
    },
    [skipBackward, skipForward],
  );

  // Reset audio state when source changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    setError(null);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setIsLoading(true);
    audio.load();
  }, [src]);

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume / 100;

    const handlePlay = () => {
      setIsPlaying(true);
      onPlayStateChange?.(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPlayStateChange?.(false);
    };

    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        if (!audioRef.current.duration || isNaN(audioRef.current.duration)) {
          setError("Audio file could not be loaded.");
          setDuration(0);
          setIsLoading(false);
          return;
        }
        setDuration(audioRef.current.duration);
        setIsLoading(false);
      }
    };

    const handleTimeUpdate = () => {
      if (!isDragging && audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onPlayStateChange?.(false);
    };

    const handleCanPlay = () => setIsLoading(false);

    const handleLoadStart = () => setIsLoading(true);

    const handleError = () => {
      let message = "Audio file could not be loaded.";
      if (audioRef.current?.error) {
        switch (audioRef.current.error.code) {
          case 1:
            message = "Audio loading aborted by user.";
            break;
          case 2:
            message = "Network error occurred while loading audio.";
            break;
          case 3:
            message = "Audio decoding error. The file may be corrupt.";
            break;
          case 4:
            message = "Audio format is not supported.";
            break;
        }
      }
      setError(message);
      setIsLoading(false);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
    };
  }, [isDragging, onPlayStateChange, volume]);

  // Keyboard shortcuts
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
          e.preventDefault();
          toggleMute();
          break;
        case "ArrowUp":
          e.preventDefault();
          handleVolumeChange([Math.min(volume + 10, 100)]);
          break;
        case "ArrowDown":
          e.preventDefault();
          handleVolumeChange([Math.max(volume - 10, 0)]);
          break;
        case "ArrowRight":
          e.preventDefault();
          skipForward();
          break;
        case "ArrowLeft":
          e.preventDefault();
          skipBackward();
          break;
        case "KeyR":
          e.preventDefault();
          resetAudio();
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
    handleVolumeChange,
    resetAudio,
    volume,
    skipForward,
    skipBackward,
  ]);

  if (error) {
    return <AudioError message={error} />;
  }

  return (
    <TooltipProvider>
      <Card
        className={`w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 overflow-hidden transition-shadow duration-300 ${
          isHovering ? "shadow-md" : ""
        } ${className}`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <audio ref={audioRef} src={src} crossOrigin="anonymous" />
        <CardContent className="p-0">
          {/* Visualizer or Album Cover */}
          {showVisualizer && (
            <div
              className="relative w-full overflow-hidden bg-gray-50 dark:bg-gray-950 cursor-pointer group"
              onClick={handleVisualizerClick}
              onTouchStart={handleVisualizerTap}
            >
              {!isPlaying ? (
                <div className="relative w-full aspect-video">
                  <Image
                    alt="album cover"
                    src={albumCover}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    quality={100}
                    priority
                  />
                  {/* Play overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110">
                      <div className="bg-white dark:bg-gray-900 rounded-full p-4 shadow-lg">
                        <Play className="w-8 h-8 text-gray-900 dark:text-white fill-current" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-video flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-black">
                  <AudioVisualizer
                    isPlaying={isPlaying}
                    currentTime={currentTime}
                    duration={duration}
                    volume={volume}
                    width={500}
                    height={150}
                    barColor="#000000"
                    gradientEndColor="#404040"
                    peakColor="#666666"
                    mirrorEffect={false}
                  />
                </div>
              )}

              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-black/90 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2
                      className="w-5 h-5 animate-spin text-gray-400"
                      strokeWidth={1.5}
                    />
                    <span className="text-xs text-gray-500">Loading...</span>
                  </div>
                </div>
              )}

              {/* Playing indicator */}
              {isPlaying && (
                <div className="absolute top-3 right-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-800">
                    <div className="flex gap-0.5">
                      <div
                        className="w-0.5 h-3 bg-gray-900 dark:bg-white rounded-full animate-pulse"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="w-0.5 h-3 bg-gray-900 dark:bg-white rounded-full animate-pulse"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-0.5 h-3 bg-gray-900 dark:bg-white rounded-full animate-pulse"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                    <span className="text-[10px] font-medium text-gray-900 dark:text-white">
                      Playing
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Controls Section */}
          <div className="p-5 space-y-4">
            {/* Title */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {title}
              </h3>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-gray-500 dark:text-gray-500 w-10 tabular-nums">
                  {formatTime(currentTime)}
                </span>
                <div className="flex-1">
                  <Slider
                    value={[currentTime]}
                    onValueChange={handleSeek}
                    max={duration || 100}
                    step={0.1}
                    className="cursor-pointer"
                  />
                </div>
                <span className="text-[11px] font-mono text-gray-500 dark:text-gray-500 w-10 text-right tabular-nums">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Main Controls */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={skipBackward}
                      className="h-9 w-9 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors rounded-full"
                    >
                      <Rewind className="w-4 h-4" strokeWidth={1.5} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    Rewind 10s (←)
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={togglePlayPause}
                      className="h-10 w-10 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all rounded-full"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5" strokeWidth={1.5} />
                      ) : (
                        <Play className="w-5 h-5 ml-0.5" strokeWidth={1.5} />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    {isPlaying ? "Pause (K)" : "Play (K)"}
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={skipForward}
                      className="h-9 w-9 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors rounded-full"
                    >
                      <FastForward className="w-4 h-4" strokeWidth={1.5} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    Forward 10s (→)
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={resetAudio}
                      className="h-9 w-9 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors rounded-full"
                    >
                      <RotateCw className="w-4 h-4" strokeWidth={1.5} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    Reset (R)
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Volume Controls */}
              <div className="flex items-center gap-2 flex-1 max-w-35">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={toggleMute}
                      className="h-9 w-9 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors rounded-full"
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4" strokeWidth={1.5} />
                      ) : (
                        <Volume2 className="w-4 h-4" strokeWidth={1.5} />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    {isMuted ? "Unmute (M)" : "Mute (M)"}
                  </TooltipContent>
                </Tooltip>

                <Slider
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="flex-1 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
