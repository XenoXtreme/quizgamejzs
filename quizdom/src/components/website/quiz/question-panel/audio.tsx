import React, { useRef, useState, useEffect } from "react";
import { Button, Card, Tooltip } from "flowbite-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlayCircle,
    faPauseCircle,
    faVolumeUp,
    faVolumeMute,
    faRedo,
    faStepBackward,
    faStepForward
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";

interface AudioPlayerProps {
    src?: string;
    title?: string;
    showVisualizer?: boolean;
    onPlayStateChange?: (isPlaying: boolean) => void;
    className?: string;
}

export default function EnhancedAudioPlayer({
    src,
    title = "Audio Track",
    showVisualizer = true,
    onPlayStateChange,
    className = ""
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
    const [wasPlayingBeforeSeek, setWasPlayingBeforeSeek] = useState<boolean>(false);

    // Format time in MM:SS format
    const formatTime = (timeInSeconds: number): string => {
        if (isNaN(timeInSeconds)) return "00:00";

        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Handle play/pause toggle
    const togglePlayPause = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            // If audio has reached the end, reset it first
            if (currentTime >= duration && duration > 0) {
                audioRef.current.currentTime = 0;
                setCurrentTime(0);
            }

            audioRef.current.play().catch(error => {
                toast.error("Failed to play audio. Please try again.");
                console.error("Audio playback error:", error);
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
        toast.info("Reset to beginning");
    };

    // Toggle mute state
    const toggleMute = () => {
        if (!audioRef.current) return;
        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
        toast.info(isMuted ? "Unmuted audio" : "Muted audio");
    };

    // Handle volume change
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseInt(e.target.value);
        setVolume(newVolume);

        if (audioRef.current) {
            audioRef.current.volume = newVolume / 100;
            // Unmute if volume is adjusted while muted
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
            // Ensure we don't exceed the duration
            const validTime = Math.min(seekTime, duration);
            audioRef.current.currentTime = validTime;
            setCurrentTime(validTime);

            // Resume playback if it was playing before
            if (wasPlayingBeforeSeek) {
                audioRef.current.play().catch(error => {
                    console.error("Failed to resume playback after seeking:", error);
                    setIsPlaying(false);
                });
            }
        }

        setIsDragging(false);
    };

    // Update audio source when src prop changes
    useEffect(() => {
        if (audioRef.current) {
            // Reset state when source changes
            setCurrentTime(0);
            setIsPlaying(false);
            setIsLoading(true);

            // Force the audio element to load the new source
            audioRef.current.load();
        }
    }, [src]);

    // Set up audio event listeners
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Set initial volume
        audio.volume = volume / 100;

        // Event handlers
        const handleAudioPlay = () => setIsPlaying(true);
        const handleAudioPause = () => setIsPlaying(false);
        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
            setIsLoading(false);
        };
        const handleTimeUpdate = () => {
            // Only update time if user is not dragging
            if (!isDragging) {
                setCurrentTime(audio.currentTime);
            }
        };
        const handleEnded = () => {
            setIsPlaying(false);
            // Don't reset currentTime here to show accurate position at end
            if (onPlayStateChange) {
                onPlayStateChange(false);
            }
        };
        const handleCanPlay = () => setIsLoading(false);
        const handleError = (e: ErrorEvent) => {
            console.error("Audio error:", e);
            toast.error("Error playing audio");
            setIsLoading(false);
        };

        // Add event listeners
        audio.addEventListener('play', handleAudioPlay);
        audio.addEventListener('pause', handleAudioPause);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('canplay', handleCanPlay);
        audio.addEventListener('error', handleError as EventListener);

        // Clean up event listeners on unmount
        return () => {
            audio.removeEventListener('play', handleAudioPlay);
            audio.removeEventListener('pause', handleAudioPause);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('canplay', handleCanPlay);
            audio.removeEventListener('error', handleError as EventListener);
        };
    }, [isDragging, onPlayStateChange, volume]);

    // Update progress range max value when duration changes
    useEffect(() => {
        if (progressRef.current && duration > 0) {
            progressRef.current.max = duration.toString();
        }
    }, [duration]);

    return (
        <Card className={`w-full max-w-lg shadow-lg ${className}`}>
            {/* Audio element */}
            <audio ref={audioRef} preload="metadata">
                <source src={src} type="audio/mp3" />
                Your browser does not support the audio element.
            </audio>

            {/* Visualizer or album art */}
            {showVisualizer && (
                <div className="w-full flex justify-center mb-4">
                    <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden shadow-md">
                        <img
                            alt="audio visualizer"
                            src={isPlaying ? "/_asset/static/sound-wave.gif" : "/_asset/static/music.avif"}
                            className="w-full h-full object-cover transition-opacity duration-500"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            {isLoading && (
                                <div className="animate-pulse flex flex-col items-center justify-center bg-black bg-opacity-50 w-full h-full text-white">
                                    <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="mt-2">Loading audio...</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Title */}
            <div className="text-center mb-2">
                <h3 className="text-lg font-medium text-gray-800 truncate">{title}</h3>
            </div>

            {/* Progress bar */}
            <div className="mb-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 relative">
                    <div
                        className="h-2.5 rounded-full bg-blue-600 pointer-events-none absolute top-0 left-0"
                        style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
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
                        disabled={duration <= 0 || isLoading}
                        className="absolute w-full h-2.5 appearance-none bg-transparent opacity-0 cursor-pointer z-10"
                    />
                </div>
            </div>

            {/* Main controls */}
            <div className="flex items-center justify-center space-x-4 mb-4">
                <Tooltip content="Go back 10 seconds">
                    <Button className="cursor-pointer" color="light" size="sm" onClick={skipBackward} pill disabled={isLoading || currentTime <= 0}>
                        <FontAwesomeIcon icon={faStepBackward} />
                    </Button>
                </Tooltip>

                <Button
                    className="bg-pink-700 text-white cursor-pointer"
                    color={isPlaying ? "failure" : "success"}
                    size="lg"
                    onClick={togglePlayPause}
                    disabled={isLoading || (duration <= 0 && !src)}
                    pill
                >
                    <FontAwesomeIcon
                        icon={isPlaying ? faPauseCircle : faPlayCircle}
                        className="text-xl"
                    />

                </Button>

                <Tooltip content="Go forward 10 seconds">
                    <Button
                        className="cursor-pointer"
                        color="light"
                        size="sm"
                        onClick={skipForward}
                        pill
                        disabled={isLoading || (currentTime >= duration && duration > 0)}
                    >
                        <FontAwesomeIcon icon={faStepForward} />
                    </Button>
                </Tooltip>
            </div>

            {/* Secondary controls */}
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Button
                        color="light"
                        size="xs"
                        onClick={toggleMute}
                        className="mr-2 cursor-pointer"
                        disabled={isLoading}
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
                        className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        disabled={isMuted || isLoading}
                    />
                </div>

                <Tooltip content="Reset to beginning">
                    <Button
                        className="cursor-pointer"
                        color="light"
                        size="xs"
                        onClick={resetAudio}
                        disabled={isLoading || currentTime === 0}
                        pill
                    >
                        <FontAwesomeIcon icon={faRedo} className="text-gray-600" />
                    </Button>
                </Tooltip>
            </div>
        </Card>
    );
}