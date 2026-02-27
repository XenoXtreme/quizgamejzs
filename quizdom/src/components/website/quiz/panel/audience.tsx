"use client";
import { useSyncExternalStore } from "react";
import Link from "next/link";

// SHADCN COMPONENTS
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// LUCIDE ICONS
import { Users, ArrowRight, Sparkles, Loader2 } from "lucide-react";

// 20 audience engagement questions
const audienceQuestions = Array.from({ length: 20 }).map((_, i) => ({
  q_no: `${i + 1}`,
  display_text: `Audience Engagement Question ${i + 1}`,
}));

// Mounting Animation Hook
const emptySubscribe = () => () => {};

export function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

/**
 * A stylish, modular component for a single question item.
 */
function QuestionListItem({
  question,
  index,
}: {
  question: { q_no: string; display_text: string };
  index: number;
}) {
  const { q_no, display_text } = question;
  const url = `/quiz/audience/${q_no}`;

  return (
    <Link href={url}>
      <Card
        className="group relative overflow-hidden border border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] hover:border-gray-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900/80 dark:hover:border-gray-700"
        style={{
          animation: `fadeInUp 0.5s ease-out ${index * 50}ms both`,
        }}
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-linear-to-r from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <CardContent className="relative flex items-center justify-between p-4 sm:p-5">
          <div className="flex items-center gap-4">
            {/* Question Number Badge */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 font-bold text-gray-900 transition-all duration-300 group-hover:bg-gray-900 group-hover:text-white dark:bg-gray-800 dark:text-gray-100 dark:group-hover:bg-gray-100 dark:group-hover:text-gray-900">
              {q_no}
            </div>

            {/* Question Text */}
            <span className="font-semibold text-gray-900 transition-colors duration-300 group-hover:text-gray-600 dark:text-gray-100 dark:group-hover:text-gray-300">
              {display_text}
            </span>
          </div>

          {/* Arrow Icon */}
          <ArrowRight className="h-5 w-5 shrink-0 text-gray-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-gray-900 dark:group-hover:text-gray-100" />
        </CardContent>
      </Card>
    </Link>
  );
}

/**
 * The main panel component.
 */
export default function AudienceEngagePanel() {
  const mounted = useIsMounted();

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <section className="relative min-h-screen w-full bg-linear-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-black dark:via-gray-950 dark:to-gray-900">
      {/* Vercel-style grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />

      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl dark:bg-blue-500/10" />
      <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl dark:bg-purple-500/10" />

      <div className="relative z-10 flex min-h-screen flex-col items-center px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <header
          className="mb-12 text-center"
          style={{
            animation: mounted ? "fadeInDown 0.6s ease-out" : "none",
          }}
        >
          <Badge variant="secondary" className="mb-4 text-sm font-medium">
            <Sparkles className="mr-1 h-3 w-3" />
            Interactive Quiz
          </Badge>

          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="rounded-xl bg-linear-to-br from-blue-500 to-purple-500 p-3 shadow-lg dark:from-blue-600 dark:to-purple-600">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>

          <h1 className="mb-4 bg-linear-to-br from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl lg:text-6xl dark:from-gray-100 dark:via-gray-300 dark:to-gray-500">
            Audience Engagement
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400">
            Test your knowledge and engage with the quiz
          </p>
        </header>

        {/* Question List */}
        <div className="w-full flex max-w-3xl flex-col space-y-4">
          {audienceQuestions.map((question, index) => (
            <QuestionListItem
              key={question.q_no}
              question={question}
              index={index}
            />
          ))}
        </div>

        {/* CTA Section */}
        <div
          className="mt-16 text-center"
          style={{
            animation: mounted ? "fadeInUp 0.6s ease-out 0.4s both" : "none",
          }}
        >
          <p className="text-sm text-gray-500 dark:text-gray-600">
            Ready to participate? Select a question above to begin
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
