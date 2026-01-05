"use client";
// REACT
import React from "react";

// NEXT
import { usePathname, useParams, useSearchParams } from "next/navigation";

// PPT VIEWER
import PPTViewer from "@/components/website/quiz/panel/prelims/ppt";

export default function Page() {
  const path = usePathname();
  const resultant_path = path.split("/").slice(3).join("/");

  return (
    <div>
       <PPTViewer category={resultant_path} />
    </div>
  );
}
