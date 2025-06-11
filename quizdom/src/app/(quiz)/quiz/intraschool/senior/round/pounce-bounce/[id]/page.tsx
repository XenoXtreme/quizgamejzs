"use client";
// REACT
import React from "react";

// NEXT
import { usePathname, useParams } from "next/navigation";
import Panel from "@/components/website/quiz/question-panel/qp";

// QNS META
import { IntraSRMeta } from "@/types/qns-pattern"

export default function Page() {
  const path = usePathname();
  const { id } = useParams();
  const meta = IntraSRMeta.pnb[id as string];
  const type = meta ? meta.type : "img"
  return (
    <div>
      <Panel
        category="intraschool/senior"
        round={"pnb"}
        qno={`${id}`}
        type={`${type}`}
        key={"pnb"}
        limit={Object.keys(IntraSRMeta.pnb).length.toString()}
        path={path}
      />
    </div>
  );
}
