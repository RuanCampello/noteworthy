import { LucideProps } from 'lucide-react';
import { ComponentType, type ReactNode } from 'react';

export const CommandFooter = {
  Icon: FooterIconWrapper,
  Root: FooterWrapper,
  Group: FooterGroup,
};

interface Props {
  children: ReactNode;
}

interface IconProps extends LucideProps {
  icon?: ComponentType<LucideProps>;
  text?: string;
}

function FooterIconWrapper({ icon: Icon, text, ...props }: IconProps) {
  return (
    <span
      data-text={!!text}
      className='p-px flex items-center h-fit leading-[14px] rounded-sm bg-midnight border border-night last-of-type:me-1 data-[text=true]:px-1 select-none'
    >
      {Icon && <Icon size={14} strokeWidth={2.5} {...props} />}
      {text}
    </span>
  );
}

function FooterWrapper({ children }: Props) {
  return (
    <footer className='p-1 border-t text-sm text-silver font-medium flex gap-4 select-none'>
      {children}
    </footer>
  );
}

function FooterGroup({ children }: Props) {
  return <div className='flex gap-1 items-center'>{children}</div>;
}
