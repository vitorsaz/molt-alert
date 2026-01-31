-- ═══════════════════════════════════════════════════════════════
-- MOLT ALERT - FIX REALTIME
-- Execute este SQL no Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- Remover e re-adicionar
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.tokens;
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.system_status;

-- REPLICA IDENTITY (obrigatório para UPDATE/DELETE realtime)
ALTER TABLE public.tokens REPLICA IDENTITY FULL;
ALTER TABLE public.system_status REPLICA IDENTITY FULL;

-- Adicionar ao realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.tokens;
ALTER PUBLICATION supabase_realtime ADD TABLE public.system_status;

-- RLS
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_status ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read" ON public.tokens;
DROP POLICY IF EXISTS "public_read" ON public.system_status;

CREATE POLICY "public_read" ON public.tokens FOR SELECT USING (true);
CREATE POLICY "public_read" ON public.system_status FOR SELECT USING (true);

-- Allow service role to insert/update
DROP POLICY IF EXISTS "service_write" ON public.tokens;
DROP POLICY IF EXISTS "service_write" ON public.system_status;

CREATE POLICY "service_write" ON public.tokens FOR ALL USING (true);
CREATE POLICY "service_write" ON public.system_status FOR ALL USING (true);
