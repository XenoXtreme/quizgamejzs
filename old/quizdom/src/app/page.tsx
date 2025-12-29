import type { Metadata } from "next";
import HomePage from "@/components/website/static/home";

export const metadata: Metadata = {
  title: "Quizdom - Home",
  description: "Welcome to Quizdom! Test your knowledge and have fun.",
  keywords: ["quiz", "game", "trivia", "knowledge", "fun"],
};


export default function Page() {
  return (
    <div><HomePage/></div>

  );
}
