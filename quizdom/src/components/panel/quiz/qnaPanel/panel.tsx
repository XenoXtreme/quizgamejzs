import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { InterSch, QuestionItem } from "@/types/qns-structures";
import { RoundConfig, getAccentClasses } from "@/config/round";

interface UniversalQuizPanelProps {
  config: RoundConfig;
}

export default function UniversalQuizPanel({
  config,
}: UniversalQuizPanelProps) {
  const questions = InterSch[config.dataKey];
  const accentClasses = getAccentClasses(config.accentColor);
  const IconComponent = config.icon;

  function genURL(q_no: string): string {
    return `/quiz/interschool/round/${config.slug}/${q_no}`;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div
              className={`p-3 rounded-full ${accentClasses.bg} ${accentClasses.bgDark} ${accentClasses.border} ${accentClasses.borderDark} border-2`}
            >
              <IconComponent
                className={`h-8 w-8 ${accentClasses.text} ${accentClasses.textDark}`}
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {config.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {config.description}
          </p>
          <Badge
            variant="outline"
            className="mt-3 dark:border-gray-700 dark:text-gray-300"
          >
            {questions.length} Question{questions.length !== 1 ? "s" : ""}
          </Badge>
        </div>

        {/* Questions Grid */}
        <div className="space-y-4">
          {questions.map((question: QuestionItem, index: number) => (
            <Card
              key={index}
              className={`transition-all duration-200 hover:shadow-lg dark:hover:shadow-gray-900/50 border-l-4 ${accentClasses.border} ${accentClasses.borderDark} dark:bg-gray-800/50 dark:border-gray-700`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      {question.display_text}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Question {question.q_no}
                    </CardDescription>
                  </div>
                  <Badge
                    className={`${accentClasses.bg} ${accentClasses.bgDark} ${accentClasses.text} ${accentClasses.textDark} border-0 ml-4`}
                  >
                    #{question.q_no}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Link href={genURL(question.q_no)}>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`w-full sm:w-auto ${accentClasses.hover} ${accentClasses.hoverDark} transition-colors dark:border-gray-600 dark:text-gray-300`}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Question
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Back Navigation */}
        <div className="mt-8 text-center">
          <Link href="/quiz/interschool/round">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              ← Back to All Rounds
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
