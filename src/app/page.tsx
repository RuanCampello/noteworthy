import Placeholder from '@/components/Placeholder';
import Resizable from '@/components/Resizable';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function Home() {
  const auth = cookies().get('isAuthenticated')?.value
  if(auth === 'true') {
    return (
      <Resizable>
        <Placeholder />
      </Resizable>
    );
  } else {
    redirect('/login')
  }
}
