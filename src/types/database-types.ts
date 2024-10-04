import { note, userPreferences } from '@/server/db/schema';
import { InferSelectModel } from 'drizzle-orm';

export type Note = InferSelectModel<typeof note>;
export type Preferences = InferSelectModel<typeof userPreferences>;
