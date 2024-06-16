import Placeholder from '@/components/Placeholder';
import { Sparkles } from 'lucide-react';

export default async function FavouritesPage() {
  return (
    <Placeholder
      paragraph='Choose a favourite note from the list on the left to view its contents, or favourite a note to add to your collection.'
      text='Select a favourite note to view'
    >
      <Sparkles size={80} strokeWidth={1} />
    </Placeholder>
  );
}
