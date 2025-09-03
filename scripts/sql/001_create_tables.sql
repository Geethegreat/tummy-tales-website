-- Meals catalog
create table if not exists meals (
  id serial primary key,
  name text not null,
  description text default '',
  price numeric not null,
  image_url text,
  created_at timestamptz not null default now()
);

-- Orders
create table if not exists orders (
  id serial primary key,
  customer_name text not null,
  phone text not null,
  address text not null,
  lat double precision not null,
  lng double precision not null,
  instructions text default '',
  items jsonb not null,
  total numeric not null,
  created_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on orders (created_at desc);
