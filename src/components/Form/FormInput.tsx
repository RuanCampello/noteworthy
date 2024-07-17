import React from 'react';
import { Input, InputProps } from '../ui/input';

const FormInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ value, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        value={value}
        type={props.type}
        className="placeholder:text-midnight/50 placeholder:font-medium bg-neutral-200 h-11 text-base text-midnight focus-visible:ring focus-visible:ring-tickle border-none ring-offset-tickle"
        {...props}
      />
    );
  },
);

FormInput.displayName = 'FormInput';

export default FormInput;
