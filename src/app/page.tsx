import Placeholder from '@/components/Placeholder';
import Sidebar from '@/components/Sidebar';
import { FileText } from 'lucide-react';

export default async function Home() {
  console.log(process.env.FIREBASE_API_KEY)
  return (
    <div className='flex w-full relative h-screen'>
      <Sidebar />
      <Placeholder
        paragraph='Choose a note from the list on the left to view its contents, or create
        a new note to add to your collection.'
        text='Select a note to view'
      >
        <FileText size={80} strokeWidth={1} />
      </Placeholder>
    </div>
  );
}
