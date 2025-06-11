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
  const meta = IntraSRMeta.cc[id as string];
  const type = meta ? meta.type : "img"
  return (
    <div>
      <Panel
        category="intraschool/senior"
        round={"cc"}
        qno={`${id}`}
        type={`${type}`}
        key={"cc"}
        limit={Object.keys(IntraSRMeta.cc).length.toString()}
        path={path}
      />
    </div>
  );
}
