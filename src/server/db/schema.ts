import {
  pgTable,
  integer,
  text,
  varchar,
  primaryKey,
  timestamp,
  pgEnum,
  uuid,
  boolean,
  serial,
} from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { InferSelectModel, relations, sql } from 'drizzle-orm';
import type { AdapterAccount } from 'next-auth/adapters';

type Provider = 'github' | 'google';

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  password: text('password'),
});

export const accounts = pgTable(
  'accounts',
  {
    userId: varchar('userId', { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: varchar('type', { length: 8 }).$type<AdapterAccount>().notNull(),
    provider: varchar('provider', { length: 8 }).$type<Provider>().notNull(),
    providerAccountId: integer('providerAccountId').notNull(),
    refresh_token: varchar('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: varchar('token_type', { length: 24 }),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const colour = pgEnum('colour', [
  'tiffany',
  'blue',
  'mindaro',
  'sunset',
  'melon',
  'tickle',
  'wisteria',
  'cambridge',
  'mikado',
  'slate',
]);

export const notes = pgTable('notes', {
  id: uuid('id')
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  title: text('title').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull(),
  isFavourite: boolean('is_favourite').default(false),
  isArchived: boolean('is_archived').default(false),
  isPublic: boolean('is_public').default(false),
  userId: varchar('userId', { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  colour: colour('colour').notNull(),
  lastUpdate: timestamp('last_update', { mode: 'date' }).defaultNow(),
});

export const noteFormat = pgEnum('note_format', ['full', 'slim']);

export const userPreferences = pgTable('users_preferences', {
  id: serial('id').unique().primaryKey(),
  userId: varchar('userId', { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  noteFormat: noteFormat('note_format').default('full').notNull(),
  fullNote: boolean('full_note').default(true).notNull(),
});

export const accountRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const userRelations = relations(users, ({ one, many }) => ({
  notes: many(notes),
  accounts: many(accounts),
  preferences: one(userPreferences, {
    fields: [users.id],
    references: [userPreferences.userId],
  }),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  owner: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
}));

export type Note = InferSelectModel<typeof notes>;
export type User = InferSelectModel<typeof users>;

// next auth tables //

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  }),
);

export const authenticators = pgTable(
  'authenticator',
  {
    credentialID: text('credentialID').notNull().unique(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: boolean('credentialBackedUp').notNull(),
    transports: text('transports'),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  }),
);
