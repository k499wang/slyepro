-- =============================================
-- Migration: Add 'general' generation type
-- =============================================

-- Drop the existing check constraint
ALTER TABLE generations DROP CONSTRAINT IF EXISTS generations_type_check;

-- Add new check constraint with 'general' type
ALTER TABLE generations
  ADD CONSTRAINT generations_type_check
  CHECK (type IN ('asmr_video', 'general', 'image', 'music', 'video'));
