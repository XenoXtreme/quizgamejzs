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
import { toast } from "sonner";

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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [wasPlayingBeforeSeek, setWasPlayingBeforeSeek] =
    useState<boolean>(false);

  // For the visualizer
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

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
      audioRef.current.play().catch((error) => {
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
    if (!audioRef.current || duration <= 0) return;
    const newTime = Math.min(currentTime + 10, duration);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Skip backward 10 seconds
  const skipBackward = () => {
    if (!audioRef.current) return;
    const newTime = Math.max(currentTime - 10, 0);
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
        audioRef.current.play().catch((error) => {
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
    const handleError = () => {
      setError("Audio file could not be loaded (not found or network error).");
      setIsLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener("play", handleAudioPlay);
    audio.addEventListener("pause", handleAudioPause);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("canplay", handleCanPlay);

    // Remove event listener if you add onError directly in JSX
    // audio.addEventListener('error', handleError as EventListener);

    return () => {
      audio.removeEventListener("play", handleAudioPlay);
      audio.removeEventListener("pause", handleAudioPause);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("canplay", handleCanPlay);
      // audio.removeEventListener('error', handleError as EventListener);
    };
  }, [isDragging, onPlayStateChange, volume]);

  // Attach onError to <audio> and <source> directly for reliability
  const handleAudioElementError = () => {
    setError("Audio file could not be loaded (not found or network error).");
    setIsLoading(false);
    setIsPlaying(false);
  };

  // Update progress range max value when duration changes
  useEffect(() => {
    if (progressRef.current && duration > 0) {
      progressRef.current.max = duration.toString();
    }
  }, [duration]);

  // --- Synchronized and Rhythmic Fake Audio Visualizer logic (no MediaSource/MediaElementAudioSource) ---
  // Add smoothing for bar heights
  const lastBarHeights = useRef<number[]>([]);
  useEffect(() => {
    if (!showVisualizer || !isPlaying || error) {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      return;
    }
    const canvas = canvasRef.current;
    let animationId: number;
    const barCount = 48;
    if (!lastBarHeights.current.length) {
      lastBarHeights.current = Array(barCount).fill(0);
    }
    function draw() {
      if (!canvas) return;
      const ctx2d = canvas.getContext("2d");
      if (!ctx2d) return;
      ctx2d.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = canvas.width / barCount;
      const t = audioRef.current ? audioRef.current.currentTime : 0;
      const d = duration || 1;
      const beat = Math.abs(Math.sin(Math.PI * t * 2));
      const envelope = 0.7 + 0.3 * Math.sin((t / d) * Math.PI * 2);
      for (let i = 0; i < barCount; i++) {
        const freq = 0.5 + 0.5 * Math.sin(t * 0.7 + i * 0.15);
        const base = Math.abs(Math.sin(t * freq + i * 0.25));
        const pulse = 0.5 + 0.5 * Math.sin(t * 2 * Math.PI + i * 0.1);
        const noise = (Math.sin(t * 3.7 + i) + 1) / 8;
        const targetHeight =
          (base * beat * envelope * pulse + noise) * canvas.height * 0.7 +
          canvas.height * 0.1;
        // Smooth the animation by interpolating previous and target heights
        const prev = lastBarHeights.current[i] || 0;
        const smoothHeight = prev + (targetHeight - prev) * 0.25;
        lastBarHeights.current[i] = smoothHeight;
        ctx2d.fillStyle = "#2563eb";
        ctx2d.fillRect(
          i * barWidth,
          canvas.height - smoothHeight,
          barWidth * 0.7,
          smoothHeight,
        );
      }
      animationId = requestAnimationFrame(draw);
    }
    animationId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [showVisualizer, isPlaying, error, duration]);

  // Clean up audio context and analyser on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      if (analyserRef.current) {
        try {
          analyserRef.current.disconnect();
        } catch {}
        analyserRef.current = null;
      }
      if (sourceRef.current) {
        try {
          sourceRef.current.disconnect();
        } catch {}
        sourceRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

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
      {/* If error, show only error UI (no controls, no animation, nothing else) */}
      {error ? (
        <div className="flex w-full flex-col items-center justify-center py-8">
          <AudioError message={error} />
        </div>
      ) : (
        <>
          {/* Album cover or waveform visualizer */}
          {showVisualizer && (
            <div className="mb-4 flex w-full justify-center">
              <div className="relative flex aspect-video w-full max-w-md items-center justify-center overflow-hidden rounded-lg bg-gray-100 shadow-md">
                {!isPlaying ? (
                  <img
                    alt="album cover"
                    src={albumCover}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <canvas
                    ref={canvasRef}
                    width={480}
                    height={140}
                    className="h-full w-full"
                    style={{ background: "#fafafa" }}
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
            <h3 className="truncate text-base font-medium text-[silver] sm:text-lg">
              {title}
            </h3>
          </div>

          {/* Progress bar */}
          <div className="mb-2">
            <div className="mb-1 flex justify-between text-xs text-gray-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div className="relative mb-2 h-2.5 w-full rounded-full bg-gray-200">
              <div
                className="pointer-events-none absolute top-0 left-0 h-2.5 rounded-full bg-blue-600"
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
                className="absolute z-10 h-2.5 w-full cursor-pointer appearance-none bg-transparent opacity-0"
              />
            </div>
          </div>

          {/* Main controls */}
          <div className="mb-4 flex flex-wrap items-center justify-center space-x-2 sm:space-x-4">
            <Tooltip content="Go back 10 seconds">
              <Button
                className="cursor-pointer"
                color="light"
                size="sm"
                onClick={skipBackward}
                pill
                disabled={isLoading || currentTime <= 0 || !!error}
              >
                <FontAwesomeIcon icon={faStepBackward} />
              </Button>
            </Tooltip>
            <Button
              className="cursor-pointer bg-pink-700 text-white"
              color={isPlaying ? "failure" : "success"}
              size="lg"
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
                className="cursor-pointer"
                color="light"
                size="sm"
                onClick={skipForward}
                pill
                disabled={
                  isLoading ||
                  (currentTime >= duration && duration > 0) ||
                  !!error
                }
              >
                <FontAwesomeIcon icon={faStepForward} />
              </Button>
            </Tooltip>
          </div>

          {/* Secondary controls */}
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <div className="flex items-center">
              <Button
                color="light"
                size="xs"
                onClick={toggleMute}
                className="mr-2 cursor-pointer"
                disabled={isLoading || !!error}
                pill
              >
                <FontAwesomeIcon
                  icon={isMuted ? faVolumeMute : faVolumeUp}
                  className="text-gray-600"
                />
              </Button>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="h-1 w-16 cursor-pointer appearance-none rounded-lg bg-gray-200 sm:w-20"
                disabled={isMuted || isLoading || !!error}
              />
            </div>
            <Tooltip content="Reset to beginning">
              <Button
                className="cursor-pointer"
                color="light"
                size="xs"
                onClick={resetAudio}
                disabled={isLoading || currentTime === 0 || !!error}
                pill
              >
                <FontAwesomeIcon icon={faRedo} className="text-gray-600" />
              </Button>
            </Tooltip>
          </div>
        </>
      )}
    </Card>
  );
}
