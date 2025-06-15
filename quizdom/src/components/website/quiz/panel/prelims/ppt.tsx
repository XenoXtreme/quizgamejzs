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
    <div className="mt-6 flex flex-col items-center gap-4 rounded-none bg-white/70 p-2 shadow-xl backdrop-blur-lg transition-all sm:rounded-2xl sm:p-6 dark:bg-slate-900/80">
      <div className="mb-4 flex w-full gap-2 overflow-x-auto rounded-xl bg-white/60 px-2 py-2 shadow-md backdrop-blur-md sm:w-auto sm:px-4 sm:py-3 dark:bg-slate-800/60">
        <Button
          onClick={() => setView("question")}
          color={view === "question" ? "alternative" : "light"}
          pill
          size="sm"
          disabled={view === "question"}
          className={`flex-shrink-0 cursor-pointer shadow-sm transition-all duration-200 focus:ring-2 focus:ring-orange-400 ${
            view === "question"
              ? "scale-105 ring-2 ring-orange-400"
              : "hover:scale-105"
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
          className={`flex-shrink-0 cursor-pointer shadow-sm transition-all duration-200 focus:ring-2 focus:ring-green-400 ${
            view === "answer"
              ? "scale-105 ring-2 ring-green-400"
              : "hover:scale-105"
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
          className={`flex-shrink-0 cursor-pointer shadow-sm transition-all duration-200 focus:ring-2 focus:ring-purple-400 ${
            view === "audience"
              ? "scale-105 ring-2 ring-purple-400"
              : "hover:scale-105"
          }`}
        >
          Questions for Audience
        </Button>
      </div>
      <div className="w-full max-w-full sm:max-w-4xl">
        <PptxViewer src={pptUrl} filename={filename} />
      </div>
    </div>
  );
}
