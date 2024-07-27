import { EyeOff, Eye } from 'lucide-react';
import { ReactNode } from 'react';

interface FormPasswordWrapperProps {
  onChange: () => void;
  value: boolean;
  children: ReactNode;
}

export default function FormPasswordWrapper({
  onChange,
  value,
  children,
}: FormPasswordWrapperProps) {
  return (
    <div className='flex focus-within:ring-2 focus-within:ring-offset-1 ring-slate ring-offset-slate items-center bg-midnight rounded-md h-12 text-neutral-100 pe-3 border border-night focus-within:border-transparent'>
      {children}
      <button
        className='focus:outline-none'
        type='button'
        onClick={() => onChange()}
      >
        {value ? <EyeOff size={22} /> : <Eye size={22} />}
      </button>
    </div>
  );
}
