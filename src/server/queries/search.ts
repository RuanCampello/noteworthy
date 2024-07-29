'use server';

import { db } from '@/server/db';
import { SearchResult } from '@/types/search-result';
import { currentUser } from './note';

export async function searchNotes(query: string) {
  const user = await currentUser();

  if (!user || !user?.id) return;
  const results: SearchResult[] | null = await db.$queryRaw`
    select "id", "title", "content", "is_favourite", "is_archived",
    ts_headline('english', "content", to_tsquery('english', ${query} || ':*'), 'MaxWords=30, MinWords=15, MaxFragments=3') as highlighted_content
    from "notes"
    where "userId" = ${user.id}
    and (to_tsvector('english', "title" || ' ' || "content") @@ to_tsquery('english', ${query} || ':*'))
    `;

  if (!results) return null;
  return results;
}
