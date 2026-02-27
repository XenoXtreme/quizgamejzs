"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Save,
  Plus,
  Trash2,
  Clock,
  Timer,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";

// COMPONENTS
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

type AlertType = "success" | "error" | "warning" | "info";

interface SavedTimer {
  id: number;
  name: string;
  timeInSeconds: number;
}

export default function EnhancedQuizTimer() {
  const DEFAULT_TIMER_SECONDS = 30;

  // Timer mode
  const [mode, setMode] = useState<"countdown" | "stopwatch">("countdown");

  // Time states
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(DEFAULT_TIMER_SECONDS);
  const [totalSeconds, setTotalSeconds] = useState<number>(
    DEFAULT_TIMER_SECONDS
  );
  const [remainingSeconds, setRemainingSeconds] = useState<number>(
    DEFAULT_TIMER_SECONDS
  );
  const [milliseconds, setMilliseconds] = useState<number>(0);

  // Control states
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Stopwatch laps
  const [laps, setLaps] = useState<number[]>([]);

  // Saved timers
  const [savedTimers, setSavedTimers] = useState<SavedTimer[]>([]);
  const [timerName, setTimerName] = useState<string>("");

  // Sound settings
  const [playTickSound, setPlayTickSound] = useState<boolean>(true);
  const [playAlarmSound, setPlayAlarmSound] = useState<boolean>(true);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState<boolean>(false);
  const [isTickSoundPlaying, setIsTickSoundPlaying] = useState<boolean>(false);

  // Toast/Alert
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string;
    type: AlertType;
  }>({
    show: false,
    message: "",
    type: "info",
  });

  // Refs
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const alarmSoundRef = useRef<HTMLAudioElement | null>(null);
  const tickSoundRef = useRef<HTMLAudioElement | null>(null);

  // Helper function for showing alerts
  const showAlertMessage = useCallback((message: string, type: AlertType) => {
    setAlert({ show: true, message, type });
    setTimeout(
      () => setAlert({ show: false, message: "", type: "info" }),
      3000
    );
  }, []);

  // Load saved timers from memory on mount
  useEffect(() => {
    // Initialize audio (would need actual audio files)
    alarmSoundRef.current = new Audio("/alarm.wav");
    tickSoundRef.current = new Audio("/tick.mp3");

    if (alarmSoundRef.current) alarmSoundRef.current.volume = 1.0;
    if (tickSoundRef.current) {
      tickSoundRef.current.volume = 1;
      tickSoundRef.current.loop = false; // Don't loop the tick sound
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // SOUND MANAGEMENT
  const stopAlarm = useCallback(() => {
    if (alarmSoundRef.current) {
      alarmSoundRef.current.pause();
      alarmSoundRef.current.currentTime = 0;
    }
    setIsAlarmPlaying(false);
  }, []);

  const stopTickSound = useCallback(() => {
    if (tickSoundRef.current) {
      tickSoundRef.current.pause();
      tickSoundRef.current.currentTime = 0;
    }
    setIsTickSoundPlaying(false);
  }, []);

  const startTickSound = useCallback(() => {
    if (tickSoundRef.current && playTickSound && !isTickSoundPlaying) {
      tickSoundRef.current.currentTime = 0;
      tickSoundRef.current
        .play()
        .catch((e) => console.log("Tick sound error:", e));
      setIsTickSoundPlaying(true);
    }
  }, [playTickSound, isTickSoundPlaying]);

  // Update total seconds when time inputs change
  useEffect(() => {
    const total = hours * 3600 + minutes * 60 + seconds;
    if (total !== totalSeconds) {
      setTotalSeconds(total);
      if (!isRunning && !isPaused) {
        setRemainingSeconds(total);
      }
    }
  }, [hours, minutes, seconds, isRunning, isPaused, totalSeconds]);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      if (mode === "countdown") {
        timerRef.current = setInterval(() => {
          setRemainingSeconds((prev) => {
            if (prev <= 0) {
              if (timerRef.current) clearInterval(timerRef.current);
              setIsRunning(false);
              setIsPaused(false);
              stopTickSound();

              if (playAlarmSound && !isAlarmPlaying) {
                setIsAlarmPlaying(true);
                alarmSoundRef.current
                  ?.play()
                  .catch((e) => console.log("Alarm error:", e));
              }

              showAlertMessage("Time's up!", "warning");
              return 0;
            }

            // Play tick sound once when entering last 10 seconds
            if (prev === 10 && playTickSound && !isTickSoundPlaying) {
              startTickSound();
            }

            return prev - 1;
          });
        }, 1000);
      } else {
        // Stopwatch mode with milliseconds
        timerRef.current = setInterval(() => {
          setMilliseconds((ms) => {
            if (ms >= 99) {
              setRemainingSeconds((prev) => prev + 1);
              return 0;
            }
            return ms + 1;
          });
        }, 10);
      }
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [
    isRunning,
    mode,
    playAlarmSound,
    isAlarmPlaying,
    playTickSound,
    isTickSoundPlaying,
    startTickSound,
    stopTickSound,
    showAlertMessage,
  ]);

  // Handle pause/resume for tick sound
  useEffect(() => {
    if (!isRunning && isTickSoundPlaying) {
      stopTickSound();
    }
  }, [isRunning, isTickSoundPlaying, stopTickSound]);

  const handleStart = () => {
    if (mode === "countdown" && totalSeconds === 0 && !isPaused) {
      showAlertMessage("Please set a time greater than zero", "error");
      return;
    }

    stopAlarm();
    setIsRunning(true);
    setIsPaused(false);

    // Resume tick sound if we're in the last 10 seconds
    if (
      mode === "countdown" &&
      remainingSeconds <= 10 &&
      remainingSeconds > 0 &&
      playTickSound
    ) {
      startTickSound();
    }
  };

  const handlePause = () => {
    setIsRunning(false);
    setIsPaused(true);
    stopTickSound();
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setHours(0);
    setMinutes(0);
    setSeconds(DEFAULT_TIMER_SECONDS);
    setRemainingSeconds(DEFAULT_TIMER_SECONDS);
    setTotalSeconds(DEFAULT_TIMER_SECONDS);
    setMilliseconds(0);
    setLaps([]);
    stopAlarm();
    stopTickSound();
  };

  const handleLap = () => {
    if (isRunning && mode === "stopwatch") {
      const lapTime = remainingSeconds * 100 + milliseconds;
      setLaps((prev) => [lapTime, ...prev]);
    }
  };

  const handleSaveTimer = () => {
    if (!timerName.trim()) {
      showAlertMessage("Please enter a timer name", "error");
      return;
    }

    const newTimer: SavedTimer = {
      id: Date.now(),
      name: timerName,
      timeInSeconds: totalSeconds,
    };

    setSavedTimers((prev) => [...prev, newTimer]);
    setTimerName("");
    showAlertMessage("Timer saved successfully", "success");
  };

  const handleLoadTimer = (timeInSeconds: number) => {
    setIsRunning(false);
    setIsPaused(false);

    const h = Math.floor(timeInSeconds / 3600);
    const m = Math.floor((timeInSeconds % 3600) / 60);
    const s = timeInSeconds % 60;

    setHours(h);
    setMinutes(m);
    setSeconds(s);
    setRemainingSeconds(timeInSeconds);

    stopAlarm();
    showAlertMessage("Timer loaded", "info");
  };

  const handleDeleteTimer = (id: number) => {
    setSavedTimers((prev) => prev.filter((t) => t.id !== id));
    showAlertMessage("Timer deleted", "info");
  };

  const formatTime = (h: number, m: number, s: number): string => {
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatTimeWithMs = (totalSec: number, ms: number): string => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}.${ms
      .toString()
      .padStart(2, "0")}`;
  };

  const progressPercentage =
    mode === "countdown" && totalSeconds > 0
      ? (remainingSeconds / totalSeconds) * 100
      : 100;

  // Calculate display values from remainingSeconds
  const displayHours = Math.floor(remainingSeconds / 3600);
  const displayMinutes = Math.floor((remainingSeconds % 3600) / 60);
  const displaySeconds = remainingSeconds % 60;

  const displayTime =
    mode === "countdown"
      ? formatTime(displayHours, displayMinutes, displaySeconds)
      : formatTimeWithMs(remainingSeconds, milliseconds);

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Quiz Timer
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Professional timer for quizzes, presentations, and time management
          </p>
        </div>

        {/* Mode Toggle */}
        <Tabs
          value={mode}
          onValueChange={(value) => setMode(value as "countdown" | "stopwatch")}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger
              value="countdown"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Clock className="h-4 w-4" />
              Countdown
            </TabsTrigger>
            <TabsTrigger
              value="stopwatch"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Timer className="h-4 w-4" />
              Stopwatch
            </TabsTrigger>
          </TabsList>

          <TabsContent value="countdown" className="space-y-6 mt-6">
            {/* Main Timer Card */}
            <Card className="border-2 shadow-2xl">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-6">
                  {/* Circular Progress Timer Display */}
                  <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                    {/* Animated circular progress */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-full h-full">
                        {/* Background circle */}
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                          <circle
                            cx="50%"
                            cy="50%"
                            r="40%"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="12"
                            className="text-gray-200 dark:text-gray-800"
                          />
                        </svg>

                        {/* Animated progress circle */}
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                          <circle
                            cx="50%"
                            cy="50%"
                            r="40%"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray={`${
                              2 * Math.PI * (mode === "countdown" ? 128 : 256)
                            }`}
                            strokeDashoffset={`${
                              2 *
                              Math.PI *
                              (mode === "countdown" ? 128 : 256) *
                              (1 - progressPercentage / 100)
                            }`}
                            className="transition-all duration-300 ease-linear"
                            style={{
                              filter:
                                remainingSeconds <= 10 &&
                                remainingSeconds > 0 &&
                                isRunning
                                  ? "drop-shadow(0 0 8px rgba(236, 72, 153, 0.6))"
                                  : "none",
                              transition: isRunning
                                ? "stroke-dashoffset 1s linear"
                                : "stroke-dashoffset 0.3s ease",
                            }}
                          />
                          <defs>
                            <linearGradient
                              id="gradient"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor="#6366f1" />
                              <stop offset="50%" stopColor="#a855f7" />
                              <stop offset="100%" stopColor="#ec4899" />
                            </linearGradient>
                          </defs>
                        </svg>

                        {/* Pulsing effect when time is low */}
                        {remainingSeconds <= 10 &&
                          remainingSeconds > 0 &&
                          isRunning && (
                            <svg className="absolute inset-0 w-full h-full transform -rotate-90 animate-pulse">
                              <circle
                                cx="50%"
                                cy="50%"
                                r="40%"
                                fill="none"
                                stroke="#ec4899"
                                strokeWidth="2"
                                opacity="0.3"
                              />
                            </svg>
                          )}
                      </div>
                    </div>

                    {/* Time display */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div
                        className={`text-4xl sm:text-5xl font-bold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent transition-all duration-300 ${
                          remainingSeconds <= 10 &&
                          remainingSeconds > 0 &&
                          isRunning
                            ? "scale-110"
                            : ""
                        }`}
                      >
                        {displayTime}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {isRunning ? "Running" : isPaused ? "Paused" : "Ready"}
                      </div>
                      {remainingSeconds === 0 && !isRunning && (
                        <div className="mt-4 space-y-2 flex flex-col items-center">
                          <Badge
                            variant="destructive"
                            className="animate-pulse"
                          >
                            Time&apos;s Up!
                          </Badge>
                          {isAlarmPlaying && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={stopAlarm}
                              className="mt-2"
                            >
                              <VolumeX className="h-4 w-4 mr-2" />
                              Stop Alarm
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="grid grid-cols-3 gap-3 w-full max-w-lg">
                    <Button
                      onClick={handleStart}
                      disabled={isRunning}
                      className="bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {isPaused ? "Resume" : "Start"}
                    </Button>
                    <Button
                      onClick={handlePause}
                      disabled={!isRunning}
                      variant="outline"
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                    <Button onClick={handleReset} variant="outline">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>

                  {/* Settings Toggle */}
                  <Button
                    onClick={() => setShowSettings(!showSettings)}
                    variant="ghost"
                    className="w-full max-w-lg"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {showSettings ? "Hide Settings" : "Show Settings"}
                  </Button>

                  {/* Settings Panel */}
                  {showSettings && (
                    <div className="w-full max-w-lg space-y-6 pt-6 border-t">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">
                          Timer Settings
                        </h3>

                        {/* Time Inputs */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="hours">Hours</Label>
                            <Input
                              id="hours"
                              type="number"
                              min={0}
                              max={23}
                              value={hours}
                              onChange={(e) =>
                                setHours(parseInt(e.target.value) || 0)
                              }
                              disabled={isRunning || isPaused}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="minutes">Minutes</Label>
                            <Input
                              id="minutes"
                              type="number"
                              min={0}
                              max={59}
                              value={minutes}
                              onChange={(e) =>
                                setMinutes(parseInt(e.target.value) || 0)
                              }
                              disabled={isRunning || isPaused}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="seconds">Seconds</Label>
                            <Input
                              id="seconds"
                              type="number"
                              min={0}
                              max={59}
                              value={seconds}
                              onChange={(e) =>
                                setSeconds(parseInt(e.target.value) || 0)
                              }
                              disabled={isRunning || isPaused}
                            />
                          </div>
                        </div>

                        {/* Sound Settings */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="tick-sound"
                              className="flex items-center gap-2"
                            >
                              <Volume2 className="h-4 w-4" />
                              Tick sound (last 10 sec)
                            </Label>
                            <Switch
                              id="tick-sound"
                              className="cursor-pointer"
                              checked={playTickSound}
                              onCheckedChange={setPlayTickSound}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="alarm-sound"
                              className="flex items-center gap-2"
                            >
                              <Volume2 className="h-4 w-4" />
                              Alarm when timer ends
                            </Label>
                            <Switch
                              id="alarm-sound"
                              className="cursor-pointer"
                              checked={playAlarmSound}
                              onCheckedChange={setPlayAlarmSound}
                            />
                          </div>
                        </div>

                        {/* Quick Presets */}
                        <div className="space-y-2">
                          <Label>Quick Presets</Label>
                          <div className="flex flex-wrap gap-2">
                            {[15, 30, 60, 120, 300, 600].map((time) => (
                              <Badge
                                key={time}
                                variant="secondary"
                                className="cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
                                onClick={() => handleLoadTimer(time)}
                              >
                                <Zap className="h-3 w-3 mr-1" />
                                {time < 60
                                  ? `${time}s`
                                  : `${Math.floor(time / 60)}m`}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Save Timer */}
                        <div className="space-y-2 pt-4 border-t">
                          <Label htmlFor="timer-name">Save Current Timer</Label>
                          <div className="flex gap-2">
                            <Input
                              id="timer-name"
                              placeholder="Timer name..."
                              value={timerName}
                              onChange={(e) => setTimerName(e.target.value)}
                            />
                            <Button onClick={handleSaveTimer}>
                              <Save className="h-4 w-4 mr-2" />
                              Save
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stopwatch" className="space-y-6 mt-6">
            {/* Stopwatch Card */}
            <Card className="border-2 shadow-2xl">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-6">
                  {/* Stopwatch Display */}
                  <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                    <div className="absolute inset-0 rounded-full bg-linear-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {displayTime}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {isRunning ? "Running" : isPaused ? "Paused" : "Ready"}
                      </div>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="grid grid-cols-3 gap-3 w-full max-w-lg">
                    <Button
                      onClick={handleStart}
                      disabled={isRunning}
                      className="bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {isPaused ? "Resume" : "Start"}
                    </Button>
                    <Button
                      onClick={handlePause}
                      disabled={!isRunning}
                      variant="outline"
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                    <Button onClick={handleReset} variant="outline">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>

                  {/* Lap Button */}
                  <Button
                    onClick={handleLap}
                    disabled={!isRunning}
                    className="w-full max-w-lg"
                    variant="secondary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Record Lap
                  </Button>

                  {/* Laps Display */}
                  {laps.length > 0 && (
                    <div className="w-full max-w-lg space-y-2">
                      <h3 className="font-semibold text-lg">
                        Laps ({laps.length})
                      </h3>
                      <div className="space-y-1 max-h-64 overflow-y-auto">
                        {laps.map((lap, idx) => {
                          const totalSec = Math.floor(lap / 100);
                          const ms = lap % 100;
                          return (
                            <div
                              key={idx}
                              className="flex justify-between items-center p-3 rounded-lg bg-linear-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950"
                            >
                              <span className="font-medium">
                                Lap {laps.length - idx}
                              </span>
                              <span className="font-mono text-lg">
                                {formatTimeWithMs(totalSec, ms)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Saved Timers */}
        {savedTimers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Saved Timers</CardTitle>
              <CardDescription>
                Quick access to your saved timer presets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {savedTimers.map((timer) => {
                  const h = Math.floor(timer.timeInSeconds / 3600);
                  const m = Math.floor((timer.timeInSeconds % 3600) / 60);
                  const s = timer.timeInSeconds % 60;
                  return (
                    <div
                      key={timer.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
                    >
                      <div>
                        <p className="font-medium">{timer.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatTime(h, m, s)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleLoadTimer(timer.timeInSeconds)}
                        >
                          Load
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteTimer(timer.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alert */}
        {alert.show && (
          <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right">
            <Alert
              className={
                alert.type === "success"
                  ? "border-green-500 bg-green-50 dark:bg-green-950"
                  : alert.type === "error"
                  ? "border-red-500 bg-red-50 dark:bg-red-950"
                  : alert.type === "warning"
                  ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950"
                  : "border-blue-500 bg-blue-50 dark:bg-blue-950"
              }
            >
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}
