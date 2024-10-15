-- Add migration script here

create table if not exists accounts
(
    user_id             text not null
        constraint "account_userId_users_id_fk"
            references users
            on delete cascade,
    type                text not null,
    provider            text not null,
    provider_account_id text not null,
    refresh_token       text,
    access_token        text,
    expires_at          integer,
    token_type          text,
    scope               text,
    id_token            text,
    session_state       text,
    constraint "account_provider_providerAccountId_pk"
        primary key (provider, provider_account_id)
);