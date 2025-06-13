"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button, Card, Badge, TextInput, Label, Toast, ToastToggle } from "flowbite-react";
import { HiClock, HiPause, HiPlay, HiStop, HiRefresh, HiAdjustments, HiSave, HiVolumeOff } from "react-icons/hi";
import Stopwatch from "./stopwatch";

export default function QuizTimer() {
    // Default timer set to 30 seconds
    const DEFAULT_TIMER_SECONDS = 30;

    // Time states
    const [seconds, setSeconds] = useState<number>(DEFAULT_TIMER_SECONDS);
    const [minutes, setMinutes] = useState<number>(0);
    const [hours, setHours] = useState<number>(0);
    const [totalTimeInSeconds, setTotalTimeInSeconds] = useState<number>(DEFAULT_TIMER_SECONDS);
    const [remainingTimeInSeconds, setRemainingTimeInSeconds] = useState<number>(DEFAULT_TIMER_SECONDS);

    // Timer control states
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [direction, setDirection] = useState<"countdown" | "stopwatch">("countdown");
    const [savedTimers, setSavedTimers] = useState<Array<{ name: string, timeInSeconds: number }>>([]);
    const [timerName, setTimerName] = useState<string>("");
    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>("");
    const [toastType, setToastType] = useState<"success" | "error" | "warning" | "info">("info");
    const [progressPercentage, setProgressPercentage] = useState<number>(100);

    // Audio refs
    const alarmSoundRef = useRef<HTMLAudioElement | null>(null);
    const tickSoundRef = useRef<HTMLAudioElement | null>(null);
    const [playTickSound, setPlayTickSound] = useState<boolean>(true);
    const [playAlarmSound, setPlayAlarmSound] = useState<boolean>(true);
    const [isAlarmPlaying, setIsAlarmPlaying] = useState<boolean>(false);

    // Timer ref
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Load saved timers from localStorage on component mount
    useEffect(() => {
        const savedTimersFromStorage = localStorage.getItem("quizTimers");
        if (savedTimersFromStorage) {
            setSavedTimers(JSON.parse(savedTimersFromStorage));
        }

        // Initialize audio elements
        alarmSoundRef.current = new Audio("/alarm.wav");
        tickSoundRef.current = new Audio("/tick.mp3");

        // Set default volume
        if (alarmSoundRef.current) alarmSoundRef.current.volume = 0.7;
        if (tickSoundRef.current) tickSoundRef.current.volume = 0.4;

        return () => {
            // Cleanup timer on unmount
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }

            // Stop any playing sounds
            if (alarmSoundRef.current) {
                alarmSoundRef.current.pause();
                alarmSoundRef.current.currentTime = 0;
            }

            if (tickSoundRef.current) {
                tickSoundRef.current.pause();
                tickSoundRef.current.currentTime = 0;
            }
        };
    }, []);

    // Calculate total time whenever hours/minutes/seconds input changes
    useEffect(() => {
        const total = hours * 3600 + minutes * 60 + seconds;
        setTotalTimeInSeconds(total);
        if (!isRunning && !isPaused) {
            setRemainingTimeInSeconds(total);
        }
    }, [hours, minutes, seconds, isRunning, isPaused]);

    // Update progress percentage
    useEffect(() => {
        if (direction === "countdown" && totalTimeInSeconds > 0) {
            setProgressPercentage((remainingTimeInSeconds / totalTimeInSeconds) * 100);
        } else if (direction === "stopwatch") {
            setProgressPercentage((remainingTimeInSeconds / (totalTimeInSeconds || 1)) * 100);
        }
    }, [remainingTimeInSeconds, totalTimeInSeconds, direction]);

    // Timer logic
    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setRemainingTimeInSeconds(prev => {
                    // For countdown timer
                    if (direction === "countdown") {
                        if (prev <= 0) {
                            clearInterval(timerRef.current!);
                            setIsRunning(false);
                            setIsPaused(false);

                            // Play alarm when timer reaches zero
                            if (playAlarmSound && alarmSoundRef.current && !isAlarmPlaying) {
                                alarmSoundRef.current.loop = true;
                                alarmSoundRef.current.play()
                                    .then(() => setIsAlarmPlaying(true))
                                    .catch(err => console.error("Error playing alarm sound:", err));
                            }
                            if (tickSoundRef.current) {
                                tickSoundRef.current.pause();
                                tickSoundRef.current.currentTime = 0;
                            }

                            displayToast("Time's up!", "warning");
                            return 0;
                        }

                        // Play tick sound every second for last 6 seconds
                        if (playTickSound && tickSoundRef.current && prev <= 6 && prev > 0) {
                            tickSoundRef.current.currentTime = 0;
                            tickSoundRef.current.play()
                                .catch(err => console.error("Error playing tick sound:", err));
                        }

                        return prev - 1;
                    }
                    // For stopwatch
                    else {
                        return prev + 1;
                    }
                });
            }, 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isRunning, direction, playTickSound, playAlarmSound, isAlarmPlaying]);

    // Update display time
    useEffect(() => {
        if (!isRunning && !isPaused) return;

        const h = Math.floor(remainingTimeInSeconds / 3600);
        const m = Math.floor((remainingTimeInSeconds % 3600) / 60);
        const s = remainingTimeInSeconds % 60;

        setHours(h);
        setMinutes(m);
        setSeconds(s);
    }, [remainingTimeInSeconds, isRunning, isPaused]);

    // Handle timer start
    const handleStart = () => {
        if (isPaused) {
            setIsPaused(false);
        } else if (direction === "countdown" && totalTimeInSeconds === 0) {
            displayToast("Please set a time greater than zero", "error");
            return;
        }

        // Stop any playing alarm
        stopAlarm();

        setIsRunning(true);
    };

    // Handle timer pause
    const handlePause = () => {
        setIsRunning(false);
        setIsPaused(true);
    };

    // Handle timer stop
    const handleStop = () => {
        setIsRunning(false);
        setIsPaused(false);

        // Reset to initial time for countdown
        if (direction === "countdown") {
            setRemainingTimeInSeconds(totalTimeInSeconds);
        } else {
            // Reset to zero for stopwatch
            setRemainingTimeInSeconds(0);
        }

        // Stop any playing alarm
        stopAlarm();
    };

    // Handle timer reset - Reset to 30 seconds as requested
    const handleReset = () => {
        setIsRunning(false);
        setIsPaused(false);

        // Reset always sets timer to 30 seconds
        setHours(0);
        setMinutes(0);
        setSeconds(DEFAULT_TIMER_SECONDS);
        setRemainingTimeInSeconds(DEFAULT_TIMER_SECONDS);
        setTotalTimeInSeconds(DEFAULT_TIMER_SECONDS);

        // Stop any playing alarm
        stopAlarm();
    };

    // Stop alarm sound
    const stopAlarm = () => {
        if (isAlarmPlaying && alarmSoundRef.current) {
            alarmSoundRef.current.pause();
            alarmSoundRef.current.currentTime = 0;
            setIsAlarmPlaying(false);
        }
    };

    // Save current timer
    const handleSaveTimer = () => {
        if (!timerName.trim()) {
            displayToast("Please enter a timer name", "error");
            return;
        }

        const newTimer = {
            name: timerName,
            timeInSeconds: totalTimeInSeconds
        };

        const updatedTimers = [...savedTimers, newTimer];
        setSavedTimers(updatedTimers);
        localStorage.setItem("quizTimers", JSON.stringify(updatedTimers));
        setTimerName("");
        displayToast("Timer saved successfully", "success");
    };

    // Load a saved timer
    const handleLoadTimer = (timeInSeconds: number) => {
        setIsRunning(false);
        setIsPaused(false);

        const h = Math.floor(timeInSeconds / 3600);
        const m = Math.floor((timeInSeconds % 3600) / 60);
        const s = timeInSeconds % 60;

        setHours(h);
        setMinutes(m);
        setSeconds(s);
        setRemainingTimeInSeconds(timeInSeconds);

        // Stop any playing alarm
        stopAlarm();

        displayToast("Timer loaded", "info");
    };

    // Delete a saved timer
    const handleDeleteTimer = (index: number) => {
        const updatedTimers = [...savedTimers];
        updatedTimers.splice(index, 1);
        setSavedTimers(updatedTimers);
        localStorage.setItem("quizTimers", JSON.stringify(updatedTimers));
        displayToast("Timer deleted", "info");
    };

    // Display toast notification
    const displayToast = (message: string, type: "success" | "error" | "warning" | "info") => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);

        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    // Format time for display
    const formatTime = (hours: number, minutes: number, seconds: number) => {
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
        <div className="mt-6 px-2 sm:px-6 rounded-xl min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-extrabold text-center mb-2 text-indigo-900 drop-shadow">Quiz Timer</h1>
                <p className="text-center text-gray-600 mb-8">Set, save, and manage timers for your quiz rounds</p>

                {/* Timer Direction Toggle */}
                <div className="flex gap-4 mb-6 justify-center">
                    <Badge
                        color={direction === "countdown" ? "info" : "gray"}
                        size="xl"
                        className={`px-4 py-2 cursor-pointer transition-all duration-200 ${direction === "countdown" ? "ring-2 ring-indigo-400" : "hover:ring-2 hover:ring-indigo-200"}`}
                        onClick={() => setDirection("countdown")}
                    >
                        Countdown
                    </Badge>
                    <Badge
                        color={direction === "stopwatch" ? "info" : "gray"}
                        size="xl"
                        className={`px-4 py-2 cursor-pointer transition-all duration-200 ${direction === "stopwatch" ? "ring-2 ring-indigo-400" : "hover:ring-2 hover:ring-indigo-200"}`}
                        onClick={() => setDirection("stopwatch")}
                    >
                        Stopwatch
                    </Badge>
                </div>

                {/* Main Timer Card or Stopwatch */}
                {direction === "countdown" ? (
                    <Card className="mb-8 shadow-2xl border-2 border-indigo-100 bg-white rounded-2xl">
                        <div className="flex flex-col items-center">
                            {/* Timer Display */}
                            <div className="relative w-72 h-72 mb-6">
                                {/* Circular Progress Background */}
                                <div className="absolute inset-0 rounded-full bg-gray-200 shadow-inner"></div>
                                {/* Circular Progress Indicator */}
                                <div
                                    className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 to-pink-300 transition-all duration-700"
                                    style={{
                                        clipPath: `circle(${progressPercentage}% at center)`,
                                        opacity: 0.25
                                    }}
                                ></div>
                                {/* Timer Value Display */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <div className="text-4xl sm:text-5xl font-extrabold text-indigo-700 drop-shadow-lg tracking-widest select-none">
                                        {formatTime(hours, minutes, seconds)}
                                    </div>
                                    <div className="mt-2 text-indigo-500 font-medium">
                                        Remaining
                                    </div>
                                    {remainingTimeInSeconds === 0 && !isRunning && (
                                        <div className="flex flex-col items-center mt-4 gap-2">
                                            <Badge color="warning" size="xl" className="animate-bounce">
                                                Time's Up!
                                            </Badge>
                                            {isAlarmPlaying && (
                                                <Button
                                                    className="cursor-pointer bg-pink-600 text-white"
                                                    color="failure"
                                                    size="sm"
                                                    onClick={stopAlarm}
                                                >
                                                    <HiVolumeOff className="mr-2 h-4 w-4" />
                                                    Stop Alarm
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Timer Controls */}
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
                            {/* Timer Settings Toggle */}
                            <Button
                                color="light"
                                onClick={() => setShowSettings(!showSettings)}
                                className="cursor-pointer mb-4 hover:ring-2 hover:ring-indigo-200 transition"
                            >
                                <HiAdjustments className="mr-2 h-5 w-5" />
                                {showSettings ? "Hide Settings" : "Show Settings"}
                            </Button>
                            {/* Timer Settings */}
                            {showSettings && (
                                <div className="w-full space-y-4 border-t pt-4">
                                    <h3 className="text-lg font-semibold text-center text-indigo-700">Timer Settings</h3>
                                    {/* Input Fields for Timer */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="hours">Hours</Label>
                                            <TextInput
                                                id="hours"
                                                type="number"
                                                min={0}
                                                max={23}
                                                value={hours}
                                                onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                                                disabled={isRunning || isPaused}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="minutes">Minutes</Label>
                                            <TextInput
                                                id="minutes"
                                                type="number"
                                                min={0}
                                                max={59}
                                                value={minutes}
                                                onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                                                disabled={isRunning || isPaused}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="seconds">Seconds</Label>
                                            <TextInput
                                                id="seconds"
                                                type="number"
                                                min={0}
                                                max={59}
                                                value={seconds}
                                                onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                                                disabled={isRunning || isPaused}
                                            />
                                        </div>
                                    </div>
                                    {/* Sound Settings */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center">
                                            <input
                                                id="tickSound"
                                                type="checkbox"
                                                checked={playTickSound}
                                                onChange={() => setPlayTickSound(!playTickSound)}
                                                className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                                            />
                                            <Label htmlFor="tickSound" className="ml-2">
                                                Play tick sound (last 5 seconds)
                                            </Label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                id="alarmSound"
                                                type="checkbox"
                                                checked={playAlarmSound}
                                                onChange={() => setPlayAlarmSound(!playAlarmSound)}
                                                className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                                            />
                                            <Label htmlFor="alarmSound" className="ml-2">
                                                Play alarm when timer ends
                                            </Label>
                                        </div>
                                    </div>
                                    {/* Quick Time Presets */}
                                    <div>
                                        <Label className="mb-2 block">Quick Presets</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {[15, 30, 60, 120, 300].map((timeInSeconds) => (
                                                <Badge
                                                    key={timeInSeconds}
                                                    color="info"
                                                    className="cursor-pointer hover:ring-2 hover:ring-indigo-300 transition"
                                                    onClick={() => handleLoadTimer(timeInSeconds)}
                                                >
                                                    {timeInSeconds < 60 ? `${timeInSeconds}s` :
                                                        timeInSeconds < 3600 ? `${Math.floor(timeInSeconds / 60)}m` :
                                                            `${Math.floor(timeInSeconds / 3600)}h ${Math.floor((timeInSeconds % 3600) / 60)}m`}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Save Timer */}
                                    <div className="pt-2 border-t">
                                        <Label htmlFor="timerName" className="mb-2 block">Save Current Timer</Label>
                                        <div className="flex gap-2">
                                            <TextInput
                                                id="timerName"
                                                placeholder="Enter timer name..."
                                                value={timerName}
                                                onChange={(e) => setTimerName(e.target.value)}
                                                className="flex-grow"
                                            />
                                            <Button
                                                color="success"
                                                onClick={handleSaveTimer}
                                                className="cursor-pointer dark:text-white hover:bg-green-700 transition"
                                            >
                                                <HiSave className="mr-2 h-5 w-5" />
                                                Save
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                ) : (
                    <Stopwatch />
                )}

                {/* Saved Timers Card */}
                {savedTimers.length > 0 && (
                    <Card className="shadow-lg bg-white">
                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-indigo-700">Saved Timers</h3>
                            <div className="space-y-3">
                                {savedTimers.map((timer, index) => {
                                    const h = Math.floor(timer.timeInSeconds / 3600);
                                    const m = Math.floor((timer.timeInSeconds % 3600) / 60);
                                    const s = timer.timeInSeconds % 60;
                                    return (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-indigo-800">{timer.name}</p>
                                                <p className="text-sm text-gray-600">{formatTime(h, m, s)}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="xs"
                                                    color="info"
                                                    className="cursor-pointer hover:bg-indigo-600 transition"
                                                    onClick={() => handleLoadTimer(timer.timeInSeconds)}
                                                >
                                                    Load
                                                </Button>
                                                <Button
                                                    size="xs"
                                                    color="failure"
                                                    className="cursor-pointer hover:bg-red-700 transition"
                                                    onClick={() => handleDeleteTimer(index)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Card>
                )}
            </div>
            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-4 right-4 z-50">
                    <Toast>
                        <div className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toastType === "success" ? "bg-green-100 text-green-500" :
                            toastType === "error" ? "bg-red-100 text-red-500" :
                                toastType === "warning" ? "bg-yellow-100 text-yellow-500" :
                                    "bg-blue-100 text-blue-500"
                            }`}>
                            {toastType === "success" && <HiSave className="h-5 w-5" />}
                            {toastType === "error" && <span>❌</span>}
                            {toastType === "warning" && <HiClock className="h-5 w-5" />}
                            {toastType === "info" && <span>ℹ️</span>}
                        </div>
                        <div className="ml-3 text-sm font-normal">{toastMessage}</div>
                        <ToastToggle onClick={() => setShowToast(false)} />
                    </Toast>
                </div>
            )}
        </div>
    );
}