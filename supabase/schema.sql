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
  orden integer not null default 100, -- menor = aparece primero
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
-- CATEGORÍAS: profesionales universitarios primero, después
-- servicios especializados, y por último oficios/hogar.
-- ============================================
create index if not exists idx_categorias_orden on categorias (orden);

insert into categorias (nombre, slug, icono, orden) values
  -- Profesionales
  ('Abogados', 'abogados', '⚖️', 1),
  ('Escribanos', 'escribanos', '📜', 2),
  ('Médicos', 'medicos', '🩺', 3),
  ('Psicólogos', 'psicologos', '🧠', 4),
  ('Contadores', 'contadores', '📊', 5),
  ('Odontólogos', 'odontologos', '🦷', 6),
  ('Arquitectos', 'arquitectos', '📐', 7),
  ('Ingenieros civiles', 'ingenieros', '🏗️', 8),
  ('Nutricionistas', 'nutricionistas', '🥗', 9),
  ('Kinesiólogos', 'kinesiologos', '🏃', 10),
  ('Veterinarios', 'veterinarios', '🐾', 11),
  ('Traductores', 'traductores', '🌐', 12),
  -- Servicios especializados y personales
  ('Diseño gráfico', 'diseno-grafico', '🎨', 20),
  ('Clases particulares', 'clases-particulares', '📚', 21),
  ('Personal trainer', 'personal-trainer', '💪', 22),
  ('Fotografía', 'fotografia', '📷', 23),
  ('Chef y catering', 'chef-catering', '👨‍🍳', 24),
  ('Niñera y cuidado infantil', 'ninera', '👶', 25),
  ('Cuidado de adultos mayores', 'cuidado-adultos-mayores', '👵', 26),
  ('Peluquería', 'peluqueria', '💇', 27),
  ('Estética y manicura', 'estetica', '💅', 28),
  ('Masajista', 'masajista', '💆', 29),
  -- Oficios y hogar
  ('Plomería', 'plomeria', '🔧', 40),
  ('Electricidad', 'electricidad', '💡', 41),
  ('Gasista', 'gasista', '🔥', 42),
  ('Albañilería', 'albanileria', '🧱', 43),
  ('Carpintería', 'carpinteria', '🪚', 44),
  ('Herrería', 'herreria', '⚒️', 45),
  ('Techista', 'techista', '🏠', 46),
  ('Cerrajería', 'cerrajeria', '🔑', 47),
  ('Climatización', 'climatizacion', '❄️', 48),
  ('Durlock y yesería', 'durlock', '🧱', 49),
  ('Vidriería', 'vidrieria', '🪟', 50),
  ('Tapicería', 'tapiceria', '🛋️', 51),
  ('Jardinería', 'jardineria', '🌿', 52),
  ('Pintura', 'pintura', '🎨', 53),
  ('Limpieza', 'limpieza', '🧹', 54),
  ('Mantenimiento de piscinas', 'piscinas', '🏊', 55),
  ('Fumigación y control de plagas', 'fumigacion', '🐜', 56),
  ('Mecánica automotriz', 'mecanica', '🚗', 57),
  ('Reparación de PC', 'reparacion-pc', '💻', 58),
  ('Restauración de muebles', 'mueblista', '🪑', 59),
  ('Costura y modista', 'costura', '🧵', 60),
  ('Mudanzas y fletes', 'mudanzas', '🚚', 61),
  ('Paseador de perros', 'paseador-perros', '🐕', 62)
on conflict (slug) do update set
  nombre = excluded.nombre,
  icono = excluded.icono,
  orden = excluded.orden;

-- Los 19 departamentos de Uruguay, más Punta del Este como localidad
-- destacada dentro de Maldonado.
insert into zonas (nombre, departamento) values
  ('Montevideo', 'Montevideo'),
  ('Canelones', 'Canelones'),
  ('Maldonado', 'Maldonado'),
  ('Punta del Este', 'Maldonado'),
  ('Artigas', 'Artigas'),
  ('Cerro Largo', 'Cerro Largo'),
  ('Colonia', 'Colonia'),
  ('Durazno', 'Durazno'),
  ('Flores', 'Flores'),
  ('Florida', 'Florida'),
  ('Lavalleja', 'Lavalleja'),
  ('Paysandú', 'Paysandú'),
  ('Río Negro', 'Río Negro'),
  ('Rivera', 'Rivera'),
  ('Rocha', 'Rocha'),
  ('Salto', 'Salto'),
  ('San José', 'San José'),
  ('Soriano', 'Soriano'),
  ('Tacuarembó', 'Tacuarembó'),
  ('Treinta y Tres', 'Treinta y Tres');

-- ============================================
-- STORAGE: crear bucket para fotos de perfil y comprobantes
-- (esto se hace desde Supabase → Storage → New bucket, no por SQL,
--  pero dejá anotado: crear "fotos-perfil" público y "comprobantes" privado)
-- ============================================

-- Políticas de Storage (storage.objects). Sin esto, las subidas de
-- archivos quedan bloqueadas por RLS aunque el bucket exista.
create policy "Usuarios suben su propio comprobante"
  on storage.objects for insert
  with check (
    bucket_id = 'comprobantes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Usuarios ven su propio comprobante"
  on storage.objects for select
  using (
    bucket_id = 'comprobantes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Admin ve todos los comprobantes"
  on storage.objects for select
  using (
    bucket_id = 'comprobantes'
    and auth.jwt() ->> 'email' = 'agustinpereira910@gmail.com'
  );

create policy "Usuarios suben su propia foto de perfil"
  on storage.objects for insert
  with check (
    bucket_id = 'fotos-perfil'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Cualquiera puede ver fotos de perfil"
  on storage.objects for select
  using (bucket_id = 'fotos-perfil');
