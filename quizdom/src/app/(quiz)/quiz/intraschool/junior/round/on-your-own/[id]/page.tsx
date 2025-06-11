"use client";
// REACT
import React from "react";

// NEXT
import { usePathname, useParams } from "next/navigation";
import OYO from "@/components/website/quiz/question-panel/qp";

// QNS META
import { IntraJRMeta } from "@/types/qns-pattern";


export default function Page() {
  const path = usePathname();
  const { id } = useParams();
  const meta = IntraJRMeta.oyo[id as string];
  const type = meta ? meta.type : "img"
  return (
    <div>
      <OYO
        category="intraschool/junior"
        round={"oyo"}
        qno={`${id}`}
        type={`${type}`}
        key={"oyo"}
        limit={Object.keys(IntraJRMeta.oyo).length.toString()}
        path={path}
      />
    </div>
  );
}
