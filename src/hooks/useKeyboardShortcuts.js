import { useEffect } from "react";

export default function useKeyboardShortcuts({
  timer,
  isFocusMode,
  exitFocusMode,
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      // Ignore typing inside inputs
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();

        if (timer.isRunning) {
          timer.pause();
        } else if (timer.isPaused) {
          timer.resume();
        } else {
          timer.start();
        }
      }

      if (e.key === "Escape" && isFocusMode) {
        exitFocusMode();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [timer, isFocusMode, exitFocusMode]);
}