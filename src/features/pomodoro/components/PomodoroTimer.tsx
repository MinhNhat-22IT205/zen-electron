"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/src/shared/components/shadcn-ui/button";
import { cn } from "@/src/shared/helpers/cn-tailwind";
import { useDraggable } from "../hooks/useDraggable";
import { playNotificationSound } from "../untils/sound";
import {
  MinusIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  RotateCounterClockwiseIcon,
  StopIcon,
} from "@radix-ui/react-icons";
import { usePomodoroStore } from "@/src/shared/libs/zustand/pomodoro-settings";

type EnhancedPomodoroTimerProps = {
  onShare: () => void;
};

export const EnhancedPomodoroTimer: React.FC<EnhancedPomodoroTimerProps> = ({
  onShare,
}) => {
  const {
    totalTimeSpent,
    timeLeft,
    isActive,
    isSession,
    sessionLength,
    breakLength,
    setTotalTimeSpent,
    setTimeLeft,
    setIsActive,
    setIsSession,
    setSessionLength,
    setBreakLength,
    resetSettings,
  } = usePomodoroStore();

  const { position } = useDraggable("pomodoro-timer");

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
        setTotalTimeSpent(totalTimeSpent + 1);
      }, 1000);
    } else if (timeLeft === 0) {
      playNotificationSound();
      setIsSession(!isSession);
      setTimeLeft(isSession ? breakLength * 60 : sessionLength * 60);
    }

    return () => clearInterval(interval);
  }, [
    isActive,
    timeLeft,
    isSession,
    sessionLength,
    breakLength,
    totalTimeSpent,
  ]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const adjustLength = (type: "session" | "break", amount: number) => {
    if (isActive) return;

    if (type === "session") {
      const newLength = Math.max(1, Math.min(60, sessionLength + amount));
      setSessionLength(newLength);
      if (isSession) {
        setTimeLeft(newLength * 60);
      }
    } else {
      const newLength = Math.max(1, Math.min(60, breakLength + amount));
      setBreakLength(newLength);
      if (!isSession) {
        setTimeLeft(newLength * 60);
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      id="pomodoro-timer"
      className="absolute bg-zinc-900/90 p-8 rounded-[32px] shadow-2xl w-[360px] text-white backdrop-blur-sm"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: "move",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
      }}
    >
      <h2 className="text-center text-2xl font-light mb-12 tracking-wide">
        {/* React Pomodoro Timer */}
      </h2>

      <div className="relative flex flex-col items-center justify-center bg-zinc-800/80 rounded-full w-48 h-48 mx-auto mb-12">
        <div className="text-sm mb-2 text-zinc-400 font-light">
          {isSession ? "Session" : "Break"}
        </div>
        <div
          className="text-5xl font-light tracking-wider"
          style={{
            textShadow: "0 0 20px rgba(255, 255, 255, 0.3)",
          }}
        >
          {formatTime(timeLeft)}
        </div>

        <div className="flex gap-4 mt-8">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "bg-zinc-700/50 hover:bg-zinc-600/50 rounded-full w-12 h-12",
              "transition-all duration-200 ease-out",
              "shadow-lg hover:shadow-xl",
              "border border-zinc-600/30",
            )}
            onClick={toggleTimer}
          >
            {isActive ? (
              <PauseIcon className="h-5 w-5" />
            ) : (
              <PlayIcon className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "bg-zinc-700/50 hover:bg-zinc-600/50 rounded-full w-12 h-12",
              "transition-all duration-200 ease-out",
              "shadow-lg hover:shadow-xl",
              "border border-zinc-600/30",
            )}
            onClick={resetSettings}
          >
            <StopIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="text-center">
          <div className="text-sm text-zinc-400 mb-3 font-light">
            Break Length
          </div>
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="bg-zinc-700/50 hover:bg-zinc-600/50 rounded-full w-8 h-8 shadow-lg"
              onClick={() => adjustLength("break", -1)}
            >
              <MinusIcon className="h-4 w-4" />
            </Button>
            <span className="text-2xl min-w-[30px] font-light">
              {breakLength}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="bg-zinc-700/50 hover:bg-zinc-600/50 rounded-full w-8 h-8 shadow-lg"
              onClick={() => adjustLength("break", 1)}
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="text-center">
          <div className="text-sm text-zinc-400 mb-3 font-light">
            Session Length
          </div>
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="bg-zinc-700/50 hover:bg-zinc-600/50 rounded-full w-8 h-8 shadow-lg"
              onClick={() => adjustLength("session", -1)}
            >
              <MinusIcon className="h-4 w-4" />
            </Button>
            <span className="text-2xl min-w-[30px] font-light">
              {sessionLength}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="bg-zinc-700/50 hover:bg-zinc-600/50 rounded-full w-8 h-8 shadow-lg"
              onClick={() => adjustLength("session", 1)}
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm text-zinc-400 m-3 font-light">
          Total Time Spent
        </div>
        <div className="text-2xl font-light">{formatTime(totalTimeSpent)}</div>
      </div>
      <Button
        className="text-black w-full bg-white mt-3"
        onClick={() => onShare()}
      >
        Share
      </Button>
    </div>
  );
};
