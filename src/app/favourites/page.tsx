import FavouriteSidebar from '@/components/FavouriteSidebar';
import Placeholder from '@/components/Placeholder';
import Resizable from '@/components/Resizable';
import { Sparkles } from 'lucide-react';

export default function FavouritesPage() {
  return (
    <Resizable>
      <div className='flex h-full'>
        <FavouriteSidebar />
        <Placeholder text='Select a favourite note to view'>
          <Sparkles size={80} strokeWidth={1} />
        </Placeholder>
      </div>
    </Resizable>
  );
}
