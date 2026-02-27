"use client";

import { use } from "react";
import { notFound, usePathname } from "next/navigation";
import Panel from "@/components/panel/quiz/components/qp";
import { InterSchMeta } from "@/types/qns-pattern";
import { getRoundConfig } from "@/config/round";

interface PageProps {
  params: Promise<{
    round: string;
    id: string;
  }>;
}

/**
 * Dynamic question page for all rounds
 */
export default function Page({ params }: PageProps) {
  const { round, id } = use(params);
  const pathname = usePathname();

  // Validate round exists
  const config = getRoundConfig(round);
  if (!config) {
    notFound();
  }

  // Get question metadata
  const roundMeta = InterSchMeta[config.dataKey];
  const meta = roundMeta?.[id];
  const type = meta?.type || "img";

  const quizCategory = "interschool";

  return (
    <Panel
      qno={id}
      round={config.dataKey}
      type={type}
      limit={config.limit}
      quizCategory={quizCategory}
      path={pathname}
    />
  );
}
