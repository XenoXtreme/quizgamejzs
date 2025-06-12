import React, { useState } from "react";
import PptxViewer from "./pptxviewer";
import { Button } from "flowbite-react";

export default function PPTViewer({ category }: { category: string }) {
  const [view, setView] = useState<"question" | "answer" | "audience">(
    "question",
  );

  function getPPTUrl(
    category: string,
    view: "question" | "answer" | "audience",
  ): { pptUrl: string; filename: string } {
    if (category === "intraschool/junior") {
      if (view === "question") {
        return { pptUrl: "", filename: "prelims.pptx" };
      } else if (view === "answer") {
        return { pptUrl: "", filename: "prelims-ans.pptx" };
      } else {
        return { pptUrl: "", filename: "prelims-audience.pptx" };
      }
    }
    if (category === "intraschool/senior") {
      if (view === "question") {
        return { pptUrl: "", filename: "prelims.pptx" };
      } else if (view === "answer") {
        return { pptUrl: "", filename: "prelims-ans.pptx" };
      } else {
        return { pptUrl: "", filename: "prelims-audience.pptx" };
      }
    }
    if (category === "interschool") {
      if (view === "question") {
        return { pptUrl: "", filename: "prelims.pptx" };
      } else if (view === "answer") {
        return { pptUrl: "", filename: "prelims-ans.pptx" };
      } else {
        return { pptUrl: "", filename: "prelims-audience.pptx" };
      }
    }
    // fallback
    return { pptUrl: "", filename: "" };
  }


  const { pptUrl, filename } = getPPTUrl(category, view);

  return (
    <div className="mt-4 flex flex-col items-center gap-4">
      <div className="mb-2 flex gap-2">
        <Button
          onClick={() => setView("question")}
          color={view === "question" ? "alternative" : "light"}
          pill
          size="sm"
          disabled={view === "question"}
          className={`cursor-pointer shadow-sm transition-all duration-200 ${view === "question" ? "ring-2 ring-orange-400" : ""}`}
        >
          Show Question PPT
        </Button>
        <Button
          onClick={() => setView("answer")}
          color={view === "answer" ? "default" : "light"}
          pill
          size="sm"
          disabled={view === "answer"}
          className={`cursor-pointer shadow-sm transition-all duration-200 ${view === "answer" ? "ring-2 ring-green-400" : ""}`}
        >
          Show Answer PPT
        </Button>
        <Button
          onClick={() => setView("audience")}
          color={view === "audience" ? "purple" : "light"}
          pill
          size="sm"
          disabled={view === "audience"}
          className={`cursor-pointer shadow-sm transition-all duration-200 ${view === "audience" ? "ring-2 ring-purple-400" : ""}`}
        >
          Questions for Audience
        </Button>
      </div>
      <div className="w-full max-w-4xl">
        <PptxViewer src={pptUrl} filename={filename} />
      </div>
    </div>
  );
}
