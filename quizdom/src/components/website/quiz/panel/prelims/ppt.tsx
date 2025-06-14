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

  return (
    <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl bg-white/70 dark:bg-slate-900/80 shadow-xl backdrop-blur-lg p-6 transition-all">
      <div className="mb-4 flex gap-2 rounded-xl bg-white/60 dark:bg-slate-800/60 shadow-md px-4 py-3 backdrop-blur-md">
        <Button
          onClick={() => setView("question")}
          color={view === "question" ? "alternative" : "light"}
          pill
          size="sm"
          disabled={view === "question"}
          className={`cursor-pointer shadow-sm transition-all duration-200 focus:ring-2 focus:ring-orange-400 ${
            view === "question" ? "ring-2 ring-orange-400 scale-105" : "hover:scale-105"
          }`}
        >
          Show Question PPT
        </Button>
        <Button
          onClick={() => setView("answer")}
          color={view === "answer" ? "default" : "light"}
          pill
          size="sm"
          disabled={view === "answer"}
          className={`cursor-pointer shadow-sm transition-all duration-200 focus:ring-2 focus:ring-green-400 ${
            view === "answer" ? "ring-2 ring-green-400 scale-105" : "hover:scale-105"
          }`}
        >
          Show Answer PPT
        </Button>
        <Button
          onClick={() => setView("audience")}
          color={view === "audience" ? "purple" : "light"}
          pill
          size="sm"
          disabled={view === "audience"}
          className={`cursor-pointer shadow-sm transition-all duration-200 focus:ring-2 focus:ring-purple-400 ${
            view === "audience" ? "ring-2 ring-purple-400 scale-105" : "hover:scale-105"
          }`}
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
