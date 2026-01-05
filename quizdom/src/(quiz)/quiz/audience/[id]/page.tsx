"use client";
// REACT
import React from "react";

// NEXT
import { useParams, usePathname } from "next/navigation";
import Panel from "@/components/website/quiz/question-panel/qp";

// QNS META
import { AudienceMeta } from "@/types/qns-pattern";

export default function Page() {
  const { id } = useParams();
  const path = usePathname();
  const meta = AudienceMeta[id as string];
  const type = meta ? meta.type : "img";
  return (
    <div>
      <Panel
        round={"audience"}
        qno={`${id}`}
        type={`${type}`}
        limit={Object.keys(AudienceMeta).length.toString()}
        key={"audience"}
        path={path}
      />
    </div>
  );
}
