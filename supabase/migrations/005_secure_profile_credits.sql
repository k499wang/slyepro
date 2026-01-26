-- =============================================
-- Migration: Prevent users from editing credits
-- =============================================

REVOKE UPDATE (credits) ON public.profiles FROM authenticated;
REVOKE UPDATE (credits) ON public.profiles FROM anon;

GRANT UPDATE (credits) ON public.profiles TO service_role;
