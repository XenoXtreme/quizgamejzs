"use client";

import React from "react";
import { Card, Badge, Alert } from "flowbite-react";
import {
  FaTrophy,
  FaUsers,
  FaClock,
  FaStar,
  FaBullseye,
  FaFilm,
  FaLink,
  FaBolt,
  FaHandHolding,
} from "react-icons/fa";

// --- Type definitions remain the same ---
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
  icon: React.ReactElement;
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
    // --- Data remains the same ---
    {
      id: 1,
      title: "Round 1",
      icon: <FaBullseye className="h-5 w-5" />,
      description: "Opening Round",
      rules: [
        {
          type: "Direct Question",
          correct: "+20",
          wrong: "0",
          note: "Answer correctly to earn points",
        },
      ],
      challenge: false,
    },
    {
      id: 2,
      title: "Round 2",
      icon: <FaBolt className="h-5 w-5" />,
      description: "Multi-format Round",
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
      icon: <FaFilm className="h-5 w-5" />,
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
      icon: <FaLink className="h-5 w-5" />,
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
          note: "No guessing, must answer",
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
      icon: <FaBullseye className="h-5 w-5" />,
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
      icon: <FaHandHolding className="h-5 w-5" />,
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
    <div className="min-h-screen bg-slate-900 px-4 py-12 text-gray-300">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 flex items-center justify-center gap-4">
            <FaTrophy className="h-10 w-10 text-amber-400" />
            <h1 className="bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-4xl font-bold text-transparent">
              Quiz Competition Rules
            </h1>
            <FaTrophy className="h-10 w-10 text-amber-400" />
          </div>
          <p className="mx-auto max-w-2xl text-lg text-slate-400">
            A complete guide to the 6-round quiz competition.
          </p>
        </div>

        {/* General Information */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          {/* Combination */}
          <div className="// Make it slightly larger by default // Base styles // Add a subtle gradient // Add a larger, more vibrant // Make the brighter // Smooth transitions // Enhance effect on hover scale-105 transform rounded-xl bg-gradient-to-br from-slate-800 to-amber-900/60 p-6 text-center shadow-2xl ring-2 shadow-amber-500/30 ring-amber-400 transition-all duration-300 hover:scale-110 hover:shadow-amber-400/50">
            <FaUsers className="mx-auto mb-3 h-10 w-10 text-amber-300" />
            <h3 className="text-xl font-bold text-white">Team Format</h3>
            <p className="text-slate-400">⁴C₂ combinations</p>
            <p className="mt-2 text-lg font-semibold text-amber-400">
              Each combination plays once
            </p>
          </div>

          {/* Other Info Cards */}
          <div className="rounded-xl bg-slate-800/50 p-6 text-center ring-1 ring-slate-700">
            <FaClock className="mx-auto mb-3 h-8 w-8 text-sky-400" />
            <h3 className="text-lg font-semibold text-white">Format</h3>
            <p className="text-slate-400">6 Exciting Rounds</p>
            <p className="text-sm text-slate-500">Progressive difficulty</p>
          </div>

          <div className="rounded-xl bg-slate-800/50 p-6 text-center ring-1 ring-slate-700">
            <FaStar className="mx-auto mb-3 h-8 w-8 text-violet-400" />
            <h3 className="text-lg font-semibold text-white">Scoring</h3>
            <p className="text-slate-400">Points-based system</p>
            <p className="text-sm text-slate-500">
              Positive & negative marking
            </p>
          </div>
        </div>

        {/* Rounds */}
        <div className="space-y-8">
          {rounds.map((round) => (
            <div
              key={round.id}
              className="overflow-hidden rounded-xl bg-slate-800/30 ring-1 ring-slate-700"
            >
              <div className="border-b border-slate-700 bg-slate-800/50 p-4">
                <div className="flex items-center gap-4">
                  <div className="text-slate-400">{round.icon}</div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {round.title}
                    </h2>
                    <p className="text-slate-400">{round.description}</p>
                  </div>
                  {round.topics && (
                    <Badge color="cyan" className="ml-auto">
                      {round.topics} Topics
                    </Badge>
                  )}
                </div>
              </div>

              <div className="p-6">
                {/* Regular Rules - Minimalist List */}
                <div className="divide-y divide-slate-700">
                  {round.rules.map((rule, index) => (
                    <div key={index} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-slate-200">
                          {rule.type}
                        </h4>
                        <div className="flex gap-4">
                          <Badge color="success" size="sm">
                            Correct: {rule.correct}
                          </Badge>
                          <Badge
                            color={rule.wrong === "0" ? "gray" : "failure"}
                            size="sm"
                          >
                            Wrong: {rule.wrong}
                          </Badge>
                        </div>
                      </div>
                      {rule.note && (
                        <p className="mt-1 text-sm text-slate-400 italic">
                          {rule.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Connection Round Special Rules */}
                {round.connection && (
                  <div className="mt-6 border-t border-slate-700 pt-6">
                    <h4 className="mb-4 flex items-center gap-2 font-semibold text-slate-200">
                      <FaLink className="h-4 w-4" />
                      Connection Guessing Points
                    </h4>
                    <div className="grid gap-3 md:grid-cols-2">
                      {Object.entries(round.connection).map(
                        ([hint, scoring]) => (
                          <div
                            key={hint}
                            className="flex items-center justify-between rounded-lg bg-slate-800 p-3 ring-1 ring-slate-700"
                          >
                            {/* Group the hint text and the asterisk together */}
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-300">
                                {hint}
                              </span>
                              {scoring.note && (
                                <span className="text-xs text-slate-500">
                                  *
                                </span>
                              )}
                            </div>

                            {/* This container for badges remains the same */}
                            <div className="flex gap-2 text-sm">
                              <Badge color="success" size="sm">
                                +{scoring.correct.replace("+", "")}
                              </Badge>
                              <Badge
                                color={
                                  scoring.wrong === "0" ? "gray" : "failure"
                                }
                                size="sm"
                              >
                                {scoring.wrong}
                              </Badge>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                    <div className="mt-3 space-y-1">
                      {Object.entries(round.connection).map(
                        ([hint, scoring]) =>
                          scoring.note && (
                            <p
                              key={hint}
                              className="text-xs text-slate-400 italic"
                            >
                              * {hint}: {scoring.note}
                            </p>
                          ),
                      )}
                    </div>
                  </div>
                )}

                {/* Challenge Information */}
                {round.challenge && (
                  <Alert
                    color="info"
                    className="mt-6 border-sky-700 bg-sky-900/50 text-sky-200"
                  >
                    <div className="flex items-center gap-2">
                      <FaBullseye className="h-4 w-4" />
                      <span className="font-medium">Challenge Rule:</span>
                      <span>
                        Teams can challenge the topic, not the question
                      </span>
                    </div>
                  </Alert>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="mx-auto max-w-2xl rounded-lg bg-amber-500/50 p-4 ring-1 ring-slate-700">
            <h4 className="mb-2 font-bold">Important Notes</h4>
            <ul className="space-y-1 text-sm text-slate-400">
              <li>• Pay attention to negative marking in later rounds.</li>
              <li>
                • The Connection round offers the highest points but also the
                highest risk.
              </li>
              <li>• Challenge rules apply only where specified.</li>
              <li>• Each team combination plays only once.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizRulesPage;
