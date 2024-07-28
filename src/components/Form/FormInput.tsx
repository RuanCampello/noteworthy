import React from 'react';
import { Input, InputProps } from '@/ui/input';

const FormInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ value, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        value={value}
        type={props.type}
        className='placeholder:text-white/50 placeholder:font-medium bg-midnight h-12 text-base text-neutral-100 focus-visible:ring focus-visible:ring-slate border border-night focus-visible:border-transparent ring-offset-slate rounded-md'
        {...props}
      />
    );
  },
);

FormInput.displayName = 'FormInput';

export default FormInput;
