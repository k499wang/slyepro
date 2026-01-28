-- =============================================
-- SLYE - FULL DATABASE SCHEMA
-- Run this in Supabase SQL Editor for quick setup
-- Or run migrations 001-004 individually
-- =============================================

-- 1. PROFILES TABLE
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  credits INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. GENERATIONS TABLE
CREATE TABLE generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('asmr_video', 'image', 'music', 'video')),
  prompt TEXT NOT NULL,
  input_image_url TEXT,
  output_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  credits_used INTEGER DEFAULT 0,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_generations_user_id ON generations(user_id);
CREATE INDEX idx_generations_status ON generations(status);
CREATE INDEX idx_generations_created ON generations(created_at DESC);

-- 3. CREDIT TRANSACTIONS TABLE
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'usage', 'bonus', 'refund')),
  description TEXT,
  stripe_payment_id TEXT,
  generation_id UUID REFERENCES generations(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
ALTER TABLE credit_transactions
  ADD CONSTRAINT credit_transactions_stripe_payment_id_key UNIQUE (stripe_payment_id);

-- 4. ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own generations"
  ON generations FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generations"
  ON generations FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own generations"
  ON generations FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions"
  ON credit_transactions FOR SELECT USING (auth.uid() = user_id);

-- 5. STRIPE CREDIT PROCESSING
CREATE OR REPLACE FUNCTION public.add_credits_for_stripe_session(
  p_user_id UUID,
  p_credits INTEGER,
  p_stripe_payment_id TEXT,
  p_package_id TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inserted_count INTEGER;
  updated_count INTEGER;
BEGIN
  IF p_credits <= 0 THEN
    RAISE EXCEPTION 'Credits must be positive';
  END IF;

  INSERT INTO credit_transactions (
    user_id,
    amount,
    type,
    description,
    stripe_payment_id
  )
  VALUES (
    p_user_id,
    p_credits,
    'purchase',
    format('Purchased %s package', p_package_id),
    p_stripe_payment_id
  )
  ON CONFLICT (stripe_payment_id) DO NOTHING;

  GET DIAGNOSTICS inserted_count = ROW_COUNT;

  IF inserted_count = 0 THEN
    RETURN FALSE;
  END IF;

  UPDATE profiles
  SET credits = COALESCE(credits, 0) + p_credits
  WHERE id = p_user_id;

  GET DIAGNOSTICS updated_count = ROW_COUNT;

  IF updated_count <> 1 THEN
    RAISE EXCEPTION 'Profile not found for user %', p_user_id;
  END IF;

  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.add_credits_for_stripe_session(UUID, INTEGER, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.add_credits_for_stripe_session(UUID, INTEGER, TEXT, TEXT) TO service_role;
