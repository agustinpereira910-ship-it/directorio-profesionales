-- ============================================
-- ESQUEMA: Directorio de Profesionales Independientes
-- Pegar esto completo en Supabase → SQL Editor → Run
-- ============================================

-- Extensión para generar slugs/ids
create extension if not exists "uuid-ossp";

-- ---------- ZONAS ----------
create table zonas (
  id uuid primary key default uuid_generate_v4(),
  nombre text not null,
  departamento text,
  created_at timestamptz default now()
);

-- ---------- CATEGORIAS ----------
create table categorias (
  id uuid primary key default uuid_generate_v4(),
  nombre text not null,
  slug text unique not null,
  icono text,
  categoria_padre_id uuid references categorias(id),
  created_at timestamptz default now()
);

-- ---------- PROFESIONALES ----------
create table profesionales (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  nombre text not null,
  slug text unique not null,
  foto_url text,
  descripcion text,
  categoria_id uuid references categorias(id),
  zona_id uuid references zonas(id),
  telefono text,
  whatsapp text,
  email text,
  sitio_web text,
  estado text not null default 'pendiente_verificacion'
    check (estado in ('pendiente_verificacion','activo','vencido','rechazado')),
  verificado boolean default false,
  fecha_alta timestamptz default now(),
  fecha_vencimiento timestamptz
);

-- ---------- PAGOS ----------
create table pagos (
  id uuid primary key default uuid_generate_v4(),
  profesional_id uuid references profesionales(id) on delete cascade,
  metodo text not null check (metodo in ('mercado_pago','scotiabank','itau')),
  monto numeric(10,2) not null,
  moneda text default 'UYU',
  estado text not null default 'pendiente'
    check (estado in ('pendiente','aprobado','rechazado')),
  comprobante_url text,      -- para transferencias (Scotia/Itaú): sube el comprobante
  referencia_externa text,   -- para Mercado Pago: id de pago de MP
  fecha_pago timestamptz default now(),
  fecha_vencimiento timestamptz,
  revisado_por uuid references auth.users(id),
  created_at timestamptz default now()
);

-- ============================================
-- SEGURIDAD (Row Level Security)
-- ============================================
alter table profesionales enable row level security;
alter table pagos enable row level security;
alter table categorias enable row level security;
alter table zonas enable row level security;

-- Cualquiera puede LEER profesionales activos (directorio público)
create policy "Lectura publica de profesionales activos"
  on profesionales for select
  using (estado = 'activo' or auth.uid() = user_id);

-- Un profesional puede crear su propio perfil
create policy "Alta de perfil propio"
  on profesionales for insert
  with check (auth.uid() = user_id);

-- Un profesional puede editar solo su propio perfil
create policy "Edicion de perfil propio"
  on profesionales for update
  using (auth.uid() = user_id);

-- Categorías y zonas: lectura pública, sin restricción
create policy "Lectura publica categorias" on categorias for select using (true);
create policy "Lectura publica zonas" on zonas for select using (true);

-- Pagos: el profesional ve y crea solo los suyos
create policy "Ver pagos propios"
  on pagos for select
  using (
    profesional_id in (select id from profesionales where user_id = auth.uid())
  );

create policy "Crear pago propio"
  on pagos for insert
  with check (
    profesional_id in (select id from profesionales where user_id = auth.uid())
  );

-- ============================================
-- ADMIN: reemplazá 'TU_EMAIL_ADMIN' por tu email real
-- para que solo vos puedas aprobar/rechazar
-- ============================================
create policy "Admin gestiona todos los profesionales"
  on profesionales for all
  using (auth.jwt() ->> 'email' = 'agustinpereira910@gmail.com');

create policy "Admin gestiona todos los pagos"
  on pagos for all
  using (auth.jwt() ->> 'email' = 'agustinpereira910@gmail.com');

-- ============================================
-- ÍNDICES (rendimiento con muchos registros)
-- ============================================
create index if not exists idx_profesionales_estado on profesionales (estado);
create index if not exists idx_profesionales_categoria_estado on profesionales (categoria_id, estado);
create index if not exists idx_profesionales_zona on profesionales (zona_id);
create index if not exists idx_profesionales_user on profesionales (user_id);
create index if not exists idx_profesionales_fecha_alta on profesionales (fecha_alta desc);

create index if not exists idx_pagos_profesional on pagos (profesional_id);
create index if not exists idx_pagos_estado on pagos (estado);
-- Único: evita que dos notificaciones simultáneas del webhook de Mercado Pago
-- inserten el mismo pago dos veces (protección de raza a nivel de base de datos).
create unique index if not exists idx_pagos_referencia_externa_unica
  on pagos (referencia_externa) where referencia_externa is not null;

-- Búsqueda de texto (ilike '%...%') eficiente aunque haya miles de perfiles.
create extension if not exists pg_trgm;
create index if not exists idx_profesionales_nombre_trgm
  on profesionales using gin (nombre gin_trgm_ops);
create index if not exists idx_profesionales_descripcion_trgm
  on profesionales using gin (descripcion gin_trgm_ops);

-- ============================================
-- DATOS DE EJEMPLO (opcional, para probar ya mismo)
-- ============================================
insert into categorias (nombre, slug, icono) values
  ('Plomería', 'plomeria', '🔧'),
  ('Electricidad', 'electricidad', '💡'),
  ('Albañilería', 'albanileria', '🧱'),
  ('Jardinería', 'jardineria', '🌿'),
  ('Pintura', 'pintura', '🎨'),
  ('Limpieza', 'limpieza', '🧹');

insert into zonas (nombre, departamento) values
  ('Maldonado', 'Maldonado'),
  ('Punta del Este', 'Maldonado'),
  ('Montevideo', 'Montevideo'),
  ('Canelones', 'Canelones');

-- ============================================
-- STORAGE: crear bucket para fotos de perfil y comprobantes
-- (esto se hace desde Supabase → Storage → New bucket, no por SQL,
--  pero dejá anotado: crear "fotos-perfil" público y "comprobantes" privado)
-- ============================================
