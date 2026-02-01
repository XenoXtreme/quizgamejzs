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

// Custom AudioVisualizer
function AudioVisualizer({
  isPlaying,
  currentTime,
  duration,
  volume,
  width = 480,
  height = 140,
  barColor = "#2563eb", // Base color for the bars
  peakColor = "#facc15", // Color for the peak indicator
  gradientEndColor = "#60a5fa", // End color for the bar gradient
  mirrorEffect = true, // Enable/disable mirror effect
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
  const peakHeights = useRef<number[]>([]); // To store peak heights for decay

  useEffect(() => {
    if (!isPlaying) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const barCount = 20;
    const barSpacing = 0.3; // Percentage of barWidth for spacing
    const barCornerRadius = 2; // For rounded corners

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

      // Draw background glow (subtle pulse)
      const glowAlpha = 0.1 + 0.1 * Math.sin(t * Math.PI); // Pulsing alpha
      ctx.fillStyle = `rgba(37, 99, 235, ${glowAlpha})`; // Blue glow
      ctx.fillRect(0, 0, width, height);

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

        // Update peak height
        peakHeights.current[i] = Math.max(
          peakHeights.current[i] * 0.98,
          smoothHeight,
        ); // Decay and update

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
        const peakLineHeight = 2; // Height of the peak line
        ctx.fillRect(
          x,
          height - peakHeights.current[i] - peakLineHeight,
          actualBarWidth,
          peakLineHeight,
        );

        // Mirror effect
        if (mirrorEffect) {
          const mirrorY = height - barHeight;
          const mirrorHeight = barHeight * 0.5; // Half the height for mirror
          const mirrorGradient = ctx.createLinearGradient(
            x,
            mirrorY + mirrorHeight,
            x,
            mirrorY,
          );
          mirrorGradient.addColorStop(
            0,
            `rgba(${parseInt(barColor.slice(1, 3), 16)}, ${parseInt(barColor.slice(3, 5), 16)}, ${parseInt(barColor.slice(5, 7), 16)}, 0.2)`,
          ); // Faded start
          mirrorGradient.addColorStop(
            1,
            `rgba(${parseInt(gradientEndColor.slice(1, 3), 16)}, ${parseInt(gradientEndColor.slice(3, 5), 16)}, ${parseInt(gradientEndColor.slice(5, 7), 16)}, 0)`,
          ); // Transparent end
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
  albumCover = "/assets/static/music.avif",
  showVisualizer = true,
  onPlayStateChange,
  className = "",
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lastTap = useRef(0);

  const formatTime = (timeInSeconds: number): string => {
    if (isNaN(timeInSeconds)) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

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
  };

  const skipForward = () => {
    if (!audioRef.current || audioRef.current.duration <= 0) return;
    const newTime = Math.min(
      audioRef.current.currentTime + 10,
      audioRef.current.duration,
    );
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skipBackward = () => {
    if (!audioRef.current) return;
    const newTime = Math.max(audioRef.current.currentTime - 10, 0);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const resetAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
      if (isMuted && newVolume > 0) {
        audioRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  const handleSeek = (value: number[]) => {
    const seekTime = value[0];
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  useEffect(() => {
    setError(null);
    setCurrentTime(0);
    if (audioRef.current) {
      setIsPlaying(false); 
      setIsLoading(true);
      audioRef.current.load();
    }
  }, [src]);

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
      onPlayStateChange?.(false);
    };

    const handleCanPlay = () => setIsLoading(false);

    const handleError = () => {
      let message = "Audio file could not be loaded.";
      if (audio.error) {
        switch (audio.error.code) {
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
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
    };
  }, [isDragging, onPlayStateChange, volume]);

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
          setVolume((v) => Math.min(v + 10, 100));
          break;
        case "ArrowDown":
          e.preventDefault();
          setVolume((v) => Math.max(v - 10, 0));
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
  }, [isPlaying, volume, isMuted, duration, currentTime]);

  const handleVisualizerTap = (e: React.TouchEvent) => {
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
  };

  if (error) {
    return <AudioError message={error} />;
  }

  return (
    <TooltipProvider>
      <Card
        className={`w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 ${className}`}
      >
        <audio ref={audioRef} src={src} crossOrigin="anonymous" />
        <CardContent className="p-0">
          {/* Visualizer or Album Cover */}
          {showVisualizer && (
            <div
              className="relative w-full overflow-hidden bg-gray-50 dark:bg-gray-950 cursor-pointer"
              onTouchStart={handleVisualizerTap}
            >
              {!isPlaying ? (
                <div className="relative w-full aspect-video">
                  <Image
                    alt="album cover"
                    src={albumCover}
                    fill
                    className="object-cover"
                    quality={100}
                    priority
                  />
                </div>
              ) : (
                <div className="w-full aspect-video flex items-center justify-center">
                  <AudioVisualizer
                    isPlaying={isPlaying}
                    currentTime={currentTime}
                    duration={duration}
                    volume={volume}
                    width={320}
                    height={90}
                    barColor="#2563eb" // Base blue
                    gradientEndColor="#60a5fa" // Lighter blue for gradient
                    peakColor="#facc15" // Yellow for peaks
                    mirrorEffect={true} // Enable mirror effect
                  />
                </div>
              )}

              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-black/80">
                  <Loader2
                    className="w-5 h-5 animate-spin text-gray-400"
                    strokeWidth={1.5}
                  />
                </div>
              )}
            </div>
          )}

          {/* Controls Section */}
          <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-800">
            {/* Title */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {title}
              </h3>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-gray-600 dark:text-gray-400 w-12">
                  {formatTime(currentTime)}
                </span>
                <Slider
                  value={[currentTime]}
                  onValueChange={handleSeek}
                  max={duration || 100}
                  step={0.1}
                  className="flex-1 cursor-pointer"
                />
                <span className="text-xs font-mono text-gray-600 dark:text-gray-400 w-12 text-right">
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
                      className="h-8 w-8 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                    >
                      <Rewind className="w-4 h-4" strokeWidth={1.5} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    Rewind 10s
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={togglePlayPause}
                      className="h-8 w-8 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4" strokeWidth={1.5} />
                      ) : (
                        <Play className="w-4 h-4" strokeWidth={1.5} />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    {isPlaying ? "Pause" : "Play"}
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={skipForward}
                      className="h-8 w-8 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                    >
                      <FastForward className="w-4 h-4" strokeWidth={1.5} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    Forward 10s
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={resetAudio}
                      className="h-8 w-8 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                    >
                      <RotateCw className="w-4 h-4" strokeWidth={1.5} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    Reset
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Volume Controls */}
              <div className="flex items-center gap-2 flex-1 max-w-[140px]">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={toggleMute}
                      className="h-8 w-8 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4" strokeWidth={1.5} />
                      ) : (
                        <Volume2 className="w-4 h-4" strokeWidth={1.5} />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    {isMuted ? "Unmute" : "Mute"}
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
