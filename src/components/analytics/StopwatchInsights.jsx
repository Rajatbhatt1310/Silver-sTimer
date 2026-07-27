import {
  CheckCircle2,
  Clock3,
  Gauge,
  LockKeyhole,
  Pause,
  TimerReset,
} from "lucide-react";


function formatSeconds(seconds = 0) {
  const safeSeconds =
    Math.max(
      0,
      Math.round(seconds)
    );

  if (safeSeconds < 60) {
    return `${safeSeconds}s`;
  }

  const minutes =
    Math.floor(
      safeSeconds / 60
    );

  const remainingSeconds =
    safeSeconds % 60;

  if (minutes < 60) {
    if (remainingSeconds === 0) {
      return `${minutes}m`;
    }

    return (
      `${minutes}m ${remainingSeconds}s`
    );
  }

  const hours =
    Math.floor(
      minutes / 60
    );

  const remainingMinutes =
    minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return (
    `${hours}h ${remainingMinutes}m`
  );
}


export default function StopwatchInsights({
  tracker,
  analysis,
}) {
  if (!tracker) {
    return null;
  }


  const unlocked =
    tracker.unlocked;

  const progress =
    tracker.progress_percent || 0;


  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border border-white/[0.07]
        bg-white/[0.025]
      "
    >
      <div className="p-6">

        {/* Header */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

          <div className="flex items-start gap-3">

            <div
              className="
                flex h-10 w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-emerald-500/10
                text-emerald-400
              "
            >
              <TimerReset size={19} />
            </div>


            <div>

              <div className="flex items-center gap-2">

                <h2 className="font-semibold text-white">
                  Stopwatch Insights
                </h2>


                {!unlocked && (
                  <LockKeyhole
                    size={13}
                    className="text-zinc-600"
                  />
                )}

              </div>


              <p className="mt-1 text-sm text-zinc-500">
                {unlocked
                  ? "Your stopwatch patterns are ready."
                  : "Learning how you use the stopwatch."}
              </p>

            </div>

          </div>


          <div
            className={`
              rounded-full
              border
              px-3 py-1.5
              text-xs
              font-medium
              ${
                unlocked
                  ? `
                      border-emerald-500/20
                      bg-emerald-500/10
                      text-emerald-400
                    `
                  : `
                      border-white/[0.07]
                      bg-white/[0.03]
                      text-zinc-400
                    `
              }
            `}
          >
            {unlocked
              ? "Insights Ready"
              : `${tracker.tracked.sessions} / ${tracker.requirements.sessions}`}
          </div>

        </div>


        {/* Learning state */}

        {!unlocked && (
          <>

            <div className="mt-7">

              <div className="mb-2 flex items-center justify-between">

                <span className="text-xs text-zinc-500">
                  Stopwatch learning progress
                </span>

                <span className="text-xs font-medium text-zinc-300">
                  {progress}%
                </span>

              </div>


              <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">

                <div
                  className="
                    h-full
                    rounded-full
                    bg-emerald-500
                    transition-all
                    duration-500
                  "
                  style={{
                    width:
                      `${progress}%`,
                  }}
                />

              </div>

            </div>


            <div
              className="
                mt-6
                rounded-xl
                border border-white/[0.06]
                bg-white/[0.02]
                p-4
              "
            >
              <div className="flex items-start gap-3">

                <Clock3
                  size={17}
                  className="mt-0.5 shrink-0 text-zinc-500"
                />

                <div>

                  <p className="text-sm font-medium text-zinc-300">
                    {tracker.remaining.sessions === 1
                      ? "1 more session needed"
                      : `${tracker.remaining.sessions} more sessions needed`}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    Stopwatch sessions lasting at least{" "}
                    {
                      tracker.requirements
                        .minimum_session_seconds
                    }{" "}
                    seconds count toward your analysis.
                  </p>

                </div>

              </div>
            </div>

          </>
        )}


        {/* Unlocked analysis */}

        {unlocked && (
          <StopwatchAnalysis
            analysis={analysis}
          />
        )}

      </div>
    </div>
  );
}


function StopwatchAnalysis({
  analysis,
}) {
  if (
    !analysis?.available ||
    !analysis?.insights
  ) {
    return (
      <div
        className="
          mt-7
          rounded-xl
          border border-white/[0.06]
          bg-white/[0.02]
          p-5
        "
      >
        <p className="text-sm text-zinc-500">
          Preparing your stopwatch insights...
        </p>
      </div>
    );
  }


  const insights =
    analysis.insights;

  const laps =
    insights.lap_analysis;


  return (
    <div className="mt-7">

      {/* Main stopwatch metrics */}

      <div className="grid gap-3 md:grid-cols-3">

        <MetricCard
          icon={Clock3}
          label="Average Session"
          value={
            formatSeconds(
              insights.average_session_seconds
            )
          }
          description="Average stopwatch focus time"
        />


        <MetricCard
          icon={Pause}
          label="Average Pauses"
          value={
            insights
              .average_pauses_per_session
          }
          description="Pauses per stopwatch session"
        />


        <MetricCard
          icon={Gauge}
          label="Sessions Analyzed"
          value={
            insights.sessions_analyzed
          }
          description="Valid stopwatch sessions"
        />

      </div>


      {/* Lap analysis */}

      <div className="mt-7">

        <div className="mb-3">

          <h3 className="text-sm font-medium text-white">
            Lap Analysis
          </h3>

          <p className="mt-1 text-xs text-zinc-500">
            Your pace when using laps during stopwatch sessions.
          </p>

        </div>


        {laps?.available ? (
          <>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

              <SmallMetric
                label="Average Laps"
                value={
                  laps.average_laps_per_session
                }
              />

              <SmallMetric
                label="Average Lap"
                value={
                  formatSeconds(
                    laps.average_lap_seconds
                  )
                }
              />

              <SmallMetric
                label="Fastest Lap"
                value={
                  formatSeconds(
                    laps.fastest_lap_seconds
                  )
                }
              />

              <SmallMetric
                label="Slowest Lap"
                value={
                  formatSeconds(
                    laps.slowest_lap_seconds
                  )
                }
              />

            </div>


            <div
              className="
                mt-3
                flex items-center gap-2
                text-xs text-zinc-600
              "
            >
              <CheckCircle2
                size={13}
                className="text-emerald-400"
              />

              Laps used in{" "}
              {laps.sessions_with_laps} of{" "}
              {insights.sessions_analyzed} analyzed sessions
              {" "}·{" "}
              {laps.total_laps} total laps

            </div>

          </>
        ) : (

          <div
            className="
              rounded-xl
              border border-white/[0.06]
              bg-white/[0.02]
              p-5
            "
          >
            <p className="text-sm font-medium text-zinc-300">
              No lap data yet
            </p>

            <p className="mt-1 text-xs leading-5 text-zinc-500">
              Try using Laps while solving questions
              to start tracking your pace.
            </p>
          </div>

        )}

      </div>

    </div>
  );
}


function MetricCard({
  icon: Icon,
  label,
  value,
  description,
}) {
  return (
    <div
      className="
        rounded-xl
        border border-white/[0.06]
        bg-white/[0.02]
        p-4
      "
    >
      <Icon
        size={16}
        className="text-emerald-400"
      />

      <p className="mt-4 text-xs text-zinc-500">
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-zinc-600">
        {description}
      </p>
    </div>
  );
}


function SmallMetric({
  label,
  value,
}) {
  return (
    <div
      className="
        rounded-xl
        border border-white/[0.06]
        bg-white/[0.02]
        p-4
      "
    >
      <p className="text-xs text-zinc-500">
        {label}
      </p>

      <p className="mt-2 text-base font-semibold text-white">
        {value}
      </p>
    </div>
  );
}