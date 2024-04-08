import { cloneElement } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const buttonVariants = tv({
  base: 'gap-2 flex p-1 px-2 items-center rounded-sm active:text-black hover:text-black focus:text-black focus:outline-none group w-full transition-colors duration-200',
  variants: {
    color: {
      edit: 'active:bg-tiffany focus:bg-tiffany hover:bg-tiffany',
      delete: 'active:bg-melon focus:bg-melon hover:bg-melon',
      favourite: 'active:bg-sunset focus:bg-sunset hover:bg-sunset',
      archive: 'active:bg-mindaro focus:bg-mindaro hover:bg-mindaro',
    },
    active: { true: 'text-black' },
  },
  compoundVariants: [
    {
      color: 'favourite',
      active: true,
      className: 'bg-sunset active:bg-sunset/85 focus:bg-sunset/85 hover:bg-sunset/85',
    },
  ],
});

type ButtonVariants = VariantProps<typeof buttonVariants>;

interface DropdownButtonProps extends ButtonVariants {
  text: string;
  icon: JSX.Element;
}

export default function DropdownButton({
  text,
  icon,
  ...props
}: DropdownButtonProps) {
  return (
    <button className={buttonVariants(props)}>
      {cloneElement(icon, {
        size: 18,
        className: 'group-active:scale-95 transition-transform duration-200',
      })}
      <span>{text}</span>
    </button>
  );
}
