import Placeholder from '@/components/Placeholder';
import Resizable from '@/components/Resizable';
import { FileText } from 'lucide-react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function Home() {
  const auth = cookies().get('user_id')?.value;
  if (auth) {
    return (
      <Resizable>
        <Placeholder
          paragraph='Choose a note from the list on the left to view its contents, or create
        a new note to add to your collection.'
          text='Select a note to view'
        >
          <FileText size={80} strokeWidth={1} />
        </Placeholder>
      </Resizable>
    );
  } else {
    redirect('/login');
  }
}
