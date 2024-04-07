import LoginForm from '@/components/Auth/LoginForm';

export default async function LoginPage() {
  return (
    <div className='flex justify-center h-screen w-screen overflow-hidden items-center bg-black'>
      <LoginForm />
    </div>
  );
}
