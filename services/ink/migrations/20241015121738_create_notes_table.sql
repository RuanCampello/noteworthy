create extension if not exists "pgcrypto";

create table if not exists notes
(
    id           uuid         default gen_random_uuid() not null
        primary key,
    title        text                                   not null,
    content      text                                   not null,
    colour       colour                                 not null,
    user_id      text                                   not null
        constraint "notes_userId_users_id_fk"
            references users
            on delete cascade,
    created_at   timestamp(3) default CURRENT_TIMESTAMP not null,
    is_archived  boolean      default false             not null,
    is_favourite boolean      default false             not null,
    is_public    boolean      default false             not null,
    last_update  timestamp(3) default CURRENT_TIMESTAMP not null
);
