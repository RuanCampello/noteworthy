create table if not exists password_reset_tokens
(
    id      serial
        primary key,
    email   text         not null,
    token   text         not null,
    expires timestamp(3) not null
);