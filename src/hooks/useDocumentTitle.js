import { useEffect } from "react";

export default function useDocumentTitle(timer) {
  useEffect(() => {
    if (timer.completed) {
      document.title = "🎉 Session Complete";
      return;
    }

    if (timer.isPaused) {
      document.title = "Paused • Silver's Timer";
      return;
    }

    if (timer.isRunning) {
      document.title = `${timer.minutes}:${timer.seconds} • Silver's Timer`;
      return;
    }

    document.title = "Silver's Timer";
  }, [
    timer.minutes,
    timer.seconds,
    timer.isRunning,
    timer.isPaused,
    timer.completed,
  ]);
}