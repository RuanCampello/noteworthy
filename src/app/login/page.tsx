import LoginForm from '@/components/LoginForm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function LoginPage() {
  const user_id = cookies().get('user_id')?.value;
  if (user_id) redirect('/');
  else {
    return (
      <div className='flex justify-center h-screen w-screen overflow-hidden items-center bg-black'>
        <LoginForm />
      </div>
    );
  }
}
