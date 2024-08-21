import { Metadata } from 'next';
import Panel from '@/components/website/quiz/panel/question-panel/intraschool/senior/oyf';

// METADATA
export const metadata: Metadata = {
    title: "On Your Fingertips - Intraschool Senior",
    description: "Annual quiz competition of Jalpaiguri Zilla School",
  };

export default function Page() {
  return (
    <div><Panel category="intraschool/senior" /></div>
  )
}
