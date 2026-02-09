import { Metadata } from "next";
import { notFound } from "next/navigation";
import UniversalQuizPanel from "@/components/panel/quiz/qnaPanel/panel";
import { getRoundConfig, getAllRoundSlugs } from "@/config/round";

interface PageProps {
  params: Promise<{
    round: string;
  }>;
}

/**
 * Generate static params for all rounds
 */
export function generateStaticParams() {
  return getAllRoundSlugs().map((slug) => ({
    round: slug,
  }));
}

/**
 * Generate metadata dynamically based on the round
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { round } = await params;
  const config = getRoundConfig(round);

  if (!config) {
    return {
      title: "Round Not Found",
    };
  }

  return {
    title: `${config.title} - Interschool Quiz`,
    description: `${config.description} | Annual quiz competition of Jalpaiguri Zilla School`,
    openGraph: {
      title: `${config.title} - Interschool Quiz`,
      description: config.description,
    },
  };
}

/**
 * Dynamic round overview page
 */
export default async function Page({ params }: PageProps) {
  const { round } = await params;
  const config = getRoundConfig(round);

  // If round doesn't exist, show 404
  if (!config) {
    notFound();
  }

  return <UniversalQuizPanel config={config} />;
}
