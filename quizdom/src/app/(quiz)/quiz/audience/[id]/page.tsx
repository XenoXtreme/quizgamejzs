"use client";

import { useParams, usePathname } from "next/navigation";
import Panel from "@/components/panel/quiz/components/qp";
import { AudienceMeta } from "@/types/qns-pattern";

interface PageProps {
  params: Promise<{
    round: string;
    id: string;
  }>;
}

/**
 * Dynamic question page for all rounds
 */
export default function Page({}: PageProps) {
  const { id } = useParams();
  const path = usePathname();
  const meta = AudienceMeta[id as string];
  const type = meta ? meta.type : "img";

  return (
    <Panel
      round={"audience"}
      qno={`${id}`}
      type={`${type}`}
      limit={Object.keys(AudienceMeta).length.toString()}
      key={"audience"}
      path={path}
      quizCategory="audience"
    />
  );
}
