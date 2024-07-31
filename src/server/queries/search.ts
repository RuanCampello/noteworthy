'use server';

import { drizzle as db } from '@/server/db';
import { SearchResult } from '@/types/search-result';
import { sql } from 'drizzle-orm';
import { notes } from '@/server/db/schema';

export async function searchNotes(query: string, userId: string) {
  query = query.replace(/(\S) (\S)/g, '$1 & $2').trim();

  const results = await db.execute(sql`
    select ${notes.id}, ${notes.title}, ${notes.content}, ${notes.isFavourite}, ${notes.isArchived},
    ts_headline('english', "content", to_tsquery('english', ${query} || ':*'), 'MaxWords=30, MinWords=20, MaxFragments=3, HighlightAll=true, StartSel=<search>, StopSel=</search>') as highlighted_content
    from ${notes}
    where ${notes.userId} = ${userId}
    and (to_tsvector('english', "title" || ' ' || "content") @@ to_tsquery('english', ${query} || ':*'))
    `);

  if (!results) return null;
  return results.rows as SearchResult[];
}
