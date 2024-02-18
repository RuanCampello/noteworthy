import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface FormRedirectProps {
  text: string;
  path: string;
  link: string;
}

export default function FormRedirect({text, path, link}: FormRedirectProps) {
  return (
    <div className='flex my-10 justify-center gap-1 text-neutral-400'>
      <span>{text}</span>
      <Link
        href={path}
        className='text-tickle hover:underline underline-offset-2 flex items-center group'
      >
        {link} <ArrowUpRight size={20} />
      </Link>
    </div>
  );
}
