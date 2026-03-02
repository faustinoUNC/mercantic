-- ═══════════════════════════════════════════════════════════════
-- El Mercantic Fogoneros — Schema completo
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────
-- PRODUCTOS
-- ─────────────────────────────────────────────
create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,                          -- 'T-REX', 'RAPTOR'
  shape       text not null check (shape in ('round', 'square')),
  description text,
  material    text default 'Chapa de 3,2 mm',
  includes    text[] default array['Parrilla', 'Estaca', 'Tapa'],
  active      boolean default true,
  created_at  timestamptz default now()
);

-- ─────────────────────────────────────────────
-- VARIANTES DE PRODUCTO (tamaño + color + precio)
-- ─────────────────────────────────────────────
create table if not exists product_variants (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  size        text not null check (size in ('1.25m', '1.50m')),
  color       text not null check (color in ('negro', 'oxido')),
  price       numeric(12, 2) not null,
  sale_price  numeric(12, 2),                -- null = sin oferta; valor = precio de oferta
  stock       integer default 0,
  active      boolean default true,
  created_at  timestamptz default now(),
  unique (product_id, size, color)
);

-- Migration: add sale_price if upgrading from an older schema
-- alter table product_variants add column if not exists sale_price numeric(12, 2);

-- ─────────────────────────────────────────────
-- CLIENTES
-- ─────────────────────────────────────────────
create table if not exists customers (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text,
  phone      text,
  dni        text,
  notes      text,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────────
-- CÓDIGOS DE DESCUENTO
-- ─────────────────────────────────────────────
create table if not exists discount_codes (
  id                   uuid primary key default gen_random_uuid(),
  code                 text unique not null,
  discount_percentage  integer not null check (discount_percentage between 1 and 100),
  active               boolean default true,
  max_uses             integer,
  times_used           integer default 0,
  description          text,
  created_at           timestamptz default now()
);

-- ─────────────────────────────────────────────
-- PEDIDOS
-- ─────────────────────────────────────────────
create table if not exists orders (
  id                  serial primary key,
  customer_id         uuid references customers(id) on delete set null,
  variant_id          uuid references product_variants(id) on delete set null,
  quantity            integer default 1,
  unit_price          numeric(12, 2) not null,
  discount_code_id    uuid references discount_codes(id) on delete set null,
  discount_amount     numeric(12, 2) default 0,
  final_amount        numeric(12, 2) not null,
  payment_method      text check (payment_method in ('transferencia', 'tarjeta', 'efectivo')),
  payment_status      text default 'pending'
                      check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  delivery_status     text default 'pending'
                      check (delivery_status in ('pending', 'shipped', 'delivered')),
  notes               text,
  mp_payment_id       text,                           -- MercadoPago payment ID
  mp_preference_id    text,                           -- MercadoPago preference ID
  shipping_address    text,
  city                text,
  province            text,
  postal_code         text,
  created_at          timestamptz default now(),
  paid_at             timestamptz,
  shipped_at          timestamptz
);

-- ─────────────────────────────────────────────
-- ÍNDICES
-- ─────────────────────────────────────────────
create index if not exists idx_orders_customer_id     on orders(customer_id);
create index if not exists idx_orders_variant_id      on orders(variant_id);
create index if not exists idx_orders_payment_status  on orders(payment_status);
create index if not exists idx_orders_delivery_status on orders(delivery_status);
create index if not exists idx_orders_created_at      on orders(created_at desc);
create index if not exists idx_variants_product_id    on product_variants(product_id);

-- ─────────────────────────────────────────────
-- DATOS INICIALES — Productos y variantes
-- ─────────────────────────────────────────────
insert into products (slug, name, shape, description, material, includes) values
  (
    't-rex',
    'T-REX',
    'round',
    'El fogonero redondo más robusto del mercado. Diseño circular clásico, ideal para el fuego central y reuniones en rueda. Hecho a mano con chapa de 3,2 mm de alta resistencia.',
    'Chapa de 3,2 mm de alta resistencia',
    array['Parrilla', 'Estaca', 'Tapa']
  ),
  (
    'raptor',
    'RAPTOR',
    'square',
    'El fogonero cuadrado para quienes buscan más superficie de cocción. Perfecto para asados grandes. Construido artesanalmente con chapa de 3,2 mm.',
    'Chapa de 3,2 mm de alta resistencia',
    array['Parrilla', 'Estaca', 'Tapa']
  )
on conflict (slug) do nothing;

-- Variantes T-REX
insert into product_variants (product_id, size, color, price, stock)
select id, '1.25m', 'negro', 1287000, 10 from products where slug = 't-rex'
on conflict (product_id, size, color) do nothing;

insert into product_variants (product_id, size, color, price, stock)
select id, '1.25m', 'oxido', 1287000, 10 from products where slug = 't-rex'
on conflict (product_id, size, color) do nothing;

insert into product_variants (product_id, size, color, price, stock)
select id, '1.50m', 'negro', 1405000, 8 from products where slug = 't-rex'
on conflict (product_id, size, color) do nothing;

insert into product_variants (product_id, size, color, price, stock)
select id, '1.50m', 'oxido', 1405000, 8 from products where slug = 't-rex'
on conflict (product_id, size, color) do nothing;

-- Variantes RAPTOR
insert into product_variants (product_id, size, color, price, stock)
select id, '1.25m', 'negro', 1287000, 10 from products where slug = 'raptor'
on conflict (product_id, size, color) do nothing;

insert into product_variants (product_id, size, color, price, stock)
select id, '1.25m', 'oxido', 1287000, 10 from products where slug = 'raptor'
on conflict (product_id, size, color) do nothing;

insert into product_variants (product_id, size, color, price, stock)
select id, '1.50m', 'negro', 1405000, 8 from products where slug = 'raptor'
on conflict (product_id, size, color) do nothing;

insert into product_variants (product_id, size, color, price, stock)
select id, '1.50m', 'oxido', 1405000, 8 from products where slug = 'raptor'
on conflict (product_id, size, color) do nothing;
