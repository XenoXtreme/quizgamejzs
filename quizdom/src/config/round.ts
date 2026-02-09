import {
  Brain,
  Zap,
  Link as LinkIcon,
  Film,
  Target,
  Hand,
  Trophy,
  LucideIcon,
} from "lucide-react";

/**
 * Round configuration type
 */
export interface RoundConfig {
  /** URL slug for the round */
  slug: string;
  /** Display title */
  title: string;
  /** Short description */
  description: string;
  /** Data key in InterSch object */
  dataKey: "oyo" | "pnb" | "cc" | "mm" | "pbk" | "oyf" | "tiebreaker";
  /** Lucide icon component */
  icon: LucideIcon;
  /** Accent color (Tailwind class) */
  accentColor: string;
  /** Question limit (total number of questions) */
  limit?: number;
}

/**
 * Complete configuration for all quiz rounds
 */
export const ROUNDS_CONFIG: Record<string, RoundConfig> = {
  "on-your-own": {
    slug: "on-your-own",
    title: "On Your Own",
    description: "Test your individual knowledge across various topics",
    dataKey: "oyo",
    icon: Brain,
    accentColor: "blue",
    limit: 10, // Adjust based on your actual question count
  },
  "pounce-bounce": {
    slug: "pounce-bounce",
    title: "Pounce Bounce",
    description: "Quick thinking and rapid response questions",
    dataKey: "pnb",
    icon: Zap,
    accentColor: "yellow",
    limit: 8, // Adjust based on your actual question count
  },
  connections: {
    slug: "connections",
    title: "Connections",
    description: "Find the links between seemingly unrelated items",
    dataKey: "cc",
    icon: LinkIcon,
    accentColor: "purple",
    limit: 6, // Adjust based on your actual question count
  },
  "movie-mania": {
    slug: "movie-mania",
    title: "Movie Mania",
    description: "Cinema, entertainment, and pop culture",
    dataKey: "mm",
    icon: Film,
    accentColor: "red",
    limit: 8, // Adjust based on your actual question count
  },
  "point-blank": {
    slug: "point-blank",
    title: "Point Blank",
    description: "Straight to the point, no hints given",
    dataKey: "pbk",
    icon: Target,
    accentColor: "green",
    limit: 5, // Adjust based on your actual question count
  },
  "on-your-fingertips": {
    slug: "on-your-fingertips",
    title: "On Your Fingertips",
    description: "Information at your fingertips",
    dataKey: "oyf",
    icon: Hand,
    accentColor: "orange",
    // No limit - uses special keys (literature, mystery, etc.)
  },
  "tie-breaker": {
    slug: "tie-breaker",
    title: "Tie Breaker",
    description: "The final round to determine the winner",
    dataKey: "tiebreaker",
    icon: Trophy,
    accentColor: "amber",
    limit: 3, // Adjust based on your actual question count
  },
};

/**
 * Helper function to get round config by slug
 */
export function getRoundConfig(slug: string): RoundConfig | null {
  return ROUNDS_CONFIG[slug] || null;
}

/**
 * Helper function to get all round slugs (for static generation)
 */
export function getAllRoundSlugs(): string[] {
  return Object.keys(ROUNDS_CONFIG);
}

/**
 * Type-safe way to get accent color classes with dark mode support
 */
export function getAccentClasses(color: string) {
  const colorMap: Record<
    string,
    {
      bg: string;
      bgDark: string;
      border: string;
      borderDark: string;
      text: string;
      textDark: string;
      hover: string;
      hoverDark: string;
    }
  > = {
    blue: {
      bg: "bg-blue-50",
      bgDark: "dark:bg-blue-950/30",
      border: "border-blue-200",
      borderDark: "dark:border-blue-800",
      text: "text-blue-700",
      textDark: "dark:text-blue-400",
      hover: "hover:bg-blue-100",
      hoverDark: "dark:hover:bg-blue-900/30",
    },
    yellow: {
      bg: "bg-yellow-50",
      bgDark: "dark:bg-yellow-950/30",
      border: "border-yellow-200",
      borderDark: "dark:border-yellow-800",
      text: "text-yellow-700",
      textDark: "dark:text-yellow-400",
      hover: "hover:bg-yellow-100",
      hoverDark: "dark:hover:bg-yellow-900/30",
    },
    purple: {
      bg: "bg-purple-50",
      bgDark: "dark:bg-purple-950/30",
      border: "border-purple-200",
      borderDark: "dark:border-purple-800",
      text: "text-purple-700",
      textDark: "dark:text-purple-400",
      hover: "hover:bg-purple-100",
      hoverDark: "dark:hover:bg-purple-900/30",
    },
    red: {
      bg: "bg-red-50",
      bgDark: "dark:bg-red-950/30",
      border: "border-red-200",
      borderDark: "dark:border-red-800",
      text: "text-red-700",
      textDark: "dark:text-red-400",
      hover: "hover:bg-red-100",
      hoverDark: "dark:hover:bg-red-900/30",
    },
    green: {
      bg: "bg-green-50",
      bgDark: "dark:bg-green-950/30",
      border: "border-green-200",
      borderDark: "dark:border-green-800",
      text: "text-green-700",
      textDark: "dark:text-green-400",
      hover: "hover:bg-green-100",
      hoverDark: "dark:hover:bg-green-900/30",
    },
    orange: {
      bg: "bg-orange-50",
      bgDark: "dark:bg-orange-950/30",
      border: "border-orange-200",
      borderDark: "dark:border-orange-800",
      text: "text-orange-700",
      textDark: "dark:text-orange-400",
      hover: "hover:bg-orange-100",
      hoverDark: "dark:hover:bg-orange-900/30",
    },
    amber: {
      bg: "bg-amber-50",
      bgDark: "dark:bg-amber-950/30",
      border: "border-amber-200",
      borderDark: "dark:border-amber-800",
      text: "text-amber-700",
      textDark: "dark:text-amber-400",
      hover: "hover:bg-amber-100",
      hoverDark: "dark:hover:bg-amber-900/30",
    },
  };

  return colorMap[color] || colorMap.blue;
}
