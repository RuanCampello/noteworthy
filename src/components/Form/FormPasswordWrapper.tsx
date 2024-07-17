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
    <div className="flex focus-within:ring-2 focus-within:ring-offset-1 ring-tickle ring-offset-tickle items-center bg-neutral-200 rounded-md h-11 text-midnight pe-3">
      {children}
      <button
        className="focus:outline-none"
        type="button"
        onClick={() => onChange()}
      >
        {value ? <EyeOff size={22} /> : <Eye size={22} />}
      </button>
    </div>
  );
}
