
-- Add new role enum values
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'tester';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'developer';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'other';

-- Add finance module
ALTER TYPE public.app_module ADD VALUE IF NOT EXISTS 'finance';
