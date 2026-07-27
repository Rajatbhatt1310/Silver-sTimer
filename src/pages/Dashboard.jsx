import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Flame,
  Zap,
  Star,
  Target,
  Timer,
  Brain,
  Trophy,
} from "lucide-react";

import PageHeader from "../components/dashboard/PageHeader";
import GoalWidget from "../components/dashboard/GoalWidget";
import StatCard from "../components/dashboard/StatCard";
import WeeklyChart from "../components/dashboard/WeeklyChart";
import AIInsightCard from "../components/dashboard/AIInsightCard";
import TaskPreviewCard from "../components/dashboard/TaskPreviewCard";
import LeaderboardPreview from "../components/dashboard/LeaderboardPreview";
import AchievementsPreview from "../components/dashboard/AchievementsPreview";

import { getDashboard } from "../services/dashboardService";
import { getLeaderboard } from "../services/leaderboardService";
import { dashboardData } from "../utils/dashboardData";


// --------------------------------------------------
// Achievement icon mapping
// --------------------------------------------------

const ACHIEVEMENT_ICONS = {
  Target,
  Timer,
  Brain,
  Zap,
  Star,
  Flame,
  Trophy,
};


// --------------------------------------------------
// Generate avatar initials
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


export default function Dashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] =
    useState(null);

  const [
    leaderboardData,
    setLeaderboardData,
  ] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // --------------------------------------------------
  // Load dashboard + leaderboard
  // --------------------------------------------------

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [
          dashboardResult,
          leaderboardResult,
        ] = await Promise.all([
          getDashboard(),
          getLeaderboard(),
        ]);

        setDashboard(
          dashboardResult
        );

        setLeaderboardData(
          leaderboardResult
        );

      } catch (error) {
        console.error(
          "Unable to load dashboard:",
          error
        );

        setError(
          "Unable to load dashboard."
        );

      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);


  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="px-6 py-6 text-sm text-[var(--color-text-muted)]">
        Loading dashboard...
      </div>
    );
  }


  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (error || !dashboard) {
    return (
      <div className="px-6 py-6 text-sm text-red-400">
        {error || "Dashboard unavailable."}
      </div>
    );
  }


  // --------------------------------------------------
  // Date
  // --------------------------------------------------

  const today = new Date();

  const formattedDate =
    today.toLocaleDateString(
      "en-IN",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
      }
    );


  // --------------------------------------------------
  // Real statistics
  // --------------------------------------------------

  const stats = [
    {
      eyebrow: "Streak",
      value:
        `${dashboard.stats.streak} days`,
      subtitle:
        "Current streak",
      icon:
        Flame,
      tone:
        "warning",
    },

    {
      eyebrow: "XP",
      value:
        dashboard.stats.xp,
      subtitle:
        "Total XP",
      icon:
        Zap,
      tone:
        "xp",
    },

    {
      eyebrow: "Level",
      value:
        dashboard.stats.level,
      subtitle:
        "Current level",
      icon:
        Star,
      tone:
        "primary",
    },

    {
      eyebrow: "Focus Score",
      value:
        dashboard.stats.focus_score,
      subtitle:
        "Focus performance",
      icon:
        Target,
      tone:
        "analytics",
    },
  ];


  // --------------------------------------------------
  // Real today's goal
  // --------------------------------------------------

  const goalHours =
    dashboard.goal.target_minutes / 60;

  const focusedMinutes =
    dashboard.goal.focused_minutes;

  const todaysGoal = {
    targetLabel:
      `${goalHours} hrs`,

    progressText:
      `${focusedMinutes} min done`,

    percent:
      dashboard.goal.percent,
  };


  // --------------------------------------------------
  // Real weekly focus
  // --------------------------------------------------

  const weeklyHours =
    Math.floor(
      dashboard.weekly.total_minutes / 60
    );

  const weeklyRemainingMinutes =
    dashboard.weekly.total_minutes % 60;

  const weeklyTotalLabel =
    weeklyHours > 0
      ? `${weeklyHours}h ${weeklyRemainingMinutes}m focused`
      : `${weeklyRemainingMinutes} min focused`;

  const weeklyChart = {
    title:
      "Weekly Focus Time",

    totalLabel:
      weeklyTotalLabel,

    data:
      dashboard.weekly.data,
  };


  // --------------------------------------------------
  // Real today's tasks
  // --------------------------------------------------

  const tasks = {
    title:
      "Today's Tasks",

    tasks:
      dashboard.tasks.items,

    onAddTask: () => {
      navigate("/planner");
    },

    onToggleTask: () => {
      navigate("/planner");
    },
  };


  // --------------------------------------------------
  // Real leaderboard
  // --------------------------------------------------

  const leaderboard = {
    title:
      "Leaderboard",

    // Backend currently ranks total XP,
    // therefore this is All Time.
    period:
      "All Time",

    entries:
      leaderboardData?.top_users
        ?.slice(0, 3)
        .map((entry) => ({
          id:
            entry.user_id,

          rank:
            entry.rank,

          name:
            entry.name,

          initials:
            getInitials(
              entry.name
            ),

          xp:
            entry.xp,
        })) || [],
  };


  // --------------------------------------------------
  // Real achievements
  // --------------------------------------------------

  const achievementTone = {
    focus:
      "primary",

    streak:
      "warning",

    xp:
      "xp",

    tasks:
      "analytics",
  };


  const achievements = {
    title:
      "Recent Achievements",

    achievements:
      (dashboard.achievements || [])
        .map((achievement) => ({
          id:
            achievement.id,

          title:
            achievement.title,

          subtitle:
            achievement.subtitle,

          icon:
            ACHIEVEMENT_ICONS[
              achievement.icon
            ] || Trophy,

          tone:
            achievementTone[
              achievement.category
            ] || "primary",
        })),
  };


  // --------------------------------------------------
  // Temporary AI data
  // --------------------------------------------------

  const {
    aiInsight,
  } = dashboardData;


  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="flex flex-col gap-6 px-6 py-6 pb-10">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <PageHeader
          date={
            formattedDate
          }

          greetingName={
            dashboard.user.name
          }

          streakDays={
            dashboard.stats.streak
          }
        />


        <GoalWidget
          {...todaysGoal}
        />

      </div>


      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        {stats.map((stat) => (
          <StatCard
            key={
              stat.eyebrow
            }

            {...stat}
          />
        ))}

      </div>


      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">

        <WeeklyChart
          {...weeklyChart}
        />


        <AIInsightCard
          {...aiInsight}
        />

      </div>


      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

        <TaskPreviewCard
          {...tasks}
        />


        <LeaderboardPreview
          {...leaderboard}
        />


        <AchievementsPreview
          {...achievements}
        />

      </div>

    </div>
  );
}