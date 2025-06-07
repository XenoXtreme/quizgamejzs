"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button, Card, Spinner } from "flowbite-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faExpand,
    faCompress,
    faDownload,
    faRotateRight,
    faRotateLeft,
    faSearch,
    faSearchMinus,
    faSearchPlus
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";

interface EnhancedImageViewerProps {
    src?: string;
    alt?: string;
    title?: string;
    className?: string;
    downloadable?: boolean;
    showControls?: boolean;
}

export default function EnhancedImageViewer({
    src,
    alt = "Image",
    title,
    className = "",
    downloadable = true,
    showControls = true
}: EnhancedImageViewerProps) {
    // Refs
    const imageRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    // State
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [rotation, setRotation] = useState<number>(0);
    const [zoom, setZoom] = useState<number>(1);
    const [controlsVisible, setControlsVisible] = useState<boolean>(true);
    const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout | null>(null);

    // Display title - use provided title or fallback to alt text
    const displayTitle = title || alt;

    // Handle image load success
    const handleImageLoad = () => {
        setIsLoading(false);
        setError(null);
    };

    // Handle image load error
    const handleImageError = () => {
        setIsLoading(false);
        setError("Failed to load image");
        toast.error("Failed to load image");
    };

    // Toggle fullscreen
    const toggleFullscreen = () => {
        if (!containerRef.current) return;

        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(err => {
                toast.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    // Download image
    const downloadImage = () => {
        if (!src) return;
        
        const link = document.createElement('a');
        link.href = src;
        link.download = alt || 'image';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Download started");
    };

    // Rotate image left
    const rotateLeft = () => {
        setRotation((prev) => (prev - 90) % 360);
    };

    // Rotate image right
    const rotateRight = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    // Zoom in
    const zoomIn = () => {
        if (zoom < 3) {
            setZoom((prev) => Math.min(prev + 0.25, 3));
            
        }
    };

    // Zoom out
    const zoomOut = () => {
        if (zoom > 0.5) {
            setZoom((prev) => Math.max(prev - 0.25, 0.5));
        }
    };

    // Reset zoom
    const resetZoom = () => {
        setZoom(1);
        setRotation(0);
        
    };

    // Handle mouse move to show controls
    const handleMouseMove = () => {
        setControlsVisible(true);

        if (hoverTimer) {
            clearTimeout(hoverTimer);
        }

        if (isFullscreen) {
            const timer = setTimeout(() => {
                setControlsVisible(false);
            }, 3000);
            setHoverTimer(timer);
        }
    };

    // Listen for fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
            if (!document.fullscreenElement) {
                // Reset zoom and rotation when exiting fullscreen
                setZoom(1);
                setRotation(0);
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            if (hoverTimer) {
                clearTimeout(hoverTimer);
            }
        };
    }, [hoverTimer]);

    // Handle source changes
    useEffect(() => {
        if (src) {
            setIsLoading(true);
            setError(null);
            setZoom(1);
            setRotation(0);
        }
    }, [src]);

    return (
        <Card className={`w-full shadow-lg overflow-hidden ${className}`}>
            <div
                ref={containerRef}
                className={`relative w-full h-full flex flex-col ${isFullscreen ? 'bg-black' : ''}`}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => isFullscreen && setControlsVisible(false)}
            >
                {/* Title bar (visible in normal mode and when hovering in fullscreen) */}
                {(displayTitle && (!isFullscreen || controlsVisible)) && (
                    <div className={`p-3 ${isFullscreen ? 'absolute top-0 left-0 right-0 bg-black/70 z-10' : ''}`}>
                        <h3 className={`text-lg font-medium truncate ${isFullscreen ? 'text-white' : 'text-gray-800'}`}>
                            {displayTitle}
                        </h3>
                    </div>
                )}

                {/* Image container */}
                <div 
                    className={`relative flex-1 flex items-center justify-center overflow-hidden ${
                        isFullscreen ? 'w-screen h-screen' : 'w-full h-full'
                    }`}
                    onClick={isFullscreen ? toggleFullscreen : undefined}
                >
                    {/* Image */}
                    {src && (
                        <img
                            ref={imageRef}
                            src={src}
                            alt={alt}
                            className="max-w-full max-h-full object-contain transition-transform duration-200"
                            style={{
                                transform: `rotate(${rotation}deg) scale(${zoom})`,
                                display: isLoading || error ? 'none' : 'block',
                                cursor: isFullscreen ? 'zoom-out' : 'default'
                            }}
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                        />
                    )}

                    {/* Loading spinner */}
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Spinner size="xl" />
                        </div>
                    )}

                    {/* Error message */}
                    {error && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                            <div className="text-red-500 text-center p-4">
                                <div className="text-4xl mb-2">⚠️</div>
                                <p>{error}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Controls overlay (shown in fullscreen or if controls are enabled) */}
                {showControls && (!isFullscreen || controlsVisible) && (
                    <div className={`
                        flex items-center justify-between p-3 
                        ${isFullscreen ? 'absolute bottom-0 left-0 right-0 bg-black/70 transition-opacity duration-300' : ''}
                        ${isFullscreen && !controlsVisible ? 'opacity-0' : 'opacity-100'}
                    `}>
                        <div className="flex items-center space-x-2">
                            {/* Zoom controls */}
                            <Button
                                color={isFullscreen ? "dark" : "light"}
                                size="xs"
                                onClick={zoomOut}
                                disabled={zoom <= 0.5}
                                className={isFullscreen ? "cursor-pointer bg-transparent border-gray-600 text-white hover:bg-gray-800" : "cursor-pointer"}
                                pill
                            >
                                <FontAwesomeIcon icon={faSearchMinus} />
                            </Button>
                            
                            <Button
                                color={isFullscreen ? "dark" : "light"}
                                size="xs"
                                onClick={resetZoom}
                                className={isFullscreen ? "cursor-pointer bg-transparent border-gray-600 text-white hover:bg-gray-800" : "cursor-pointer"}
                                pill
                            >
                                <FontAwesomeIcon icon={faSearch} />
                            </Button>
                            
                            <Button
                                color={isFullscreen ? "dark" : "light"}
                                size="xs"
                                onClick={zoomIn}
                                disabled={zoom >= 3}
                                className={isFullscreen ? "cursor-pointer bg-transparent border-gray-600 text-white hover:bg-gray-800" : "cursor-pointer"}
                                pill
                            >
                                <FontAwesomeIcon icon={faSearchPlus} />
                            </Button>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            {/* Rotation controls */}
                            <Button
                                color={isFullscreen ? "dark" : "light"}
                                size="xs"
                                onClick={rotateLeft}
                                className={isFullscreen ? "cursor-pointer bg-transparent border-gray-600 text-white hover:bg-gray-800" : "cursor-pointer"}
                                pill
                            >
                                <FontAwesomeIcon icon={faRotateLeft} />
                            </Button>
                            
                            <Button
                                color={isFullscreen ? "dark" : "light"}
                                size="xs"
                                onClick={rotateRight}
                                className={isFullscreen ? "cursor-pointer bg-transparent border-gray-600 text-white hover:bg-gray-800" : "cursor-pointer"}
                                pill
                            >
                                <FontAwesomeIcon icon={faRotateRight} />
                            </Button>
                            
                            {/* Download button */}
                            {downloadable && (
                                <Button
                                    color={isFullscreen ? "dark" : "light"}
                                    size="xs"
                                    onClick={downloadImage}
                                    className={isFullscreen ? "cursor-pointer bg-transparent border-gray-600 text-white hover:bg-gray-800" : "cursor-pointer"}
                                    pill
                                >
                                    <FontAwesomeIcon icon={faDownload} />
                                </Button>
                            )}
                            
                            {/* Fullscreen toggle */}
                            <Button
                                color={isFullscreen ? "dark" : "light"}
                                size="xs"
                                onClick={toggleFullscreen}
                                className={isFullscreen ? "cursor-pointer bg-transparent border-gray-600 text-white hover:bg-gray-800" : "cursor-pointer"}
                                pill
                            >
                                <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}