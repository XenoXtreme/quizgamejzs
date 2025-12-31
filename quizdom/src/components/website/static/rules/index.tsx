"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Trophy,
  Users,
  Clock,
  Star,
  Brain,
  Link2,
  Target,
  Hand,
  Film,
  Info,
  AlertCircle,
} from "lucide-react";

interface Rule {
  type: string;
  correct: string;
  wrong: string;
  note?: string;
}

interface ConnectionScoring {
  correct: string;
  wrong: string;
  note?: string;
}

interface Round {
  id: number;
  title: string;
  icon: React.ReactNode;
  description: string;
  rules: Rule[];
  challenge: boolean;
  topics?: number;
  connection?: {
    [key: string]: ConnectionScoring;
  };
}

const QuizRulesPage: React.FC = () => {
  const rounds: Round[] = [
    {
      id: 1,
      title: "Round 1",
      icon: <Brain className="w-6 h-6" />,
      description: "On Your Own",
      rules: [
        {
          type: "Direct Question",
          correct: "+20",
          wrong: "0",
          note: "Answer correctly to earn points",
        },
        {
          type: "Pounce",
          correct: "+20",
          wrong: "-10",
          note: "Quick buzzer round",
        },
      ],
      challenge: false,
    },
    {
      id: 2,
      title: "Round 2",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            d="M12 5v14m0 0l-7-7m7 7l7-7"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      description: "Pounce Bounce",
      rules: [
        { type: "Direct Question", correct: "+20", wrong: "0" },
        {
          type: "Pounce",
          correct: "+20",
          wrong: "-10",
          note: "Quick buzzer round",
        },
        {
          type: "Bounce",
          correct: "+10",
          wrong: "0",
          note: "Second chance questions",
        },
      ],
      challenge: false,
    },
    {
      id: 3,
      title: "Round 3",
      icon: <Film className="w-6 h-6" />,
      description: "Movie Mania",
      rules: [
        {
          type: "Movie Questions",
          correct: "+20",
          wrong: "-10",
          note: "All about cinema",
        },
      ],
      challenge: false,
    },
    {
      id: 4,
      title: "Round 4",
      icon: <Link2 className="w-6 h-6" />,
      description: "Connection Round",
      rules: [{ type: "Per Question", correct: "+20", wrong: "-10" }],
      connection: {
        "1st Hint": { correct: "+80", wrong: "-40" },
        "2nd Hint": { correct: "+60", wrong: "-30" },
        "3rd Hint": { correct: "+40", wrong: "-20" },
        "4th Hint": { correct: "+20", wrong: "-10" },
        "5th Hint": {
          correct: "+20",
          wrong: "-10",
          note: "No guessing allowed",
        },
        "6th Hint": {
          correct: "+20",
          wrong: "0",
          note: "Must answer, no negative points",
        },
      },
      challenge: false,
    },
    {
      id: 5,
      title: "Round 5",
      icon: <Target className="w-6 h-6" />,
      description: "Point Blank",
      rules: [
        {
          type: "Quick Fire",
          correct: "+10",
          wrong: "-5",
          note: "Rapid-fire questions",
        },
      ],
      challenge: false,
    },
    {
      id: 6,
      title: "Round 6",
      icon: <Hand className="w-6 h-6" />,
      description: "On Your Fingertips",
      rules: [
        { type: "Direct Question", correct: "+20", wrong: "0" },
        {
          type: "Challenge",
          correct: "+20",
          wrong: "-10",
          note: "Teams can challenge the topic, not the question",
        },
      ],
      topics: 8,
      challenge: true,
    },
  ];

  return (
    <main className="min-h-screen bg-background py-12 px-4 text-foreground">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Header */}
        <section className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <Trophy className="h-10 w-10 text-amber-400" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              Quiz Competition Rules
            </h1>
            <Trophy className="h-10 w-10 text-amber-400" />
          </div>
          <p className="text-lg text-muted-foreground">
            A complete guide to the 6-round quiz competition.
          </p>
        </section>

        {/* General Information Cards */}
        <section className="grid md:grid-cols-3 gap-6">
          <Card className="relative overflow-hidden border-amber-300 bg-linear-to-br from-amber-900/10 to-amber-900/5 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Users className="mx-auto h-10 w-10 text-amber-500 mb-2" />
              <CardTitle>Team Format</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-2">⁴C₂ combinations</p>
              <p className="font-semibold text-amber-600">
                Each combination plays once
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Clock className="mx-auto h-10 w-10 text-blue-500 mb-2" />
              <CardTitle>Format</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">6 Exciting Rounds</p>
              <p className="text-sm text-muted-foreground mt-1">
                Progressive difficulty
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Star className="mx-auto h-10 w-10 text-purple-500 mb-2" />
              <CardTitle>Scoring</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">Points-based system</p>
              <p className="text-sm text-muted-foreground mt-1">
                Positive & negative marking
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Rounds with Tabs */}
        <Tabs defaultValue="round-1" className="w-full">
          <TabsList className="w-full grid grid-cols-3 md:grid-cols-6 gap-2">
            {rounds.map((round) => (
              <TabsTrigger
                key={round.id}
                value={`round-${round.id}`}
                className="cursor-pointer text-xs sm:text-sm"
              >
                R{round.id}
              </TabsTrigger>
            ))}
          </TabsList>

          {rounds.map((round) => (
            <TabsContent key={round.id} value={`round-${round.id}`}>
              <Card>
                <CardHeader className="border-b pb-4">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{round.icon}</div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl">{round.title}</CardTitle>
                      <CardDescription>{round.description}</CardDescription>
                    </div>
                    {round.topics && (
                      <Badge variant="secondary">{round.topics} Topics</Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-6 space-y-6">
                  {/* Rules Accordion */}
                  <Accordion type="single" collapsible className="w-full">
                    {round.rules.map((rule, idx) => (
                      <AccordionItem key={idx} value={`rule-${idx}`}>
                        <AccordionTrigger className="cursor-pointer font-semibold text-left">
                          {rule.type}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                Correct: {rule.correct}
                              </Badge>
                              <Badge
                                variant={
                                  rule.wrong === "0"
                                    ? "secondary"
                                    : "destructive"
                                }
                              >
                                Wrong: {rule.wrong}
                              </Badge>
                            </div>
                            {rule.note && (
                              <Alert className="border-blue-200 bg-blue-50  dark:bg-[#0a0a0a]">
                                <Info className="h-4 w-4 text-blue-600" />
                                <AlertDescription className="text-blue-800">
                                  {rule.note}
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  {/* Connection Round Special Rules */}
                  {round.connection && (
                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="font-bold text-lg flex items-center gap-2">
                        <Link2 className="w-5 h-5 text-purple-600" />
                        Connection Guessing Points
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(round.connection).map(
                          ([hint, scoring]) => (
                            <div
                              key={hint}
                              className="flex items-center justify-between p-3 rounded-lg bg-muted"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{hint}</span>
                                {scoring.note && (
                                  <span className="text-xs text-muted-foreground">
                                    *
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Badge className="bg-green-200 text-green-800 hover:bg-green-100">
                                  +{scoring.correct.replace("+", "")}
                                </Badge>
                                <Badge
                                  variant={
                                    scoring.wrong === "0"
                                      ? "secondary"
                                      : "destructive"
                                  }
                                >
                                  {scoring.wrong}
                                </Badge>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                      {Object.entries(round.connection).some(
                        ([, s]) => s.note
                      ) && (
                        <div className="text-xs text-muted-foreground space-y-1">
                          {Object.entries(round.connection).map(
                            ([hint, scoring]) =>
                              scoring.note && (
                                <p key={hint}>
                                  * {hint}: {scoring.note}
                                </p>
                              )
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Challenge Information */}
                  {round.challenge && (
                    <Alert className="border-sky-200 bg-sky-50 dark:bg-[#0a0a0a]">
                      <AlertCircle className="h-4 w-4 text-sky-600" />
                      <AlertDescription className="text-sky-900">
                        <strong>Challenge Rule:</strong> Teams can challenge the
                        topic, not the question
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Important Notes Footer */}
        <Card className="bg-amber-50 border-amber-300 dark:bg-[#0a0a0a] dark:border-amber-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
              <AlertCircle className="w-5 h-5" />
              Important Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Pay attention to negative marking in later rounds. </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>
                  The Connection round offers the highest points but also the
                  highest risk.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Challenge rules apply only where specified.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-amber-700">•</span>
                <span className="text-amber-700 font-medium">
                  Each team combination plays only once.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default QuizRulesPage;
