import React, { useState, useRef, useEffect } from "react";
import { Card, Button, Badge } from "flowbite-react";
import { HiPlay, HiPause, HiStop, HiRefresh } from "react-icons/hi";


export default function Stopwatch() {
    const initialSeconds = 0; // Initial seconds for the stopwatch
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(initialSeconds);
    const [milliseconds, setMilliseconds] = useState(0);
    const [laps, setLaps] = useState<number[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Reset elapsedSeconds if initialSeconds changes (e.g. user changes timer input)
    useEffect(() => {
        if (!isRunning && !isPaused) {
            setElapsedSeconds(initialSeconds);
            setMilliseconds(0);
            setLaps([]);
        }
    }, [initialSeconds]);

    // Timer logic for stopwatch
    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setMilliseconds((ms) => {
                    if (ms >= 99) {
                        setElapsedSeconds((prev) => prev + 1);
                        return 0;
                    }
                    return ms + 1;
                });
            }, 10);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRunning]);

    useEffect(() => {
        if (!isRunning) setMilliseconds(0);
    }, [isRunning]);

    const handleStart = () => {
        setIsRunning(true);
        setIsPaused(false);
    };

    const handlePause = () => {
        setIsRunning(false);
        setIsPaused(true);
    };

    const handleStop = () => {
        setIsRunning(false);
        setIsPaused(false);
        setElapsedSeconds(initialSeconds);
        setMilliseconds(0);
        setLaps([]);
    };

    const handleReset = () => {
        setIsRunning(false);
        setIsPaused(false);
        setElapsedSeconds(initialSeconds);
        setMilliseconds(0);
        setLaps([]);
    };

    const handleLap = () => {
        if (isRunning) {
            setLaps((prev) => [elapsedSeconds * 100 + milliseconds, ...prev]);
        }
    };

    const formatTime = (totalSeconds: number, ms: number) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${h.toString().padStart(2, "0")}:${m
            .toString()
            .padStart(2, "0")}:${s.toString().padStart(2, "0")}.${ms
            .toString()
            .padStart(2, "0")}`;
    };

    return (
        <Card className="mb-8 shadow-2xl border-2 border-indigo-100 bg-white rounded-2xl">
            <div className="flex flex-col items-center">
                {/* Stopwatch Display */}
                <div className="relative w-72 h-72 mb-6">
                    <div className="absolute inset-0 rounded-full bg-gray-200 shadow-inner"></div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 to-pink-300 transition-all duration-700" style={{ opacity: 0.25 }}></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-3xl sm:text-4xl font-extrabold text-indigo-700 drop-shadow-lg tracking-widest select-none">
                            {formatTime(elapsedSeconds, milliseconds)}
                        </div>
                        <div className="mt-2 text-indigo-500 font-medium">Elapsed</div>
                    </div>
                </div>
                {/* Stopwatch Controls */}
                <div className="grid grid-cols-4 gap-3 mb-6 w-full max-w-md">
                    <Button
                        className="cursor-pointer bg-pink-600 text-white hover:bg-pink-700 transition"
                        color={isRunning ? "gray" : "success"}
                        disabled={isRunning}
                        onClick={handleStart}
                        size="lg"
                    >
                        <HiPlay className="mr-2 h-5 w-5" />
                        {isPaused ? "Resume" : "Start"}
                    </Button>
                    <Button
                        className="cursor-pointer bg-pink-600 text-white hover:bg-yellow-500 transition"
                        color="warning"
                        disabled={!isRunning}
                        onClick={handlePause}
                        size="lg"
                    >
                        <HiPause className="mr-2 h-5 w-5" />
                        Pause
                    </Button>
                    <Button
                        className="cursor-pointer bg-pink-600 text-white hover:bg-red-700 transition"
                        color="failure"
                        disabled={!isRunning && !isPaused}
                        onClick={handleStop}
                        size="lg"
                    >
                        <HiStop className="mr-2 h-5 w-5" />
                        Stop
                    </Button>
                    <Button
                        className="cursor-pointer hover:bg-purple-700 transition"
                        color="purple"
                        onClick={handleReset}
                        size="lg"
                    >
                        <HiRefresh className="mr-2 h-5 w-5" />
                        Reset
                    </Button>
                </div>
                {/* Lap Button */}
                <Button
                    className="cursor-pointer mb-4 bg-indigo-600 text-white hover:bg-indigo-700 transition"
                    color="info"
                    onClick={handleLap}
                    disabled={!isRunning}
                    size="md"
                >
                    Lap
                </Button>
                {/* Laps */}
                {laps.length > 0 && (
                    <div className="w-full">
                        <h3 className="text-lg font-semibold mb-2 text-indigo-700">Laps</h3>
                        <div className="space-y-1">
                            {laps.map((lap, idx) => {
                                const totalSec = Math.floor(lap / 100);
                                const ms = lap % 100;
                                return (
                                    <div key={idx} className="flex justify-between px-2 py-1 bg-indigo-50 dark:bg-indigo-800 dark:text-amber-500 rounded">
                                        <span className="font-medium dark:text-white">Lap {laps.length - idx}</span>
                                        <span className="font-mono">{formatTime(totalSec, ms)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}
