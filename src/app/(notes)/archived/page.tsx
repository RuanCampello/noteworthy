import Placeholder from '@/components/Placeholder';
import { Package } from 'lucide-react';

export default async function ArchivedPage() {
  return (
    <Placeholder
      paragraph='Choose a archived note from the list on the left to view its contents, or archived a note to add to your collection.'
      text='Select a archived note to view'
    >
      <Package size={80} strokeWidth={1} />
    </Placeholder>
  );
}
