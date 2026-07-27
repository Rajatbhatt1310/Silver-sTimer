import {
  LayoutGrid,
  Timer,
  BookOpen,
  BarChart3,
  Trophy,
  Bot,
  User,
  Settings,
} from "lucide-react";

export const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutGrid,
  },
  {
    id: "timer",
    label: "Focus Timer",
    icon: Timer,
  },
  {
    id: "planner",
    label: "Planner",
    icon: BookOpen,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
  },
  {
    id: "leaderboard",
    label: "Leaderboards",
    icon: Trophy,
  },
  {
    id: "ai",
    label: "AI Assistant",
    icon: Bot,
    hasNotification: true,
  },
];

export const SECONDARY_NAV_ITEMS = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
  },
];