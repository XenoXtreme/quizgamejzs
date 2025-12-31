import { Metadata } from "next";
import History from "@/components/website/static/history";

export const metadata: Metadata = {
  title: "History - Quizdom",
  description:
    "Explore the rich history and evolution of the Annual Interschool Quiz Competition at Jalpaiguri Zilla School, from its origins to the revolutionary Quizdom era of 21st century.",
};

export default function Page() {
  return (
    <div>
      <History />
    </div>
  );
}
