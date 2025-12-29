import { Metadata } from 'next';
import Panel from '@/components/website/quiz/panel/question-panel/pbk';

// METADATA
export const metadata: Metadata = {
    title: "Point Black - Interschool",
    description: "Annual quiz competition of Jalpaiguri Zilla School",
  };

export default function Page() {
  return (
    <div><Panel /></div>
  )
}
