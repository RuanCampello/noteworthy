import { FileWarning } from 'lucide-react';
import Placeholder from './Placeholder';

export default function NotVisibleWarning() {
  return (
    <main className='w-full h-full items-center justify-center'>
      <Placeholder
        text='This note is private'
        paragraph="Looks like you're trying to see a private note, don't be a little snoop"
      >
        <FileWarning
          size={80}
          strokeWidth={1}
        />
      </Placeholder>
    </main>
  );
}
