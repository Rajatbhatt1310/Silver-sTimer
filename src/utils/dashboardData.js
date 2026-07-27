import {
  Flame,
  Zap,
  Star,
  Target as TargetIcon,
  Award,
} from "lucide-react";

export const dashboardData = {
  date: "Tuesday, 15 July 2026",

  greetingName: "Alex",

  streakDays: 17,

  todaysGoal: {
    targetLabel: "6 hrs",
    progressText: "3.4h done",
    percent: 57,
  },

  stats: [
    {
      eyebrow: "Streak",
      value: "17 days",
      subtitle: "Personal best: 23",
      icon: Flame,
      tone: "warning",
    },
    {
      eyebrow: "XP Today",
      value: "740 XP",
      subtitle: "+120 from sessions",
      icon: Zap,
      tone: "primary",
    },
    {
      eyebrow: "Level",
      value: "Lv. 12",
      subtitle: "Scholar · 2.1k XP to 13",
      icon: Star,
      tone: "xp",
    },
    {
      eyebrow: "Focus Score",
      value: "84 / 100",
      subtitle: "Top 8% this week",
      icon: TargetIcon,
      tone: "analytics",
    },
  ],

  weeklyChart: {
    title: "Weekly Study Time",
    totalLabel: "29.5h this week",
    deltaLabel: "18% vs last week",
    deltaPositive: true,

    data: [
      { label: "Mon", value: 3 },
      { label: "Tue", value: 4.2 },
      { label: "Wed", value: 5.5 },
      { label: "Thu", value: 4.8 },
      { label: "Fri", value: 6 },
      { label: "Sat", value: 3.5 },
      { label: "Sun", value: 2.5 },
    ],
  },

  aiInsight: {
    message: "Your peak focus window is 8–11 AM. Schedule your hardest subjects then for maximum retention.",

    suggestedSessionLabel: "Thermodynamics",

    suggestedSessionDuration: "45 min",
  },

  tasks: {
    tasks: [
      {
        id: "t1",
        title: "Revise Chapter 5 — Thermodynamics",
        subject: "Physics",
        duration: "45m",
        done: true,
      },
      {
        id: "t2",
        title: "Solve 20 Integration Problems",
        subject: "Maths",
        duration: "60m",
        done: false,
      },
      {
        id: "t3",
        title: "Read Research Paper on NLP",
        subject: "Computer Science",
        duration: "30m",
        done: false,
      },
    ],
  },

  leaderboard: {
    period: "Weekly",

    entries: [
      {
        id: "l1",
        rank: 1,
        name: "Arjun Mehta",
        initials: "AM",
        xp: 9840,
      },
      {
        id: "l2",
        rank: 2,
        name: "Priya Nair",
        initials: "PN",
        xp: 9210,
      },
      {
        id: "l3",
        rank: 3,
        name: "Daniel Choi",
        initials: "DC",
        xp: 8750,
      },
    ],
  },

  achievements: {
    achievements: [
      {
        id: "a1",
        title: "17-Day Streak",
        subtitle: "Consistency milestone",
        icon: Flame,
        tone: "warning",
      },
      {
        id: "a2",
        title: "Level 12 Reached",
        subtitle: "Scholar rank unlocked",
        icon: Award,
        tone: "xp",
      },
    ],
  },

  user: {
    name: "You",
    level: 12,
    title: "Scholar",
  },
};