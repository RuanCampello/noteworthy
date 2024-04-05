import { auth, signOut } from '@/auth';
import Placeholder from '@/components/Placeholder';
import Resizable from '@/components/Resizable';
import { FileText } from 'lucide-react';

export default async function Home() {
  const session = await auth();

  async function handleSignOut() {
    'use server'
    await signOut()
  }

  return (
    <div>{JSON.stringify(session)}
    <form action={handleSignOut}>
      <button type='submit'>sign out</button>
    </form>
    </div>
    // <Resizable>
    //   <Placeholder
    //     paragraph='Choose a note from the list on the left to view its contents, or create
    //     a new note to add to your collection.'
    //     text='Select a note to view'
    //   >
    //     <FileText size={80} strokeWidth={1} />
    //   </Placeholder>
    // </Resizable>
  );
}
