'use server';

import { db } from '@/server/db';
import { note } from '@/server/db/schema';
import { type SearchResult } from '@/types/search-result';
import { sql } from 'drizzle-orm';

export async function searchNotes(query: string, userId: string) {
  query = query.replace(/(\S) (\S)/g, '$1 & $2').trim();

  const results = await db.execute(sql`
    select ${note.id}, ${note.title}, ${note.content}, ${note.isFavourite}, ${note.isArchived},
    ts_headline('english', "content", to_tsquery('english', ${query} || ':*'), 'MaxWords=30, MinWords=20, MaxFragments=3, HighlightAll=true, StartSel=<search>, StopSel=</search>') as highlighted_content
    from ${note}
    where ${note.userId} = ${userId}
    and (to_tsvector('english', "title" || ' ' || "content") @@ to_tsquery('english', ${query} || ':*'))
    `);

  if (!results) return null;
  return results.rows as SearchResult[];
}
