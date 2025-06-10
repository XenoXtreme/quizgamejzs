import React, { useState } from "react";
import PptxViewer from "./pptxviewer";
import { Button } from "flowbite-react";

export default function PPTViewer({ category }: { category: string }) {
    const [showAnswer, setShowAnswer] = useState(false);

    const pptUrl = showAnswer
        ? `https://idoxdew.sufydely.com/prelims/${category}/prelims-ans.pptx`
        : `https://idoxdew.sufydely.com/prelims/${category}/prelims.pptx`;

    return (
        <div className="flex flex-col items-center gap-4 mt-4">
            <div className="flex gap-2 mb-2">
                <Button
                    onClick={() => setShowAnswer(false)}
                    color={!showAnswer ? "info" : "light"}
                    pill
                    size="sm"
                    disabled={!showAnswer}
                    className={`cursor-pointer transition-all duration-200 shadow-sm ${!showAnswer ? "ring-2 ring-orange-400" : ""}`}
                >
                    Show Question PPT
                </Button>
                <Button
                    onClick={() => setShowAnswer(true)}
                    color={showAnswer ? "success" : "light"}
                    pill
                    size="sm"
                    disabled={showAnswer}
                    className={`cursor-pointer transition-all duration-200 shadow-sm ${showAnswer ? "ring-2 ring-green-400" : ""}`}
                >
                    Show Answer PPT
                </Button>
            </div>
            <div className="w-full max-w-4xl">
                <PptxViewer
                    src={pptUrl}
                    filename={showAnswer ? "prelims-ans.pptx" : "prelims.pptx"}
                />
            </div>
        </div>
    );
}