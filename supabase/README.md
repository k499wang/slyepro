# Supabase Migrations

## Quick Setup

Run `000_full_schema.sql` in Supabase SQL Editor for complete setup.

## Individual Migrations

Run in order if you prefer step-by-step:

| File | Description |
|------|-------------|
| `001_create_profiles.sql` | Profiles table + auto-create trigger |
| `002_create_generations.sql` | Generations table + indexes |
| `003_create_credit_transactions.sql` | Credit transactions table |
| `004_enable_rls.sql` | Row Level Security policies |

## How to Run

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor** → **New query**
4. Paste the SQL and click **Run**

## Tables

### profiles
- Extends `auth.users`
- Auto-created when user signs up (via trigger)
- Stores credits (default: 10)

### generations
- Stores AI generation records
- Types: `asmr_video`, `image`, `music`, `video`
- Status: `pending`, `processing`, `completed`, `failed`

### credit_transactions
- Tracks credit purchases and usage
- Types: `purchase`, `usage`, `bonus`, `refund`
