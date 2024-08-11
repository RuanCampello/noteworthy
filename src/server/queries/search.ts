'use server';

import { Filters, type Filter } from '@/lib/zustand/search-filter';
import { db } from '@/server/db';
import { note } from '@/server/db/schema';
import { type SearchResult } from '@/types/search-result';
import { sql } from 'drizzle-orm';

export async function searchNotes(
  query: string,
  userId: string,
  filter: Filter | null,
) {
  query = query.replace(/(\S) (\S)/g, '$1 & $2').trim();

  let sqlQuery = sql`
    select ${note.id}, ${note.title}, ${note.content}, ${note.isFavourite}, ${note.isArchived},
    ts_headline('english', "content", to_tsquery('english', ${query} || ':*'), 'MaxWords=30, MinWords=20, MaxFragments=3, HighlightAll=true, StartSel=<search>, StopSel=</search>') as highlighted_content
    from ${note}
    where ${note.userId} = ${userId}
    and (to_tsvector('english', "title" || ' ' || "content") @@ to_tsquery('english', ${query} || ':*'))
    `;

  if (filter && filter !== 'blank') {
    const statement = Filters[filter].query;
    console.log(statement);
    sqlQuery = sql`${sqlQuery} ${sql.raw(statement)}`;
  }

  const results = await db.execute(sqlQuery);

  if (!results) return null;
  return results.rows as SearchResult[];
}
