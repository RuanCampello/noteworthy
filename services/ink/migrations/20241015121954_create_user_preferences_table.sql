-- Add migration script here

create table users_preferences
(
    id          serial
        primary key,
    user_id     text                                    not null
        constraint "users_preferences_userId_users_id_fk"
            references users
            on delete cascade,
    note_format note_format default 'full'::note_format not null,
    full_note   boolean     default true                not null
);