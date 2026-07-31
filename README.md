# Directorio de Profesionales Independientes

Proyecto completo: Next.js + Tailwind + Supabase, con pago por Mercado Pago,
Scotiabank e Itaú.

## Qué hacer ahora, en orden

### 1. Crear el proyecto en Supabase
1. Andá a https://supabase.com → "New project".
2. Cuando esté creado, andá a **SQL Editor** → pegá TODO el contenido de
   `supabase/schema.sql` → **Run**.
3. Antes de correrlo, reemplazá `TU_EMAIL_ADMIN@ejemplo.com` (aparece 2 veces
   en el archivo) por tu email real — así solo vos vas a poder aprobar
   profesionales y pagos.
4. Andá a **Storage** → creá dos buckets:
   - `fotos-perfil` → público
   - `comprobantes` → privado
5. Andá a **Settings → API** → copiá `Project URL` y `anon public key`.

### 2. Configurar las variables de entorno
1. Copiá `.env.local.example` como `.env.local`.
2. Completá `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` con
   lo que copiaste en el paso anterior.
3. Completá los datos de Mercado Pago (Developers → Credenciales de
   producción o de prueba).
4. Completá los textos de cuenta de Scotiabank e Itaú tal cual querés que
   se vean en el checkout.

### 3. Instalar y correr localmente
```bash
npm install
npm run dev
```
Abrí http://localhost:3000 — ya deberías ver el sitio funcionando con las
categorías y zonas de ejemplo.

### 4. Registrarte como admin
1. Andá a `/registro` y creá una cuenta con el mismo email que pusiste en
   `schema.sql`.
2. Confirmá el email (Supabase te manda un correo).
3. Ya podés entrar a `/admin` para aprobar profesionales y pagos.

### 5. Publicar en Vercel (para que esté online, no solo en tu computadora)
1. Subí este proyecto a un repositorio de GitHub.
2. Andá a https://vercel.com → "Add New Project" → importá el repo.
3. En "Environment Variables" pegá las mismas variables de tu `.env.local`.
4. Deploy. En 2-3 minutos tenés una URL pública (ej:
   `directorio-profesionales.vercel.app`).

### 6. Dominio propio (opcional, para más adelante)
Desde Vercel → Settings → Domains podés conectar un dominio que compres
(ej: en NIC.uy o Namecheap) cuando quieras dejar de usar el subdominio
de Vercel.

## Estructura de páginas
Ver detalle completo en el archivo de spec que armamos antes
(`spec-directorio-profesionales.md`).

## Notas importantes
- Los pagos por Scotiabank e Itaú quedan **pendientes** hasta que vos los
  apruebes manualmente en `/admin` (no hay forma de automatizar
  transferencias bancarias directas sin una pasarela adicional).
- Mercado Pago sí se puede automatizar del todo más adelante agregando un
  "webhook" que escuche la confirmación de pago — por ahora, el flujo
  redirige a Mercado Pago y vos confirmás el pago manualmente en `/admin`
  también, para no dejar nada sin revisar mientras arrancás.
