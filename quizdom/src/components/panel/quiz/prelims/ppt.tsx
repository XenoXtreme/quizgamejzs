import React, { useState } from "react";
import PptxViewer from "./pptxviewer";
import { Button } from "@/components/ui/button";
import { HelpCircle, CheckCircle2, UsersRound } from "lucide-react";

export default function PPTViewer() {
  const [view, setView] = useState<"question" | "answer" | "audience">(
    "question",
  );

  const host: string = process.env.NEXT_PUBLIC_HOST_URI || "";

  let pptUrl: string;
  let filename: string;

  if (view === "question") {
    pptUrl = `${host}/assets/quiz/prelims/interschool/prelims.pptx`;
    filename = "prelims.pptx";
  } else if (view === "audience") {
    pptUrl = `${host}/assets/quiz/prelims/interschool/prelims-audience.pptx`;
    filename = "prelims-audience.pptx";
  } else {
    pptUrl = `${host}/assets/quiz/prelims/interschool/prelims-ans.pptx`;
    filename = "prelims-ans.pptx";
  }

  return (
    <div className="mt-8 flex flex-col items-center gap-6">
      {/* Toggle Buttons */}
      <div className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white p-1 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
        <Button
          onClick={() => setView("question")}
          variant={view === "question" ? "default" : "ghost"}
          size="sm"
          className={`gap-2 ${
            view === "question"
              ? "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
              : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          Questions
        </Button>
        <Button
          onClick={() => setView("answer")}
          variant={view === "answer" ? "default" : "ghost"}
          size="sm"
          className={`gap-2 ${
            view === "answer"
              ? "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
              : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          }`}
        >
          <CheckCircle2 className="h-4 w-4" />
          Answers
        </Button>
        <Button
          onClick={() => setView("audience")}
          variant={view === "audience" ? "default" : "ghost"}
          size="sm"
          className={`gap-2 ${
            view === "audience"
              ? "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
              : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          }`}
        >
          <UsersRound className="h-4 w-4" />
          Audience
        </Button>
      </div>

      {/* Viewer */}
      <div className="w-full max-w-full sm:max-w-4xl">
        <PptxViewer src={pptUrl} filename={filename} />
      </div>
    </div>
  );
}
