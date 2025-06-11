import { Metadata } from 'next';
import Panel from '@/components/website/quiz/panel/question-panel/general/oyo';

// METADATA
export const metadata: Metadata = {
    title: "On Your Own - Intraschool Junior",
    description: "Annual quiz competition of Jalpaiguri Zilla School",
  };

export default function Page() {
  return (
    <div><Panel category="intraschool/junior" /></div>
  )
}
