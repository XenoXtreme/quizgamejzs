import React, { useState } from "react";
import PptxViewer from "./pptxviewer";
import { Button } from "flowbite-react";

export default function PPTViewer({ category }: { category: string }) {
  const [view, setView] = useState<"question" | "answer" | "tie" | "audience">(
    "question",
  );

  let pptUrl: string;
  let filename: string;

  const CDN_URI = process.env.NEXT_PUBLIC_CDN_URI || "/";

  if (view === "question") {
    pptUrl = `${CDN_URI}/assets/quiz/prelims/interschool/prelims.pptx`;
    filename = "prelims.pptx";
  } else if (view === "answer") {
    pptUrl = `${CDN_URI}/assets/quiz/prelims/interschool/prelims-ans.pptx`;
    filename = "prelims-ans.pptx";
  } else if (view === "tie") {
    pptUrl = `${CDN_URI}/assets/quiz/prelims/interschool/prelims-tie.pptx`;
    filename = "prelims-tie.pptx";
  } else {
    pptUrl = `${CDN_URI}/assets/quiz/prelims/interschool/prelims-audience.pptx`;
    filename = "prelims-audience.pptx";
  }

  return (
    <div className="mt-8 flex flex-col items-center gap-6 rounded-3xl bg-gradient-to-br from-white/80 via-orange-50/80 to-pink-50/80 p-2 shadow-2xl backdrop-blur-2xl transition-all sm:p-8 dark:from-slate-900/80 dark:via-slate-800/80 dark:to-orange-900/80">
      <div className="mb-6 flex w-full gap-3 overflow-x-auto rounded-xl bg-gradient-to-r from-orange-100/60 via-pink-100/60 to-white/60 px-3 py-3 shadow-lg backdrop-blur-lg sm:w-auto sm:px-6 sm:py-4 dark:from-slate-800/60 dark:via-orange-900/40 dark:to-slate-900/60">
        <Button
          onClick={() => setView("question")}
          color={view === "question" ? "alternative" : "light"}
          pill
          size="sm"
          disabled={view === "question"}
          className={`flex-shrink-0 cursor-pointer rounded-xl font-semibold shadow-md transition-all duration-200 focus:ring-2 focus:ring-orange-400 dark:text-white ${
            view === "question"
              ? "scale-110 bg-gradient-to-r from-orange-400 via-yellow-300 to-yellow-200 text-orange-900 ring-2 ring-orange-400"
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
          className={`flex-shrink-0 cursor-pointer rounded-xl font-semibold shadow-md transition-all duration-200 focus:ring-2 focus:ring-green-400 ${
            view === "answer"
              ? "scale-110 bg-gradient-to-r from-green-400 via-green-200 to-white text-green-900 ring-2 ring-green-400"
              : "hover:scale-105"
          }`}
        >
          Show Answer PPT
        </Button>
        <Button
          onClick={() => setView("tie")}
          color={view === "tie" ? "blue" : "light"}
          pill
          size="sm"
          disabled={view === "tie"}
          className={`flex-shrink-0 cursor-pointer rounded-xl font-semibold shadow-md transition-all duration-200 focus:ring-2 focus:ring-purple-400 ${
            view === "tie"
              ? "scale-110 bg-gradient-to-r from-purple-400 via-pink-200 to-white text-orange-500 ring-2 ring-purple-400"
              : "hover:scale-105"
          }`}
        >
          Tie Breaker
        </Button>
        <Button
          onClick={() => setView("audience")}
          color={view === "audience" ? "purple" : "light"}
          pill
          size="sm"
          disabled={view === "audience"}
          className={`flex-shrink-0 cursor-pointer rounded-xl font-semibold shadow-md transition-all duration-200 focus:ring-2 focus:ring-purple-400 ${
            view === "audience"
              ? "scale-110 bg-gradient-to-r from-purple-400 via-pink-200 to-white text-purple-900 ring-2 ring-purple-400"
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
