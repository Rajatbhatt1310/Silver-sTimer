import { useEffect, useRef, useState } from "react";
import { TIMER_MODES } from "../utils/timerModes";
import { formatTime } from "../utils/time";

export default function useTimer(defaultMode = "deep-work") {
  const [mode, setMode] = useState(defaultMode);

  const [duration, setDuration] = useState(
    TIMER_MODES[defaultMode].duration
  );

  const [remainingSeconds, setRemainingSeconds] = useState(
    TIMER_MODES[defaultMode].duration
  );

  const [isRunning, setIsRunning] = useState(false);

  const [isPaused, setIsPaused] = useState(false);

  const [completed, setCompleted] = useState(false);

  const [sessionHistory, setSessionHistory] = useState([]);

  const [laps, setLaps] = useState([]);

  const intervalRef = useRef(null);

  const endTimeRef = useRef(null);

  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      if (mode === "stopwatch") {
        const elapsed = Math.floor(
          (Date.now() - startTimeRef.current) / 1000
        );

        setRemainingSeconds(elapsed);

        return;
      }

      const remaining = Math.max(
        0,
        Math.ceil((endTimeRef.current - Date.now()) / 1000)
      );

      setRemainingSeconds(remaining);

      if (remaining <= 0) {
        clearInterval(intervalRef.current);

        setRemainingSeconds(0);

        setIsRunning(false);

        setIsPaused(false);

        setCompleted(true);

        setSessionHistory((prev) => [
          {
            id: Date.now(),
            mode,
            duration,
            completed: true,
            date: new Date(),
          },
          ...prev,
        ]);

        endTimeRef.current = null;
      }
    }, 250);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode]);

  function start() {
    if (isRunning) return;

    if (mode === "stopwatch") {
      startTimeRef.current =
        Date.now() - remainingSeconds * 1000;
    } else {
      endTimeRef.current =
        Date.now() + remainingSeconds * 1000;
    }

    setCompleted(false);

    setIsPaused(false);

    setIsRunning(true);
  }

  function pause() {
    if (!isRunning) return;

    clearInterval(intervalRef.current);

    setIsPaused(true);

    setIsRunning(false);
  }


  function resume() {
    if (!isPaused) return;

    start();
  }

  function stop() {
    if (!isRunning && !isPaused) return;

    clearInterval(intervalRef.current);

    setIsRunning(false);

    setIsPaused(false);

    setCompleted(false);

    setRemainingSeconds(duration);

    if (mode === "stopwatch") {
      setLaps([]);
    }

    startTimeRef.current = null;

    endTimeRef.current = null
  }

  function saveLap() {
  if (mode !== "stopwatch") return;

  if (!isRunning) return;

  setLaps((prev) => {
    // Maximum 5 saved laps
    if (prev.length >= 5) {
      return prev;
    }

    return [
      ...prev,
      {
        id: Date.now(),
        number: prev.length + 1,
        time: remainingSeconds,
      },
    ];
  });
}

  function changeMode(newMode) {

    const newDuration =
      TIMER_MODES[newMode].duration;

    clearInterval(intervalRef.current);

    startTimeRef.current = null;

    endTimeRef.current = null;

    setMode(newMode);

    setDuration(newDuration);

    setRemainingSeconds(newDuration);

    setCompleted(false);

    setIsRunning(false);

    setIsPaused(false);
    
    setLaps([]);
  }

  function setCustomDuration(totalMinutes, autoStart = false) {
    const seconds = totalMinutes * 60;

    clearInterval(intervalRef.current);

    startTimeRef.current = null;

    setMode("custom");

    setDuration(seconds);

    setRemainingSeconds(seconds);

    setCompleted(false);

    setIsPaused(false);

    if (autoStart) {
      endTimeRef.current =
        Date.now() + seconds * 1000;

      setIsRunning(true);
    } else {
      endTimeRef.current = null;

      setIsRunning(false);
    }
  }

  const { minutes, seconds } =
    formatTime(remainingSeconds);

  const progress =
    mode === "stopwatch"
      ? 0
      : 1 - remainingSeconds / duration;

  return {
    mode,

    duration,

    remainingSeconds,

    minutes,

    seconds,

    progress,

    isRunning,

    isPaused,

    completed,

    sessionHistory,

    start,

    pause,

    resume,

    stop,

    changeMode,

    setCustomDuration,

    laps,

    saveLap,
  };
}