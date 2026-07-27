import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Clock3 } from "lucide-react";

import {
  getFocusSessions,
} from "../../services/focusService";


const MODE_LABELS = {
  pomodoro: "Pomodoro",
  "deep-work": "Deep Work",
  custom: "Custom Session",
  stopwatch: "Stopwatch",
};


function formatDuration(seconds) {
  if (!seconds) {
    return "0 min";
  }

  const hours = Math.floor(
    seconds / 3600
  );

  const minutes = Math.floor(
    (seconds % 3600) / 60
  );

  const remainingSeconds =
    seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes} min`;
  }

  return `${remainingSeconds} sec`;
}


function formatTime(dateString) {
  return new Date(
    dateString
  ).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}


function isToday(dateString) {
  const date = new Date(dateString);
  const today = new Date();

  return (
    date.getFullYear() ===
    today.getFullYear() &&
    date.getMonth() ===
    today.getMonth() &&
    date.getDate() ===
    today.getDate()
  );
}

export default function SessionHistory({
  refreshKey,
}) {
  const [sessions, setSessions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadSessions() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getFocusSessions();

        setSessions(data.sessions || []);
      } catch (err) {
        console.error(
          "Unable to load focus sessions:",
          err
        );

        setError(
          "Unable to load sessions."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSessions();
  }, [refreshKey]);


  const todaysSessions =
    useMemo(() => {
      return sessions.filter(
        (session) =>
          session.ended_at &&
          isToday(
            session.started_at
          )
      );
    }, [sessions]);


  const totalFocus =
    useMemo(() => {
      return todaysSessions.reduce(
        (total, session) =>
          total +
          (
            session.actual_duration ||
            0
          ),
        0
      );
    }, [todaysSessions]);


  return (
    <div
      className="
        w-full
        rounded-3xl
        border
        border-[var(--color-border)]
        bg-[var(--color-card)]
        p-6
      "
    >
      <div className="mb-5 flex items-center gap-2">
        <Clock3 size={18} />

        <h3 className="text-lg font-semibold">
          Today's Sessions
        </h3>
      </div>


      {loading && (
        <p className="text-sm text-zinc-500">
          Loading sessions...
        </p>
      )}


      {!loading && error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}


      {!loading &&
        !error &&
        todaysSessions.length ===
        0 && (
          <div className="py-6 text-center">
            <p className="text-sm text-zinc-500">
              No focus sessions yet today.
            </p>
          </div>
        )}


      {!loading &&
        !error &&
        todaysSessions.length >
        0 && (
          <div className="space-y-4">

            {todaysSessions.map(
              (session) => (
                <div
                  key={
                    session.id
                  }
                  className="
                    rounded-2xl
                    border
                    border-white/5
                    bg-white/[0.03]
                    p-4
                  "
                >
                  <div className="flex items-center justify-between">

                    <span className="font-medium">
                      {session.task_title ||
                        MODE_LABELS[
                        session.mode
                        ] ||
                        session.mode}
                    </span>

                    <span className="text-sm text-zinc-500">
                      {formatDuration(
                        session.actual_duration
                      )}
                    </span>

                  </div>


                  {session.task_title && (
                    <p className="mt-1 text-xs text-zinc-600">
                      {
                        MODE_LABELS[
                        session.mode
                        ]
                      }
                    </p>
                  )}


                  <p className="mt-2 text-sm text-zinc-500">
                    {formatTime(
                      session.started_at
                    )}
                  </p>

                </div>
              )
            )}

          </div>
        )}


      <div className="mt-6 border-t border-white/5 pt-4">

        <div className="flex justify-between">

          <span>
            Total Focus
          </span>

          <span className="font-semibold text-emerald-400">
            {formatDuration(
              totalFocus
            )}
          </span>

        </div>

      </div>

    </div>
  );
}