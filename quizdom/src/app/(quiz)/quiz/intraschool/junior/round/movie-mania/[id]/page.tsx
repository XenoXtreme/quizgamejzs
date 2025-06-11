"use client";
// REACT
import React from "react";

// NEXT
import { usePathname, useParams } from "next/navigation";
import MM from "@/components/website/quiz/question-panel/qp";

// QNS META
import { IntraJRMeta } from "@/types/qns-pattern"

export default function Page() {
  const path = usePathname();
  const { id } = useParams();
  const meta = IntraJRMeta.mm[id as string];
  const type = meta ? meta.type : "img"

  return (
    <div>
      <MM
        category="intraschool/junior"
        round={"mm"}
        qno={`${id}`}
        type={`${type}`}
        key={"mm"}
        limit={"8"}
        path={path}
      />
    </div>
  );
}
