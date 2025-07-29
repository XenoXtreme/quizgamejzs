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
  const meta = InterSchMeta.oyf[id as string];
  const type = meta ? meta.type : "img";

  console.log(type);

  return (
    <div>
      <Panel
        round={"oyf"}
        qno={`${id}`}
        type={`${type}`}
        limit={Object.keys(InterSchMeta.oyf).length.toString()}
        key={"oyf"}
        path={path}
      />
    </div>
  );
}
