import React, { useState } from "react";
import PptxViewer from "./pptxviewer";
import { Button } from "flowbite-react";

export default function PPTViewer({ category }: { category: string }) {
  const [view, setView] = useState<"question" | "answer" | "audience">(
    "question",
  );

  let pptUrl: string;
  let filename: string;

  const CDN_URI = process.env.NEXT_PUBLIC_CDN_URI || "/";

  if (view === "question") {
    pptUrl = `${CDN_URI}/quiz/prelims/${category}/prelims.pptx`;
    filename = "prelims.pptx";
  } else if (view === "answer") {
    pptUrl = `${CDN_URI}/quiz/prelims/${category}/prelims-ans.pptx`;
    filename = "prelims-ans.pptx";
  } else {
    pptUrl = `${CDN_URI}/quiz/prelims/${category}/prelims-audience.pptx`;
    filename = "prelims-audience.pptx";
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
