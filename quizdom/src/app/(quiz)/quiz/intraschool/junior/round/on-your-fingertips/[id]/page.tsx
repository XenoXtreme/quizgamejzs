"use client";
// REACT
import React from "react";

// NEXT
import { usePathname, useParams } from "next/navigation";
import OYF from "@/components/website/quiz/question-panel/qp";

// QNS META
import { IntraJRMeta } from "@/types/qns-pattern"

export default function Page() {
  const path = usePathname();
  const { id } = useParams();
  const meta = IntraJRMeta.oyf[id as string];
  const type = meta ? meta.type : "img"
  return (
    <div>
      <OYF
        category="intraschool/junior"
        round={"oyf"}
        qno={`${id}`}
        type={`${type}`}
        key={"oyf"}
        limit={Object.keys(IntraJRMeta.oyf).length.toString()}
        path={path}
      />
    </div>
  );
}
