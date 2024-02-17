interface SectionTitleProps {
  title: string;
}

export default function SectionTitle({ title }: SectionTitleProps) {
  return (
    <h2 className='text-[15px] leading-normal font-semibold text-white/60 mb-2'>
      {title}
    </h2>
  );
}
