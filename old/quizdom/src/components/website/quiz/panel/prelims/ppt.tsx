import React, { useState } from "react";
import PptxViewer from "./pptxviewer";
import { Button } from "flowbite-react";

export default function PPTViewer({ category }: { category: string }) {
  const [view, setView] = useState<"question" | "answer">("question");

  let pptUrl: string;
  let filename: string;

  const CDN_URI = process.env.NEXT_PUBLIC_CDN_URI || "/";

  if (view === "question") {
    pptUrl = `${CDN_URI}/assets/quiz/prelims/interschool/prelims.pptx`;
    filename = "prelims.pptx";
  } else {
    pptUrl = `${CDN_URI}/assets/quiz/prelims/interschool/prelims-ans.pptx`;
    filename = "prelims-ans.pptx";
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
      </div>
      <div className="w-full max-w-full sm:max-w-4xl">
        <PptxViewer src={pptUrl} filename={filename} />
      </div>
    </div>
  );
}
