-- Add migration script here

create table if not exists users
(
    id             text not null
        primary key,
    name           text not null,
    email          text not null,
    email_verified timestamp(3),
    password       text,
    image          text
);
