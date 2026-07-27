import {
  useEffect,
  useRef,
  useState,
} from "react";

import TimerModes from "../components/timer/TimerModes";
import TimerCircle from "../components/timer/TimerCircle";
import TimerControls from "../components/timer/TimerControls";
import AmbientControls from "../components/timer/AmbientControls";
import SessionHistory from "../components/timer/SessionHistory";
import CustomTimerModal from "../components/timer/CustomTimerModal";
import FocusCompleteModal from "../components/timer/FocusCompleteModal";
import SavedLaps from "../components/timer/SavedLaps";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { useFocusMode } from "../context/FocusModeContext";
import { useTimerContext } from "../context/TimerContext";


import useDocumentTitle from "../hooks/useDocumentTitle";
import useNotification from "../hooks/useNotification";
import useBeforeUnload from "../hooks/useBeforeUnload";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";

import {
  createStopwatchLap,
  startFocusSession,
  updateFocusSession,
} from "../services/focusService";


export default function Timer() {
  const timer = useTimerContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    isFocusMode,
    enterFocusMode,
    exitFocusMode,
  } = useFocusMode();


  const [
    showCustomModal,
    setShowCustomModal,
  ] = useState(false);

  const [
    historyRefreshKey,
    setHistoryRefreshKey,
  ] = useState(0);

  const [
    sessionRewards,
    setSessionRewards,
  ] = useState(null);


  // --------------------------------------------------
  // Current Django FocusSession
  // --------------------------------------------------

  const activeSessionId =
    useRef(null);


  // --------------------------------------------------
  // Focus duration tracking
  // --------------------------------------------------

  // Seconds accumulated before pauses.
  const focusedSeconds =
    useRef(0);

  // Timestamp when current active segment began.
  const focusStartedAt =
    useRef(null);


  // --------------------------------------------------
  // Stopwatch analytics tracking
  // --------------------------------------------------

  // Number of times Pause was pressed.
  const pauseCount =
    useRef(0);

  // Total focused seconds at previous lap.
  // Allows us to calculate individual lap duration.
  const lastLapFocusedSeconds =
    useRef(0);


  useDocumentTitle(timer);

  useNotification(
    timer.completed
  );

  useKeyboardShortcuts({
    timer,
    isFocusMode,
    exitFocusMode,
  });

  useBeforeUnload(
    timer.isRunning ||
    timer.isPaused
  );

  useEffect(() => {
    const requestedMode =
      searchParams.get("mode");

    const allowedModes = [
      "pomodoro",
      "deep-work",
      "stopwatch",
    ];

    if (
      !requestedMode ||
      !allowedModes.includes(requestedMode)
    ) {
      return;
    }

    // Never switch mode while a session
    // is already active.
    if (
      timer.isRunning ||
      timer.isPaused
    ) {
      return;
    }

    if (timer.mode === requestedMode) {
      return;
    }

    timer.clearActiveTask();
    timer.changeMode(requestedMode);

  }, [searchParams,
    timer.mode,
    timer.isRunning,
    timer.isPaused,
  ]);

  const MODE_LABELS = {
    pomodoro:
      "Pomodoro",

    "deep-work":
      "Deep Work",

    stopwatch:
      "Stopwatch",

    custom:
      "Custom Session",
  };


  // ==================================================
  // START SESSION
  // ==================================================

  async function handleStart() {
    try {
      setSessionRewards(null);

      const result =
        await startFocusSession({
          mode:
            timer.mode,

          planned_duration:
            timer.mode ===
              "stopwatch"
              ? null
              : timer.duration,

          // Attach Planner task when
          // timer originated from Planner.
          task:
            timer.activeTask?.id ||
            null,
        });


      activeSessionId.current =
        result.session.id;


      // Reset tracking for new session.

      focusedSeconds.current = 0;

      pauseCount.current = 0;

      lastLapFocusedSeconds.current =
        0;

      focusStartedAt.current =
        Date.now();


      timer.start();

    } catch (error) {
      console.error(
        "Unable to start focus session:",
        error
      );
    }
  }


  // ==================================================
  // PAUSE
  // ==================================================

  function handlePause() {

    // Save focused time from the
    // current uninterrupted segment.

    if (focusStartedAt.current) {
      focusedSeconds.current +=
        Math.floor(
          (
            Date.now() -
            focusStartedAt.current
          ) / 1000
        );

      focusStartedAt.current =
        null;
    }


    // Every explicit Pause click counts
    // as one pause for analytics.

    pauseCount.current += 1;


    timer.pause();
  }


  // ==================================================
  // RESUME
  // ==================================================

  function handleResume() {
    focusStartedAt.current =
      Date.now();

    timer.resume();
  }


  // ==================================================
  // SAVE STOPWATCH LAP
  // ==================================================

  async function handleSaveLap() {

    // Laps are persisted only for
    // active Stopwatch sessions.

    if (
      timer.mode !== "stopwatch" ||
      !activeSessionId.current
    ) {
      return;
    }


    // Calculate total focused Stopwatch
    // time so far, excluding paused time.

    let totalFocused =
      focusedSeconds.current;


    if (focusStartedAt.current) {
      totalFocused +=
        Math.floor(
          (
            Date.now() -
            focusStartedAt.current
          ) / 1000
        );
    }


    // Individual lap duration =
    // current total - previous lap total.

    const lapDuration =
      totalFocused -
      lastLapFocusedSeconds.current;


    // Prevent zero-second laps.

    if (lapDuration <= 0) {
      return;
    }


    try {

      // Save lap in Django.

      await createStopwatchLap(
        activeSessionId.current,
        lapDuration
      );


      // Remember where this lap ended.

      lastLapFocusedSeconds.current =
        totalFocused;


      // Keep existing frontend
      // SavedLaps UI working.

      timer.saveLap();

    } catch (error) {
      console.error(
        "Unable to save stopwatch lap:",
        error
      );
    }
  }


  // ==================================================
  // STOP SESSION MANUALLY
  // ==================================================

  async function handleStop() {

    let totalFocused =
      focusedSeconds.current;


    if (focusStartedAt.current) {
      totalFocused +=
        Math.floor(
          (
            Date.now() -
            focusStartedAt.current
          ) / 1000
        );
    }


    // --------------------------------------------------
    // Persist session
    // --------------------------------------------------

    if (activeSessionId.current) {

      try {
        await updateFocusSession(
          activeSessionId.current,
          {
            actual_duration:
              totalFocused,

            pause_count:
              pauseCount.current,

            completed:
              false,

            ended:
              true,
          }
        );


        setHistoryRefreshKey(
          (current) =>
            current + 1
        );

      } catch (error) {
        console.error(
          "Unable to save focus session:",
          error
        );
      }
    }


    // --------------------------------------------------
    // Reset session tracking
    // --------------------------------------------------

    activeSessionId.current =
      null;

    focusedSeconds.current =
      0;

    focusStartedAt.current =
      null;

    pauseCount.current =
      0;

    lastLapFocusedSeconds.current =
      0;


    timer.stop();


    // Prevent next normal timer from
    // inheriting Planner task.

    timer.clearActiveTask();


    if (isFocusMode) {
      exitFocusMode();
    }
  }


  // ==================================================
  // AUTOMATIC TIMER COMPLETION
  // ==================================================

  useEffect(() => {

    if (!timer.completed) {
      return;
    }


    const sessionId =
      activeSessionId.current;


    if (!sessionId) {
      return;
    }


    // Clear immediately so this effect
    // cannot complete the same session twice.

    activeSessionId.current =
      null;


    async function completeSession() {

      let totalFocused =
        focusedSeconds.current;


      if (focusStartedAt.current) {
        totalFocused +=
          Math.floor(
            (
              Date.now() -
              focusStartedAt.current
            ) / 1000
          );
      }


      const actualDuration =
        Math.min(
          totalFocused,
          timer.duration
        );


      try {
        const result =
          await updateFocusSession(
            sessionId,
            {
              actual_duration:
                actualDuration,

              pause_count:
                pauseCount.current,

              completed:
                true,

              ended:
                true,
            }
          );


        setSessionRewards(
          result.rewards
        );


        setHistoryRefreshKey(
          (current) =>
            current + 1
        );

      } catch (error) {
        console.error(
          "Unable to complete focus session:",
          error
        );

      } finally {

        focusedSeconds.current =
          0;

        focusStartedAt.current =
          null;

        pauseCount.current =
          0;

        lastLapFocusedSeconds.current =
          0;
      }
    }


    completeSession();

  }, [
    timer.completed,
    timer.duration,
  ]);


  // ==================================================
  // UI
  // ==================================================

  return (
    <div
      className={
        isFocusMode
          ? "flex h-full w-full items-center justify-center"
          : "mx-auto max-w-7xl px-8 py-8"
      }
    >

      {/* Timer modes */}

      {!isFocusMode && (
        <TimerModes
          activeMode={
            timer.mode
          }

          onModeChange={(mode) => {

            if (
              timer.isRunning ||
              timer.isPaused
            ) {
              alert(
                "Please stop your current session first."
              );

              return;
            }


            if (
              mode === "custom"
            ) {

              timer.clearActiveTask();

              setShowCustomModal(
                true
              );

              return;
            }


            timer.clearActiveTask();

            timer.changeMode(
              mode
            );
          }}
        />
      )}


      <div
        className={
          isFocusMode
            ? "flex flex-col items-center justify-center gap-10"
            : "mt-10 grid gap-10 xl:grid-cols-[1fr_320px]"
        }
      >

        <div className="flex flex-col items-center justify-center gap-10">

          <TimerCircle
            minutes={
              timer.minutes
            }

            seconds={
              timer.seconds
            }

            progress={
              timer.mode ===
                "stopwatch"
                ? 1
                : timer.progress
            }

            remainingSeconds={
              timer.remainingSeconds
            }

            modeLabel={
              MODE_LABELS[
              timer.mode
              ]
            }
          />


          <TimerControls
            isRunning={
              timer.isRunning
            }

            isPaused={
              timer.isPaused
            }

            isFocusMode={
              isFocusMode
            }

            mode={
              timer.mode
            }

            lapCount={
              timer.laps.length
            }

            onStart={
              handleStart
            }

            onPause={
              handlePause
            }

            onResume={
              handleResume
            }

            onSaveLap={
              handleSaveLap
            }

            onStop={
              handleStop
            }

            onFullscreen={() => {

              if (isFocusMode) {
                exitFocusMode();
              } else {
                enterFocusMode();
              }

            }}
          />


          {/* Stopwatch laps */}

          {timer.mode ===
            "stopwatch" &&
            timer.laps.length >
            0 && (

              <SavedLaps
                laps={
                  timer.laps
                }
              />

            )}


          <AmbientControls />

        </div>


        {!isFocusMode && (
          <SessionHistory
            refreshKey={
              historyRefreshKey
            }
          />
        )}

      </div>


      {/* Custom timer */}

      <CustomTimerModal
        open={
          showCustomModal
        }

        onClose={() =>
          setShowCustomModal(
            false
          )
        }

        onStart={(minutes) => {

          timer.setCustomDuration(
            minutes,
            false
          );

          setShowCustomModal(
            false
          );

        }}
      />


      {/* Completion modal */}

      <FocusCompleteModal
        open={
          timer.completed
        }

        rewards={
          sessionRewards
        }


        onDashboard={() => {

          timer.stop();

          timer.clearActiveTask();


          if (isFocusMode) {
            exitFocusMode();
          }


          navigate(
            "/dashboard"
          );

        }}


        onBreak={() => {

          timer.stop();

          timer.clearActiveTask();


          if (isFocusMode) {
            exitFocusMode();
          }


          timer.changeMode(
            "pomodoro"
          );

        }}
      />

    </div>
  );
}