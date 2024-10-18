create table if not exists users_preferences
(
    id          serial primary key,
    user_id     text                                    not null,
    note_format note_format default 'full'::note_format not null,
    full_note   boolean     default true                not null
);


alter table users_preferences
    drop constraint if exists users_preferences_userId_users_id_fk;
alter table users_preferences
    add constraint users_preferences_userId_users_id_fk foreign key (user_id) references users (id) on delete cascade;
