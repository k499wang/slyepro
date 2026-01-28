-- =============================================
-- Migration: Stripe idempotency + credit grant
-- =============================================

ALTER TABLE public.credit_transactions
  ADD CONSTRAINT credit_transactions_stripe_payment_id_key UNIQUE (stripe_payment_id);

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
