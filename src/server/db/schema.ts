import { createId } from '@paralleldrive/cuid2';
import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

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

export const noteFormat = pgEnum('note_format', ['full', 'slim']);

export const account = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
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

export const passwordResetTokens = pgTable(
  'password_reset_tokens',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    email: text('email').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { precision: 3, mode: 'date' }).notNull(),
  },
  (table) => {
    return {
      tokenEmailKey: uniqueIndex('password_reset_tokens_token_email_key').using(
        'btree',
        table.token,
        table.email,
      ),
      tokenKey: uniqueIndex('password_reset_tokens_token_key').using(
        'btree',
        table.token,
      ),
    };
  },
);

export const userPreferences = pgTable(
  'users_preferences',
  {
    id: serial('id').primaryKey().notNull(),
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    noteFormat: noteFormat('note_format').default('full').notNull(),
    fullNote: boolean('full_note').default(true).notNull(),
  },
  (table) => {
    return {
      userIdKey: uniqueIndex('users_preferences_userId_key').using(
        'btree',
        table.userId,
      ),
    };
  },
);

export const user = pgTable(
  'users',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text('name'),
    email: text('email'),
    emailVerified: timestamp('emailVerified', { precision: 3, mode: 'date' }),
    password: text('password'),
    image: text('image'),
  },
  (table) => {
    return {
      emailKey: uniqueIndex('users_email_key').using('btree', table.email),
    };
  },
);

export const note = pgTable(
  'notes',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    colour: colour('colour').notNull(),
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { precision: 3, mode: 'date' })
      .defaultNow()
      .notNull(),
    isArchived: boolean('is_archived').default(false).notNull(),
    isFavourite: boolean('is_favourite').default(false).notNull(),
    isPublic: boolean('is_public').default(false).notNull(),
    lastUpdate: timestamp('last_update', { precision: 3, mode: 'date' })
      .defaultNow()
      .notNull(),
  },
  () => {
    return {
      contentIdx: index('notes_content_idx').using(
        'gin',
        sql`to_tsvector('english'::regconfig`,
      ),
      contentTitleIdx: index('notes_content_title_idx').using(
        'gin',
        sql`to_tsvector('english'::regconfig`,
      ),
    };
  },
);

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const usersRelations = relations(user, ({ one, many }) => ({
  accounts: many(account),
  usersPreferences: one(userPreferences),
  notes: many(note),
}));

export const usersPreferencesRelations = relations(
  userPreferences,
  ({ one }) => ({
    user: one(user, {
      fields: [userPreferences.userId],
      references: [user.id],
    }),
  }),
);

export const notesRelations = relations(note, ({ one }) => ({
  user: one(user, {
    fields: [note.userId],
    references: [user.id],
  }),
}));
