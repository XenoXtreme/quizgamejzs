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
    faExclamationTriangle
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
        <div className="w-full flex flex-col items-center justify-center py-8 px-4">
            <div className="bg-red-50 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-xl shadow-lg w-full max-w-md flex flex-col items-center p-6">
                <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    className="text-5xl text-red-500 mb-4 animate-bounce"
                    aria-hidden="true"
                />
                <h2 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
                    Video Error
                </h2>
                <p className="text-sm text-red-600 dark:text-red-200 text-center mb-4">
                    {message}
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
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
    className = ""
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

    // Format time in MM:SS format
    const formatTime = (timeInSeconds: number): string => {
        if (isNaN(timeInSeconds)) return "00:00";

        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Handle play/pause toggle
    const togglePlayPause = () => {
        if (!videoRef.current) return;

        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play().catch(error => {
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
        videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
    };

    // Skip backward 10 seconds
    const skipBackward = () => {
        if (!videoRef.current) return;
        videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
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
            videoContainerRef.current.requestFullscreen().catch(err => {
                toast.error(`Error attempting to enable full-screen mode: ${err.message}`);
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
    const handleVideoError = (e?: React.SyntheticEvent<HTMLVideoElement, Event>) => {
        let message = "Video file could not be loaded (not found or network error).";
        if (videoRef.current && videoRef.current.error) {
            switch (videoRef.current.error.code) {
                case 1:
                    message = "Video loading aborted by user.";
                    break;
                case 2:
                    message = "Network error occurred while loading the video.";
                    break;
                case 3:
                    message = "Video decoding error. The file may be corrupt or unsupported.";
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
        video.addEventListener('play', handleVideoPlay);
        video.addEventListener('pause', handleVideoPause);
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('ended', handleEnded);
        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('error', handleVideoError as EventListener);
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        // Clean up event listeners on unmount
        return () => {
            video.removeEventListener('play', handleVideoPlay);
            video.removeEventListener('pause', handleVideoPause);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('ended', handleEnded);
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('error', handleVideoError as EventListener);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            if (hoverTimer) {
                clearTimeout(hoverTimer);
            }
        };
    }, [onPlayStateChange, volume, hoverTimer]);

    return (
        <Card className={`w-full shadow-lg p-0 overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 ${className}`}>
            {/* Error display */}
            {error ? (
                <div className="flex flex-col items-center justify-center w-full py-8">
                    <VideoError message={error} />
                </div>
            ) : (
                <div
                    ref={videoContainerRef}
                    className="relative w-full"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => isPlaying && setShowControls(false)}
                >
                    {/* Video element */}
                    <video
                        ref={videoRef}
                        preload="metadata"
                        poster={poster}
                        onClick={handleVideoClick}
                        className="w-full cursor-pointer rounded-t-lg bg-black"
                        onError={handleVideoError}
                    >
                        <source src={src} type="video/mp4" />
                        Your browser does not support the video element.
                    </video>

                    {/* Loading overlay */}
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                            <div className="animate-pulse flex flex-col items-center justify-center text-white">
                                <svg className="animate-spin h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="mt-2">Loading video...</span>
                            </div>
                        </div>
                    )}

                    {/* Video controls overlay */}
                    <div
                        className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
                    >
                        {/* Title */}
                        <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 to-transparent">
                            <h3 className="text-white text-lg font-medium truncate drop-shadow">{title}</h3>
                        </div>

                        <div className="p-3">
                            {/* Progress bar */}
                            <div className="mb-2">
                                <div className="flex justify-between text-xs text-white mb-1">
                                    <span>{formatTime(currentTime)}</span>
                                    <span>{formatTime(duration)}</span>
                                </div>
                                <div className="w-full bg-gray-600/70 rounded-full h-2 mb-2 group relative">
                                    <input
                                        type="range"
                                        min="0"
                                        max={duration || 100}
                                        value={currentTime}
                                        onChange={handleSeek}
                                        className="absolute w-full h-2 appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 cursor-pointer z-10"
                                    />
                                    <div
                                        className="h-2 rounded-full bg-blue-500"
                                        style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Main controls */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Button
                                        color="light"
                                        size="xs"
                                        onClick={skipBackward}
                                        pill
                                        className="bg-transparent text-white hover:bg-white/20 cursor-pointer border border-white/20"
                                    >
                                        <FontAwesomeIcon icon={faStepBackward} />
                                    </Button>

                                    <Button
                                        color="light"
                                        size="sm"
                                        onClick={togglePlayPause}
                                        pill
                                        className="bg-blue-600 text-white hover:bg-blue-700 cursor-pointer border border-blue-700"
                                    >
                                        <FontAwesomeIcon
                                            icon={isPlaying ? faPauseCircle : faPlayCircle}
                                            className="text-xl"
                                        />
                                    </Button>

                                    <Button
                                        color="light"
                                        size="xs"
                                        onClick={skipForward}
                                        pill
                                        className="bg-transparent text-white hover:bg-white/20 cursor-pointer border border-white/20"
                                    >
                                        <FontAwesomeIcon icon={faStepForward} />
                                    </Button>

                                    <div className="flex items-center ml-2">
                                        <Button
                                            color="light"
                                            size="xs"
                                            onClick={toggleMute}
                                            pill
                                            className="bg-transparent text-white hover:bg-white/20 cursor-pointer border border-white/20"
                                        >
                                            <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeUp} />
                                        </Button>

                                        {!isMuted && (
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={volume}
                                                onChange={handleVolumeChange}
                                                className="w-16 h-1 ml-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    {/* Playback speed control */}
                                    <div className="relative group">
                                        <Button
                                            color="light"
                                            size="xs"
                                            pill
                                            className="bg-transparent text-white hover:bg-white/20 cursor-pointer border border-white/20"
                                        >
                                            <span className="text-xs font-medium">{playbackRate}x</span>
                                        </Button>
                                        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-gray-800 rounded-md shadow-lg p-1 z-10">
                                            {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map(rate => (
                                                <button
                                                    key={rate}
                                                    onClick={() => changePlaybackRate(rate)}
                                                    className={`block w-full text-xs py-1 px-3 text-left hover:bg-gray-700 rounded cursor-pointer ${playbackRate === rate ? 'text-blue-400' : 'text-white'}`}
                                                >
                                                    {rate}x
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Reset button */}
                                    <Button
                                        color="light"
                                        size="xs"
                                        onClick={resetVideo}
                                        pill
                                        className="bg-transparent text-white hover:bg-white/20 cursor-pointer border border-white/20"
                                    >
                                        <FontAwesomeIcon icon={faRedo} />
                                    </Button>

                                    {/* Fullscreen button */}
                                    <Button
                                        color="light"
                                        size="xs"
                                        onClick={toggleFullscreen}
                                        pill
                                        className="bg-transparent text-white hover:bg-white/20 cursor-pointer border border-white/20"
                                    >
                                        <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Play/Pause Button Overlay (visible when paused) */}
                    {(!isPlaying && !isLoading) && (
                        <button
                            className="absolute inset-0 flex items-center justify-center bg-black/30 group cursor-pointer"
                            onClick={togglePlayPause}
                        >
                            <span className="flex items-center justify-center h-16 w-16 bg-blue-600/80 text-white rounded-full group-hover:bg-blue-600 transition-colors shadow-lg border-4 border-white/30">
                                <FontAwesomeIcon icon={faPlayCircle} className="text-3xl" />
                            </span>
                        </button>
                    )}
                </div>
            )}
        </Card>
    );
}