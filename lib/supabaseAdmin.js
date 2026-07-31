import { createClient } from '@supabase/supabase-js';

// SOLO para uso en server (API routes). Usa la service_role key, que se salta
// las políticas de RLS — nunca importar este archivo desde un componente 'use client'.
// Requiere SUPABASE_SERVICE_ROLE_KEY en .env.local (Supabase → Settings → API → service_role).
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
