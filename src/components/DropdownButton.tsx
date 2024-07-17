import { Loader2 } from 'lucide-react';
import { cloneElement } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { type JSX } from 'react/jsx-runtime';

const buttonVariants = tv({
  base: 'gap-1.5 flex p-2 px-3 items-center active:text-black hover:text-black focus:text-black focus:outline-none group w-full transition-colors duration-200',
  variants: {
    color: {
      edit: 'active:bg-tiffany focus:bg-tiffany hover:bg-tiffany',
      delete: 'active:bg-melon focus:bg-melon hover:bg-melon',
      favourite: 'active:bg-sunset focus:bg-sunset hover:bg-sunset',
      archive: 'active:bg-mindaro focus:bg-mindaro hover:bg-mindaro',
      publish: 'active:bg-wisteria focus:bg-wisteria hover:bg-wisteria',
    },
    active: { true: 'text-black' },
    disabled: {
      true: 'text-neutral-400 hover:text-neutral-400 focus:text-neutral-400 active:text-neutral-400 hover:bg-transparent focus:bg-transparent active:bg-transparent cursor-not-allowed',
    },
  },
  compoundVariants: [
    {
      color: 'favourite',
      active: true,
      className:
        'bg-sunset active:bg-sunset/85 focus:bg-sunset/85 hover:bg-sunset/85',
    },
    {
      color: 'archive',
      active: true,
      className:
        'bg-mindaro active:bg-mindaro/85 focus:bg-mindaro/85 hover:bg-mindaro/85',
    },
  ],
});

type ButtonVariants = VariantProps<typeof buttonVariants>;

interface DropdownButtonProps extends ButtonVariants {
  text?: string;
  loading?: boolean;
  icon: JSX.Element;
}

export default function DropdownButton({
  text,
  icon,
  loading,
  ...props
}: DropdownButtonProps) {
  return (
    <button disabled={props.disabled} className={buttonVariants(props)}>
      {loading ? (
        <Loader2 size={17} strokeWidth={2.5} className="animate-spin" />
      ) : (
        cloneElement(icon, {
          size: 17,
          fill: props.active ? '#A3A3A3' : 'transparent',
          strokeWidth: 2.5,
          className: `group-disabled:scale-100 group-active:scale-95 transition-transform duration-200`,
        })
      )}
      <span className="capitalize">{text || props.color}</span>
    </button>
  );
}
