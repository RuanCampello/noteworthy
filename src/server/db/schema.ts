import { relations, sql, type InferSelectModel } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
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

export const account = pgTable('account', {
  id: text('id'),
  userId: text('userId').references(() => user.id, { onDelete: 'cascade' }),
  type: text('type'),
  provider: text('provider'),
  providerAccountId: text('providerAccountId'),
  refreshToken: text('refresh_token'),
  accessToken: text('access_token'),
  expiresAt: integer('expires_at'),
  tokenType: text('token_type'),
  scope: text('scope'),
  idToken: text('id_token'),
  sessionState: text('session_state'),
});

export const passwordResetTokens = pgTable(
  'password_reset_tokens',
  {
    id: text('id').primaryKey().notNull(),
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
    id: text('id').primaryKey().notNull(),
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

export type Note = InferSelectModel<typeof note>;
