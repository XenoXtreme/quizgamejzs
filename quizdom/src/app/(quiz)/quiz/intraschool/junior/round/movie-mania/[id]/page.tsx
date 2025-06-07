"use client";
// REACT
import React from "react";

// NEXT
import { usePathname, useParams, useSearchParams } from "next/navigation";
import MM from "@/components/website/quiz/question-panel/qp";

// QNS META
import { intra_jr_movieManiaMeta } from "@/types/qns-pattern"

export default function Page() {
  const path = usePathname();
  const { id } = useParams();
  const meta = intra_jr_movieManiaMeta[id as string];
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
