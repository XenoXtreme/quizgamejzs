import {
  LucideIcon,
  Users,
  Zap,
  Link2,
  Film,
  Target,
  Hand,
  Flame,
} from "lucide-react";
import { InterSch } from "@/types/qns-structures";
import { InterSchMeta } from "@/types/qns-pattern";

export interface RoundConfig {
  key: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  items: Array<{ q_no: string; display_text: string }>;
  meta: Record<string, { type: string }>;
  routeSlug: string;
}

export const INTERSCHOOL_ROUNDS: Record<string, RoundConfig> = {
  "on-your-own": {
    key: "oyo",
    title: "On Your Own",
    subtitle: "Test your knowledge solo",
    icon: Users,
    items: InterSch.oyo,
    meta: InterSchMeta.oyo,
    routeSlug: "on-your-own",
  },
  "pounce-bounce": {
    key: "pnb",
    title: "Pounce Bounce",
    subtitle: "Quick on your feet",
    icon: Zap,
    items: InterSch.pnb,
    meta: InterSchMeta.pnb,
    routeSlug: "pounce-bounce",
  },
  connections: {
    key: "cc",
    title: "Connections",
    subtitle: "Find the link",
    icon: Link2,
    items: InterSch.cc,
    meta: InterSchMeta.cc,
    routeSlug: "connections",
  },
  "movie-mania": {
    key: "mm",
    title: "Movie Mania",
    subtitle: "Lights, camera, action!",
    icon: Film,
    items: InterSch.mm,
    meta: InterSchMeta.mm,
    routeSlug: "movie-mania",
  },
  "point-blank": {
    key: "pbk",
    title: "Point Blank",
    subtitle: "Rapid Fire Questions",
    icon: Target,
    items: InterSch.pbk,
    meta: InterSchMeta.pbk,
    routeSlug: "point-blank",
  },
  "on-your-fingertips": {
    key: "oyf",
    title: "On Your Fingertips",
    subtitle: "Knowledge at your tips",
    icon: Hand,
    items: InterSch.oyf,
    meta: InterSchMeta.oyf,
    routeSlug: "on-your-fingertips",
  },
  "tie-breaker": {
    key: "tiebreaker",
    title: "Tie Breaker",
    subtitle: "The final round",
    icon: Flame,
    items: InterSch.tiebreaker,
    meta: InterSchMeta.tiebreaker,
    routeSlug: "tie-breaker",
  },
};

export function getRoundConfig(round: string): RoundConfig | null {
  return INTERSCHOOL_ROUNDS[round] || null;
}
