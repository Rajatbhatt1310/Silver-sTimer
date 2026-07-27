import {
  useEffect,
  useState,
} from "react";

import {
  Trophy,
  Medal,
  Flame,
} from "lucide-react";

import LeaderboardHeader from "../components/leaderboard/LeaderboardHeader";
import LeaderboardEmptyState from "../components/leaderboard/LeaderboardEmptyState";

import {
  getLeaderboard,
} from "../services/leaderboardService";


// --------------------------------------------------
// Periods
// --------------------------------------------------

const PERIODS = [
  {
    value: "weekly",
    label: "Weekly",
  },
  {
    value: "monthly",
    label: "Monthly",
  },
  {
    value: "all_time",
    label: "All Time",
  },
];


// --------------------------------------------------
// Helpers
// --------------------------------------------------

function getInitials(name) {
  if (!name) {
    return "?";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase()
    )
    .join("");
}


function formatFocusTime(minutes = 0) {
  const hours =
    Math.floor(minutes / 60);

  const remainingMinutes =
    minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}


function RankIcon({ rank }) {
  if (rank === 1) {
    return (
      <Trophy
        size={18}
        className="text-amber-400"
      />
    );
  }

  if (rank === 2) {
    return (
      <Medal
        size={18}
        className="text-zinc-300"
      />
    );
  }

  if (rank === 3) {
    return (
      <Medal
        size={18}
        className="text-amber-700"
      />
    );
  }

  return (
    <span className="text-sm font-semibold text-[var(--color-text-subtle)]">
      #{rank}
    </span>
  );
}


// --------------------------------------------------
// Page
// --------------------------------------------------

export default function Leaderboard() {
  const [period, setPeriod] =
    useState("weekly");

  const [leaderboard, setLeaderboard] =
    useState([]);

  const [currentUser, setCurrentUser] =
    useState(null);

  const [periodLabel, setPeriodLabel] =
    useState("This Week");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // --------------------------------------------------
  // Load leaderboard
  // --------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    async function loadLeaderboard() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getLeaderboard(
            period
          );

        if (cancelled) {
          return;
        }

        setLeaderboard(
          data.top_users || []
        );

        setCurrentUser(
          data.current_user || null
        );

        setPeriodLabel(
          data.period_label || ""
        );

      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Unable to load leaderboard:",
          error
        );

        setError(
          "Unable to load leaderboard."
        );

        setLeaderboard([]);
        setCurrentUser(null);

      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadLeaderboard();

    return () => {
      cancelled = true;
    };

  }, [period]);


  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">

      <LeaderboardHeader />


      {/* Period / Heading */}

      <div className="mt-8 flex items-center justify-between gap-6">

        <div>
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
            Global Rankings
          </h2>

          <p className="mt-1 text-xs text-[var(--color-text-subtle)]">
            Ranked by XP earned during{" "}
            {periodLabel.toLowerCase()}
          </p>
        </div>


        {/* Period Tabs */}

        <div className="flex items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-1">

          {PERIODS.map((item) => {

            const active =
              period === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  setPeriod(
                    item.value
                  )
                }
                className={[
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200",

                  active
                    ? "bg-[var(--color-primary-dim)] text-[var(--color-primary-light)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]",

                ].join(" ")}
              >
                {item.label}
              </button>
            );
          })}

        </div>

      </div>


      {/* Error */}

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}


      {/* Loading */}

      {loading && (
        <div className="py-20 text-center text-sm text-[var(--color-text-muted)]">
          Loading leaderboard...
        </div>
      )}


      {/* Empty */}

      {!loading &&
        !error &&
        leaderboard.length === 0 && (

          <div className="mt-6">

            <LeaderboardEmptyState />

            {currentUser && (
              <div className="mt-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-5 py-4">

                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                  You haven't earned XP during{" "}
                  {periodLabel.toLowerCase()} yet.
                </p>

                <p className="mt-1 text-xs text-[var(--color-text-subtle)]">
                  Complete a focus session to enter the ranking.
                </p>

              </div>
            )}

          </div>
        )}


      {/* Leaderboard */}

      {!loading &&
        !error &&
        leaderboard.length > 0 && (

          <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]">


            {/* Table Header */}

            <div className="grid grid-cols-[70px_1fr_100px_110px_120px_100px] items-center border-b border-[var(--color-border)] px-5 py-3 text-xs font-medium uppercase tracking-wide text-[var(--color-text-subtle)]">

              <span>
                Rank
              </span>

              <span>
                User
              </span>

              <span className="text-right">
                Level
              </span>

              <span className="text-right">
                Streak
              </span>

              <span className="text-right">
                Focus
              </span>

              <span className="text-right">
                XP
              </span>

            </div>


            {/* Users */}

            {leaderboard.map(
              (entry) => (

                <div
                  key={entry.user_id}
                  className={[
                    "grid grid-cols-[70px_1fr_100px_110px_120px_100px] items-center px-5 py-4",
                    "border-b border-[var(--color-border)] last:border-b-0",
                    "transition-colors duration-150",

                    entry.is_current_user
                      ? "bg-[var(--color-primary-dim)]"
                      : "hover:bg-white/[0.025]",

                  ].join(" ")}
                >

                  {/* Rank */}

                  <div className="flex items-center">

                    <RankIcon
                      rank={entry.rank}
                    />

                  </div>


                  {/* User */}

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-white/[0.04] text-xs font-semibold text-[var(--color-text-primary)]">

                      {getInitials(
                        entry.name
                      )}

                    </div>


                    <div className="min-w-0">

                      <div className="flex items-center gap-2">

                        <span className="truncate text-sm font-medium text-[var(--color-text-primary)]">
                          {entry.name}
                        </span>


                        {entry.is_current_user && (

                          <span className="rounded-md bg-[var(--color-primary-dim)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-primary-light)]">
                            YOU
                          </span>

                        )}

                      </div>


                      <span className="block truncate text-xs text-[var(--color-text-subtle)]">
                        @{entry.username}
                      </span>

                    </div>

                  </div>


                  {/* Level */}

                  <span className="text-right text-sm text-[var(--color-text-muted)]">
                    {entry.level}
                  </span>


                  {/* Streak */}

                  <div className="flex items-center justify-end gap-1.5 text-sm text-[var(--color-text-muted)]">

                    <Flame
                      size={14}
                      className={
                        entry.streak > 0
                          ? "text-amber-400"
                          : "text-[var(--color-text-subtle)]"
                      }
                    />

                    {entry.streak}

                  </div>


                  {/* Focus */}

                  <span className="text-right text-sm text-[var(--color-text-muted)]">
                    {formatFocusTime(
                      entry.study_minutes
                    )}
                  </span>


                  {/* XP */}

                  <span className="text-right text-sm font-semibold text-[var(--color-primary-light)]">
                    {Number(
                      entry.xp || 0
                    ).toLocaleString()}
                  </span>

                </div>

              )
            )}

          </div>
        )}


      {/* Current User Rank */}

      {!loading &&
        !error &&
        currentUser && (

          <div className="mt-5 flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-5 py-4">

            <div>

              <p className="text-xs font-medium text-[var(--color-text-subtle)]">
                Your {periodLabel} Rank
              </p>

              <p className="mt-1 text-xl font-bold text-[var(--color-text-primary)]">

                {currentUser.rank
                  ? `#${currentUser.rank}`
                  : "Unranked"}

              </p>

            </div>


            <div className="text-right">

              <p className="text-sm font-semibold text-[var(--color-primary-light)]">
                {Number(
                  currentUser.xp || 0
                ).toLocaleString()}{" "}
                XP
              </p>

              <p className="mt-1 text-xs text-[var(--color-text-subtle)]">
                Level {currentUser.level}
              </p>

            </div>

          </div>

        )}

    </div>
  );
}