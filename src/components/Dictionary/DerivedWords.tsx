import { Badge } from '../ui/badge';

interface DerivedWordsProps {
  items: string[];
  title: string;
}

export default function DerivedWords({ items, title }: DerivedWordsProps) {
  if (items.length === 0) return;

  return (
    <div className='text-silver my-1 flex gap-1'>
      <p>{title}:</p>
      {items.map((derivative) => (
        <Badge
          variant='secondary'
          className='dark'
          key={derivative}
        >
          {derivative}
        </Badge>
      ))}
    </div>
  );
}
