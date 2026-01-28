-- =============================================
-- Migration: Change default credits from 10 to 5
-- =============================================

-- Update the default value for new accounts
ALTER TABLE profiles
ALTER COLUMN credits SET DEFAULT 5;
