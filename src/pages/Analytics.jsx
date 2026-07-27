import {
  useEffect,
  useState,
} from "react";

import {
  BrainCircuit,
  Clock3,
  CalendarDays,
  Timer,
  LockKeyhole,
  CheckCircle2,
} from "lucide-react";

import StopwatchInsights from "../components/analytics/StopwatchInsights";
import AnalyticsHeader from "../components/analytics/AnalyticsHeader";
import AnalyticsStats from "../components/analytics/AnalyticsStats";
import FocusChart from "../components/analytics/FocusChart";
import ProductivityChart from "../components/analytics/ProductivityChart";
import CategoryBreakdown from "../components/analytics/CategoryBreakdown";

import {
  getAnalytics,
  getStopwatchAnalysis,
  getStopwatchStatus,
  getTrackerAnalysis,
  getTrackerStatus,
} from "../services/analyticsService";


export default function Analytics() {
  const [
    stopwatchTracker,
    setStopwatchTracker,
  ] = useState(null);

  const [
    stopwatchAnalysis,
    setStopwatchAnalysis,
  ] = useState(null);

  const [
    trackerAnalysis,
    setTrackerAnalysis,
  ] = useState(null);

  const [
    analytics,
    setAnalytics,
  ] = useState(null);

  const [
    tracker,
    setTracker,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");


  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        setError("");

        const [
          analyticsResult,
          trackerResult,
          stopwatchResult,
        ] = await Promise.all([
          getAnalytics(),
          getTrackerStatus(),
          getStopwatchStatus(),
        ]);


        setAnalytics(
          analyticsResult
        );

        setTracker(
          trackerResult
        );

        setStopwatchTracker(
          stopwatchResult
        );


        // ------------------------------------------
        // Silver's Tracker analysis
        // ------------------------------------------

        if (trackerResult.unlocked) {
          const analysisResult =
            await getTrackerAnalysis();

          setTrackerAnalysis(
            analysisResult
          );
        } else {
          setTrackerAnalysis(
            null
          );
        }


        // ------------------------------------------
        // Stopwatch analysis
        // ------------------------------------------

        if (stopwatchResult.unlocked) {
          const stopwatchAnalysisResult =
            await getStopwatchAnalysis();

          setStopwatchAnalysis(
            stopwatchAnalysisResult
          );
        } else {
          setStopwatchAnalysis(
            null
          );
        }

      } catch (err) {
        console.error(
          "Unable to load analytics:",
          err
        );

        setError(
          "Unable to load analytics."
        );

      } finally {
        setLoading(false);
      }
    }


    loadAnalytics();
  }, []);


  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-8 py-10 text-sm text-zinc-500">
        Loading analytics...
      </div>
    );
  }


  if (
    error ||
    !analytics ||
    !tracker ||
    !stopwatchTracker
  ) {
    return (
      <div className="mx-auto max-w-7xl px-8 py-10">

        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error ||
            "Analytics unavailable."}
        </div>

      </div>
    );
  }


  return (
    <div className="mx-auto max-w-7xl px-8 py-10">

      <AnalyticsHeader />


      {/* Main statistics */}

      <div className="mt-8">

        <AnalyticsStats
          stats={
            analytics.stats
          }
        />

      </div>


      {/* Silver's Tracker */}

      <div className="mt-6">

        <TrackerPanel
          tracker={
            tracker
          }
          analysis={
            trackerAnalysis
          }
        />

      </div>


      {/* Charts */}

      <div className="mt-6 grid gap-6 xl:grid-cols-2">

        <FocusChart
          data={
            analytics.focusData ||
            []
          }
        />

        <ProductivityChart
          data={
            analytics.productivityData ||
            []
          }
        />

      </div>


      {/* Category breakdown */}

      <div className="mt-6">

        <CategoryBreakdown
          data={
            analytics.categoryData ||
            []
          }
        />

      </div>


      {/* Stopwatch Insights */}

      <div className="mt-6">

        <StopwatchInsights
          tracker={
            stopwatchTracker
          }
          analysis={
            stopwatchAnalysis
          }
        />

      </div>

    </div>
  );
}


// ==================================================
// SILVER'S TRACKER PANEL
// ==================================================

function TrackerPanel({
  tracker,
  analysis,
}) {
  const progress =
    tracker.progress_percent || 0;

  const unlocked =
    tracker.unlocked;


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
              <BrainCircuit
                size={19}
              />
            </div>


            <div>

              <div className="flex items-center gap-2">

                <h2 className="font-semibold text-white">
                  Silver's Tracker
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
                  ? "Your productivity profile is ready."
                  : "Learning your productivity patterns."}

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
              ? "Tracker Ready"
              : `${progress}% learned`}

          </div>

        </div>


        {/* Learning progress */}

        {!unlocked && (
          <>

            <div className="mt-7">

              <div className="mb-2 flex items-center justify-between">

                <span className="text-xs text-zinc-500">
                  Learning progress
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


            {/* Requirements */}

            <div className="mt-7 grid gap-3 sm:grid-cols-3">

              <TrackerMetric
                icon={
                  Clock3
                }
                value={`${tracker.tracked.hours} / ${tracker.requirements.hours}h`}
                label="Focus Time"
                complete={
                  tracker.remaining.hours <=
                  0
                }
              />


              <TrackerMetric
                icon={
                  Timer
                }
                value={`${tracker.tracked.sessions} / ${tracker.requirements.sessions}`}
                label="Sessions"
                complete={
                  tracker.remaining
                    .sessions <= 0
                }
              />


              <TrackerMetric
                icon={
                  CalendarDays
                }
                value={`${tracker.tracked.active_days} / ${tracker.requirements.active_days}`}
                label="Active Days"
                complete={
                  tracker.remaining
                    .active_days <= 0
                }
              />

            </div>


            <div
              className="
                mt-6
                rounded-xl
                border border-white/[0.05]
                bg-black/10
                px-4 py-3
              "
            >

              <p className="text-xs leading-5 text-zinc-500">

                Complete focused sessions and
                Silver's Tracker will learn when
                and how you work most effectively.
                Sessions under{" "}
                {
                  tracker.requirements
                    .minimum_session_minutes
                }{" "}
                minutes aren't used for behavioral
                analysis.

              </p>

            </div>

          </>
        )}


        {/* Unlocked */}

        {unlocked && (
          <>

            <div
              className="
                mt-7
                rounded-xl
                border border-emerald-500/15
                bg-emerald-500/[0.05]
                p-5
              "
            >

              <div className="flex items-start gap-3">

                <CheckCircle2
                  size={19}
                  className="mt-0.5 shrink-0 text-emerald-400"
                />


                <div>

                  <p className="text-sm font-medium text-white">
                    Productivity profile ready
                  </p>

                  <p className="mt-1 text-sm leading-6 text-zinc-500">
                    Silver's Tracker has enough
                    focus history to begin analyzing
                    your productive hours, task
                    patterns, and session behavior.
                  </p>

                </div>

              </div>

            </div>


            <TrackerInsights
              analysis={
                analysis
              }
            />

          </>
        )}

      </div>

    </div>
  );
}


// ==================================================
// TRACKER INSIGHTS
// ==================================================

function TrackerInsights({
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
          Preparing your productivity profile...
        </p>

      </div>
    );
  }


  const insights =
    analysis.insights;

  const categoryPatterns =
    insights.category_patterns ||
    [];


  return (
    <div className="mt-7">


      {/* Main insights */}

      <div className="grid gap-3 md:grid-cols-3">

        <InsightCard
          label="Peak Focus Window"
          value={
            insights.peak_focus
              ?.time_window ||
            "Not enough data"
          }
          description={
            insights.peak_focus
              ?.tracked_minutes
              ? `${insights.peak_focus.tracked_minutes} min tracked`
              : "Your most-used focus period"
          }
        />


        <InsightCard
          label="Strongest Day"
          value={
            insights.best_day
              ?.day ||
            "Not enough data"
          }
          description={
            insights.best_day
              ?.tracked_minutes
              ? `${insights.best_day.tracked_minutes} min tracked`
              : "More data required"
          }
        />


        <InsightCard
          label="Typical Session"
          value={
            `${
              insights.session_pattern
                ?.average_minutes ||
              0
            } min`
          }
          description="Average focused session"
        />

      </div>


      {/* Category patterns */}

      {categoryPatterns.length >
        0 && (

        <div className="mt-6">

          <div className="mb-3">

            <h3 className="text-sm font-medium text-white">
              Focus patterns by category
            </h3>

            <p className="mt-1 text-xs text-zinc-500">
              When you tend to focus on different types of work.
            </p>

          </div>


          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">

            {categoryPatterns.map(
              (pattern) => (

                <div
                  key={
                    pattern.category
                  }
                  className="
                    rounded-xl
                    border border-white/[0.06]
                    bg-white/[0.02]
                    p-4
                  "
                >

                  <p className="text-xs text-zinc-500">
                    {pattern.category}
                  </p>

                  <p className="mt-2 text-base font-semibold text-white">
                    {pattern.peak_time}
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    {pattern.tracked_minutes} min{" "}
                    of tracked history
                  </p>

                </div>

              )
            )}

          </div>

        </div>

      )}

    </div>
  );
}


// ==================================================
// GENERIC INSIGHT CARD
// ==================================================

function InsightCard({
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

      <p className="text-xs text-zinc-500">
        {label}
      </p>

      <p className="mt-3 text-lg font-semibold text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-zinc-600">
        {description}
      </p>

    </div>
  );
}


// ==================================================
// TRACKER REQUIREMENT CARD
// ==================================================

function TrackerMetric({
  icon: Icon,
  value,
  label,
  complete,
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

      <div className="flex items-center justify-between">

        <Icon
          size={16}
          className={
            complete
              ? "text-emerald-400"
              : "text-zinc-500"
          }
        />


        {complete && (
          <CheckCircle2
            size={14}
            className="text-emerald-400"
          />
        )}

      </div>


      <p className="mt-4 text-lg font-semibold text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-zinc-500">
        {label}
      </p>

    </div>
  );
}