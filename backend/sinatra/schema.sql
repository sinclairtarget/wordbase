drop table if exists entries;
create table entries(
    id integer primary key autoincrement,
    slug text not null,
    word text not null,
    definition text not null,
    updatedAt text
);

drop index if exists entries_slug_idx;
create unique index entries_slug_idx on entries(slug);
