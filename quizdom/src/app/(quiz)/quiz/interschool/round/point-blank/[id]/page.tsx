"use client";
// REACT
import React from "react";

// NEXT
import { useParams, usePathname, useSearchParams } from "next/navigation";
import Panel from "@/components/website/quiz/question-panel/qp";

// QNS META
import { InterSchMeta } from "@/types/qns-pattern";

export default function Page() {
  const { id } = useParams();
  const path = usePathname();
  const meta = InterSchMeta.pbk[id as string];
  const type = meta ? meta.type : "img";

  return (
    <div>
      <Panel
        category="interschool"
        round={"pbk"}
        qno={`${id}`}
        type={`${type}`}
        limit={Object.keys(InterSchMeta.pbk).length.toString()}
        key={"pbk"}
        path={path}
      />
    </div>
  );
}
