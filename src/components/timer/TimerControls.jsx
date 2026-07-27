import {
  Play,
  Pause,
  Square,
  Maximize2,
  Minimize2,
  Flag,
} from "lucide-react";

export default function TimerControls({
  isRunning = false,
  isPaused = false,
  isFocusMode = false,
  mode,
  lapCount = 0,

  onStart,
  onPause,
  onResume,
  onStop,
  onSaveLap,

  onFullscreen,
}) {
  const isStopwatch = mode === "stopwatch";

  return (
    <div className="flex items-center justify-center gap-4">

      {(isRunning || isPaused) && (
        <button
          onClick={onStop}
          className="
            flex
            h-12
            w-36
            items-center
            justify-center
            gap-2
            rounded-2xl
            border
            border-red-500/20
            bg-red-500/10
            text-red-400
            transition-all
            hover:bg-red-500/20
          "
        >
          <Square size={17} />
          Stop
        </button>
      )}

      <button
        onClick={
          isRunning
            ? onPause
            : isPaused
            ? onResume
            : onStart
        }
        className="
          flex
          h-12
          w-40
          items-center
          justify-center
          gap-2
          rounded-2xl
          bg-emerald-500
          font-semibold
          text-black
          transition-all
          hover:brightness-110
        "
      >
        {isRunning ? (
          <>
            <Pause size={18} />
            Pause
          </>
        ) : isPaused ? (
          <>
            <Play size={18} />
            Resume
          </>
        ) : (
          <>
            <Play size={18} />
            Start
          </>
        )}
      </button>

      {isStopwatch && isRunning && lapCount < 5 && (
        <button
          onClick={onSaveLap}
          className="
            flex
            h-12
            w-36
            items-center
            justify-center
            gap-2
            rounded-2xl
            border
            border-emerald-500/20
            bg-emerald-500/10
            text-emerald-400
            transition-all
            hover:bg-emerald-500/20
          "
        >
          <Flag size={17} />
          Save Lap
        </button>
      )}

      <button
        onClick={onFullscreen}
        className="
          flex
          h-12
          w-40
          items-center
          justify-center
          gap-2
          rounded-2xl
          border
          border-white/5
          bg-white/[0.03]
          text-white
          transition-all
          hover:bg-white/[0.06]
        "
      >
        {isFocusMode ? (
          <>
            <Minimize2 size={17} />
            Exit Focus
          </>
        ) : (
          <>
            <Maximize2 size={17} />
            Focus Mode
          </>
        )}
      </button>

    </div>
  );
}